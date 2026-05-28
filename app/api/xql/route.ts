import { getCurrentUser } from '@/app/actions';
import { generateObject, generateText, stepCountIs } from 'ai';
import { ChatSDKError } from '@/lib/errors';

import { z } from 'zod';
import { xai } from '@ai-sdk/xai';
import { getTweet, type Tweet } from 'react-tweet/api';

const xqlSearchSchema = z.object({
  query: z.string().describe('The rephrased natural language search query.'),
  startDate: z.string().describe('The start date of the search in the format YYYY-MM-DD.'),
  endDate: z.string().describe('The end date of the search in the format YYYY-MM-DD.'),
  includeXHandles: z
    .array(z.string())
    .max(10)
    .optional()
    .describe('The X handles to include in the search (max 10). Cannot be used with excludeXHandles.'),
  excludeXHandles: z
    .array(z.string())
    .max(10)
    .optional()
    .describe('The X handles to exclude in the search (max 10). Cannot be used with includeXHandles.'),
});

export type XQLSearchInput = z.infer<typeof xqlSearchSchema>;

export interface XQLTweet {
  id: string;
  url: string;
  data: Tweet | null;
}

export interface XQLSearchResponse {
  input: XQLSearchInput;
  citations: string[];
  tweets: XQLTweet[];
  analysis: string;
  processingTime: number;
}

const toYMD = (date: Date) => date.toISOString().slice(0, 10);

function normalizeSearchInput(input: XQLSearchInput): XQLSearchInput {
  const sanitizeHandle = (handle: string) => handle.replace(/^@+/, '').trim();
  const includeXHandles = input.includeXHandles?.map(sanitizeHandle).filter(Boolean);
  const excludeXHandles = input.excludeXHandles?.map(sanitizeHandle).filter(Boolean);
  const handles = [...(includeXHandles ?? []), ...(excludeXHandles ?? [])];
  let query = input.query.trim();

  for (const handle of handles) {
    query = query.replace(new RegExp(`\\bfrom:${handle}\\b`, 'gi'), '').replace(new RegExp(`@${handle}\\b`, 'gi'), '');
  }

  query = query.replace(/\s+/g, ' ').trim() || input.query.trim();

  return {
    ...input,
    query,
    includeXHandles: includeXHandles?.length ? includeXHandles : undefined,
    excludeXHandles: excludeXHandles?.length ? excludeXHandles : undefined,
  };
}

async function runXSearch(input: XQLSearchInput): Promise<{ citations: string[]; analysis: string }> {
  const sanitizeHandle = (handle: string) => handle.replace(/^@+/, '').trim();

  const normalizedInclude = Array.isArray(input.includeXHandles)
    ? input.includeXHandles.map(sanitizeHandle).filter(Boolean)
    : undefined;
  const normalizedExclude = Array.isArray(input.excludeXHandles)
    ? input.excludeXHandles.map(sanitizeHandle).filter(Boolean)
    : undefined;

  const today = new Date();
  const daysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
  const effectiveStart = input.startDate && input.startDate.trim().length > 0 ? input.startDate : toYMD(daysAgo);
  const effectiveEnd = input.endDate && input.endDate.trim().length > 0 ? input.endDate : toYMD(today);

  console.log('X search - includeHandles:', normalizedInclude, 'excludeHandles:', normalizedExclude);

  const xSearchToolConfig: NonNullable<Parameters<typeof xai.tools.xSearch>[0]> = {
    fromDate: effectiveStart,
    toDate: effectiveEnd,
    enableImageUnderstanding: true,
    enableVideoUnderstanding: true,
  };

  if (normalizedInclude?.length) {
    xSearchToolConfig.allowedXHandles = normalizedInclude;
  }

  if (normalizedExclude?.length) {
    xSearchToolConfig.excludedXHandles = normalizedExclude;
  }

  const result = await generateText({
    model: xai.responses('grok-4.20-non-reasoning'),
    system: `You are a thorough X (Twitter) research analyst. Your job is to deeply investigate the user's query across the ENTIRE date range from ${effectiveStart} to ${effectiveEnd}.

Instructions:
- Run MULTIPLE x_search calls to cover the full time period — do NOT settle for the first batch of recent posts. Break the date range into chunks (e.g. by month) and search each, and try several query phrasings and related topics to surface as many distinct posts as possible.
- Aim to gather a comprehensive set of posts spanning the whole range, not just the latest week.
- Then write a detailed, well-structured Markdown analysis: organize by theme and/or chronologically, highlight key developments, trends, and notable posts, and cite specific posts inline.
- Be exhaustive and analytical. Never ask clarifying questions — just search thoroughly and analyze.`,
    prompt: input.query,
    stopWhen: stepCountIs(10),
    maxOutputTokens: 6000,
    tools: {
      x_search: xai.tools.xSearch(xSearchToolConfig),
    },
  });

  const citations =
    result.sources
      ?.map((source) => (source.sourceType === 'url' ? source.url : null))
      .filter((url): url is string => url !== null) ?? [];

  console.log('XQL Sources: ', result.sources);

  return { citations, analysis: result.text ?? '' };
}

async function fetchTweets(citations: string[]): Promise<XQLTweet[]> {
  const seen = new Set<string>();
  const entries: { id: string; url: string }[] = [];

  for (const url of citations) {
    const id = url?.match(/\/status\/(\d+)/)?.[1];
    if (!id || seen.has(id)) continue;
    seen.add(id);
    entries.push({ id, url });
  }

  return Promise.all(
    entries.map(async ({ id, url }) => {
      try {
        const data = await getTweet(id);
        return { id, url, data: data ?? null };
      } catch (error) {
        console.warn(`Failed to fetch tweet ${id}:`, error);
        return { id, url, data: null };
      }
    }),
  );
}

export async function POST(req: Request) {
  console.log('🔍 XQL API endpoint hit');

  const requestStartTime = Date.now();
  const { query } = (await req.json().catch(() => ({}))) as { query?: string };

  const user = await getCurrentUser();

  if (!user) {
    return new ChatSDKError('unauthorized:auth', 'Authentication required to use this feature').toResponse();
  }

  if (!user.isProUser) {
    return new ChatSDKError('upgrade_required:auth', 'This feature requires a Pro subscription').toResponse();
  }

  if (!query || query.trim().length === 0) {
    return Response.json({ error: 'A search query is required.' }, { status: 400 });
  }

  try {
    const today = new Date();
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);

    const { object: searchInput } = await generateObject({
      model: xai('grok-4.20-non-reasoning'),
      schema: xqlSearchSchema,
      system: `You convert a natural language request into structured X (Twitter) search parameters.

Today's date is ${toYMD(today)}. Default the date range to ${toYMD(fifteenDaysAgo)} (15 days ago) through ${toYMD(today)} (today) unless the user specifies otherwise.

Rules:
- query: a clean, rephrased version of the user's request suitable for searching X posts. Keep it faithful to what the user asked — do NOT substitute a different topic.
- startDate / endDate: YYYY-MM-DD format.
- includeXHandles: handles the user wants to search within (max 10, no @ symbol). CANNOT be combined with excludeXHandles.
- excludeXHandles: handles to exclude (max 10, no @ symbol). CANNOT be combined with includeXHandles.
- If the user mentions a handle like "@tsi_org", put "tsi_org" in includeXHandles.
- Do NOT include "from:handle" or "@handle" tokens in query when includeXHandles is set. The handle filter belongs only in includeXHandles.`,
      prompt: query,
    });

    const normalizedSearchInput = normalizeSearchInput(searchInput);
    const { citations, analysis } = await runXSearch(normalizedSearchInput);

    const tweets = await fetchTweets(citations);

    const processingTime = (Date.now() - requestStartTime) / 1000;
    console.log(`XQL request processing time: ${processingTime.toFixed(2)}s`);

    return Response.json({
      input: normalizedSearchInput,
      citations,
      tweets,
      analysis,
      processingTime,
    } satisfies XQLSearchResponse);
  } catch (error) {
    console.error('XQL error: ', error);
    const message = error instanceof Error ? error.message : 'Failed to run XQL search';
    return Response.json({ error: message }, { status: 500 });
  }
}

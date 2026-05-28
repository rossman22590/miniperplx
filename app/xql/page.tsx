'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Loader2, Copy, Check, X } from 'lucide-react';
import { CodeIcon, XLogoIcon } from '@phosphor-icons/react';
import { sileo } from 'sileo';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { XQLProUpgradeScreen } from '@/components/xql-pro-upgrade-screen';
import { BorderTrail } from '@/components/core/border-trail';
import { TextShimmer } from '@/components/core/text-shimmer';
import { cn } from '@/lib/utils';
import { type XQLSearchInput, type XQLSearchResponse } from '@/app/api/xql/route';
import { highlight } from 'sugar-high';
import { SciraLogo } from '@/components/logos/scira-logo';
import { MarkdownRenderer } from '@/components/markdown';
import { SidebarLayout } from '@/components/sidebar-layout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SafeEmbeddedTweet } from '@/components/safe-embedded-tweet';

function buildSQLQuery(input: XQLSearchInput) {
  let sql = 'SELECT * FROM x_posts\n';
  const conditions = [] as string[];

  if (input.query) {
    conditions.push(`  content LIKE '%${input.query}%'`);
  }

  const toYMD = (d: Date) => d.toISOString().slice(0, 10);
  const today = new Date();
  const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
  const startDate =
    input.startDate && String(input.startDate).trim().length > 0 ? input.startDate : toYMD(fifteenDaysAgo);
  const endDate = input.endDate && String(input.endDate).trim().length > 0 ? input.endDate : toYMD(today);

  conditions.push(`  created_at >= '${startDate}'`);
  conditions.push(`  created_at <= '${endDate}'`);

  if (input.includeXHandles && Array.isArray(input.includeXHandles) && input.includeXHandles.length > 0) {
    const handles = input.includeXHandles.map((handle) => `'${handle ?? ''}'`).join(', ');
    conditions.push(`  author_handle IN (${handles})`);
  }

  if (input.excludeXHandles && Array.isArray(input.excludeXHandles) && input.excludeXHandles.length > 0) {
    const handles = input.excludeXHandles.map((handle) => `'${handle ?? ''}'`).join(', ');
    conditions.push(`  author_handle NOT IN (${handles})`);
  }

  if (conditions.length > 0) {
    sql += 'WHERE\n' + conditions.join(' AND\n');
  }

  sql += '\nORDER BY created_at DESC';

  return sql;
}

async function readErrorMessage(response: Response) {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
    return payload?.error || payload?.message || 'Query failed';
  }

  return (await response.text().catch(() => 'Query failed')) || 'Query failed';
}

function XQLPageContent() {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<XQLSearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, isProUser, isLoading: isProStatusLoading } = useUser();
  const router = useRouter();
  const hasActivity = isRunning || result !== null || errorMessage !== null;
  const canSubmit = input.trim().length > 0 && !isRunning && !isProStatusLoading;

  const handleRun = useCallback(async () => {
    const query = input.trim();

    if (!query || isRunning) return;

    setIsRunning(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/xql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const payload = (await response.json()) as Partial<XQLSearchResponse>;

      if (!payload.input || !Array.isArray(payload.citations)) {
        throw new Error('XQL returned an invalid response.');
      }

      setResult({
        input: payload.input,
        citations: payload.citations,
        tweets: Array.isArray(payload.tweets) ? payload.tweets : [],
        analysis: typeof payload.analysis === 'string' ? payload.analysis : '',
        processingTime: typeof payload.processingTime === 'number' ? payload.processingTime : 0,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Query failed';
      setErrorMessage(message);
      sileo.error({
        title: 'Query failed',
        description: message,
      });
    } finally {
      setIsRunning(false);
    }
  }, [input, isRunning]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    },
    [handleRun],
  );

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedResult(true);
      sileo.success({ title: 'Copied to clipboard' });
      setTimeout(() => setCopiedResult(false), 2000);
    } catch (err) {
      sileo.error({ title: 'Failed to copy' });
    }
  }, []);

  React.useEffect(() => {
    if (!isProStatusLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, router, isProStatusLoading]);

  if (!isProStatusLoading && !isProUser) {
    return <XQLProUpgradeScreen />;
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-background overflow-x-hidden transition-[justify-content,align-items] duration-700 ease-in-out',
        !hasActivity ? 'flex items-center justify-center' : '',
      )}
    >
      <div
        className={cn(
          'max-w-3xl w-full mx-auto px-4 transition-[padding] duration-700 ease-in-out',
          !hasActivity ? 'py-12 sm:py-14' : 'pt-12 sm:pt-14 pb-12 sm:pb-10',
        )}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-5xl font-be-vietnam-pro -tracking-normal font-medium relative">
          <div className="md:hidden absolute left-0">
            <SidebarTrigger />
          </div>
          <span className="text-foreground">Datavibes</span>
          <div className="flex items-center relative">
            <XLogoIcon className="size-6 sm:size-8 md:size-12 text-foreground -mr-1 sm:-mr-2 font-medium" />
            <h1 className="text-foreground">QL</h1>
            <div className="absolute -top-4 -right-8">
              <span className="font-pixel text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                Beta
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border border-border rounded-full px-3 sm:px-4 py-2 bg-muted/20 w-full">
          <XLogoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
          <div className="relative flex-1 min-w-0 m-0! p-0!">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask in natural language..."
              disabled={isProStatusLoading || isRunning}
              maxLength={200}
              className="w-full border-0 p-0 focus-visible:ring-0 text-sm sm:text-base bg-transparent! pr-12 sm:pr-14 shadow-none placeholder:text-muted-foreground"
            />
            {input.trim() && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setInput('')}
                disabled={isRunning}
                className="absolute size-8 sm:size-9 right-0 top-1/2 -translate-y-1/2 rounded-full p-0! m-0!"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          {input.trim() && <div className="w-px h-8 sm:h-9 bg-border shrink-0 self-center rounded" />}
          <Button
            onClick={handleRun}
            disabled={!canSubmit}
            size="sm"
            className="h-8 sm:h-9 px-3 sm:px-4 rounded-full font-semibold text-xs sm:text-sm"
          >
            {isRunning ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>

        {isProStatusLoading && (
          <div className="mt-8 space-y-4">
            <div className="text-center space-y-2">
              <div className="h-4 w-48 bg-muted rounded mx-auto animate-pulse" />
              <div className="h-3 w-64 bg-muted/60 rounded mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="shadow-none animate-pulse p-0">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 w-4 sm:h-5 sm:w-5 bg-muted rounded" />
                      <div className="h-3 w-3 bg-muted rounded ml-auto" />
                    </div>
                    <div className="h-4 w-full bg-muted rounded mb-1" />
                    <div className="h-3 w-2/3 bg-muted/60 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!hasActivity && !isProStatusLoading && (
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Try these queries</p>
              <p className="font-pixel text-[11px] text-muted-foreground uppercase tracking-wider">
                Search X posts with natural language
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  query: '@tsi_org updates from last week',
                  description: 'Popular content with date range',
                },
                {
                  query: 'Posts from @elonmusk about Tesla',
                  description: 'Specific user + topic filter',
                },
                {
                  query: 'Research Paper discussions with 1000+ views today',
                  description: 'High engagement + recent',
                },
                {
                  query: 'Hugging Face tweets about new AI models',
                  description: 'Topic with handle exclusion',
                },
                {
                  query: 'Posts from @openai @anthropicai with 500+ likes',
                  description: 'Multiple handles + engagement',
                },
                {
                  query: 'Tech news from past 3 days with 2000+ views',
                  description: 'Date range + view threshold',
                },
              ].map((example, i) => (
                <Card
                  key={i}
                  className="cursor-pointer hover:border-primary/30 shadow-none group p-0 transition-colors"
                  onClick={() => setInput(example.query)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded bg-secondary shrink-0">
                        <XLogoIcon className="h-3 w-3 text-foreground" />
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 ml-auto transition-opacity">
                        <Play className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <p className="text-sm text-foreground mb-1 font-medium leading-tight">{example.query}</p>
                    <p className="font-pixel text-[9px] text-muted-foreground/50 uppercase tracking-wider leading-tight">
                      {example.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="mt-6 text-center font-pixel text-[10px] text-muted-foreground/80 uppercase tracking-wider">
              Dates / Handles / Engagement / Keywords
            </p>
          </div>
        )}

        {hasActivity && (
          <div className="mt-8 space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            {result?.input && (
              <Card className="rounded-xl border-border/60 p-0 shadow-none">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="grow min-w-0">
                      <div className="flex items-center gap-2 mb-2.5">
                        <CodeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <p className="font-pixel text-[12px] uppercase tracking-wider">Generated XQL</p>
                      </div>
                      <div className="relative">
                        <pre className="text-xs sm:text-sm bg-muted/30 p-2 sm:p-3 rounded-lg border leading-relaxed overflow-x-auto w-full max-w-full">
                          <code
                            className="font-mono!"
                            dangerouslySetInnerHTML={{ __html: highlight(buildSQLQuery(result.input)) }}
                          />
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result?.analysis && result.analysis.trim().length > 0 && (
              <Card className="rounded-xl border-border/60 p-0 shadow-none">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <SciraLogo className="size-5 text-foreground shrink-0" />
                    <p className="font-pixel text-[12px] uppercase tracking-wider">Analysis</p>
                  </div>
                  <div className="text-sm leading-relaxed">
                    <MarkdownRenderer content={result.analysis} />
                  </div>
                </CardContent>
              </Card>
            )}

            {isRunning && (
              <Card className="relative w-full h-[80px] sm:h-[100px] my-4 overflow-hidden shadow-none p-0">
                <BorderTrail className={cn('bg-linear-to-r from-primary/20 via-primary to-primary/20')} size={80} />
                <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
                  <div className="relative flex items-center gap-2 sm:gap-3">
                    <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center bg-primary/10 shrink-0">
                      <BorderTrail
                        className={cn('bg-linear-to-r from-primary/20 via-primary to-primary/20')}
                        size={40}
                      />
                      <XLogoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                      <TextShimmer className="text-sm sm:text-base font-medium" duration={2}>
                        Writing XQL code...
                      </TextShimmer>
                      <div className="flex gap-1 sm:gap-2">
                        {[32, 24, 42].map((width, i) => (
                          <div
                            key={i}
                            className="h-1 sm:h-1.5 rounded-full bg-muted animate-pulse"
                            style={{
                              width: `${width}px`,
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result &&
              (() => {
                const tweets = result.tweets ?? [];

                return (
                  <Card className="p-0 shadow-none">
                    <CardContent className="p-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <SciraLogo className="size-5 text-foreground shrink-0" />
                          <span className="text-sm font-semibold text-foreground">{tweets.length} Posts</span>
                        </div>

                        {result.citations.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.citations.join('\n'))}
                            className="rounded-full h-8 w-8 sm:h-9 sm:w-9 p-0 shrink-0"
                          >
                            {copiedResult ? (
                              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                        {tweets.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {tweets.map(({ id, url, data }) => (
                              <SafeEmbeddedTweet
                                key={id}
                                tweet={data}
                                fallback={{
                                  id,
                                  url,
                                  text: data?.text,
                                  authorName: data?.user?.name,
                                  authorHandle: data?.user?.screen_name,
                                  avatarUrl: data?.user?.profile_image_url_https,
                                  createdAt: data?.created_at,
                                  likeCount: data?.favorite_count,
                                  replyCount: data?.conversation_count,
                                  mediaUrl:
                                    data?.photos?.[0]?.url ||
                                    data?.mediaDetails?.find((media) => media.type === 'photo')?.media_url_https,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                              <XLogoIcon className="h-5 w-5 opacity-50" />
                            </div>
                            <p className="text-sm mb-1">No posts found</p>
                            <p className="font-pixel text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                              Try a different query
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

            {errorMessage && (
              <Card className="border-destructive shadow-none">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3 text-destructive">
                    <XLogoIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">Search Error</p>
                      <p className="text-xs sm:text-sm leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function XQLPage() {
  return (
    <SidebarLayout>
      <XQLPageContent />
    </SidebarLayout>
  );
}

/* eslint-disable @next/next/no-img-element */
'use client';

import { XLogoIcon } from '@phosphor-icons/react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface XPostCardData {
  id?: string;
  url: string;
  text?: string;
  authorName?: string;
  authorHandle?: string;
  avatarUrl?: string;
  createdAt?: string;
  likeCount?: number;
  replyCount?: number;
  mediaUrl?: string;
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });
}

function formatCount(value?: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export function XPostCard({ post, className }: { post: XPostCardData; className?: string }) {
  const date = formatDate(post.createdAt);
  const likes = formatCount(post.likeCount);
  const replies = formatCount(post.replyCount);
  const displayHandle = post.authorHandle ? `@${post.authorHandle.replace(/^@+/, '')}` : null;

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'group flex h-full min-h-[190px] flex-col rounded-xl border border-border/70 bg-card p-4 text-left shadow-none transition-colors hover:border-border hover:bg-accent/20',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted">
          {post.avatarUrl ? (
            <img src={post.avatarUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <XLogoIcon className="size-4 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{post.authorName || 'X Post'}</p>
              <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                {displayHandle && <span className="truncate">{displayHandle}</span>}
                {displayHandle && date && <span className="shrink-0 text-muted-foreground/50">/</span>}
                {date && <span className="shrink-0">{date}</span>}
              </div>
            </div>
            <ExternalLink className="size-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex-1">
        <p className="line-clamp-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {post.text || (post.id ? `Post ${post.id}` : 'Open on X')}
        </p>
      </div>

      {post.mediaUrl && (
        <div className="mt-3 overflow-hidden rounded-lg border border-border/60 bg-muted/30">
          <img src={post.mediaUrl} alt="" className="max-h-56 w-full object-cover" loading="lazy" />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/50 pt-3">
        <div className="flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
          {likes && <span>{likes} likes</span>}
          {replies && <span>{replies} replies</span>}
          {!likes && !replies && post.id && <span className="truncate">Post {post.id}</span>}
        </div>
        <span className="shrink-0 text-xs font-medium text-primary">Open on X</span>
      </div>
    </a>
  );
}

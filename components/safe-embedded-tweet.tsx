/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { EmbeddedTweet } from 'react-tweet';
import type { Tweet } from 'react-tweet/api';
import { XPostCard, type XPostCardData } from '@/components/x-post-card';

function normalizeTweetEntities(tweet: any) {
  const rawEntities = tweet?.entities && typeof tweet.entities === 'object' ? tweet.entities : {};
  const media = Array.isArray(rawEntities.media) && rawEntities.media.length > 0 ? rawEntities.media : undefined;

  return {
    hashtags: Array.isArray(rawEntities.hashtags) ? rawEntities.hashtags : [],
    urls: Array.isArray(rawEntities.urls) ? rawEntities.urls : [],
    user_mentions: Array.isArray(rawEntities.user_mentions) ? rawEntities.user_mentions : [],
    symbols: Array.isArray(rawEntities.symbols) ? rawEntities.symbols : [],
    ...(media ? { media } : {}),
  };
}

function normalizeTweet(tweet: Tweet): Tweet {
  const text = typeof tweet.text === 'string' ? tweet.text : '';
  const displayTextRange =
    Array.isArray(tweet.display_text_range) && tweet.display_text_range.length === 2
      ? tweet.display_text_range
      : [0, Array.from(text).length];

  return {
    ...tweet,
    text,
    display_text_range: displayTextRange as [number, number],
    entities: normalizeTweetEntities(tweet),
    mediaDetails: Array.isArray(tweet.mediaDetails) ? tweet.mediaDetails : undefined,
    photos: Array.isArray(tweet.photos) ? tweet.photos : undefined,
    quoted_tweet: tweet.quoted_tweet ? (normalizeTweet(tweet.quoted_tweet as unknown as Tweet) as any) : undefined,
    parent: tweet.parent ? (normalizeTweet(tweet.parent as unknown as Tweet) as any) : undefined,
  };
}

interface SafeEmbeddedTweetProps {
  tweet: Tweet | null | undefined;
  fallback: XPostCardData;
}

interface SafeEmbeddedTweetState {
  hasError: boolean;
  fetchedTweet: Tweet | null | undefined;
  isFetching: boolean;
}

export class SafeEmbeddedTweet extends React.Component<SafeEmbeddedTweetProps, SafeEmbeddedTweetState> {
  private abortController?: AbortController;

  constructor(props: SafeEmbeddedTweetProps) {
    super(props);
    this.state = { hasError: false, fetchedTweet: undefined, isFetching: false };
  }

  static getDerivedStateFromError(): Partial<SafeEmbeddedTweetState> {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('react-tweet failed to render sanitized tweet:', error);
  }

  componentDidMount() {
    this.fetchTweetIfNeeded();
  }

  componentDidUpdate(prevProps: SafeEmbeddedTweetProps) {
    if (prevProps.fallback.id !== this.props.fallback.id && this.state.hasError) {
      this.setState({ hasError: false, fetchedTweet: undefined, isFetching: false }, () => {
        this.fetchTweetIfNeeded();
      });
      return;
    }

    if (prevProps.fallback.id !== this.props.fallback.id || prevProps.tweet !== this.props.tweet) {
      this.setState({ fetchedTweet: undefined, isFetching: false }, () => {
        this.fetchTweetIfNeeded();
      });
    }
  }

  componentWillUnmount() {
    this.abortController?.abort();
  }

  private async fetchTweetIfNeeded() {
    if (this.props.tweet || this.state.fetchedTweet !== undefined || this.state.isFetching || !this.props.fallback.id) {
      return;
    }

    this.abortController?.abort();
    this.abortController = new AbortController();
    this.setState({ isFetching: true });

    try {
      const response = await fetch(`/api/tweet?id=${encodeURIComponent(this.props.fallback.id)}`, {
        signal: this.abortController.signal,
      });
      const payload = (await response.json().catch(() => null)) as { tweet?: Tweet | null } | null;

      if (!this.abortController.signal.aborted) {
        this.setState({ fetchedTweet: payload?.tweet ?? null, isFetching: false });
      }
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') return;
      console.warn(`Failed to hydrate tweet ${this.props.fallback.id}:`, error);
      this.setState({ fetchedTweet: null, isFetching: false });
    }
  }

  private renderLoadingCard() {
    return (
      <div className="min-h-[220px] rounded-xl border border-border/70 bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  render() {
    const { tweet, fallback } = this.props;
    const resolvedTweet = tweet ?? this.state.fetchedTweet;
    const isHydratingTweet = !tweet && !!fallback.id && this.state.fetchedTweet === undefined && !this.state.hasError;

    if (!resolvedTweet && (this.state.isFetching || isHydratingTweet)) {
      return this.renderLoadingCard();
    }

    if (!resolvedTweet || this.state.hasError) {
      return <XPostCard post={fallback} />;
    }

    return <EmbeddedTweet tweet={normalizeTweet(resolvedTweet)} />;
  }
}

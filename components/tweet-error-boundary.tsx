'use client';

import React from 'react';
import { XLogoIcon } from '@phosphor-icons/react';

interface TweetErrorBoundaryProps {
  url: string;
  children: React.ReactNode;
}

interface TweetErrorBoundaryState {
  hasError: boolean;
}

export class TweetErrorBoundary extends React.Component<TweetErrorBoundaryProps, TweetErrorBoundaryState> {
  constructor(props: TweetErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): TweetErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('Tweet failed to render:', error);
  }

  render() {
    if (this.state.hasError) {
      const { url } = this.props;
      const postId = url.match(/\/status\/(\d+)/)?.[1];

      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3 sm:p-4 bg-muted/20 hover:bg-muted/30 border border-border rounded-lg group w-full transition-colors"
        >
          <XLogoIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground group-hover:text-primary truncate">
              {postId ? `Post ${postId}` : 'View post'}
            </p>
            <p className="text-xs text-muted-foreground">Open on X</p>
          </div>
        </a>
      );
    }

    return this.props.children;
  }
}

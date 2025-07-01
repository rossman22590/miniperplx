'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { signIn } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SignInPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SignInButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SignInButton = ({ loading, setLoading }: SignInButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        'relative w-full h-10 px-4 font-normal text-sm',
        'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
        'transition-colors duration-150',
        'text-neutral-700 dark:text-neutral-300',
      )}
      disabled={loading}
      onClick={async () => {
        await signIn.social(
          {
            provider: 'google',
            callbackURL: '/',
          },
          {
            onRequest: () => {
              setLoading(true);
            },
          },
        );
      }}
    >
      <div className="flex items-center justify-center w-full gap-3">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </div>
    </Button>
  );
};

export function SignInPromptDialog({ open, onOpenChange }: SignInPromptDialogProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] p-6 gap-0 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        {/* Compact Header */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">Sign in to continue</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Save conversations and sync across devices</p>
        </div>

        {/* Auth Options */}
        <div className="space-y-2 mb-4">
          <SignInButton loading={loading} setLoading={setLoading} />
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white dark:bg-neutral-950 text-neutral-400">or</span>
          </div>
        </div>

        {/* Guest Option */}
        <Button
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="w-full h-10 font-normal text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Continue without account
        </Button>
      </DialogContent>
    </Dialog>
  );
}

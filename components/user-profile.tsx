'use client';

import React, { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import {
  SignOut,
  SignIn,
  UserCircle,
  Bookmark,
  Eye,
  EyeSlash,
  Sun,
  Crown,
  Lightning,
  Gear,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from './theme-switcher';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { User } from '@/lib/db/schema';

// Update the component to use memo
const UserProfile = memo(
  ({
    className,
    user,
    subscriptionData,
    isProUser,
    isProStatusLoading,
  }: {
    className?: string;
    user?: User | null;
    subscriptionData?: any;
    isProUser?: boolean;
    isProStatusLoading?: boolean;
  }) => {
    const [signingOut, setSigningOut] = useState(false);
    const [signingIn, setSigningIn] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const { data: session, isPending } = useSession();
    const router = useRouter();

    // Use passed user prop if available, otherwise fall back to session
    const currentUser = user || session?.user;
    const isAuthenticated = !!(user || session);

    // Use passed Pro status instead of calculating it
    const hasActiveSubscription = isProUser;

    if (isPending && !user) {
      return (
        <div className="h-8 w-8 flex items-center justify-center">
          <div className="size-4 rounded-full bg-muted/50 animate-pulse"></div>
        </div>
      );
    }

    // Function to format email for display
    const formatEmail = (email?: string | null) => {
      if (!email) return '';

      // If showing full email, don't truncate it
      if (showEmail) {
        return email;
      }

      // If hiding email, show only first few characters and domain
      const parts = email.split('@');
      if (parts.length === 2) {
        const username = parts[0];
        const domain = parts[1];
        const maskedUsername = username.slice(0, 3) + '•••';
        return `${maskedUsername}@${domain}`;
      }

      // Fallback for unusual email formats
      return email.slice(0, 3) + '•••';
    };

    return (
      <>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn('p-0! m-0!', signingOut && 'animate-pulse', className)}
                    asChild
                  >
                    <Avatar className="size-7">
                      <AvatarImage
                        src={currentUser?.image ?? ''}
                        alt={currentUser?.name ?? ''}
                        className="rounded-full"
                      />
                      <AvatarFallback className="rounded-full text-sm">{currentUser?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn('p-0! m-0! hover:bg-transparent!', signingIn && 'animate-pulse', className)}
                  >
                    <UserCircle className="size-6" />
                  </Button>
                )}
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              {isAuthenticated ? 'Account' : 'Sign In'}
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent className="w-[240px] z-[110] mr-5">
            {isAuthenticated ? (
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage
                      src={currentUser?.image ?? ''}
                      alt={currentUser?.name ?? ''}
                      className="rounded-full"
                    />
                    <AvatarFallback className="rounded-full">{currentUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="font-medium text-sm leading-none truncate">{currentUser?.name}</p>
                    <div className="flex items-center mt-0.5 gap-1">
                      <div
                        className={`text-xs text-muted-foreground ${showEmail ? '' : 'max-w-[160px] truncate'}`}
                        title={currentUser?.email || ''}
                      >
                        {formatEmail(currentUser?.email)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEmail(!showEmail);
                        }}
                        className="size-6 text-muted-foreground hover:text-foreground"
                      >
                        {showEmail ? <EyeSlash size={12} /> : <Eye size={12} />}
                        <span className="sr-only">{showEmail ? 'Hide email' : 'Show email'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="rounded-full">
                      <UserCircle size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="font-medium text-sm leading-none">Guest</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Sign in to save your progress</p>
                  </div>
                </div>
              </div>
            )}
            <DropdownMenuSeparator />

            {/* Subscription Status - show loading or actual status */}
            {isAuthenticated && (
              <>
                {isProStatusLoading ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2.5 text-sm">
                      <div className="size-6 rounded-md bg-muted/50 border border-border flex items-center justify-center">
                        <div className="size-3 rounded-full bg-muted animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                        <div className="w-16 h-3 bg-muted rounded animate-pulse" />
                        <div className="w-20 h-2 bg-muted/50 rounded animate-pulse mt-1" />
                      </div>
                    </div>
                  </div>
                ) : subscriptionData ? (
                  hasActiveSubscription ? (
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2.5 text-sm">
                        <div className="size-6 rounded-md bg-muted/50 border border-border flex items-center justify-center">
                          <Crown size={14} className="text-foreground" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm">Scira Pro</span>
                          <span className="text-[10px] text-muted-foreground">Unlimited access to all features</span>
                        </div>
                      </div>
                    </div>
                  ) : null
                ) : null}
                {(subscriptionData || isProStatusLoading) && <DropdownMenuSeparator />}
              </>
            )}

            {isAuthenticated && (
              <>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/settings" className="w-full flex items-center gap-2">
                    <Gear size={16} />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem className="cursor-pointer py-1 hover:bg-transparent!">
              <div className="flex items-center justify-between w-full px-0" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  <Sun size={16} />
                  <span className="text-sm">Theme</span>
                </div>
                <ThemeSwitcher />
              </div>
            </DropdownMenuItem>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenuItem
                className="cursor-pointer w-full flex items-center justify-between gap-2"
                onClick={() =>
                  signOut({
                    fetchOptions: {
                      onRequest: () => {
                        setSigningOut(true);
                        toast.loading('Signing out...');
                      },
                      onSuccess: () => {
                        setSigningOut(false);
                        localStorage.clear();
                        toast.success('Signed out successfully');
                        toast.dismiss();
                        window.location.href = '/new';
                      },
                      onError: () => {
                        setSigningOut(false);
                        toast.error('Failed to sign out');
                        window.location.reload();
                      },
                    },
                  })
                }
              >
                <span>Sign Out</span>
                <SignOut className="size-4" />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer w-full flex items-center justify-between gap-2"
                onClick={() => {
                  setSigningIn(true);
                  redirect('/sign-in');
                }}
              >
                <span>Sign In</span>
                <SignIn className="size-4" />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  },
);

// Add a display name for the memoized component for better debugging
UserProfile.displayName = 'UserProfile';

export { UserProfile };

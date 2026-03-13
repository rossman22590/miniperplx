'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';

export default function BannedPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.18),transparent_35%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.14),transparent_40%)]" />
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="rounded-[2rem] border border-border/70 bg-card/85 p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.12)] backdrop-blur md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-pink-500/20 via-fuchsia-500/15 to-violet-500/20 text-3xl text-foreground ring-1 ring-border">
            !
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Account Status</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">This account is blocked</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            Access to Datavibes has been disabled for this account. If you think this happened in error, contact the
            site administrator.
          </p>

          <div className="mt-8 grid gap-3 text-left md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm font-medium">What this means</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Search, settings, lookouts, billing, and account actions are locked while the ban is active.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm font-medium">Next step</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign out of this session or reach out to the admin if the restriction should be reviewed.
              </p>
            </div>
          </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                className="min-w-40"
                variant="destructive"
                onClick={async () => {
                  await signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.replace('/sign-in');
                      },
                      onError: () => {
                        router.replace('/sign-in');
                      },
                    },
                  });
                }}
              >
                Sign out
              </Button>
              <Button asChild variant="outline" className="min-w-40">
                <Link href="/about">About Datavibes</Link>
              </Button>
            </div>
        </div>
      </div>
    </main>
  );
}

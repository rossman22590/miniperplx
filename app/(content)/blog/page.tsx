import Link from 'next/link';
import { ArrowRight, BellDot, Mic2, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { SciraLogo } from '@/components/logos/scira-logo';

const posts = [
  {
    title: 'Datavibes now separates billing from auth',
    category: 'Product',
    date: 'March 2026',
    body: 'Subscriptions, checkout, and billing management now run through a cleaner Stripe-first flow while authentication stays focused on sessions and sign-in.',
  },
  {
    title: 'Voice mode is now built into the app',
    category: 'Voice',
    date: 'March 2026',
    body: 'Realtime voice sessions no longer need a separate local service. Session creation now happens inside the app with cleaner controls and interruption support.',
  },
  {
    title: 'Lookouts are becoming a bigger part of the workflow',
    category: 'Monitoring',
    date: 'March 2026',
    body: 'Recurring research, alerts, and saved monitoring flows are being shaped into a stronger part of the Datavibes experience.',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <SciraLogo className="size-7" />
            <span className="font-be-vietnam-pro text-2xl font-light tracking-tight">Datavibes</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/about" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline">
              About
            </Link>
            <Link href="/pricing" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline">
              Pricing
            </Link>
            <ThemeSwitcher />
            <Button asChild size="sm" className="rounded-full px-4">
              <Link href="/">Open Datavibes</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-6 py-12 sm:px-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Datavibes Journal</p>
            <h1 className="mt-3 font-be-vietnam-pro text-4xl font-light tracking-tight sm:text-5xl">
              Product notes, launches, and what the team is shipping.
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              This page is where Datavibes publishes updates about the product itself: new workflows, interface changes,
              billing improvements, voice updates, and what is getting sharper next.
            </p>
          </div>
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-primary/12 p-3 text-primary">
              <Zap className="size-5" />
            </div>
            <h2 className="text-lg font-medium">Faster research surface</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The interface is being tightened around speed, clarity, and less visual clutter.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-primary/12 p-3 text-primary">
              <Mic2 className="size-5" />
            </div>
            <h2 className="text-lg font-medium">Voice that feels native</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Voice interactions are being treated as a first-class product path, not a side experiment.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-primary/12 p-3 text-primary">
              <BellDot className="size-5" />
            </div>
            <h2 className="text-lg font-medium">Monitoring that sticks</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Lookouts are evolving toward a more dependable research monitoring workflow.
            </p>
          </div>
        </section>

        <section className="mt-12 space-y-4">
          {posts.map((post) => (
            <article key={post.title} className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h2 className="mt-4 font-be-vietnam-pro text-2xl font-light tracking-tight">{post.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{post.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] border border-border/70 bg-muted/20 p-8 sm:p-10">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">What comes next</p>
            <h2 className="mt-3 font-be-vietnam-pro text-3xl font-light tracking-tight">
              Datavibes is moving toward a cleaner research operating system.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Expect more refinement around saved work, monitoring, exports, voice, and subscription flows. The goal is
              simple: make the product feel precise and dependable.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link href="/">
                  Try Datavibes
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/about">About Datavibes</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

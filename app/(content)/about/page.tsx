import Link from 'next/link';
import { ArrowRight, Bell, Brain, Layers3, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { SciraLogo } from '@/components/logos/scira-logo';
import { PRICING, SEARCH_LIMITS } from '@/lib/constants';

const capabilities = [
  {
    title: 'Fast research, less noise',
    body: 'Datavibes turns a messy question into a focused answer with sources, structure, and a clean research trail.',
    icon: Sparkles,
  },
  {
    title: 'Multi-step reasoning',
    body: 'Complex prompts can branch across search, extraction, synthesis, and follow-up work without making the interface feel heavy.',
    icon: Workflow,
  },
  {
    title: 'Model flexibility',
    body: 'Different models and tools are routed for different jobs so the product feels sharp, not generic.',
    icon: Brain,
  },
  {
    title: 'Ongoing monitoring',
    body: 'Lookouts keep watching a topic over time so users do not have to restart the same research manually.',
    icon: Bell,
  },
];

const principles = [
  'Designed to feel fast, direct, and useful from the first search.',
  'Built for real research workflows, not one-shot chatbot novelty.',
  'Structured around clarity, sources, and practical follow-through.',
];

const steps = [
  {
    label: 'Ask',
    body: 'Start with a plain-language question, a topic to monitor, or a thread you want broken down.',
  },
  {
    label: 'Investigate',
    body: 'Datavibes pulls current information, evaluates sources, and organizes the work into something readable.',
  },
  {
    label: 'Act',
    body: 'Export, share, revisit, or automate the research path instead of losing it after one session.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <SciraLogo className="size-7" />
            <span className="font-be-vietnam-pro text-2xl font-light tracking-tight">Datavibes</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/blog" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline">
              Journal
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

      <main>
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,79,163,0.15),transparent_35%),radial-gradient(circle_at_top_right,rgba(183,72,255,0.12),transparent_32%)]" />
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:py-28">
            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                <Layers3 className="size-3.5" />
                Research, monitoring, and AI workflows in one product
              </div>
              <h1 className="max-w-4xl font-be-vietnam-pro text-5xl font-light tracking-tight sm:text-6xl lg:text-7xl">
                Datavibes helps people turn live information into usable decisions.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                It is an AI research product for people who need more than chat. Search, synthesize, revisit, monitor, and
                export work without losing the thread.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link href="/">
                    Start searching
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <Link href="/pricing">View plans</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Built for practical use</p>
                    <p className="text-sm text-muted-foreground">Clear outputs, reliable monitoring, clean follow-up.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {principles.map((item) => (
                    <div key={item} className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Free plan</p>
                    <p className="mt-2 text-2xl font-light">{SEARCH_LIMITS.DAILY_SEARCH_LIMIT}/day</p>
                    <p className="mt-1 text-sm text-muted-foreground">Focused daily research runs.</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Pro</p>
                    <p className="mt-2 text-2xl font-light">${PRICING.PRO_MONTHLY}/mo</p>
                    <p className="mt-1 text-sm text-muted-foreground">Unlimited usage and premium tools.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">What Datavibes is for</p>
            <h2 className="mt-3 font-be-vietnam-pro text-3xl font-light tracking-tight sm:text-4xl">
              A product for people who need answers they can actually work with.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6">
                <div className="mb-5 inline-flex rounded-2xl bg-primary/12 p-3 text-primary">
                  <item.icon className="size-5" />
                </div>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border/70 bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-20">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">How it works</p>
              <h2 className="mt-3 font-be-vietnam-pro text-3xl font-light tracking-tight sm:text-4xl">
                Datavibes keeps the workflow simple even when the research is not.
              </h2>
            </div>

            <div className="mt-10 space-y-4 lg:mt-0">
              {steps.map((step, index) => (
                <div key={step.label} className="rounded-[1.75rem] border border-border/70 bg-background/85 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium">{step.label}</h3>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[2rem] border border-border/70 bg-card/60 p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Trust</p>
              <h2 className="mt-3 font-be-vietnam-pro text-3xl font-light tracking-tight">Datavibes is designed for real usage, not vague demo energy.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                The product is built around readable outputs, durable research history, privacy-aware account handling,
                and a billing flow that is separate from authentication. That makes the experience cleaner for users and
                easier to maintain over time.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Need help?</p>
              <h2 className="mt-3 font-be-vietnam-pro text-3xl font-light tracking-tight">Talk to the Datavibes team.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Questions about plans, support, student pricing, or product usage can be sent to{' '}
                <a href="mailto:support@mydatavibes.com" className="text-foreground underline underline-offset-4">
                  support@mydatavibes.com
                </a>
                .
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-full">
                  <Link href="/pricing">See pricing</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/blog">Read the journal</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <SciraLogo className="size-5" />
            <span>&copy; {new Date().getFullYear()} Datavibes</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Journal
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

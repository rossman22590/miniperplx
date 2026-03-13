import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SciraLogo } from '@/components/logos/scira-logo';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative border-b border-border/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,79,163,0.10),transparent_32%),radial-gradient(circle_at_top_right,rgba(183,72,255,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-20 sm:px-6">
          <div className="mb-8 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-full border border-border/70 bg-background/90 shadow-sm">
                <SciraLogo className="size-8" />
              </div>
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Datavibes</p>
            <h1 className="mt-3 font-be-vietnam-pro text-4xl font-light tracking-tight sm:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: March 13, 2026</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-be-vietnam-pro prose-headings:font-light prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-foreground">
          <p className="text-lg">
            This Privacy Policy explains how Datavibes collects, uses, and protects information when you use the service.
          </p>

          <h2>1. Information We Collect</h2>
          <p>Depending on how you use Datavibes, we may collect:</p>
          <ul>
            <li>account information such as name, email address, and profile image</li>
            <li>queries, prompts, instructions, saved chats, exports, and monitoring configurations</li>
            <li>usage data such as feature interactions, device/browser details, and service diagnostics</li>
            <li>subscription and billing status information needed to manage access</li>
          </ul>

          <h2>2. How We Use Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>operate and secure the Datavibes service</li>
            <li>deliver search, research, monitoring, and export features</li>
            <li>manage subscriptions, access limits, and account support</li>
            <li>debug issues, improve reliability, and understand product usage</li>
          </ul>

          <h2>3. Billing Data</h2>
          <p>
            Datavibes does not store full payment card details. Checkout, billing management, and payment processing are
            handled by Stripe. We may receive limited billing metadata such as subscription status, customer identifiers,
            and invoice-related events needed to manage your plan.
          </p>

          <h2>4. Third-Party Providers</h2>
          <p>
            Datavibes relies on third-party services for infrastructure, authentication, model access, search, email,
            analytics, storage, and billing. Those providers may process data on our behalf subject to their own policies
            and contractual terms.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We keep information for as long as needed to operate the service, comply with legal obligations, resolve
            disputes, maintain security, and enforce our agreements. Retention periods may vary depending on the type of
            data and the account state.
          </p>

          <h2>6. Security</h2>
          <p>
            We use reasonable administrative, technical, and organizational safeguards to protect data. No system is
            perfectly secure, and we cannot guarantee absolute security.
          </p>

          <h2>7. Your Choices</h2>
          <p>Depending on your location and account state, you may be able to:</p>
          <ul>
            <li>access or update certain account information</li>
            <li>cancel a paid subscription</li>
            <li>request deletion of account-related data, subject to legal and operational limits</li>
            <li>contact support about privacy questions or data requests</li>
          </ul>

          <h2>8. International Processing</h2>
          <p>
            Datavibes and its providers may process data in different jurisdictions. By using the service, you understand
            that information may be transferred to and processed outside your local region.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we may revise the effective
            date and update the policy on this page.
          </p>

          <h2>10. Contact</h2>
          <p>If you have questions about privacy or data handling, contact:</p>
          <p>
            <a href="mailto:support@mydatavibes.com" className="inline-flex items-center gap-1">
              support@mydatavibes.com <ExternalLink className="size-4" />
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <SciraLogo className="size-5" />
            <span>&copy; {new Date().getFullYear()} Datavibes</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Journal
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

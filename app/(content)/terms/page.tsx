import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SciraLogo } from '@/components/logos/scira-logo';

export default function TermsPage() {
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
            <h1 className="mt-3 font-be-vietnam-pro text-4xl font-light tracking-tight sm:text-5xl">Terms of Service</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: March 13, 2026</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-be-vietnam-pro prose-headings:font-light prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-foreground">
          <p className="text-lg">
            These Terms of Service govern your use of Datavibes, including our website, research tools, monitoring
            features, account services, and paid subscriptions. By using Datavibes, you agree to these terms.
          </p>

          <h2>1. Using Datavibes</h2>
          <p>
            Datavibes is an AI-assisted research and monitoring product. You may use it only in compliance with applicable
            law and these terms. You are responsible for your account activity and for maintaining the confidentiality of
            your login credentials.
          </p>

          <h2>2. Acceptable Use</h2>
          <p>You may not use Datavibes to:</p>
          <ul>
            <li>break the law or help others break the law</li>
            <li>attempt unauthorized access to accounts, systems, or networks</li>
            <li>distribute malware, spam, or abusive automated traffic</li>
            <li>generate content that is fraudulent, harmful, or infringing</li>
            <li>interfere with the service, its infrastructure, or other users</li>
          </ul>

          <h2>3. Accounts and Access</h2>
          <p>
            Some features require an account. We may suspend or terminate access if we reasonably believe an account is
            being used in violation of these terms, in a way that creates security risk, or in a way that threatens the
            stability of the service.
          </p>

          <h2>4. Product Behavior</h2>
          <p>
            Datavibes uses AI models, search tools, and other third-party infrastructure to generate outputs. Results may
            be incomplete, outdated, or incorrect. You are responsible for reviewing outputs before relying on them,
            especially for legal, financial, medical, employment, or other high-impact decisions.
          </p>

          <h2>5. Paid Plans and Billing</h2>
          <p>
            Datavibes offers free and paid subscriptions. Paid plans currently use Stripe for checkout, billing, and
            subscription management.
          </p>
          <ul>
            <li>subscriptions renew automatically unless cancelled before renewal</li>
            <li>prices, features, and limits may change over time</li>
            <li>you are responsible for applicable taxes, fees, and payment method accuracy</li>
            <li>failed or disputed payments may result in suspension of paid access</li>
          </ul>

          <h2>6. Cancellation</h2>
          <p>
            You can cancel a subscription through the billing portal. Unless otherwise required by law, cancellations take
            effect at the end of the current billing period and previously paid fees are non-refundable.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            Datavibes, including its branding, interface, design, software, and service materials, is owned by Datavibes
            or its licensors and is protected by applicable intellectual property laws. These terms do not grant you any
            ownership rights in the service.
          </p>

          <h2>8. Third-Party Services</h2>
          <p>
            Datavibes depends on third-party providers for infrastructure, authentication, billing, model access, search,
            and related product functionality. Those services may have their own terms and privacy policies.
          </p>

          <h2>9. Service Availability</h2>
          <p>
            We may change, suspend, or discontinue features at any time. We do not guarantee uninterrupted availability,
            real-time delivery, or permanent retention of all content and activity history.
          </p>

          <h2>10. Disclaimer</h2>
          <p>
            Datavibes is provided on an &quot;as is&quot; and &quot;as available&quot; basis, without warranties of any kind to the fullest
            extent permitted by law.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Datavibes and its operators will not be liable for indirect,
            incidental, special, consequential, or punitive damages, or for loss of data, revenue, profits, or goodwill
            arising from your use of the service.
          </p>

          <h2>12. Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of Datavibes after an update becomes effective
            constitutes acceptance of the revised terms.
          </p>

          <h2>13. Contact</h2>
          <p>If you have questions about these Terms of Service, contact:</p>
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
            <Link href="/privacy-policy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PRICING, SEARCH_LIMITS } from '@/lib/constants';
import { getDiscountConfigAction } from '@/app/actions';
import type { DiscountConfig } from '@/lib/discount';
import { useLocation } from '@/hooks/use-location';
import type { ComprehensiveUserData } from '@/lib/user-data-server';
import { StudentDomainRequestButton } from '@/components/student-domain-request-button';
import { SupportedDomainsList } from '@/components/supported-domains-list';
import { SciraLogo } from '@/components/logos/scira-logo';

type SubscriptionDetails = {
  id: string;
  productId: string;
  status: string;
  amount: number;
  currency: string;
  recurringInterval: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
};

type SubscriptionDetailsResult = {
  hasSubscription: boolean;
  subscription?: SubscriptionDetails;
  error?: string;
  errorType?: 'CANCELED' | 'EXPIRED' | 'GENERAL';
};

interface PricingTableProps {
  subscriptionDetails: SubscriptionDetailsResult;
  user: ComprehensiveUserData | null;
}

export default function PricingTable({ subscriptionDetails, user }: PricingTableProps) {
  const router = useRouter();
  const location = useLocation();
  const userEmail = user?.email?.toLowerCase() ?? '';
  const derivedIsIndianStudentEmail = Boolean(
    userEmail && (userEmail.endsWith('.ac.in') || userEmail.endsWith('.edu.in')),
  );

  const [discountConfig, setDiscountConfig] = useState<DiscountConfig>({
    enabled: false,
    isStudentDiscount: false,
  });

  useEffect(() => {
    const fetchDiscountConfig = async () => {
      try {
        const config = await getDiscountConfigAction({
          email: user?.email,
          isIndianUser: location.isIndia || derivedIsIndianStudentEmail,
        });

        setDiscountConfig(config as DiscountConfig);
      } catch (error) {
        console.error('Failed to fetch discount config:', error);
      }
    };

    fetchDiscountConfig();
  }, [derivedIsIndianStudentEmail, location.isIndia, user?.email]);

  const hasProAccess = Boolean(user?.isProUser || subscriptionDetails.subscription?.status === 'active');
  const hasStudentDiscount = Boolean(discountConfig.enabled && discountConfig.isStudentDiscount);

  const getStudentPrice = (isInr: boolean) => {
    if (!hasStudentDiscount) {
      return null;
    }

    return isInr ? discountConfig.inrPrice || null : discountConfig.finalPrice || null;
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/sign-up');
      return;
    }

    try {
      toast.loading('Redirecting to checkout...');

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isIndianUser: location.isIndia || derivedIsIndianStudentEmail,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || 'Checkout failed');
      }

      toast.dismiss();
      window.location.href = payload.url;
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });
      const payload = await response.json();

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || 'Failed to open billing portal');
      }

      window.location.href = payload.url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      toast.error('Failed to open billing portal');
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const proPriceLabel =
    location.isIndia || derivedIsIndianStudentEmail
      ? hasStudentDiscount && getStudentPrice(true)
        ? `Subscribe INR ${getStudentPrice(true)}/month`
        : `Subscribe INR ${PRICING.PRO_MONTHLY_INR}/month`
      : hasStudentDiscount && getStudentPrice(false)
        ? `Subscribe USD ${getStudentPrice(false)}/month`
        : 'Subscribe USD 15/month';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-14 items-center justify-between px-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <SciraLogo className="size-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-be-vietnam-pro text-lg font-light tracking-tighter">Datavibes</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 pb-12 pt-16 text-center">
        <p className="mb-3 text-xs tracking-wide text-muted-foreground">Plans</p>
        <h1 className="font-be-vietnam-pro mb-4 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          Pricing
        </h1>
        <p className="text-base text-muted-foreground">Choose the plan that works for you</p>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
          <div className="flex flex-col bg-background p-8">
            <h3 className="mb-2 text-lg font-medium text-foreground">Free</h3>
            <p className="mb-6 text-sm text-muted-foreground">Get started with essential features</p>
            <div className="mb-8 flex items-baseline">
              <span className="font-be-vietnam-pro text-4xl font-light tracking-tight text-foreground">$0</span>
              <span className="ml-2 text-sm text-muted-foreground">/month</span>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                {SEARCH_LIMITS.DAILY_SEARCH_LIMIT} searches per day
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                Basic AI models
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                Search history
              </li>
            </ul>

            <Button variant="outline" className="h-11 w-full rounded-none" disabled={!hasProAccess}>
              {!hasProAccess ? 'Current plan' : 'Free plan'}
            </Button>
          </div>

          <div className="relative flex flex-col bg-muted/20 p-8">
            {hasProAccess && (
              <div className="absolute right-4 top-4">
                <span className="border border-foreground px-2 py-1 text-[10px] uppercase tracking-wider text-foreground">
                  Current
                </span>
              </div>
            )}
            {!hasProAccess && hasStudentDiscount && (
              <div className="absolute right-4 top-4">
                <span className="border border-green-600 px-2 py-1 text-[10px] uppercase tracking-wider text-green-600 dark:border-green-400 dark:text-green-400">
                  Student
                </span>
              </div>
            )}

            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-lg font-medium text-foreground">Pro</h3>
              {!hasProAccess && !hasStudentDiscount && (
                <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Popular
                </span>
              )}
            </div>
            <p className="mb-6 text-sm text-muted-foreground">Everything for serious research</p>

            <div className="mb-8">
              {hasProAccess ? (
                <div className="flex items-baseline">
                  <span className="font-be-vietnam-pro text-4xl font-light tracking-tight text-foreground">
                    {location.isIndia || derivedIsIndianStudentEmail ? `INR ${PRICING.PRO_MONTHLY_INR}` : 'USD 15'}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">/month</span>
                </div>
              ) : location.isIndia || derivedIsIndianStudentEmail ? (
                <div className="space-y-1">
                  <div className="flex items-baseline">
                    {getStudentPrice(true) ? (
                      <>
                        <span className="mr-2 text-xl text-muted-foreground line-through">
                          INR {PRICING.PRO_MONTHLY_INR}
                        </span>
                        <span className="font-be-vietnam-pro text-4xl font-light tracking-tight text-foreground">
                          INR {getStudentPrice(true)}
                        </span>
                      </>
                    ) : (
                      <span className="font-be-vietnam-pro text-4xl font-light tracking-tight text-foreground">
                        INR {PRICING.PRO_MONTHLY_INR}
                      </span>
                    )}
                    <span className="ml-2 text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Approx. USD 15/month</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-baseline">
                    {getStudentPrice(false) ? (
                      <>
                        <span className="mr-2 text-xl text-muted-foreground line-through">USD 15</span>
                        <span className="font-be-vietnam-pro text-4xl font-light tracking-tight text-foreground">
                          USD {getStudentPrice(false)}
                        </span>
                      </>
                    ) : (
                      <span className="font-be-vietnam-pro text-4xl font-light tracking-tight text-foreground">
                        USD 15
                      </span>
                    )}
                    <span className="ml-2 text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Approx. INR {PRICING.PRO_MONTHLY_INR}/month</p>
                </div>
              )}
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                Unlimited searches
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                All AI models
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                PDF analysis
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                Priority support
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                Datavibes Lookout
              </li>
            </ul>

            {hasProAccess ? (
              <div className="space-y-3">
                <Button className="h-11 w-full rounded-none" onClick={handleManageSubscription}>
                  Manage billing
                </Button>
                {subscriptionDetails.subscription && (
                  <p className="text-center text-xs text-muted-foreground">
                    {subscriptionDetails.subscription.cancelAtPeriodEnd
                      ? `Expires ${formatDate(subscriptionDetails.subscription.currentPeriodEnd)}`
                      : `Renews ${formatDate(subscriptionDetails.subscription.currentPeriodEnd)}`}
                  </p>
                )}
              </div>
            ) : !user ? (
              <Button className="group h-11 w-full rounded-none" onClick={handleCheckout}>
                Sign up for Pro
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <div className="space-y-3">
                <Button className="group h-11 w-full rounded-none" onClick={handleCheckout} disabled={location.loading}>
                  {location.loading ? 'Loading...' : proPriceLabel}
                  {!location.loading && (
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Secure card checkout via Stripe. Subscription renews monthly.
                </p>
                {hasStudentDiscount && discountConfig.message && (
                  <p className="text-center text-xs font-medium text-green-600 dark:text-green-400">
                    {discountConfig.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {!hasStudentDiscount && (
          <div className="mx-auto mt-8 max-w-3xl border border-border p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <h3 className="mb-1 text-sm font-medium">Student discount available</h3>
                  <p className="text-xs text-muted-foreground">
                    {location.isIndia || derivedIsIndianStudentEmail
                      ? 'Get Pro for just INR 450/month. Sign up with your university email.'
                      : 'Get Pro for just USD 5/month. Sign up with your university email.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SupportedDomainsList />
                <StudentDomainRequestButton />
              </div>
            </div>
          </div>
        )}

        {hasStudentDiscount && !hasProAccess && (
          <div className="mx-auto mt-8 max-w-3xl border border-green-200 bg-green-50/50 p-6 dark:border-green-800 dark:bg-green-900/10">
            <div className="flex items-start gap-4">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="mb-1 text-sm font-medium text-green-700 dark:text-green-300">Student discount active</h3>
                <p className="text-xs text-muted-foreground">
                  Your university email qualifies for discounted Stripe checkout pricing.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto mt-16 max-w-3xl space-y-4 text-center">
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our{' '}
            <Link href="/terms" className="text-foreground hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-foreground hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <SciraLogo className="size-4" />
              <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Datavibes AI</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Home
              </Link>
              <Link href="/about" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                About
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Terms
              </Link>
              <Link
                href="/privacy-policy"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

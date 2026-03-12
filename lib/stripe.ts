import 'server-only';

import Stripe from 'stripe';
import { serverEnv } from '@/env/server';

function getRequiredEnv(name: string, value: string) {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export const stripe = new Stripe(getRequiredEnv('STRIPE_SECRET_KEY', serverEnv.STRIPE_SECRET_KEY), {
  apiVersion: '2025-08-27.basil',
  appInfo: {
    name: 'Datavibes',
  },
});

export function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, 'https://') ||
    (process.env.NODE_ENV === 'production' ? 'https://mydatavibes.com' : 'http://localhost:3000')
  );
}

export function getStripeWebhookSecret() {
  return getRequiredEnv('STRIPE_WEBHOOK_SECRET', serverEnv.STRIPE_WEBHOOK_SECRET);
}

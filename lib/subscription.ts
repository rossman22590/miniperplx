import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export type SubscriptionDetailsResult = {
  hasSubscription: boolean;
  error?: string;
  errorType?: 'GENERAL';
};

export async function getSubscriptionDetails(): Promise<SubscriptionDetailsResult> {
  'use server';

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { hasSubscription: false };
    }

    // Default to no subscription for free tier
    return { hasSubscription: false };
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return {
      hasSubscription: false,
      error: 'Failed to load subscription details',
      errorType: 'GENERAL',
    };
  }
}

// Simple helper to check if user has an active subscription
export async function isUserSubscribed(): Promise<boolean> {
  return false;
}

// Helper to check if user has access to a specific product/tier
export async function hasAccessToProduct(productId: string): Promise<boolean> {
  return false;
}

// Helper to get user's current subscription status
export async function getUserSubscriptionStatus(): Promise<'none'> {
  return 'none';
}

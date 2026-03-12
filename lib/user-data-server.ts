import 'server-only';

import { desc, eq } from 'drizzle-orm';
import { subscription, user } from './db/schema';
import { getReadReplica, maindb } from './db';
import { auth } from './auth';
import { headers } from 'next/headers';
import { getCustomInstructionsByUserId, getUserPreferencesByUserId } from './db/queries';
import type { CustomInstructions, UserPreferences } from './db/schema';

const ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'trialing', 'past_due'] as const;

type NormalizedSubscription = {
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

// Single comprehensive user data type
export type ComprehensiveUserData = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  isProUser: boolean;
  proSource: 'stripe' | 'polar' | 'dodo' | 'none';
  subscriptionStatus: 'active' | 'canceled' | 'expired' | 'none';
  subscription?: NormalizedSubscription;
  polarSubscription?: NormalizedSubscription;
  dodoSubscription?: {
    hasSubscriptions: boolean;
    expiresAt: Date | null;
    mostRecentSubscription?: Date;
    daysUntilExpiration?: number;
    isExpired: boolean;
    isExpiringSoon: boolean;
  };
  // Subscription history
  subscriptionHistory: any[];
};

// Lightweight user auth type for fast checks
export type LightweightUserAuth = {
  userId: string;
  email: string;
  isProUser: boolean;
};

const userDataCache = new Map<string, { data: ComprehensiveUserData; expiresAt: number }>();
const lightweightAuthCache = new Map<string, { data: LightweightUserAuth; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const LIGHTWEIGHT_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes - shorter for lightweight checks

// Custom instructions cache (per-user)
const customInstructionsCache = new Map<
  string,
  {
    instructions: CustomInstructions | null;
    timestamp: number;
    ttl: number;
  }
>();
const CUSTOM_INSTRUCTIONS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// User preferences cache (per-user)
const userPreferencesCache = new Map<
  string,
  {
    preferences: UserPreferences | null;
    timestamp: number;
    ttl: number;
  }
>();
const USER_PREFERENCES_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedUserData(userId: string): ComprehensiveUserData | null {
  const cached = userDataCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }
  if (cached) {
    userDataCache.delete(userId);
  }
  return null;
}

function setCachedUserData(userId: string, data: ComprehensiveUserData): void {
  userDataCache.set(userId, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export function clearUserDataCache(userId: string): void {
  userDataCache.delete(userId);
  // Also clear lightweight auth cache to avoid stale pro status
  lightweightAuthCache.delete(userId);
  // Clear any per-user custom instructions cache
  customInstructionsCache.delete(userId);
  // Clear any per-user preferences cache
  userPreferencesCache.delete(userId);
}

export function clearAllUserDataCache(): void {
  userDataCache.clear();
  lightweightAuthCache.clear();
  customInstructionsCache.clear();
  userPreferencesCache.clear();
}

function getCachedLightweightAuth(userId: string): LightweightUserAuth | null {
  const cached = lightweightAuthCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }
  if (cached) {
    lightweightAuthCache.delete(userId);
  }
  return null;
}

function setCachedLightweightAuth(userId: string, data: LightweightUserAuth): void {
  lightweightAuthCache.set(userId, {
    data,
    expiresAt: Date.now() + LIGHTWEIGHT_CACHE_TTL_MS,
  });
}

/**
 * Get custom instructions for a user with in-memory caching.
 * Falls back to DB via getCustomInstructionsByUserId when cache miss/expired.
 */
export async function getCachedCustomInstructionsByUserId(
  userId: string,
  options?: { ttlMs?: number },
): Promise<CustomInstructions | null> {
  const ttlMs = options?.ttlMs ?? CUSTOM_INSTRUCTIONS_CACHE_TTL_MS;
  const cached = customInstructionsCache.get(userId);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.instructions;
  }

  const instructions = await getCustomInstructionsByUserId({ userId });
  customInstructionsCache.set(userId, {
    instructions: instructions ?? null,
    timestamp: Date.now(),
    ttl: ttlMs,
  });
  return instructions ?? null;
}

export function clearCustomInstructionsCache(userId?: string): void {
  if (userId) {
    customInstructionsCache.delete(userId);
  } else {
    customInstructionsCache.clear();
  }
}

/**
 * Get user preferences for a user with in-memory caching.
 * Falls back to DB via getUserPreferencesByUserId when cache miss/expired.
 */
export async function getCachedUserPreferencesByUserId(
  userId: string,
  options?: { ttlMs?: number },
): Promise<UserPreferences | null> {
  const ttlMs = options?.ttlMs ?? USER_PREFERENCES_CACHE_TTL_MS;
  const cached = userPreferencesCache.get(userId);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.preferences;
  }

  const preferences = await getUserPreferencesByUserId({ userId });
  userPreferencesCache.set(userId, {
    preferences: preferences ?? null,
    timestamp: Date.now(),
    ttl: ttlMs,
  });
  return preferences ?? null;
}

export function clearUserPreferencesCache(userId?: string): void {
  if (userId) {
    userPreferencesCache.delete(userId);
  } else {
    userPreferencesCache.clear();
  }
}

function mapSubscriptionRecord(record: typeof subscription.$inferSelect): NormalizedSubscription {
  return {
    id: record.id,
    productId: record.productId,
    status: record.status,
    amount: record.amount,
    currency: record.currency,
    recurringInterval: record.recurringInterval,
    currentPeriodStart: record.currentPeriodStart,
    currentPeriodEnd: record.currentPeriodEnd,
    cancelAtPeriodEnd: record.cancelAtPeriodEnd,
    canceledAt: record.canceledAt,
  };
}

function isSubscriptionCurrentlyActive(record: typeof subscription.$inferSelect): boolean {
  return (
    ACTIVE_SUBSCRIPTION_STATUSES.includes(record.status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number]) &&
    new Date(record.currentPeriodEnd) > new Date()
  );
}

/**
 * Lightweight authentication check that only fetches minimal user data.
 * This is much faster than getComprehensiveUserData() and should be used
 * for early auth checks before fetching full user details.
 *
 * @returns Lightweight user auth data or null if not authenticated
 */
export async function getLightweightUserAuth(): Promise<LightweightUserAuth | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const userId = session.user.id;

    // Check lightweight cache first
    const cached = getCachedLightweightAuth(userId);
    if (cached) {
      return cached;
    }

    // Check if full user data is cached (reuse it if available)
    const fullCached = getCachedUserData(userId);
    if (fullCached) {
      const lightweightData: LightweightUserAuth = {
        userId: fullCached.id,
        email: fullCached.email,
        isProUser: fullCached.isProUser,
      };
      setCachedLightweightAuth(userId, lightweightData);
      return lightweightData;
    }

    const readDb = getReadReplica();
    const [userRecord] = await readDb
      .select({
        userId: user.id,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userRecord) {
      return null;
    }

    const userSubscriptions = await readDb
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .orderBy(desc(subscription.currentPeriodEnd));

    const activeSubscription = userSubscriptions.find((record) => isSubscriptionCurrentlyActive(record));

    const lightweightData: LightweightUserAuth = {
      userId: userRecord.userId,
      email: userRecord.email,
      isProUser: Boolean(activeSubscription),
    };

    // Cache the result
    setCachedLightweightAuth(userId, lightweightData);

    return lightweightData;
  } catch (error) {
    console.error('Error in lightweight auth check:', error);
    return null;
  }
}

export async function getComprehensiveUserData(): Promise<ComprehensiveUserData | null> {
  try {
    // If billing is off, return premium user data immediately
    if (process.env.BILLING_OFF === 'true') {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user?.id) {
        return null;
      }

      const [userData] = await maindb.select().from(user).where(eq(user.id, session.user.id)).limit(1);

      if (!userData) {
        return null;
      }

      // Return user with premium status when billing is disabled
      return {
        id: userData.id,
        email: userData.email,
        emailVerified: userData.emailVerified,
        name: userData.name || userData.email.split('@')[0],
        image: userData.image,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        isProUser: true,
        proSource: 'stripe',
        subscriptionStatus: 'active',
        subscriptionHistory: [],
      };
    }

    // Get session once
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const userId = session.user.id;

    // Check cache first
    const cached = getCachedUserData(userId);
    if (cached) {
      return cached;
    }

    const readDb = getReadReplica();
    const [userData] = await readDb.select().from(user).where(eq(user.id, userId)).limit(1);
    if (!userData) {
      return null;
    }

    const userSubscriptions = await readDb
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .orderBy(desc(subscription.currentPeriodEnd));

    const activeSubscription = userSubscriptions.find((record) => isSubscriptionCurrentlyActive(record));
    const latestSubscription = userSubscriptions[0];

    let isProUser = Boolean(activeSubscription);
    let proSource: 'stripe' | 'polar' | 'dodo' | 'none' = activeSubscription ? 'stripe' : 'none';
    let subscriptionStatus: 'active' | 'canceled' | 'expired' | 'none' = 'none';

    if (activeSubscription) {
      subscriptionStatus = 'active';
    } else if (latestSubscription) {
      const isExpired = new Date(latestSubscription.currentPeriodEnd) <= new Date();
      if (latestSubscription.status === 'canceled' || latestSubscription.status === 'cancelled') {
        subscriptionStatus = 'canceled';
      } else if (isExpired) {
        subscriptionStatus = 'expired';
      }
    }

    const comprehensiveData: ComprehensiveUserData = {
      id: userData.id,
      email: userData.email,
      emailVerified: userData.emailVerified,
      name: userData.name || userData.email.split('@')[0],
      image: userData.image,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      isProUser,
      proSource,
      subscriptionStatus,
      subscription: activeSubscription ? mapSubscriptionRecord(activeSubscription) : undefined,
      polarSubscription: activeSubscription ? mapSubscriptionRecord(activeSubscription) : undefined,
      dodoSubscription: undefined,
      subscriptionHistory: userSubscriptions.map((record) => ({
        ...record,
        provider: 'stripe',
      })),
    };

    // Cache the result
    setCachedUserData(userId, comprehensiveData);

    return comprehensiveData;
  } catch (error) {
    console.error('Error getting comprehensive user data:', error);
    return null;
  }
}

// Helper functions for backward compatibility and specific use cases
export async function isUserPro(): Promise<boolean> {
  // If billing is off, everyone is premium
  if (process.env.BILLING_OFF === 'true') {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return !!session?.user?.id; // Premium if authenticated
  }
  
  const userData = await getComprehensiveUserData();
  return userData?.isProUser || false;
}

export async function getUserSubscriptionStatus(): Promise<'active' | 'canceled' | 'expired' | 'none'> {
  const userData = await getComprehensiveUserData();
  return userData?.subscriptionStatus || 'none';
}

export async function getProSource(): Promise<'stripe' | 'polar' | 'dodo' | 'none'> {
  const userData = await getComprehensiveUserData();
  return userData?.proSource || 'none';
}

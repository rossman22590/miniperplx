import 'server-only';

import { headers } from 'next/headers';
import { desc, eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { auth } from '@/lib/auth';
import { db, maindb } from '@/lib/db';
import { chat, lookout, session, subscription, type UserPreferences, user, userPreferences } from '@/lib/db/schema';
import { invalidateSessionCaches, invalidateUserCaches } from '@/lib/performance-cache';
import { clearUserDataCache } from '@/lib/user-data-server';
import { upsertUserPreferences } from '@/lib/db/queries';

const ADMIN_EMAIL = 'rcohen@mytsi.org';
const MANUAL_PRO_PRODUCT_ID = 'admin-pro';
const MANUAL_MAX_PRODUCT_ID = 'admin-max';
const MANUAL_PRO_INTERVAL = 'manual';
const MANUAL_PRO_DURATION_YEARS = 50;

function invalidateAdminManagedUserState(userId: string) {
  clearUserDataCache(userId);
  invalidateUserCaches(userId);
  invalidateSessionCaches();
}

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string;
};

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  chatCount: number;
  lookoutCount: number;
  sessionCount: number;
  isPro: boolean;
  isMax: boolean;
  subscriptionStatus: string;
  subscriptionEndsAt: Date | null;
  isBanned: boolean;
  banReason: string | null;
  banUpdatedAt: string | null;
};

type AdminPreferenceFlags = NonNullable<UserPreferences['preferences']>;

function getBanFlags(preferences?: AdminPreferenceFlags | null) {
  return {
    isBanned: Boolean(preferences?.['admin-banned']),
    banReason: preferences?.['admin-ban-reason'] ?? null,
    banUpdatedAt: preferences?.['admin-ban-updated-at'] ?? null,
  };
}

function isActiveSubscriptionStatus(status: string) {
  return ['active', 'trialing', 'past_due'].includes(status);
}

export async function getAdminSessionUser(): Promise<AdminSessionUser | null> {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData?.user?.id || !sessionData.user.email) {
    return null;
  }

  if (sessionData.user.email.toLowerCase() !== ADMIN_EMAIL) {
    return null;
  }

  return {
    id: sessionData.user.id,
    email: sessionData.user.email,
    name: sessionData.user.name ?? sessionData.user.email.split('@')[0],
  };
}

export async function requireAdminSessionUser(): Promise<AdminSessionUser> {
  const adminUser = await getAdminSessionUser();

  if (!adminUser) {
    throw new Error('Admin access denied');
  }

  return adminUser;
}

export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  await requireAdminSessionUser();

  const [users, subscriptions, preferences, chats, lookouts, sessions] = await Promise.all([
    maindb.select().from(user).orderBy(desc(user.createdAt)),
    maindb.select().from(subscription).orderBy(desc(subscription.currentPeriodEnd)),
    maindb.select().from(userPreferences),
    maindb.select({ userId: chat.userId }).from(chat),
    maindb.select({ userId: lookout.userId }).from(lookout),
    maindb.select({ userId: session.userId }).from(session),
  ]);

  const subscriptionsByUserId = new Map<string, typeof subscription.$inferSelect[]>();
  for (const record of subscriptions) {
    if (!record.userId) continue;
    const existing = subscriptionsByUserId.get(record.userId) ?? [];
    existing.push(record);
    subscriptionsByUserId.set(record.userId, existing);
  }

  const preferencesByUserId = new Map(preferences.map((record) => [record.userId, record.preferences]));
  const chatCounts = new Map<string, number>();
  const lookoutCounts = new Map<string, number>();
  const sessionCounts = new Map<string, number>();

  for (const record of chats) {
    chatCounts.set(record.userId, (chatCounts.get(record.userId) ?? 0) + 1);
  }

  for (const record of lookouts) {
    lookoutCounts.set(record.userId, (lookoutCounts.get(record.userId) ?? 0) + 1);
  }

  for (const record of sessions) {
    sessionCounts.set(record.userId, (sessionCounts.get(record.userId) ?? 0) + 1);
  }

  return users.map((record) => {
    const userSubscriptions = subscriptionsByUserId.get(record.id) ?? [];
    const activeSubscription = userSubscriptions.find(
      (subscriptionRecord) =>
        isActiveSubscriptionStatus(subscriptionRecord.status) && new Date(subscriptionRecord.currentPeriodEnd) > new Date(),
    );
    const latestSubscription = userSubscriptions[0];
    const adminFlags = getBanFlags(preferencesByUserId.get(record.id));

    return {
      id: record.id,
      name: record.name,
      email: record.email,
      image: record.image,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      chatCount: chatCounts.get(record.id) ?? 0,
      lookoutCount: lookoutCounts.get(record.id) ?? 0,
      sessionCount: sessionCounts.get(record.id) ?? 0,
      isPro: Boolean(activeSubscription),
      isMax: Boolean(activeSubscription && activeSubscription.productId === MANUAL_MAX_PRODUCT_ID),
      subscriptionStatus: activeSubscription?.status ?? latestSubscription?.status ?? 'none',
      subscriptionEndsAt: activeSubscription?.currentPeriodEnd ?? latestSubscription?.currentPeriodEnd ?? null,
      isBanned: adminFlags.isBanned,
      banReason: adminFlags.banReason,
      banUpdatedAt: adminFlags.banUpdatedAt,
    };
  });
}

export async function setManualProStatus(userId: string, makePro: boolean, adminEmail: string) {
  const now = new Date();
  const [targetUser] = await maindb.select().from(user).where(eq(user.id, userId)).limit(1);

  if (!targetUser) {
    throw new Error('User not found');
  }

  const existingSubscriptions = await maindb
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .orderBy(desc(subscription.currentPeriodEnd));

  if (makePro) {
    const activeSubscription = existingSubscriptions.find(
      (record) => isActiveSubscriptionStatus(record.status) && new Date(record.currentPeriodEnd) > now,
    );

    if (activeSubscription) {
      await db
        .update(subscription)
        .set({
          status: 'active',
          modifiedAt: now,
          cancelAtPeriodEnd: false,
          canceledAt: null,
          endsAt: null,
          endedAt: null,
          currentPeriodEnd: new Date(now.getFullYear() + MANUAL_PRO_DURATION_YEARS, now.getMonth(), now.getDate()),
          metadata: JSON.stringify({
            source: 'admin',
            updatedBy: adminEmail,
            updatedAt: now.toISOString(),
          }),
        })
        .where(eq(subscription.id, activeSubscription.id));
    } else {
      const subscriptionId = `admin_${uuidv7()}`;
      await db.insert(subscription).values({
        id: subscriptionId,
        createdAt: now,
        modifiedAt: now,
        amount: 0,
        currency: 'usd',
        recurringInterval: MANUAL_PRO_INTERVAL,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: new Date(now.getFullYear() + MANUAL_PRO_DURATION_YEARS, now.getMonth(), now.getDate()),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        startedAt: now,
        endsAt: null,
        endedAt: null,
        customerId: `admin_${userId}`,
        productId: MANUAL_PRO_PRODUCT_ID,
        discountId: null,
        checkoutId: `admin_grant_${uuidv7()}`,
        customerCancellationReason: null,
        customerCancellationComment: null,
        metadata: JSON.stringify({
          source: 'admin',
          grantedBy: adminEmail,
          grantedAt: now.toISOString(),
        }),
        customFieldData: null,
        userId,
      });
    }
  } else {
    for (const record of existingSubscriptions) {
      if (!isActiveSubscriptionStatus(record.status) && new Date(record.currentPeriodEnd) <= now) {
        continue;
      }

      await db
        .update(subscription)
        .set({
          status: 'canceled',
          modifiedAt: now,
          cancelAtPeriodEnd: true,
          canceledAt: now,
          endsAt: now,
          endedAt: now,
          currentPeriodEnd: now,
          metadata: JSON.stringify({
            source: 'admin',
            revokedBy: adminEmail,
            revokedAt: now.toISOString(),
          }),
        })
        .where(eq(subscription.id, record.id));
    }
  }

  invalidateAdminManagedUserState(userId);
}

export async function setManualMaxStatus(userId: string, makeMax: boolean, adminEmail: string) {
  const now = new Date();
  const [targetUser] = await maindb.select().from(user).where(eq(user.id, userId)).limit(1);

  if (!targetUser) {
    throw new Error('User not found');
  }

  const existingSubscriptions = await maindb
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .orderBy(desc(subscription.currentPeriodEnd));

  if (makeMax) {
    const activeMaxSubscription = existingSubscriptions.find(
      (record) =>
        record.productId === MANUAL_MAX_PRODUCT_ID &&
        isActiveSubscriptionStatus(record.status) &&
        new Date(record.currentPeriodEnd) > now,
    );

    if (activeMaxSubscription) {
      await db
        .update(subscription)
        .set({
          status: 'active',
          modifiedAt: now,
          cancelAtPeriodEnd: false,
          canceledAt: null,
          endsAt: null,
          endedAt: null,
          currentPeriodEnd: new Date(now.getFullYear() + MANUAL_PRO_DURATION_YEARS, now.getMonth(), now.getDate()),
          metadata: JSON.stringify({ source: 'admin', updatedBy: adminEmail, updatedAt: now.toISOString() }),
        })
        .where(eq(subscription.id, activeMaxSubscription.id));
    } else {
      await db.insert(subscription).values({
        id: `admin_${uuidv7()}`,
        createdAt: now,
        modifiedAt: now,
        amount: 0,
        currency: 'usd',
        recurringInterval: MANUAL_PRO_INTERVAL,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: new Date(now.getFullYear() + MANUAL_PRO_DURATION_YEARS, now.getMonth(), now.getDate()),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        startedAt: now,
        endsAt: null,
        endedAt: null,
        customerId: `admin_${userId}`,
        productId: MANUAL_MAX_PRODUCT_ID,
        discountId: null,
        checkoutId: `admin_max_grant_${uuidv7()}`,
        customerCancellationReason: null,
        customerCancellationComment: null,
        metadata: JSON.stringify({ source: 'admin', grantedBy: adminEmail, grantedAt: now.toISOString() }),
        customFieldData: null,
        userId,
      });
    }
  } else {
    for (const record of existingSubscriptions) {
      if (record.productId !== MANUAL_MAX_PRODUCT_ID) continue;
      if (!isActiveSubscriptionStatus(record.status) && new Date(record.currentPeriodEnd) <= now) continue;

      await db
        .update(subscription)
        .set({
          status: 'canceled',
          modifiedAt: now,
          cancelAtPeriodEnd: true,
          canceledAt: now,
          endsAt: now,
          endedAt: now,
          currentPeriodEnd: now,
          metadata: JSON.stringify({ source: 'admin', revokedBy: adminEmail, revokedAt: now.toISOString() }),
        })
        .where(eq(subscription.id, record.id));
    }
  }

  invalidateAdminManagedUserState(userId);
}

export async function setManualBanStatus(userId: string, banned: boolean, reason: string | null, adminEmail: string) {
  const now = new Date().toISOString();
  await upsertUserPreferences({
    userId,
    preferences: {
      'admin-banned': banned,
      'admin-ban-reason': banned ? reason?.trim() || 'Banned by admin' : '',
      'admin-ban-updated-at': now,
      'admin-ban-updated-by': adminEmail,
    },
  });

  await db.delete(session).where(eq(session.userId, userId));
  invalidateAdminManagedUserState(userId);
}

export async function clearUserSessions(userId: string) {
  await db.delete(session).where(eq(session.userId, userId));
  invalidateAdminManagedUserState(userId);
}

export function isAdminEmail(email?: string | null) {
  return (email ?? '').toLowerCase() === ADMIN_EMAIL;
}

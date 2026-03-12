import 'server-only';

import type Stripe from 'stripe';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { getDiscountConfig } from '@/lib/discount';
import { maindb } from '@/lib/db';
import { subscription, type User } from '@/lib/db/schema';
import { invalidateUserCaches } from '@/lib/performance-cache';
import { clearUserDataCache } from '@/lib/user-data-server';
import { getAppUrl, stripe } from '@/lib/stripe';
import { serverEnv } from '@/env/server';

const ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'trialing', 'past_due'] as const;

function getStripePriceId({
  isIndianUser,
  isStudentDiscount,
}: {
  isIndianUser: boolean;
  isStudentDiscount: boolean;
}) {
  if (isIndianUser && isStudentDiscount && serverEnv.STRIPE_PRICE_PRO_MONTHLY_STUDENT_INR) {
    return serverEnv.STRIPE_PRICE_PRO_MONTHLY_STUDENT_INR;
  }

  if (isIndianUser && serverEnv.STRIPE_PRICE_PRO_MONTHLY_INR) {
    return serverEnv.STRIPE_PRICE_PRO_MONTHLY_INR;
  }

  if (isStudentDiscount && serverEnv.STRIPE_PRICE_PRO_MONTHLY_STUDENT) {
    return serverEnv.STRIPE_PRICE_PRO_MONTHLY_STUDENT;
  }

  if (!serverEnv.STRIPE_PRICE_PRO_MONTHLY) {
    throw new Error('STRIPE_PRICE_PRO_MONTHLY is not configured');
  }

  return serverEnv.STRIPE_PRICE_PRO_MONTHLY;
}

async function findStoredCustomerId(userId: string) {
  const [existingSubscription] = await maindb
    .select({
      customerId: subscription.customerId,
    })
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .orderBy(desc(subscription.currentPeriodEnd))
    .limit(1);

  return existingSubscription?.customerId || null;
}

export async function findOrCreateStripeCustomer(user: Pick<User, 'id' | 'email' | 'name'>) {
  const storedCustomerId = await findStoredCustomerId(user.id);
  if (storedCustomerId) {
    return storedCustomerId;
  }

  const existingCustomers = await stripe.customers.list({
    email: user.email,
    limit: 10,
  });

  const matchedCustomer = existingCustomers.data.find((customer) => customer.metadata?.userId === user.id);
  if (matchedCustomer) {
    return matchedCustomer.id;
  }

  const firstCustomer = existingCustomers.data[0];
  if (firstCustomer) {
    await stripe.customers.update(firstCustomer.id, {
      metadata: {
        ...firstCustomer.metadata,
        userId: user.id,
      },
      name: firstCustomer.name || user.name,
    });
    return firstCustomer.id;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
    },
  });

  return customer.id;
}

async function resolveSubscriptionUserId(stripeSubscription: Stripe.Subscription) {
  const metadataUserId = stripeSubscription.metadata?.userId;
  if (metadataUserId) {
    return metadataUserId;
  }

  if (typeof stripeSubscription.customer === 'string') {
    const customer = await stripe.customers.retrieve(stripeSubscription.customer);
    if (!customer.deleted) {
      return customer.metadata?.userId || null;
    }
  }

  return null;
}

export async function upsertStripeSubscription(
  stripeSubscription: Stripe.Subscription,
  options?: { checkoutSessionId?: string | null },
) {
  const stripeSubscriptionData = stripeSubscription as Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
    discount?: { coupon?: { id?: string | null } | null } | null;
  };
  const userId = await resolveSubscriptionUserId(stripeSubscription);
  const price = stripeSubscription.items.data[0]?.price;
  const productId = typeof price?.product === 'string' ? price.product : '';
  const customerId = typeof stripeSubscription.customer === 'string' ? stripeSubscription.customer : '';
  const currentPeriodStart =
    stripeSubscriptionData.current_period_start || stripeSubscription.start_date || stripeSubscription.created;
  const currentPeriodEnd =
    stripeSubscriptionData.current_period_end || stripeSubscription.cancel_at || stripeSubscription.created;
  const discountId = stripeSubscriptionData.discount?.coupon?.id || null;

  await maindb
    .insert(subscription)
    .values({
      id: stripeSubscription.id,
      createdAt: new Date((stripeSubscription.created || Date.now() / 1000) * 1000),
      modifiedAt: new Date(),
      amount: price?.unit_amount ?? 0,
      currency: stripeSubscription.currency || price?.currency || 'usd',
      recurringInterval: price?.recurring?.interval || 'month',
      status: stripeSubscription.status,
      currentPeriodStart: new Date(currentPeriodStart * 1000),
      currentPeriodEnd: new Date(currentPeriodEnd * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
      startedAt: new Date((stripeSubscription.start_date || stripeSubscription.created) * 1000),
      endsAt: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : null,
      endedAt: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : null,
      customerId,
      productId,
      discountId,
      checkoutId: options?.checkoutSessionId || '',
      customerCancellationReason: stripeSubscription.cancellation_details?.reason || null,
      customerCancellationComment: stripeSubscription.cancellation_details?.comment || null,
      metadata: JSON.stringify({
        provider: 'stripe',
        priceId: price?.id || null,
        stripeSubscriptionId: stripeSubscription.id,
      }),
      customFieldData: null,
      userId,
    })
    .onConflictDoUpdate({
      target: subscription.id,
      set: {
        modifiedAt: new Date(),
        amount: price?.unit_amount ?? 0,
        currency: stripeSubscription.currency || price?.currency || 'usd',
        recurringInterval: price?.recurring?.interval || 'month',
        status: stripeSubscription.status,
        currentPeriodStart: new Date(currentPeriodStart * 1000),
        currentPeriodEnd: new Date(currentPeriodEnd * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
        endsAt: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : null,
        endedAt: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : null,
        customerId,
        productId,
        discountId,
        checkoutId: options?.checkoutSessionId || '',
        customerCancellationReason: stripeSubscription.cancellation_details?.reason || null,
        customerCancellationComment: stripeSubscription.cancellation_details?.comment || null,
        metadata: JSON.stringify({
          provider: 'stripe',
          priceId: price?.id || null,
          stripeSubscriptionId: stripeSubscription.id,
        }),
        userId,
      },
    });

  if (userId) {
    invalidateUserCaches(userId);
    clearUserDataCache(userId);
  }
}

export async function syncStripeSubscriptionById(subscriptionId: string, options?: { checkoutSessionId?: string | null }) {
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price'],
  });

  await upsertStripeSubscription(stripeSubscription, options);
  return stripeSubscription;
}

export async function getActiveSubscriptionByUserId(userId: string) {
  const [activeSubscription] = await maindb
    .select()
    .from(subscription)
    .where(and(eq(subscription.userId, userId), inArray(subscription.status, [...ACTIVE_SUBSCRIPTION_STATUSES])))
    .orderBy(desc(subscription.currentPeriodEnd))
    .limit(1);

  if (!activeSubscription) {
    return null;
  }

  if (new Date(activeSubscription.currentPeriodEnd) <= new Date()) {
    return null;
  }

  return activeSubscription;
}

export async function getSubscriptionHistoryByUserId(userId: string) {
  return maindb.select().from(subscription).where(eq(subscription.userId, userId)).orderBy(desc(subscription.createdAt));
}

export async function createStripeCheckoutSession({
  user,
  isIndianUser,
}: {
  user: Pick<User, 'id' | 'email' | 'name'>;
  isIndianUser: boolean;
}) {
  const customerId = await findOrCreateStripeCustomer(user);
  const discountConfig = await getDiscountConfig(user.email, isIndianUser);
  const priceId = getStripePriceId({
    isIndianUser,
    isStudentDiscount: Boolean(discountConfig.enabled && discountConfig.isStudentDiscount),
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${getAppUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getAppUrl()}/pricing`,
    allow_promotion_codes: true,
    metadata: {
      userId: user.id,
      billingProvider: 'stripe',
    },
    subscription_data: {
      metadata: {
        userId: user.id,
        billingProvider: 'stripe',
      },
    },
  });

  return session;
}

export async function createStripeBillingPortalSession(user: Pick<User, 'id' | 'email' | 'name'>) {
  const customerId = await findOrCreateStripeCustomer(user);

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${getAppUrl()}/settings`,
  });
}

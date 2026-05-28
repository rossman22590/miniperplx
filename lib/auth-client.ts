import { createAuthClient } from 'better-auth/react';
import { lastLoginMethodClient } from 'better-auth/client/plugins';

const authBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://mydatavibes.com' : 'http://localhost:3000');

const baseAuthClient = createAuthClient({
  baseURL: authBaseUrl,
  plugins: [lastLoginMethodClient()],
});

async function openBillingPortal() {
  const response = await fetch('/api/billing/portal', {
    method: 'POST',
  });
  const payload = await response.json();

  if (!response.ok || !payload?.url) {
    throw new Error(payload?.error || 'Failed to open billing portal');
  }

  window.location.href = payload.url;
}

async function createCheckoutSession(input: { isIndianUser?: boolean }) {
  const response = await fetch('/api/billing/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isIndianUser: Boolean(input.isIndianUser),
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload?.url) {
    return {
      data: null,
      error: {
        message: payload?.error || 'Checkout failed',
      },
    };
  }

  return {
    data: {
      url: payload.url as string,
    },
    error: null,
  };
}

type DodoCheckoutSessionInput = {
  slug?: string;
  customer?: {
    email?: string;
    name?: string;
  };
  billing_currency?: string;
  allowed_payment_method_types?: string[];
  referenceId?: string;
  discount_code?: string;
};

type CompatibilityClient = typeof baseAuthClient & {
  customer: {
    portal: () => Promise<void>;
    orders: {
      list: (_input?: unknown) => Promise<{ data: { result: { items: unknown[] } } }>;
    };
  };
  dodopayments: {
    checkoutSession: (input: DodoCheckoutSessionInput) => Promise<{
      data: { url: string } | null;
      error: { message: string } | null;
    }>;
    customer: {
      portal: () => Promise<void>;
      subscriptions: {
        list: (_input?: unknown) => Promise<{ data: { items: unknown[] }; error: null }>;
      };
    };
  };
};

export const authClient: CompatibilityClient = Object.assign(baseAuthClient, {
  customer: {
    portal: openBillingPortal,
    orders: {
      list: async (_input?: unknown) => ({
        data: {
          result: {
            items: [],
          },
        },
      }),
    },
  },
  dodopayments: {
    checkoutSession: async (input: DodoCheckoutSessionInput) =>
      createCheckoutSession({
        isIndianUser: input.billing_currency === 'INR',
      }),
    customer: {
      portal: openBillingPortal,
      subscriptions: {
        list: async (_input?: unknown) => ({
          data: {
            items: [],
          },
          error: null,
        }),
      },
    },
  },
});

export const betterauthClient = authClient;

export const { signIn, signOut, signUp, useSession } = authClient;

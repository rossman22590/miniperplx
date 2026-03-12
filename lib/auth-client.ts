import { createAuthClient } from 'better-auth/react';
import { dodopaymentsClient } from '@dodopayments/better-auth';
import { polarClient } from '@polar-sh/better-auth';
import { lastLoginMethodClient } from 'better-auth/client/plugins';

const authBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://mydatavibes.com' : 'http://localhost:3000');

export const betterauthClient = createAuthClient({
  baseURL: authBaseUrl,
  plugins: [dodopaymentsClient()],
});

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  plugins: [polarClient(), lastLoginMethodClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;

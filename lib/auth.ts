import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { lastLoginMethod } from 'better-auth/plugins';
import { config } from 'dotenv';
import { serverEnv } from '@/env/server';
import { db } from '@/lib/db';
import { account, session, user, verification } from '@/lib/db/schema';

config({
  path: '.env.local',
});

export const auth = betterAuth({
  rateLimit: {
    max: 100,
    window: 60,
  },
  experimental: { joins: true },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      verification,
      account,
    },
  }),
  socialProviders: {
    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
    twitter: {
      clientId: serverEnv.TWITTER_CLIENT_ID,
      clientSecret: serverEnv.TWITTER_CLIENT_SECRET,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
      prompt: 'select_account',
    },
  },
  plugins: [lastLoginMethod(), nextCookies()],
  trustedOrigins: [
    'http://localhost:3000',
    'https://mydatavibes.com',
    'https://www.mydatavibes.com',
    'https://www.scira.ai',
  ],
  allowedOrigins: [
    'http://localhost:3000',
    'https://mydatavibes.com',
    'https://www.mydatavibes.com',
    'https://www.scira.ai',
  ],
});

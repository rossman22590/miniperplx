import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { serverEnv } from "@/env/server";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    socialProviders: {
        google: {
            clientId: serverEnv.GOOGLE_CLIENT_ID,
            clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
            scope: ["openid", "email", "profile"],
            params: {
                prompt: "select_account",
                access_type: "offline",
                response_type: "code"
            }
        }
    },
    plugins: [
        nextCookies()
    ],
    secret: serverEnv.BETTER_AUTH_SECRET,
    baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://datavibesv2.vercel.app' 
        : 'http://localhost:3001',
    routes: {
        signIn: '/api/auth/sign-in',
        signUp: '/api/auth/sign-up',
        error: '/error',
        verifyRequest: '/verify-request',
        newUser: '/',
        callback: '/api/auth/callback',
        useSession: '/api/auth/use-session'
    },
    session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    debug: true
});
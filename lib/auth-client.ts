import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV === 'production' 
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
    providers: {
        google: {
            id: 'google',
            name: 'Google'
        }
    },
    session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    }
});

export const { signIn, signOut, signUp, useSession } = authClient;
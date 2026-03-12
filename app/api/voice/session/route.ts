import { NextResponse } from 'next/server';
import { serverEnv } from '@/env/server';

const XAI_REALTIME_CLIENT_SECRET_URL = 'https://api.x.ai/v1/realtime/client_secrets';

export async function POST() {
  try {
    const response = await fetch(XAI_REALTIME_CLIENT_SECRET_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serverEnv.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expires_after: {
          seconds: 300,
        },
      }),
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => null);
    const clientSecretValue =
      payload?.client_secret?.value ||
      payload?.clientSecret?.value ||
      payload?.value ||
      payload?.secret ||
      null;
    const clientSecretExpiresAt =
      payload?.client_secret?.expires_at ||
      payload?.clientSecret?.expires_at ||
      payload?.expires_at ||
      null;

    if (!response.ok) {
      console.error('Voice session creation failed:', payload);
      return NextResponse.json(
        {
          error: payload?.error?.message || payload?.message || 'Failed to create voice session',
        },
        { status: response.status || 500 },
      );
    }

    if (!clientSecretValue) {
      console.error('Voice session response missing client secret:', payload);
      return NextResponse.json({ error: 'Voice session token missing from xAI response' }, { status: 502 });
    }

    return NextResponse.json(
      {
        client_secret: {
          value: clientSecretValue,
          expires_at: clientSecretExpiresAt,
        },
      },
      {
      headers: {
        'Cache-Control': 'no-store',
      },
      },
    );
  } catch (error) {
    console.error('Voice session route failed:', error);
    return NextResponse.json({ error: 'Failed to create voice session' }, { status: 500 });
  }
}

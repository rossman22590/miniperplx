import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-utils';
import { createStripeCheckoutSession } from '@/lib/billing';

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const session = await createStripeCheckoutSession({
      user,
      isIndianUser: Boolean(body?.isIndianUser),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout creation failed:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-utils';
import { createStripeBillingPortalSession } from '@/lib/billing';

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const session = await createStripeBillingPortalSession(user);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe billing portal creation failed:', error);
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserPreferencesByUserId } from '@/lib/db/queries';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({
        authenticated: false,
        isBanned: false,
        banReason: null,
      });
    }

    const preferences = await getUserPreferencesByUserId({ userId: session.user.id });
    const isBanned = Boolean(preferences?.preferences?.['admin-banned']);
    const banReason = preferences?.preferences?.['admin-ban-reason'] ?? null;

    return NextResponse.json({
      authenticated: true,
      isBanned,
      banReason,
    });
  } catch (error) {
    console.error('Error checking auth access status:', error);
    return NextResponse.json(
      {
        authenticated: false,
        isBanned: false,
        banReason: null,
      },
      { status: 500 },
    );
  }
}

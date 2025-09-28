import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getSearchStats } from '@/lib/search-limits';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const stats = await getSearchStats(session.user.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching search stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

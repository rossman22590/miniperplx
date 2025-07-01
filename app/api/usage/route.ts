import { getUser } from '@/lib/auth-utils';
import { getDailySearchCount, populateDailySearchUsageFromChats } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

export async function GET(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new ChatSDKError('unauthorized:auth', 'User not authenticated').toResponse();
    }

    const dailySearchCount = await getDailySearchCount({ userId: user.id });

    return Response.json({
      success: true,
      dailySearchCount,
    });
  } catch (error) {
    console.error('Error getting usage:', error);
    return new ChatSDKError('bad_request:api', 'Failed to get usage data').toResponse();
  }
}

export async function POST(req: Request) {
  try {
    await populateDailySearchUsageFromChats();
    return Response.json({
      success: true,
      message: 'Daily search usage populated successfully',
    });
  } catch (error) {
    console.error('Error populating usage:', error);
    return new ChatSDKError('bad_request:api', 'Failed to populate usage data').toResponse();
  }
} 
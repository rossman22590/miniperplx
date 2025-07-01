import { useQuery } from '@tanstack/react-query';
import { getUserMessageCount } from '@/app/actions';
import { SEARCH_LIMITS } from '@/lib/constants';
import { User } from '@/lib/db/schema';

// Allow for both auth User and schema User types
type UserWithOptionalImage = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
} | User | null;

export function useUsageData(user: UserWithOptionalImage, enabled: boolean = true) {
  const { data, ...rest } = useQuery({
    queryKey: ['user-usage', user?.id],
    queryFn: () => getUserMessageCount(),
    enabled: enabled && !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    data: data
      ? {
          count: data.count,
          messageCount: data.messageCount,
          extremeSearchCount: data.extremeSearchCount,
          hasExceededLimit: data.count >= SEARCH_LIMITS.DAILY_SEARCH_LIMIT,
          hasExceededExtremeLimit: data.extremeSearchCount >= SEARCH_LIMITS.EXTREME_SEARCH_LIMIT,
        }
      : null,
    ...rest,
  };
}

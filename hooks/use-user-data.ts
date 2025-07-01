import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getSubDetails } from '@/app/actions';
import { User } from '@/lib/db/schema';
import { useSession } from '@/hooks/use-session';

// Hook for user data
export function useUserData() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes - user data doesn't change often
    gcTime: 1000 * 60 * 10, // 10 minutes cache retention
    refetchOnWindowFocus: false, // Don't refetch on focus
    retry: 2, // Retry failed requests twice
  });
}

// Hook for subscription data with intelligent caching
export function useSubscriptionData(user: User | null) {
  return useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: getSubDetails,
    enabled: !!user, // Only run when user exists
    staleTime: 1000 * 60 * 30, // 30 minutes - Pro status doesn't change frequently
    gcTime: 1000 * 60 * 60 * 2, // 2 hours cache retention for subscription data
    refetchOnWindowFocus: false, // Don't refetch on focus
    retry: 1, // Only retry once for subscription checks
  });
}

// Hook for user status with simplified caching (no Pro tiers)
export function useProUserStatus() {
  const { data: session } = useSession();
  const user = session?.user ? {
    ...session.user,
    image: session.user.image || null,
  } as User : null;

  return {
    user,
  };
} 
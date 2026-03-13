import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/app/actions';
import { type ComprehensiveUserData } from '@/lib/user-data';
import { shouldBypassRateLimits } from '@/ai/providers';

export function useUserData() {
  const {
    data: userData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['comprehensive-user-data'],
    queryFn: getCurrentUser,
    // Keep this aggressively fresh so subscription changes reflect quickly
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
  });

  // Helper function to check if user should have unlimited access for specific models
  const shouldBypassLimitsForModel = (selectedModel: string) => {
    return shouldBypassRateLimits(selectedModel, userData);
  };

  return {
    // Core user data
    user: userData,
    isLoading,
    error,
    refetch,
    isRefetching,

    // Quick access to commonly used properties
    isProUser: Boolean(userData?.isProUser),
    proSource: userData?.proSource || 'none',
    subscriptionStatus: userData?.subscriptionStatus || 'none',
    subscription: userData?.subscription,

    // Normalized subscription data
    subscriptionHistory: userData?.subscriptionHistory || [],

    // Rate limiting helpers
    shouldCheckLimits: !isLoading && userData && !userData.isProUser,
    shouldBypassLimitsForModel,

    // Subscription status checks
    hasActiveSubscription: userData?.subscriptionStatus === 'active',
    isSubscriptionCanceled: userData?.subscriptionStatus === 'canceled',
    isSubscriptionExpired: userData?.subscriptionStatus === 'expired',
    hasNoSubscription: userData?.subscriptionStatus === 'none',

    // Legacy compatibility helpers during the Stripe cutover
    polarSubscription: userData?.subscription || userData?.polarSubscription,
    hasPolarSubscription: Boolean(userData?.subscription || userData?.polarSubscription),
    dodoSubscription: userData?.dodoSubscription,
    hasDodoSubscription: false,
    dodoExpiresAt: userData?.dodoSubscription?.expiresAt,
    isDodoExpiring: Boolean(userData?.dodoSubscription?.isExpiringSoon),
    isDodoExpired: Boolean(userData?.dodoSubscription?.isExpired),
    subscriptionData: userData?.subscription
      ? {
          hasSubscription: true,
          subscription: userData.subscription,
        }
      : { hasSubscription: false },
    dodoProStatus: null,
    expiresAt: userData?.dodoSubscription?.expiresAt,
  };
}

// Lightweight hook for components that only need to know if user is pro
export function useIsProUser() {
  const { isProUser, isLoading } = useUserData();
  return { isProUser, isLoading };
}

// Hook for components that need subscription status but not all user data
export function useSubscriptionStatus() {
  const {
    subscriptionStatus,
    proSource,
    hasActiveSubscription,
    isSubscriptionCanceled,
    isSubscriptionExpired,
    hasNoSubscription,
    isLoading,
  } = useUserData();

  return {
    subscriptionStatus,
    proSource,
    hasActiveSubscription,
    isSubscriptionCanceled,
    isSubscriptionExpired,
    hasNoSubscription,
    isLoading,
  };
}

// Export the comprehensive type for components that need it
export type { ComprehensiveUserData };

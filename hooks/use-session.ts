import { useQuery } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface SessionData {
  user: User;
  session: Session;
}

export function useSession() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useQuery<SessionData | null>({
    queryKey: ['session', pathname],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/use-session', {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          credentials: 'include',
        });
        if (!res.ok) return null;
        return res.json();
      } catch (error) {
        console.error('Error fetching session:', error);
        return null;
      }
    },
    // Run immediately when component mounts
    refetchOnMount: true,
    // Run when window regains focus
    refetchOnWindowFocus: true,
    // Run every 5 minutes
    refetchInterval: 5 * 60 * 1000,
    // Don't retry on error
    retry: false,
    // Run when route changes
    refetchOnReconnect: true,
  });

  // Force refetch when route changes
  useEffect(() => {
    query.refetch();
  }, [pathname, searchParams, query]);

  return query;
} 
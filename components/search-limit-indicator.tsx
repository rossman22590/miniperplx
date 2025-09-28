'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface SearchStats {
  searchesUsed: number;
  searchesRemaining: number;
  resetTime: string;
}

export function SearchLimitIndicator({ userId }: { userId?: string }) {
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        const response = await fetch('/api/search-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching search stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  if (loading || !stats || !userId) {
    return null;
  }

  const percentage = (stats.searchesUsed / 100) * 100;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Daily Searches</span>
          <Badge variant={stats.searchesRemaining > 20 ? "secondary" : "destructive"} className="text-xs">
            {stats.searchesUsed}/100
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              percentage > 90 ? 'bg-red-500' : 
              percentage > 75 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {stats.searchesRemaining < 10 && (
          <p className="text-xs text-muted-foreground mt-2">
            {stats.searchesRemaining > 0 
              ? `${stats.searchesRemaining} searches left` 
              : 'Daily limit reached'
            }
          </p>
        )}
        {stats.searchesRemaining === 0 && (
          <p className="text-xs text-red-500 mt-2 font-medium">
            Resets at {new Date(stats.resetTime).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

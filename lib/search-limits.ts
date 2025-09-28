import { Redis } from '@upstash/redis';
import { serverEnv } from '@/env/server';

// Initialize Redis client
let redis: Redis | null = null;

try {
  redis = new Redis({
    url: serverEnv.UPSTASH_REDIS_REST_URL,
    token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
  });
} catch (error) {
  console.error('Failed to connect to Redis:', error);
}

const DAILY_SEARCH_LIMIT = 100;

export async function checkSearchLimit(userId: string): Promise<{ 
  allowed: boolean; 
  remaining: number; 
  resetTime: Date 
}> {
  if (!redis) {
    // If Redis is not available, allow the search to prevent blocking users
    return {
      allowed: true,
      remaining: DAILY_SEARCH_LIMIT,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `search_limit:${userId}:${today}`;
  
  try {
    const current = await redis.get(key);
    const searchCount = current ? parseInt(current as string) : 0;
    
    if (searchCount >= DAILY_SEARCH_LIMIT) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: tomorrow
      };
    }
    
    return {
      allowed: true,
      remaining: DAILY_SEARCH_LIMIT - searchCount,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  } catch (error) {
    console.error('Error checking search limit:', error);
    // On error, allow the search to prevent blocking users
    return {
      allowed: true,
      remaining: DAILY_SEARCH_LIMIT,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }
}

export async function incrementSearchCount(userId: string): Promise<void> {
  if (!redis) {
    return;
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `search_limit:${userId}:${today}`;
  
  try {
    await redis.incr(key);
    // Set expiry to end of day + 1 hour buffer
    const endOfDay = new Date();
    endOfDay.setDate(endOfDay.getDate() + 1);
    endOfDay.setHours(1, 0, 0, 0); // 1 AM next day
    const ttl = Math.floor((endOfDay.getTime() - Date.now()) / 1000);
    await redis.expire(key, ttl);
  } catch (error) {
    console.error('Error incrementing search count:', error);
  }
}

export async function getSearchStats(userId: string): Promise<{
  searchesUsed: number;
  searchesRemaining: number;
  resetTime: Date;
}> {
  if (!redis) {
    return {
      searchesUsed: 0,
      searchesRemaining: DAILY_SEARCH_LIMIT,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }

  const today = new Date().toISOString().split('T')[0];
  const key = `search_limit:${userId}:${today}`;
  
  try {
    const current = await redis.get(key);
    const searchCount = current ? parseInt(current as string) : 0;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return {
      searchesUsed: searchCount,
      searchesRemaining: Math.max(0, DAILY_SEARCH_LIMIT - searchCount),
      resetTime: tomorrow
    };
  } catch (error) {
    console.error('Error getting search stats:', error);
    return {
      searchesUsed: 0,
      searchesRemaining: DAILY_SEARCH_LIMIT,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }
}

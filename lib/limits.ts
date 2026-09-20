// CLIENT-SAFE: per-user usage limits with admin overrides.
//
// Defaults live in constants; an admin can raise them for a single user by
// writing override keys into that user's preferences JSON (no schema change).
import { SEARCH_LIMITS } from '@/lib/constants';
import type { UserPreferenceSettings } from '@/lib/db/schema';

export type UserLimits = {
  /** Free-tier daily searches (messages). */
  dailySearch: number;
  /** Free-tier monthly extreme searches. */
  extremeSearch: number;
  /** Max-tier Anthropic requests per week. */
  anthropicWeekly: number;
  /** Max-tier Gemini requests per month. */
  googleMonthly: number;
};

export type UserLimitOverrides = Partial<UserLimits>;
/** Admin input: a number sets an override, `null` clears it, omitted keys are untouched. */
export type UserLimitOverrideInput = Partial<Record<keyof UserLimits, number | null>>;

export const DEFAULT_LIMITS: UserLimits = {
  dailySearch: SEARCH_LIMITS.DAILY_SEARCH_LIMIT,
  extremeSearch: SEARCH_LIMITS.EXTREME_SEARCH_LIMIT,
  anthropicWeekly: 60,
  googleMonthly: 80,
};

/**
 * Server-side backstop for the daily search limit. The client blocks free users
 * at DEFAULT_LIMITS.dailySearch; the API only hard-rejects at this larger value
 * (or the admin override, whichever is higher).
 */
export const SERVER_DAILY_SEARCH_BACKSTOP = 100;

export const LIMIT_PREFERENCE_KEYS = {
  dailySearch: 'admin-limit-daily-search',
  extremeSearch: 'admin-limit-extreme-search',
  anthropicWeekly: 'admin-limit-anthropic-weekly',
  googleMonthly: 'admin-limit-google-monthly',
} as const satisfies Record<keyof UserLimits, keyof UserPreferenceSettings>;

export const LIMIT_LABELS: Record<keyof UserLimits, string> = {
  dailySearch: 'Daily searches',
  extremeSearch: 'Extreme / month',
  anthropicWeekly: 'Anthropic / week (Max)',
  googleMonthly: 'Gemini / month (Max)',
};

function readOverride(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return undefined;
  return Math.floor(value);
}

/** Only the overrides that are actually set for this user. */
export function getLimitOverrides(preferences?: UserPreferenceSettings | null): UserLimitOverrides {
  const overrides: UserLimitOverrides = {};
  if (!preferences) return overrides;
  for (const key of Object.keys(LIMIT_PREFERENCE_KEYS) as (keyof UserLimits)[]) {
    const value = readOverride(preferences[LIMIT_PREFERENCE_KEYS[key]]);
    if (value !== undefined) overrides[key] = value;
  }
  return overrides;
}

/** Effective limits: admin override when set, otherwise the default. */
export function resolveUserLimits(preferences?: UserPreferenceSettings | null): UserLimits {
  return { ...DEFAULT_LIMITS, ...getLimitOverrides(preferences) };
}

/** Effective server-side daily search limit (never lower than the backstop). */
export function resolveServerDailySearchLimit(limits?: Pick<UserLimits, 'dailySearch'> | null): number {
  return Math.max(SERVER_DAILY_SEARCH_BACKSTOP, limits?.dailySearch ?? 0);
}

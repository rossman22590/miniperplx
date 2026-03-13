/** Logo used app-wide (sidebar, auth, about, dialogs, etc.). Always this URL. */
export const APP_LOGO_URL =
  'https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1759034358692-scira.png';

// Search limits for free users
export const SEARCH_LIMITS = {
  DAILY_SEARCH_LIMIT: 10,
  EXTREME_SEARCH_LIMIT: 5,
} as const;

export const PRICING = {
  PRO_MONTHLY: 15, // USD
  PRO_MONTHLY_INR: 1330, // INR for Indian users
} as const;

export const CURRENCIES = {
  USD: 'USD',
  INR: 'INR',
} as const;

export const SNAPSHOT_NAME = 'scira-analysis:1751323422';

import 'server-only';

function normalizeFlag(value: string | undefined) {
  return value?.trim().toLowerCase();
}

function hasRealEnvValue(value: string | undefined) {
  const normalized = normalizeFlag(value);
  if (!normalized) return false;
  if (normalized.startsWith('dummy')) return false;
  if (normalized.startsWith('your_')) return false;
  if (normalized === 'changeme' || normalized === 'placeholder') return false;
  return true;
}

export function isBillingOff() {
  return normalizeFlag(process.env.BILLING_OFF) === 'true';
}

export function isDodoBillingEnabled() {
  if (isBillingOff()) return false;

  const provider = normalizeFlag(process.env.BILLING_PROVIDER || process.env.NEXT_PUBLIC_BILLING_PROVIDER);
  if (provider === 'stripe') return false;

  const hasDodoSecrets =
    hasRealEnvValue(process.env.DODO_PAYMENTS_API_KEY) && hasRealEnvValue(process.env.DODO_PAYMENTS_WEBHOOK_SECRET);

  if (provider === 'dodo') return hasDodoSecrets;

  return hasDodoSecrets;
}

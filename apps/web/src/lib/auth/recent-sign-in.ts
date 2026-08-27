export const ACCOUNT_DELETION_REAUTH_WINDOW_MS = 10 * 60 * 1000;

export function isRecentSignIn(
  lastSignInAt: string | null | undefined,
  now = Date.now(),
  maximumAgeMs = ACCOUNT_DELETION_REAUTH_WINDOW_MS,
): boolean {
  if (!lastSignInAt) {
    return false;
  }

  const timestamp = Date.parse(lastSignInAt);

  return Number.isFinite(timestamp) && timestamp <= now && now - timestamp <= maximumAgeMs;
}

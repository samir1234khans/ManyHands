const SAFE_CORRELATION_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/;

export function resolveCorrelationId(candidate: string | null | undefined): string {
  const normalized = candidate?.trim();

  if (normalized && SAFE_CORRELATION_ID.test(normalized)) {
    return normalized;
  }

  return globalThis.crypto.randomUUID();
}

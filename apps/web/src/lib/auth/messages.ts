export const authenticationErrorCodes = [
  "access_denied",
  "callback_invalid",
  "configuration",
  "session_expired",
  "session_revoked",
  "unknown",
] as const;

export type AuthenticationErrorCode = (typeof authenticationErrorCodes)[number];

export interface AuthenticationMessage {
  readonly code: AuthenticationErrorCode;
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
}

const messages: Record<AuthenticationErrorCode, AuthenticationMessage> = {
  access_denied: {
    code: "access_denied",
    title: "GitHub sign-in was cancelled",
    description:
      "Nothing was connected and ManyHands did not receive repository access. You can continue browsing or try again when you need an account-backed action.",
    actionLabel: "Return to sign in",
  },
  callback_invalid: {
    code: "callback_invalid",
    title: "That sign-in link cannot be used",
    description:
      "The callback may be incomplete, expired, or already used. Start a new sign-in instead of reloading or sharing the callback URL.",
    actionLabel: "Start a fresh sign-in",
  },
  configuration: {
    code: "configuration",
    title: "GitHub sign-in is not configured here yet",
    description:
      "Public browsing still works. This environment needs its Supabase and GitHub OAuth settings before account-backed actions can be tested.",
    actionLabel: "Read the setup guide",
  },
  session_expired: {
    code: "session_expired",
    title: "Your session has expired",
    description:
      "Sign in again to continue the protected action. Public pages and project information remain available without an account.",
    actionLabel: "Sign in again",
  },
  session_revoked: {
    code: "session_revoked",
    title: "This session is no longer valid",
    description:
      "ManyHands stopped trusting the previous session. Start a new sign-in to continue; no repository permission is requested by ordinary login.",
    actionLabel: "Start a new sign-in",
  },
  unknown: {
    code: "unknown",
    title: "Sign-in could not be completed",
    description:
      "The attempt ended safely, but ManyHands could not establish a trusted session. Try again or continue browsing without signing in.",
    actionLabel: "Return to sign in",
  },
};

export function normalizeAuthenticationErrorCode(value: unknown): AuthenticationErrorCode {
  return typeof value === "string" && authenticationErrorCodes.includes(value as AuthenticationErrorCode)
    ? (value as AuthenticationErrorCode)
    : "unknown";
}

export function getAuthenticationMessage(value: unknown): AuthenticationMessage {
  return messages[normalizeAuthenticationErrorCode(value)];
}

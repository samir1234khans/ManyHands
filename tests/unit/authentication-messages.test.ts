import { describe, expect, it } from "vitest";

import {
  getAuthenticationMessage,
  normalizeAuthenticationErrorCode,
} from "../../apps/web/src/lib/auth/messages";

describe("authentication messages", () => {
  it("accepts only documented public error codes", () => {
    expect(normalizeAuthenticationErrorCode("access_denied")).toBe("access_denied");
    expect(normalizeAuthenticationErrorCode("session_expired")).toBe("session_expired");
    expect(normalizeAuthenticationErrorCode("<script>alert(1)</script>")).toBe("unknown");
    expect(normalizeAuthenticationErrorCode(["configuration"])).toBe("unknown");
    expect(normalizeAuthenticationErrorCode(undefined)).toBe("unknown");
  });

  it("never reflects an unknown provider value into public copy", () => {
    const malicious = "token=secret&error_description=<script>alert(1)</script>";
    const message = getAuthenticationMessage(malicious);

    expect(message.code).toBe("unknown");
    expect(message.title).not.toContain(malicious);
    expect(message.description).not.toContain("secret");
    expect(message.description).not.toContain("script");
  });

  it("explains that provider denial granted no repository access", () => {
    const message = getAuthenticationMessage("access_denied");

    expect(message.title).toMatch(/cancelled/i);
    expect(message.description).toMatch(/did not receive repository access/i);
  });

  it("uses a fresh-flow instruction for invalid callbacks", () => {
    const message = getAuthenticationMessage("callback_invalid");

    expect(message.description).toMatch(/expired|already used/i);
    expect(message.actionLabel).toMatch(/fresh sign-in/i);
  });
});

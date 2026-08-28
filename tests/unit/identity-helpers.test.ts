import { describe, expect, it } from "vitest";

import {
  parseStoredPublicLinks,
  profileLinksToText,
  validateProfileInput,
} from "../../apps/web/src/lib/auth/profile-input";
import { isRecentSignIn } from "../../apps/web/src/lib/auth/recent-sign-in";
import { createSignInPath, sanitizeReturnPath } from "../../apps/web/src/lib/auth/return-path";

function validProfileForm(): FormData {
  const form = new FormData();
  form.set("displayName", "Samir Khan");
  form.set("handle", "samir-khan");
  form.set("biography", "Researcher, builder, and documentation contributor.");
  form.set("avatarUrl", "https://example.com/avatar.png");
  form.set("skills", "TypeScript, PostgreSQL, TypeScript");
  form.set("nonCodeRoles", "Research, Accessibility");
  form.set("interests", "Open-source creative tools");
  form.set("languages", "Hindi, English");
  form.set("availability", "limited");
  form.set("timezone", "Asia/Kolkata");
  form.set("publicLinks", "Portfolio | https://example.com\nhttps://github.com/example");
  form.set("visibility", "public");
  return form;
}

describe("safe return paths", () => {
  it("preserves same-origin paths including queries and fragments", () => {
    expect(sanitizeReturnPath(" /profile?tab=skills#details ", "/")).toBe(
      "/profile?tab=skills#details",
    );
  });

  it.each([
    "https://attacker.example/profile",
    "//attacker.example/profile",
    "/\\attacker.example",
    "/auth/callback?next=/profile",
    "/auth/start",
    "/auth/error",
  ])("rejects unsafe or recursive auth destination %s", (candidate) => {
    expect(sanitizeReturnPath(candidate, "/safe")).toBe("/safe");
  });

  it("builds a sign-in path with sanitized intent", () => {
    expect(createSignInPath("https://attacker.example", "profile")).toBe(
      "/auth/sign-in?next=%2Fprofile&reason=profile",
    );
  });
});

describe("profile input validation", () => {
  it("normalizes a valid profile without duplicating list values", () => {
    const result = validateProfileInput(validProfileForm());

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.handle).toBe("samir-khan");
    expect(result.value.skills).toEqual(["TypeScript", "PostgreSQL"]);
    expect(result.value.publicLinks).toEqual([
      { label: "Portfolio", url: "https://example.com/" },
      { label: "github.com", url: "https://github.com/example" },
    ]);
  });

  it("rejects invalid handles, timezones, provider credentials, and non-HTTPS links", () => {
    const form = validProfileForm();
    form.set("handle", "-Bad--Handle-");
    form.set("timezone", "Mars/Olympus");
    form.set("avatarUrl", "https://user:secret@example.com/avatar.png");
    form.set("publicLinks", "Portfolio | http://example.com");

    const result = validateProfileInput(form);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.fieldErrors).toMatchObject({
      avatarUrl: expect.any(String),
      handle: expect.any(String),
      publicLinks: expect.any(String),
      timezone: expect.any(String),
    });
  });

  it("ignores malformed stored links and preserves valid HTTPS links", () => {
    const stored = [
      { label: "Portfolio", url: "https://example.com" },
      { label: "Unsafe", url: "javascript:alert(1)" },
      "not an object",
    ];

    expect(parseStoredPublicLinks(stored)).toEqual([
      { label: "Portfolio", url: "https://example.com" },
    ]);
    expect(profileLinksToText(stored)).toBe("Portfolio | https://example.com");
  });
});

describe("recent authentication", () => {
  const now = Date.parse("2026-08-28T00:00:00Z");

  it("accepts a sign-in inside the deletion reauthentication window", () => {
    expect(isRecentSignIn("2026-08-27T23:55:00Z", now)).toBe(true);
  });

  it("rejects old, future, absent, and invalid timestamps", () => {
    expect(isRecentSignIn("2026-08-27T23:30:00Z", now)).toBe(false);
    expect(isRecentSignIn("2026-08-28T00:01:00Z", now)).toBe(false);
    expect(isRecentSignIn(undefined, now)).toBe(false);
    expect(isRecentSignIn("not-a-date", now)).toBe(false);
  });
});

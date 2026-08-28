import type { Json } from "@manyhands/data";

export const availabilityLevels = ["unavailable", "limited", "open"] as const;
export const profileVisibilityLevels = ["private", "members", "public"] as const;

export type AvailabilityLevel = (typeof availabilityLevels)[number];
export type ProfileVisibilityLevel = (typeof profileVisibilityLevels)[number];

export interface PublicProfileLink {
  readonly label: string;
  readonly url: string;
}

export interface ProfileInput {
  readonly availability: AvailabilityLevel;
  readonly avatarUrl: string | null;
  readonly biography: string | null;
  readonly displayName: string;
  readonly handle: string;
  readonly interests: string[];
  readonly languages: string[];
  readonly nonCodeRoles: string[];
  readonly publicLinks: PublicProfileLink[];
  readonly skills: string[];
  readonly timezone: string | null;
  readonly visibility: ProfileVisibilityLevel;
}

export interface ProfileValidationFailure {
  readonly fieldErrors: Record<string, string>;
  readonly ok: false;
}

export interface ProfileValidationSuccess {
  readonly ok: true;
  readonly value: ProfileInput;
}

export type ProfileValidationResult = ProfileValidationFailure | ProfileValidationSuccess;

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeList(value: string, maximumItems: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const rawItem of value.split(/[\n,]/)) {
    const item = rawItem.trim().replace(/\s+/g, " ");
    const key = item.toLocaleLowerCase("en");

    if (!item || item.length > 60 || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);

    if (result.length === maximumItems) {
      break;
    }
  }

  return result;
}

function parseHttpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:" || url.username || url.password) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function parsePublicLinks(value: string): { error?: string; links: PublicProfileLink[] } {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 10) {
    return { error: "Add no more than 10 public links.", links: [] };
  }

  const links: PublicProfileLink[] = [];

  for (const line of lines) {
    const separator = line.indexOf("|");
    const rawLabel = separator >= 0 ? line.slice(0, separator).trim() : "";
    const rawUrl = separator >= 0 ? line.slice(separator + 1).trim() : line;
    const url = parseHttpsUrl(rawUrl);

    if (!url) {
      return {
        error: "Use one HTTPS URL per line, optionally written as Label | https://example.com.",
        links: [],
      };
    }

    const label = (rawLabel || url.hostname.replace(/^www\./, "")).slice(0, 40);

    if (!label) {
      return { error: "Every public link needs a readable label.", links: [] };
    }

    links.push({ label, url: url.toString() });
  }

  return { links };
}

function isValidTimezone(value: string): boolean {
  if (!value) {
    return true;
  }

  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function validateProfileInput(formData: FormData): ProfileValidationResult {
  const fieldErrors: Record<string, string> = {};
  const displayName = readFormText(formData, "displayName").replace(/\s+/g, " ");
  const handle = readFormText(formData, "handle").toLowerCase();
  const biographyValue = readFormText(formData, "biography");
  const avatarValue = readFormText(formData, "avatarUrl");
  const timezoneValue = readFormText(formData, "timezone");
  const availabilityValue = readFormText(formData, "availability");
  const visibilityValue = readFormText(formData, "visibility");
  const parsedLinks = parsePublicLinks(readFormText(formData, "publicLinks"));

  if (displayName.length < 1 || displayName.length > 80) {
    fieldErrors.displayName = "Use a display name between 1 and 80 characters.";
  }

  if (
    handle.length < 3 ||
    handle.length > 30 ||
    !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/.test(handle) ||
    handle.includes("--")
  ) {
    fieldErrors.handle =
      "Use 3–30 lowercase letters, numbers, or single hyphens; start and end with a letter or number.";
  }

  if (biographyValue.length > 1000) {
    fieldErrors.biography = "Keep the biography at 1,000 characters or fewer.";
  }

  if (avatarValue && (!parseHttpsUrl(avatarValue) || avatarValue.length > 2048)) {
    fieldErrors.avatarUrl = "Use a valid HTTPS image URL no longer than 2,048 characters.";
  }

  if (!isValidTimezone(timezoneValue) || timezoneValue.length > 100) {
    fieldErrors.timezone = "Use an IANA timezone such as Asia/Kolkata or Europe/Berlin.";
  }

  if (!availabilityLevels.includes(availabilityValue as AvailabilityLevel)) {
    fieldErrors.availability = "Choose one of the available contribution levels.";
  }

  if (!profileVisibilityLevels.includes(visibilityValue as ProfileVisibilityLevel)) {
    fieldErrors.visibility = "Choose who can see this profile.";
  }

  if (parsedLinks.error) {
    fieldErrors.publicLinks = parsedLinks.error;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, ok: false };
  }

  return {
    ok: true,
    value: {
      availability: availabilityValue as AvailabilityLevel,
      avatarUrl: avatarValue || null,
      biography: biographyValue || null,
      displayName,
      handle,
      interests: normalizeList(readFormText(formData, "interests"), 40),
      languages: normalizeList(readFormText(formData, "languages"), 20),
      nonCodeRoles: normalizeList(readFormText(formData, "nonCodeRoles"), 24),
      publicLinks: parsedLinks.links,
      skills: normalizeList(readFormText(formData, "skills"), 24),
      timezone: timezoneValue || null,
      visibility: visibilityValue as ProfileVisibilityLevel,
    },
  };
}

export function parseStoredPublicLinks(value: Json | null): PublicProfileLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || Array.isArray(entry) || typeof entry !== "object") {
      return [];
    }

    const label = entry.label;
    const urlValue = entry.url;

    if (typeof label !== "string" || typeof urlValue !== "string" || !parseHttpsUrl(urlValue)) {
      return [];
    }

    return [{ label: label.slice(0, 40), url: urlValue }];
  });
}

export function profileLinksToText(value: Json | null): string {
  return parseStoredPublicLinks(value)
    .map((link) => `${link.label} | ${link.url}`)
    .join("\n");
}

export function profileListToText(values: readonly string[] | null): string {
  return values?.join(", ") ?? "";
}

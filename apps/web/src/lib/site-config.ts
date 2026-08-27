export const siteConfig = {
  name: "ManyHands",
  tagline: "Big problems. Built together.",
  description:
    "A problem-first community for forming ambitious open-source projects and finding a clear way to help.",
  boundary: "ManyHands owns coordination. GitHub owns code.",
  repositoryUrl: "https://github.com/samir1234khans/ManyHands",
  roadmapUrl: "https://github.com/samir1234khans/ManyHands/issues/2",
  issuesUrl: "https://github.com/samir1234khans/ManyHands/issues",
  contributingUrl: "https://github.com/samir1234khans/ManyHands/blob/main/CONTRIBUTING.md",
  licenseUrl: "https://github.com/samir1234khans/ManyHands/blob/main/LICENSE",
  licenseName: "GNU AGPL v3 or later",
} as const;

export type SiteConfig = typeof siteConfig;

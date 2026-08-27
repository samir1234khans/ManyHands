import { describe, expect, it } from "vitest";

import { siteConfig } from "../../apps/web/src/lib/site-config";

describe("siteConfig", () => {
  it("keeps the product boundary explicit", () => {
    expect(siteConfig.boundary).toBe("ManyHands owns coordination. GitHub owns code.");
  });

  it("publishes secure source, roadmap, contribution, and license URLs", () => {
    const publicUrls = [
      siteConfig.repositoryUrl,
      siteConfig.roadmapUrl,
      siteConfig.issuesUrl,
      siteConfig.contributingUrl,
      siteConfig.licenseUrl,
    ];

    for (const value of publicUrls) {
      const url = new URL(value);
      expect(url.protocol).toBe("https:");
      expect(url.hostname).toBe("github.com");
      expect(url.pathname).toContain("/samir1234khans/ManyHands");
    }
  });

  it("names the network-source license clearly", () => {
    expect(siteConfig.licenseName).toBe("GNU AGPL v3 or later");
  });
});

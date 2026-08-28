import { describe, expect, it } from "vitest";

import {
  canTransitionProjectStatus,
  evaluateProjectActivation,
  evaluateProjectMemberDeparture,
  projectMembershipGrantsRepositoryPermission,
  projectMembershipRoles,
} from "../../packages/domain/src";

describe("Project formation contract", () => {
  it("requires every accountability field before activation", () => {
    const assessment = evaluateProjectActivation({
      governanceUrl: " ",
      licenseIdentifier: null,
      nonGoals: "",
      onboardingSummary: null,
      scope: " ",
      stewardCount: 0,
    });

    expect(assessment).toEqual({
      ready: false,
      gaps: [
        "steward_required",
        "license_required",
        "scope_required",
        "non_goals_required",
        "governance_required",
        "onboarding_required",
      ],
    });
  });

  it("recognizes an accountable activation candidate", () => {
    expect(
      evaluateProjectActivation({
        governanceUrl: "https://example.test/governance",
        licenseIdentifier: "AGPL-3.0-or-later",
        nonGoals: "No private enterprise workspace in this checkpoint.",
        onboardingSummary: "Start with the public contribution guide.",
        scope: "Build one auditable solution Project under the parent Problem.",
        stewardCount: 1,
      }),
    ).toEqual({ ready: true, gaps: [] });
  });

  it("allows only explicit lifecycle transitions", () => {
    expect(canTransitionProjectStatus("proposed", "active")).toBe(true);
    expect(canTransitionProjectStatus("active", "seeking_steward")).toBe(true);
    expect(canTransitionProjectStatus("paused", "active")).toBe(true);
    expect(canTransitionProjectStatus("completed", "archived")).toBe(true);

    expect(canTransitionProjectStatus("proposed", "completed")).toBe(false);
    expect(canTransitionProjectStatus("archived", "active")).toBe(false);
    expect(canTransitionProjectStatus("active", "active")).toBe(false);
  });

  it("prevents the final active steward from silently leaving", () => {
    expect(
      evaluateProjectMemberDeparture({
        currentStatus: "active",
        memberRole: "steward",
        stewardCount: 1,
      }),
    ).toEqual({ allowed: false, reason: "final_steward_handoff_required" });

    expect(
      evaluateProjectMemberDeparture({
        currentStatus: "active",
        memberRole: "steward",
        stewardCount: 2,
      }),
    ).toEqual({ allowed: true });
  });

  it("permits an explicit pause or stewardship request before the final steward leaves", () => {
    expect(
      evaluateProjectMemberDeparture({
        currentStatus: "paused",
        memberRole: "steward",
        stewardCount: 1,
      }),
    ).toEqual({ allowed: true });

    expect(
      evaluateProjectMemberDeparture({
        currentStatus: "seeking_steward",
        memberRole: "steward",
        stewardCount: 1,
      }),
    ).toEqual({ allowed: true });
  });

  it("never treats ManyHands membership as GitHub repository permission", () => {
    for (const role of projectMembershipRoles) {
      expect(projectMembershipGrantsRepositoryPermission(role)).toBe(false);
    }
  });
});

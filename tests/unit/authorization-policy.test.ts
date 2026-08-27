import { describe, expect, it } from "vitest";

import {
  AuthorizationError,
  anonymousPrincipal,
  createAccountPrincipal,
  decideAuthorization,
  requireAuthorization,
  type ProfileResource,
} from "../../packages/domain/src";

const ownerProfile: ProfileResource = {
  kind: "profile",
  accountId: "account-owner",
  visibility: "private",
};

describe("authorization policy", () => {
  it("allows anyone to read an explicitly public profile", () => {
    expect(
      decideAuthorization(anonymousPrincipal, {
        capability: "profile.read",
        resource: { ...ownerProfile, visibility: "public" },
      }),
    ).toEqual({ allowed: true });
  });

  it("requires authentication for member-visible profiles", () => {
    expect(
      decideAuthorization(anonymousPrincipal, {
        capability: "profile.read",
        resource: { ...ownerProfile, visibility: "members" },
      }),
    ).toEqual({ allowed: false, reason: "authentication_required" });
  });

  it("allows a suspended member to keep reading member-visible content", () => {
    const suspendedMember = createAccountPrincipal({
      accountId: "suspended-account",
      status: "suspended",
    });

    expect(
      decideAuthorization(suspendedMember, {
        capability: "profile.read",
        resource: { ...ownerProfile, visibility: "members" },
      }),
    ).toEqual({ allowed: true });
  });

  it("allows an owner to read their private profile", () => {
    const owner = createAccountPrincipal({ accountId: ownerProfile.accountId });

    expect(
      decideAuthorization(owner, {
        capability: "profile.read",
        resource: ownerProfile,
      }),
    ).toEqual({ allowed: true });
  });

  it("does not reveal another user's private profile", () => {
    const otherUser = createAccountPrincipal({ accountId: "other-account" });

    expect(
      decideAuthorization(otherUser, {
        capability: "profile.read",
        resource: ownerProfile,
      }),
    ).toEqual({ allowed: false, reason: "resource_not_visible" });
  });

  it("allows only an active owner to update a profile", () => {
    const owner = createAccountPrincipal({ accountId: ownerProfile.accountId });
    const otherUser = createAccountPrincipal({ accountId: "other-account" });

    expect(
      decideAuthorization(owner, {
        capability: "profile.update",
        resource: ownerProfile,
      }),
    ).toEqual({ allowed: true });

    expect(
      decideAuthorization(otherUser, {
        capability: "profile.update",
        resource: ownerProfile,
      }),
    ).toEqual({ allowed: false, reason: "profile_owner_required" });
  });

  it("denies protected writes for suspended owners", () => {
    const suspendedOwner = createAccountPrincipal({
      accountId: ownerProfile.accountId,
      status: "suspended",
    });

    expect(
      decideAuthorization(suspendedOwner, {
        capability: "profile.update",
        resource: ownerProfile,
      }),
    ).toEqual({ allowed: false, reason: "account_inactive" });
  });

  it("allows project updates only inside a steward or maintainer scope", () => {
    const projectMaintainer = createAccountPrincipal({
      accountId: "maintainer",
      projectRoles: {
        "project-a": "maintainer",
        "project-b": "contributor",
      },
    });

    expect(
      decideAuthorization(projectMaintainer, {
        capability: "project.update",
        resource: { kind: "project", projectId: "project-a" },
      }),
    ).toEqual({ allowed: true });

    expect(
      decideAuthorization(projectMaintainer, {
        capability: "project.update",
        resource: { kind: "project", projectId: "project-b" },
      }),
    ).toEqual({ allowed: false, reason: "project_role_required" });
  });

  it("does not convert a project moderator into a global moderator", () => {
    const projectModerator = createAccountPrincipal({
      accountId: "project-moderator",
      projectRoles: { "project-a": "moderator" },
    });

    expect(
      decideAuthorization(projectModerator, {
        capability: "moderation.report.read_private",
        resource: { kind: "private_report", reportId: "report-a" },
      }),
    ).toEqual({ allowed: false, reason: "global_moderator_required" });
  });

  it("allows an active global moderator to read private reports", () => {
    const globalModerator = createAccountPrincipal({
      accountId: "global-moderator",
      globalRoles: ["moderator"],
    });

    expect(
      decideAuthorization(globalModerator, {
        capability: "moderation.report.read_private",
        resource: { kind: "private_report", reportId: "report-a" },
      }),
    ).toEqual({ allowed: true });
  });

  it("suspends global moderation capability along with other protected access", () => {
    const suspendedModerator = createAccountPrincipal({
      accountId: "global-moderator",
      status: "suspended",
      globalRoles: ["moderator"],
    });

    expect(
      decideAuthorization(suspendedModerator, {
        capability: "moderation.report.read_private",
        resource: { kind: "private_report", reportId: "report-a" },
      }),
    ).toEqual({ allowed: false, reason: "account_inactive" });
  });

  it("raises a structured error at enforcement boundaries", () => {
    expect(() =>
      requireAuthorization(anonymousPrincipal, {
        capability: "profile.update",
        resource: ownerProfile,
      }),
    ).toThrowError(
      expect.objectContaining<Partial<AuthorizationError>>({
        name: "AuthorizationError",
        capability: "profile.update",
        reason: "authentication_required",
      }),
    );
  });
});

import { describe, expect, it } from "vitest";

import {
  anonymousPrincipal,
  canTransitionProblemStatus,
  createAccountPrincipal,
  decideAuthorization,
  type ProblemResource,
} from "../../packages/domain/src";

const publicProblem: ProblemResource = {
  authorAccountId: "problem-author",
  kind: "problem",
  moderationState: "clear",
  problemId: "problem-a",
  status: "published",
};

const privateDraft: ProblemResource = {
  ...publicProblem,
  status: "draft",
};

describe("Problem authorization", () => {
  it("allows signed-out visitors to read published clear Problems", () => {
    expect(
      decideAuthorization(anonymousPrincipal, {
        capability: "problem.read",
        resource: publicProblem,
      }),
    ).toEqual({ allowed: true });
  });

  it("does not reveal private drafts or restricted Problems to signed-out visitors", () => {
    expect(
      decideAuthorization(anonymousPrincipal, {
        capability: "problem.read",
        resource: privateDraft,
      }),
    ).toEqual({ allowed: false, reason: "resource_not_visible" });

    expect(
      decideAuthorization(anonymousPrincipal, {
        capability: "problem.read",
        resource: { ...publicProblem, moderationState: "restricted" },
      }),
    ).toEqual({ allowed: false, reason: "resource_not_visible" });
  });

  it("allows authors and global moderators to inspect non-public Problem states", () => {
    const author = createAccountPrincipal({ accountId: publicProblem.authorAccountId });
    const moderator = createAccountPrincipal({
      accountId: "moderator-account",
      globalRoles: ["moderator"],
    });

    expect(
      decideAuthorization(author, {
        capability: "problem.read",
        resource: privateDraft,
      }),
    ).toEqual({ allowed: true });
    expect(
      decideAuthorization(moderator, {
        capability: "problem.read",
        resource: { ...publicProblem, moderationState: "restricted" },
      }),
    ).toEqual({ allowed: true });
  });

  it("requires an active account to create a Problem", () => {
    const activeAccount = createAccountPrincipal({ accountId: "active-account" });
    const suspendedAccount = createAccountPrincipal({
      accountId: "suspended-account",
      status: "suspended",
    });
    const deletionRequestedAccount = createAccountPrincipal({
      accountId: "deleting-account",
      status: "deletion_requested",
    });

    expect(
      decideAuthorization(activeAccount, {
        capability: "problem.create",
        resource: { kind: "problem_collection" },
      }),
    ).toEqual({ allowed: true });
    expect(
      decideAuthorization(suspendedAccount, {
        capability: "problem.create",
        resource: { kind: "problem_collection" },
      }),
    ).toEqual({ allowed: false, reason: "account_inactive" });
    expect(
      decideAuthorization(deletionRequestedAccount, {
        capability: "problem.create",
        resource: { kind: "problem_collection" },
      }),
    ).toEqual({ allowed: false, reason: "account_inactive" });
  });

  it("allows only the active author to revise a clear Problem", () => {
    const author = createAccountPrincipal({ accountId: publicProblem.authorAccountId });
    const otherAccount = createAccountPrincipal({ accountId: "other-account" });

    expect(
      decideAuthorization(author, {
        capability: "problem.update",
        resource: publicProblem,
      }),
    ).toEqual({ allowed: true });
    expect(
      decideAuthorization(otherAccount, {
        capability: "problem.update",
        resource: publicProblem,
      }),
    ).toEqual({ allowed: false, reason: "problem_owner_required" });
    expect(
      decideAuthorization(author, {
        capability: "problem.update",
        resource: { ...publicProblem, moderationState: "restricted" },
      }),
    ).toEqual({ allowed: false, reason: "problem_moderated" });
  });

  it("blocks Problem revisions for inactive authors", () => {
    const suspendedAuthor = createAccountPrincipal({
      accountId: publicProblem.authorAccountId,
      status: "suspended",
    });

    expect(
      decideAuthorization(suspendedAuthor, {
        capability: "problem.update",
        resource: publicProblem,
      }),
    ).toEqual({ allowed: false, reason: "account_inactive" });
  });

  it("allows need signals and follows only on published clear Problems", () => {
    const activeAccount = createAccountPrincipal({ accountId: "interested-account" });

    expect(
      decideAuthorization(activeAccount, {
        capability: "problem.interact",
        resource: publicProblem,
      }),
    ).toEqual({ allowed: true });
    expect(
      decideAuthorization(activeAccount, {
        capability: "problem.interact",
        resource: privateDraft,
      }),
    ).toEqual({ allowed: false, reason: "problem_not_interactive" });
    expect(
      decideAuthorization(activeAccount, {
        capability: "problem.interact",
        resource: { ...publicProblem, moderationState: "removed" },
      }),
    ).toEqual({ allowed: false, reason: "problem_not_interactive" });
  });

  it("requires authentication and an active lifecycle state for interactions", () => {
    const suspendedAccount = createAccountPrincipal({
      accountId: "suspended-account",
      status: "suspended",
    });

    expect(
      decideAuthorization(anonymousPrincipal, {
        capability: "problem.interact",
        resource: publicProblem,
      }),
    ).toEqual({ allowed: false, reason: "authentication_required" });
    expect(
      decideAuthorization(suspendedAccount, {
        capability: "problem.interact",
        resource: publicProblem,
      }),
    ).toEqual({ allowed: false, reason: "account_inactive" });
  });
});

describe("Problem lifecycle transitions", () => {
  it.each([
    ["draft", "draft", true],
    ["draft", "published", true],
    ["draft", "archived", true],
    ["draft", "closed", false],
    ["published", "published", true],
    ["published", "closed", true],
    ["published", "archived", true],
    ["published", "draft", false],
    ["closed", "closed", true],
    ["closed", "published", true],
    ["closed", "archived", true],
    ["closed", "draft", false],
    ["archived", "archived", true],
    ["archived", "published", false],
  ] as const)("evaluates %s → %s as %s", (currentStatus, desiredStatus, expected) => {
    expect(canTransitionProblemStatus(currentStatus, desiredStatus)).toBe(expected);
  });
});

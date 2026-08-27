export const accountStatuses = ["active", "suspended", "deletion_requested", "anonymized"] as const;

export type AccountStatus = (typeof accountStatuses)[number];

export const profileVisibilities = ["private", "members", "public"] as const;

export type ProfileVisibility = (typeof profileVisibilities)[number];

export const projectRoles = ["steward", "maintainer", "contributor", "moderator"] as const;

export type ProjectRole = (typeof projectRoles)[number];

export const globalRoles = ["moderator"] as const;

export type GlobalRole = (typeof globalRoles)[number];

export interface AnonymousPrincipal {
  readonly kind: "anonymous";
}

export interface AccountPrincipal {
  readonly kind: "account";
  readonly accountId: string;
  readonly status: AccountStatus;
  readonly globalRoles: readonly GlobalRole[];
  readonly projectRoles: Readonly<Record<string, ProjectRole | undefined>>;
}

export type Principal = AnonymousPrincipal | AccountPrincipal;

export const anonymousPrincipal: AnonymousPrincipal = Object.freeze({ kind: "anonymous" });

export interface CreateAccountPrincipalInput {
  readonly accountId: string;
  readonly status?: AccountStatus;
  readonly globalRoles?: readonly GlobalRole[];
  readonly projectRoles?: Readonly<Record<string, ProjectRole | undefined>>;
}

export function createAccountPrincipal({
  accountId,
  status = "active",
  globalRoles: assignedGlobalRoles = [],
  projectRoles: assignedProjectRoles = {},
}: CreateAccountPrincipalInput): AccountPrincipal {
  return {
    kind: "account",
    accountId,
    status,
    globalRoles: assignedGlobalRoles,
    projectRoles: assignedProjectRoles,
  };
}

export interface ProfileResource {
  readonly kind: "profile";
  readonly accountId: string;
  readonly visibility: ProfileVisibility;
}

export interface ProjectResource {
  readonly kind: "project";
  readonly projectId: string;
}

export interface PrivateReportResource {
  readonly kind: "private_report";
  readonly reportId: string;
}

export type AuthorizationRequest =
  | {
      readonly capability: "profile.read";
      readonly resource: ProfileResource;
    }
  | {
      readonly capability: "profile.update";
      readonly resource: ProfileResource;
    }
  | {
      readonly capability: "project.update";
      readonly resource: ProjectResource;
    }
  | {
      readonly capability: "moderation.report.read_private";
      readonly resource: PrivateReportResource;
    };

export type Capability = AuthorizationRequest["capability"];

export type AuthorizationDenialReason =
  | "authentication_required"
  | "account_inactive"
  | "resource_not_visible"
  | "profile_owner_required"
  | "project_role_required"
  | "global_moderator_required";

export interface AuthorizationAllowed {
  readonly allowed: true;
}

export interface AuthorizationDenied {
  readonly allowed: false;
  readonly reason: AuthorizationDenialReason;
}

export type AuthorizationDecision = AuthorizationAllowed | AuthorizationDenied;

const allowed: AuthorizationAllowed = Object.freeze({ allowed: true });

function denied(reason: AuthorizationDenialReason): AuthorizationDenied {
  return { allowed: false, reason };
}

function isActiveAccount(principal: Principal): principal is AccountPrincipal {
  return principal.kind === "account" && principal.status === "active";
}

function canReadProfile(principal: Principal, resource: ProfileResource): AuthorizationDecision {
  if (resource.visibility === "public") {
    return allowed;
  }

  if (principal.kind === "anonymous") {
    return denied("authentication_required");
  }

  if (resource.visibility === "members") {
    return allowed;
  }

  return principal.accountId === resource.accountId ? allowed : denied("resource_not_visible");
}

function canUpdateProfile(principal: Principal, resource: ProfileResource): AuthorizationDecision {
  if (principal.kind === "anonymous") {
    return denied("authentication_required");
  }

  if (!isActiveAccount(principal)) {
    return denied("account_inactive");
  }

  return principal.accountId === resource.accountId ? allowed : denied("profile_owner_required");
}

function canUpdateProject(principal: Principal, resource: ProjectResource): AuthorizationDecision {
  if (principal.kind === "anonymous") {
    return denied("authentication_required");
  }

  if (!isActiveAccount(principal)) {
    return denied("account_inactive");
  }

  const role = principal.projectRoles[resource.projectId];

  return role === "steward" || role === "maintainer" ? allowed : denied("project_role_required");
}

function canReadPrivateReport(principal: Principal): AuthorizationDecision {
  if (principal.kind === "anonymous") {
    return denied("authentication_required");
  }

  if (!isActiveAccount(principal)) {
    return denied("account_inactive");
  }

  return principal.globalRoles.includes("moderator")
    ? allowed
    : denied("global_moderator_required");
}

export function decideAuthorization(
  principal: Principal,
  request: AuthorizationRequest,
): AuthorizationDecision {
  switch (request.capability) {
    case "profile.read":
      return canReadProfile(principal, request.resource);
    case "profile.update":
      return canUpdateProfile(principal, request.resource);
    case "project.update":
      return canUpdateProject(principal, request.resource);
    case "moderation.report.read_private":
      return canReadPrivateReport(principal);
  }
}

export class AuthorizationError extends Error {
  readonly capability: Capability;
  readonly reason: AuthorizationDenialReason;

  constructor(capability: Capability, reason: AuthorizationDenialReason) {
    super(`Authorization denied for ${capability}: ${reason}`);
    this.name = "AuthorizationError";
    this.capability = capability;
    this.reason = reason;
  }
}

export function requireAuthorization(principal: Principal, request: AuthorizationRequest): void {
  const decision = decideAuthorization(principal, request);

  if (!decision.allowed) {
    throw new AuthorizationError(request.capability, decision.reason);
  }
}

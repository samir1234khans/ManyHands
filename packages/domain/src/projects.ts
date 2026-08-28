export const projectStatuses = [
  "proposed",
  "active",
  "paused",
  "seeking_steward",
  "completed",
  "archived",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export const projectMembershipRoles = ["steward", "maintainer", "contributor"] as const;

export type ProjectMembershipRole = (typeof projectMembershipRoles)[number];

export const projectActivationGaps = [
  "steward_required",
  "license_required",
  "scope_required",
  "non_goals_required",
  "governance_required",
  "onboarding_required",
] as const;

export type ProjectActivationGap = (typeof projectActivationGaps)[number];

export interface ProjectActivationInput {
  readonly governanceUrl: string | null;
  readonly licenseIdentifier: string | null;
  readonly nonGoals: string | null;
  readonly onboardingSummary: string | null;
  readonly scope: string | null;
  readonly stewardCount: number;
}

export interface ProjectActivationAssessment {
  readonly ready: boolean;
  readonly gaps: readonly ProjectActivationGap[];
}

function hasText(value: string | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function evaluateProjectActivation(
  input: ProjectActivationInput,
): ProjectActivationAssessment {
  const gaps: ProjectActivationGap[] = [];

  if (!Number.isInteger(input.stewardCount) || input.stewardCount < 1) {
    gaps.push("steward_required");
  }
  if (!hasText(input.licenseIdentifier)) {
    gaps.push("license_required");
  }
  if (!hasText(input.scope)) {
    gaps.push("scope_required");
  }
  if (!hasText(input.nonGoals)) {
    gaps.push("non_goals_required");
  }
  if (!hasText(input.governanceUrl)) {
    gaps.push("governance_required");
  }
  if (!hasText(input.onboardingSummary)) {
    gaps.push("onboarding_required");
  }

  return { ready: gaps.length === 0, gaps };
}

const projectStatusTransitions: Readonly<Record<ProjectStatus, readonly ProjectStatus[]>> = {
  proposed: ["active", "archived"],
  active: ["paused", "seeking_steward", "completed", "archived"],
  paused: ["active", "seeking_steward", "archived"],
  seeking_steward: ["active", "paused", "archived"],
  completed: ["archived"],
  archived: [],
};

export function canTransitionProjectStatus(
  currentStatus: ProjectStatus,
  nextStatus: ProjectStatus,
): boolean {
  return projectStatusTransitions[currentStatus].includes(nextStatus);
}

export interface ProjectMemberDepartureInput {
  readonly currentStatus: ProjectStatus;
  readonly memberRole: ProjectMembershipRole;
  readonly stewardCount: number;
}

export type ProjectMemberDepartureDecision =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly reason: "final_steward_handoff_required" };

const statusesThatPermitFinalStewardDeparture = new Set<ProjectStatus>([
  "paused",
  "seeking_steward",
  "completed",
  "archived",
]);

export function evaluateProjectMemberDeparture(
  input: ProjectMemberDepartureInput,
): ProjectMemberDepartureDecision {
  if (input.memberRole !== "steward" || input.stewardCount > 1) {
    return { allowed: true };
  }

  return statusesThatPermitFinalStewardDeparture.has(input.currentStatus)
    ? { allowed: true }
    : { allowed: false, reason: "final_steward_handoff_required" };
}

export function projectMembershipGrantsRepositoryPermission(_role: ProjectMembershipRole): false {
  return false;
}

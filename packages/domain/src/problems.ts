export const problemStatuses = ["draft", "published", "closed", "archived"] as const;
export type ProblemStatus = (typeof problemStatuses)[number];

export const problemModerationStates = ["clear", "restricted", "removed"] as const;
export type ProblemModerationState = (typeof problemModerationStates)[number];

export function isPublicProblemStatus(status: ProblemStatus): boolean {
  return status === "published" || status === "closed" || status === "archived";
}

export function canTransitionProblemStatus(
  currentStatus: ProblemStatus,
  desiredStatus: ProblemStatus,
): boolean {
  switch (currentStatus) {
    case "draft":
      return (
        desiredStatus === "draft" || desiredStatus === "published" || desiredStatus === "archived"
      );
    case "published":
      return (
        desiredStatus === "published" || desiredStatus === "closed" || desiredStatus === "archived"
      );
    case "closed":
      return (
        desiredStatus === "closed" || desiredStatus === "published" || desiredStatus === "archived"
      );
    case "archived":
      return desiredStatus === "archived";
  }
}

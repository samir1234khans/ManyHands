import type { ProblemStatus } from "@manyhands/domain";

export interface ProblemFormValues {
  readonly affectedPeople: string;
  readonly changeSummary: string;
  readonly context: string;
  readonly evidence: string;
  readonly existingAlternatives: string;
  readonly platforms: string;
  readonly slug: string;
  readonly summary: string;
  readonly tags: string;
  readonly title: string;
}

export interface ProblemFormState {
  readonly currentStatus: ProblemStatus | null;
  readonly fieldErrors: Readonly<Record<string, string>>;
  readonly message: string | null;
  readonly problemId: string | null;
  readonly status: "error" | "idle" | "success";
  readonly values: ProblemFormValues;
}

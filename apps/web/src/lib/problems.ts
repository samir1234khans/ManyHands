import "server-only";

import type { ProblemDirectoryRow, ProblemRevisionRow, ProblemRow } from "@manyhands/data";
import {
  problemModerationStates,
  problemStatuses,
  type ProblemModerationState,
  type ProblemStatus,
} from "@manyhands/domain";

import type { ProblemFormValues } from "@/app/problems/problem-form-state";

import { getPublicSupabaseConfig } from "./env";
import { createServerSupabaseClient, type ServerSupabaseClient } from "./supabase/server";

export interface PublicProblem {
  readonly affectedPeople: string;
  readonly authorAccountId: string;
  readonly authorDisplayName: string | null;
  readonly authorHandle: string | null;
  readonly context: string;
  readonly createdAt: string;
  readonly evidence: string | null;
  readonly existingAlternatives: string | null;
  readonly followCount: number;
  readonly id: string;
  readonly lastMeaningfulUpdateAt: string;
  readonly needSignalCount: number;
  readonly platforms: readonly string[];
  readonly publishedAt: string | null;
  readonly revisionNumber: number;
  readonly slug: string;
  readonly status: ProblemStatus;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly title: string;
  readonly updatedAt: string;
}

export interface PublicProblemRevision {
  readonly changeSummary: string;
  readonly createdAt: string;
  readonly id: string;
  readonly revisionNumber: number;
  readonly status: ProblemStatus;
}

export interface PublicProblemListResult {
  readonly configured: boolean;
  readonly problems: readonly PublicProblem[];
  readonly query: string;
}

export interface ProblemInteractionState {
  readonly hasNeedSignal: boolean;
  readonly isFollowing: boolean;
  readonly privateSignalContext: string | null;
}

function isProblemStatus(value: unknown): value is ProblemStatus {
  return typeof value === "string" && problemStatuses.includes(value as ProblemStatus);
}

function isProblemModerationState(value: unknown): value is ProblemModerationState {
  return (
    typeof value === "string" && problemModerationStates.includes(value as ProblemModerationState)
  );
}

function normalizePublicProblem(row: ProblemDirectoryRow): PublicProblem | null {
  if (
    !row.id ||
    !row.author_account_id ||
    !row.slug ||
    !row.title ||
    !row.summary ||
    !row.affected_people ||
    !row.context ||
    !row.created_at ||
    !row.last_meaningful_update_at ||
    !row.updated_at ||
    !row.revision_number ||
    !isProblemStatus(row.status)
  ) {
    return null;
  }

  return {
    affectedPeople: row.affected_people,
    authorAccountId: row.author_account_id,
    authorDisplayName: row.author_display_name,
    authorHandle: row.author_handle,
    context: row.context,
    createdAt: row.created_at,
    evidence: row.evidence,
    existingAlternatives: row.existing_alternatives,
    followCount: Number(row.follow_count ?? 0),
    id: row.id,
    lastMeaningfulUpdateAt: row.last_meaningful_update_at,
    needSignalCount: Number(row.need_signal_count ?? 0),
    platforms: row.platforms ?? [],
    publishedAt: row.published_at,
    revisionNumber: row.revision_number,
    slug: row.slug,
    status: row.status,
    summary: row.summary,
    tags: row.tags ?? [],
    title: row.title,
    updatedAt: row.updated_at,
  };
}

function normalizeProblemRevision(row: ProblemRevisionRow): PublicProblemRevision | null {
  if (
    !row.id ||
    !row.change_summary ||
    !row.created_at ||
    !row.revision_number ||
    !isProblemStatus(row.status)
  ) {
    return null;
  }

  return {
    changeSummary: row.change_summary,
    createdAt: row.created_at,
    id: row.id,
    revisionNumber: row.revision_number,
    status: row.status,
  };
}

export async function listPublicProblems(queryValue = ""): Promise<PublicProblemListResult> {
  const query = queryValue.trim().slice(0, 120);

  if (!getPublicSupabaseConfig()) {
    return { configured: false, problems: [], query };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("problem_directory")
    .select("*")
    .order("last_meaningful_update_at", { ascending: false })
    .limit(100);

  if (error) {
    return { configured: true, problems: [], query };
  }

  const normalized = (data ?? []).flatMap((row) => {
    const problem = normalizePublicProblem(row);
    return problem ? [problem] : [];
  });
  const queryKey = query.toLocaleLowerCase("en");
  const problems = queryKey
    ? normalized.filter((problem) =>
        [
          problem.title,
          problem.summary,
          problem.affectedPeople,
          problem.context,
          ...problem.platforms,
          ...problem.tags,
        ]
          .join(" ")
          .toLocaleLowerCase("en")
          .includes(queryKey),
      )
    : normalized;

  return { configured: true, problems, query };
}

export async function getPublicProblemBySlug(slug: string): Promise<PublicProblem | null> {
  if (!getPublicSupabaseConfig()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("problem_directory")
    .select("*")
    .eq("slug", slug.toLowerCase())
    .maybeSingle();

  return error || !data ? null : normalizePublicProblem(data);
}

export async function listPublicProblemRevisions(
  problemId: string,
): Promise<readonly PublicProblemRevision[]> {
  if (!getPublicSupabaseConfig()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("problem_revisions")
    .select("id, change_summary, created_at, revision_number, status")
    .eq("problem_id", problemId)
    .eq("is_public", true)
    .order("revision_number", { ascending: false })
    .limit(25);

  if (error) {
    return [];
  }

  return (data ?? []).flatMap((row) => {
    const revision = normalizeProblemRevision(row as ProblemRevisionRow);
    return revision ? [revision] : [];
  });
}

export async function getOwnedProblemBySlug(
  supabase: ServerSupabaseClient,
  accountId: string,
  slug: string,
): Promise<ProblemRow | null> {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("author_account_id", accountId)
    .eq("slug", slug.toLowerCase())
    .maybeSingle();

  return error ? null : data;
}

export async function getProblemByIdForAccount(
  supabase: ServerSupabaseClient,
  accountId: string,
  problemId: string,
): Promise<ProblemRow | null> {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("id", problemId)
    .eq("author_account_id", accountId)
    .maybeSingle();

  return error ? null : data;
}

export async function getProblemInteractionState(
  supabase: ServerSupabaseClient,
  problemId: string,
): Promise<ProblemInteractionState | null> {
  const { data, error } = await supabase.rpc("current_problem_interactions", {
    target_problem_id: problemId,
  });
  const state = data?.[0];

  if (error || !state) {
    return null;
  }

  return {
    hasNeedSignal: Boolean(state.has_need_signal),
    isFollowing: Boolean(state.is_following),
    privateSignalContext: state.private_signal_context,
  };
}

export function problemRowToFormValues(problem: ProblemRow): ProblemFormValues {
  return {
    affectedPeople: problem.affected_people,
    changeSummary: "",
    context: problem.context,
    evidence: problem.evidence ?? "",
    existingAlternatives: problem.existing_alternatives ?? "",
    platforms: problem.platforms.join(", "),
    slug: problem.slug,
    summary: problem.summary,
    tags: problem.tags.join(", "),
    title: problem.title,
  };
}

export function problemRowToAuthorizationResource(problem: ProblemRow) {
  if (!isProblemStatus(problem.status) || !isProblemModerationState(problem.moderation_state)) {
    return null;
  }

  return {
    authorAccountId: problem.author_account_id,
    kind: "problem" as const,
    moderationState: problem.moderation_state,
    problemId: problem.id,
    status: problem.status,
  };
}

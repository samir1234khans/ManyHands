"use server";

import { decideAuthorization, type ProblemStatus } from "@manyhands/domain";
import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ProblemFormState, ProblemFormValues } from "./problem-form-state";
import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { createSignInPath } from "@/lib/auth/return-path";
import { validateProblemInput } from "@/lib/problems/input";
import {
  getProblemByIdForAccount,
  getPublicProblemBySlug,
  problemRowToAuthorizationResource,
} from "@/lib/problems";

function readValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function captureValues(formData: FormData): ProblemFormValues {
  return {
    affectedPeople: readValue(formData, "affectedPeople"),
    changeSummary: readValue(formData, "changeSummary"),
    context: readValue(formData, "context"),
    evidence: readValue(formData, "evidence"),
    existingAlternatives: readValue(formData, "existingAlternatives"),
    platforms: readValue(formData, "platforms"),
    slug: readValue(formData, "slug"),
    summary: readValue(formData, "summary"),
    tags: readValue(formData, "tags"),
    title: readValue(formData, "title"),
  };
}

function desiredStatusForIntent(
  intent: string,
  currentStatus: ProblemStatus | null,
): ProblemStatus {
  switch (intent) {
    case "publish":
    case "reopen":
      return "published";
    case "close":
      return "closed";
    case "archive":
      return "archived";
    default:
      return currentStatus ?? "draft";
  }
}

function logProblemEvent(input: {
  readonly name: "follow" | "need_signal" | "save";
  readonly outcome: "completed" | "denied" | "failed";
  readonly reason?: string;
}): void {
  console.info(
    JSON.stringify({
      event: "manyhands.problem",
      name: input.name,
      outcome: input.outcome,
      ...(input.reason ? { reason: input.reason.replace(/[^a-z0-9_-]/gi, "_").slice(0, 80) } : {}),
    }),
  );
}

export async function saveProblemAction(
  previousState: ProblemFormState,
  formData: FormData,
): Promise<ProblemFormState> {
  const values = captureValues(formData);
  const context = await getCurrentAccountContext();

  if (!context) {
    return {
      ...previousState,
      fieldErrors: {},
      message: "Your session is no longer valid. Sign in again before saving this Problem.",
      status: "error",
      values,
    };
  }

  const problemIdValue = readValue(formData, "problemId");
  const problemId = problemIdValue || null;
  const existingProblem = problemId
    ? await getProblemByIdForAccount(context.supabase, context.accountId, problemId)
    : null;
  const currentStatus = existingProblem?.status ?? null;

  if (problemId && !existingProblem) {
    logProblemEvent({ name: "save", outcome: "denied", reason: "problem_not_editable" });
    return {
      ...previousState,
      fieldErrors: {},
      message: "This Problem could not be loaded as an editable item for your account.",
      status: "error",
      values,
    };
  }

  const authorization = existingProblem
    ? (() => {
        const resource = problemRowToAuthorizationResource(existingProblem);
        return resource
          ? decideAuthorization(context.principal, {
              capability: "problem.update",
              resource,
            })
          : { allowed: false as const, reason: "resource_not_visible" as const };
      })()
    : decideAuthorization(context.principal, {
        capability: "problem.create",
        resource: { kind: "problem_collection" },
      });

  if (!authorization.allowed) {
    logProblemEvent({ name: "save", outcome: "denied", reason: authorization.reason });
    return {
      ...previousState,
      currentStatus,
      fieldErrors: {},
      message:
        authorization.reason === "account_inactive"
          ? "This account cannot publish or revise Problems in its current lifecycle state."
          : "This account is not allowed to save that Problem.",
      problemId,
      status: "error",
      values,
    };
  }

  const validation = validateProblemInput(formData, currentStatus);

  if (!validation.ok) {
    return {
      currentStatus,
      fieldErrors: validation.fieldErrors,
      message: "Review the highlighted fields and try again.",
      problemId,
      status: "error",
      values,
    };
  }

  const intent = readValue(formData, "intent");
  const desiredStatus = desiredStatusForIntent(intent, currentStatus);
  const { value } = validation;
  const problemPayload = {
    change_summary: value.changeSummary ?? "Initial Problem definition",
    desired_status: desiredStatus,
    problem_affected_people: value.affectedPeople,
    problem_context: value.context,
    problem_evidence: value.evidence ?? "",
    problem_existing_alternatives: value.existingAlternatives ?? "",
    problem_platforms: value.platforms,
    problem_slug: value.slug,
    problem_summary: value.summary,
    problem_tags: value.tags,
    problem_title: value.title,
  };
  const { data, error } = problemId
    ? await context.supabase.rpc("save_problem", {
        ...problemPayload,
        target_problem_id: problemId,
      })
    : await context.supabase.rpc("create_problem", problemPayload);

  if (error || !data) {
    const slugConflict = error?.code === "23505";
    const permissionFailure = error?.code === "42501";
    logProblemEvent({
      name: "save",
      outcome: permissionFailure ? "denied" : "failed",
      reason: slugConflict
        ? "slug_conflict"
        : permissionFailure
          ? "authorization"
          : "database_write",
    });
    return {
      currentStatus,
      fieldErrors: slugConflict
        ? { slug: "That public slug is already in use. Choose another one." }
        : {},
      message: slugConflict
        ? "Choose another public slug and try again."
        : permissionFailure
          ? "The Problem is not editable in the current account or moderation state."
          : "The Problem could not be saved safely. Your previous version remains unchanged.",
      problemId,
      status: "error",
      values,
    };
  }

  logProblemEvent({ name: "save", outcome: "completed" });
  revalidatePath("/problems");
  revalidatePath(`/problems/${value.slug}`);
  revalidatePath(`/problems/${value.slug}/edit`);

  const destination =
    desiredStatus === "draft"
      ? `/problems/${value.slug}/edit?saved=1`
      : `/problems/${value.slug}?saved=1`;
  redirect(destination as Route);
}

export async function toggleProblemNeedSignalAction(formData: FormData): Promise<never> {
  const slug = readValue(formData, "slug").toLowerCase();
  const context = await getCurrentAccountContext();

  if (!context) {
    redirect(createSignInPath(`/problems/${slug}`, "problem_signal"));
  }

  const problem = await getPublicProblemBySlug(slug);
  if (!problem) {
    redirect(`/problems?interaction=unavailable` as Route);
  }

  const authorization = decideAuthorization(context.principal, {
    capability: "problem.interact",
    resource: {
      authorAccountId: problem.authorAccountId,
      kind: "problem",
      moderationState: "clear",
      problemId: problem.id,
      status: problem.status,
    },
  });

  if (!authorization.allowed) {
    logProblemEvent({ name: "need_signal", outcome: "denied", reason: authorization.reason });
    redirect(`/problems/${slug}?interaction=denied` as Route);
  }

  const privateContext = readValue(formData, "privateContext").trim().slice(0, 500);
  const { data, error } = await context.supabase.rpc("toggle_problem_need_signal", {
    signal_context: privateContext,
    target_problem_id: problem.id,
  });

  if (error) {
    logProblemEvent({ name: "need_signal", outcome: "failed", reason: error.code });
    redirect(`/problems/${slug}?interaction=failed` as Route);
  }

  logProblemEvent({ name: "need_signal", outcome: "completed" });
  revalidatePath("/problems");
  revalidatePath(`/problems/${slug}`);
  redirect(`/problems/${slug}?need=${data ? "added" : "removed"}` as Route);
}

export async function toggleProblemFollowAction(formData: FormData): Promise<never> {
  const slug = readValue(formData, "slug").toLowerCase();
  const context = await getCurrentAccountContext();

  if (!context) {
    redirect(createSignInPath(`/problems/${slug}`, "problem_follow"));
  }

  const problem = await getPublicProblemBySlug(slug);
  if (!problem) {
    redirect(`/problems?interaction=unavailable` as Route);
  }

  const authorization = decideAuthorization(context.principal, {
    capability: "problem.interact",
    resource: {
      authorAccountId: problem.authorAccountId,
      kind: "problem",
      moderationState: "clear",
      problemId: problem.id,
      status: problem.status,
    },
  });

  if (!authorization.allowed) {
    logProblemEvent({ name: "follow", outcome: "denied", reason: authorization.reason });
    redirect(`/problems/${slug}?interaction=denied` as Route);
  }

  const { data, error } = await context.supabase.rpc("toggle_problem_follow", {
    target_problem_id: problem.id,
  });

  if (error) {
    logProblemEvent({ name: "follow", outcome: "failed", reason: error.code });
    redirect(`/problems/${slug}?interaction=failed` as Route);
  }

  logProblemEvent({ name: "follow", outcome: "completed" });
  revalidatePath("/problems");
  revalidatePath(`/problems/${slug}`);
  redirect(`/problems/${slug}?follow=${data ? "added" : "removed"}` as Route);
}

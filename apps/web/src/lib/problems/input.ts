import type { ProblemStatus } from "@manyhands/domain";

export interface ProblemInput {
  readonly affectedPeople: string;
  readonly changeSummary: string | null;
  readonly context: string;
  readonly evidence: string | null;
  readonly existingAlternatives: string | null;
  readonly platforms: string[];
  readonly slug: string;
  readonly summary: string;
  readonly tags: string[];
  readonly title: string;
}

export interface ProblemValidationFailure {
  readonly fieldErrors: Readonly<Record<string, string>>;
  readonly ok: false;
}

export interface ProblemValidationSuccess {
  readonly ok: true;
  readonly value: ProblemInput;
}

export type ProblemValidationResult = ProblemValidationFailure | ProblemValidationSuccess;

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeParagraph(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/[\t ]+\n/g, "\n")
    .trim();
}

function normalizeList(value: string, maximumItems: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const rawItem of value.split(/[\n,]/)) {
    const item = rawItem.trim().replace(/\s+/g, " ");
    const key = item.toLocaleLowerCase("en");

    if (!item || item.length > 60 || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);

    if (result.length === maximumItems) {
      break;
    }
  }

  return result;
}

export function normalizeProblemSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
    .replace(/-$/g, "");
}

export function validateProblemInput(
  formData: FormData,
  currentStatus: ProblemStatus | null,
): ProblemValidationResult {
  const fieldErrors: Record<string, string> = {};
  const slug = normalizeProblemSlug(readFormText(formData, "slug"));
  const title = readFormText(formData, "title").replace(/\s+/g, " ");
  const summary = normalizeParagraph(readFormText(formData, "summary"));
  const affectedPeople = normalizeParagraph(readFormText(formData, "affectedPeople"));
  const context = normalizeParagraph(readFormText(formData, "context"));
  const evidence = normalizeParagraph(readFormText(formData, "evidence"));
  const existingAlternatives = normalizeParagraph(readFormText(formData, "existingAlternatives"));
  const changeSummary = normalizeParagraph(readFormText(formData, "changeSummary"));
  const platforms = normalizeList(readFormText(formData, "platforms"), 12);
  const tags = normalizeList(readFormText(formData, "tags"), 20).map((tag) =>
    tag.toLocaleLowerCase("en"),
  );

  if (
    slug.length < 3 ||
    slug.length > 80 ||
    !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) ||
    slug.includes("--")
  ) {
    fieldErrors.slug =
      "Use 3–80 lowercase letters, numbers, or single hyphens; start and end with a letter or number.";
  }

  if (title.length < 10 || title.length > 120) {
    fieldErrors.title = "Use a title between 10 and 120 characters.";
  }

  if (summary.length < 30 || summary.length > 400) {
    fieldErrors.summary = "Summarize the unmet need in 30–400 characters.";
  }

  if (affectedPeople.length < 20 || affectedPeople.length > 600) {
    fieldErrors.affectedPeople = "Describe the affected people or context in 20–600 characters.";
  }

  if (context.length < 20 || context.length > 3000) {
    fieldErrors.context = "Explain the problem context in 20–3,000 characters.";
  }

  if (evidence.length > 3000) {
    fieldErrors.evidence = "Keep the supporting evidence at 3,000 characters or fewer.";
  }

  if (existingAlternatives.length > 3000) {
    fieldErrors.existingAlternatives =
      "Keep the existing-alternatives note at 3,000 characters or fewer.";
  }

  if (currentStatus && (changeSummary.length < 5 || changeSummary.length > 500)) {
    fieldErrors.changeSummary = "Explain this revision in 5–500 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, ok: false };
  }

  return {
    ok: true,
    value: {
      affectedPeople,
      changeSummary: changeSummary || null,
      context,
      evidence: evidence || null,
      existingAlternatives: existingAlternatives || null,
      platforms,
      slug,
      summary,
      tags,
      title,
    },
  };
}

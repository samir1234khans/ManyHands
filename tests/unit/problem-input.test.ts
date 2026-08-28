import { describe, expect, it } from "vitest";

import { normalizeProblemSlug, validateProblemInput } from "../../apps/web/src/lib/problems/input";

function validProblemForm(): FormData {
  const form = new FormData();
  form.set("slug", "accessible-creative-tools");
  form.set("title", "Creative tools remain inaccessible on Linux");
  form.set(
    "summary",
    "Many creative professionals cannot complete common workflows with accessible Linux tools.",
  );
  form.set(
    "affectedPeople",
    "Designers and media creators using keyboards, screen readers, or constrained hardware.",
  );
  form.set(
    "context",
    "Existing tools cover isolated tasks, but the complete professional workflow remains fragmented and difficult to operate without precise pointer input.",
  );
  form.set("evidence", "Repeated workflow gaps documented across public issue trackers.");
  form.set("existingAlternatives", "Several single-purpose editors solve parts of the workflow.");
  form.set("platforms", "Linux, low-bandwidth web, Linux");
  form.set("tags", "Accessibility, Creative Tools, accessibility");
  form.set("changeSummary", "Clarified the affected workflow and alternatives");
  return form;
}

describe("Problem input validation", () => {
  it("normalizes a human phrase into a stable slug", () => {
    expect(normalizeProblemSlug("  Accessible creative tools!  ")).toBe(
      "accessible-creative-tools",
    );
  });

  it("accepts a complete Problem and deduplicates lists", () => {
    const result = validateProblemInput(validProblemForm(), "published");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.platforms).toEqual(["Linux", "low-bandwidth web"]);
      expect(result.value.tags).toEqual(["accessibility", "creative tools"]);
      expect(result.value.changeSummary).toBe("Clarified the affected workflow and alternatives");
    }
  });

  it("does not require a revision summary for a new Problem", () => {
    const form = validProblemForm();
    form.set("changeSummary", "");

    const result = validateProblemInput(form, null);

    expect(result.ok).toBe(true);
  });

  it("requires an inspectable revision summary for existing Problems", () => {
    const form = validProblemForm();
    form.set("changeSummary", "no");

    const result = validateProblemInput(form, "draft");

    expect(result).toMatchObject({
      ok: false,
      fieldErrors: {
        changeSummary: expect.stringMatching(/5–500/),
      },
    });
  });

  it("rejects a solution-shaped incomplete definition", () => {
    const form = validProblemForm();
    form.set("slug", "x");
    form.set("title", "Build app");
    form.set("summary", "Make my app");
    form.set("affectedPeople", "me");
    form.set("context", "because I want it");

    const result = validateProblemInput(form, null);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toEqual(
        expect.objectContaining({
          affectedPeople: expect.any(String),
          context: expect.any(String),
          slug: expect.any(String),
          summary: expect.any(String),
          title: expect.any(String),
        }),
      );
    }
  });

  it("keeps untrusted markup as plain text instead of interpreting it", () => {
    const form = validProblemForm();
    form.set(
      "context",
      "People encounter this text in reports: <script>doNotRun()</script>; React must render it as text.",
    );

    const result = validateProblemInput(form, null);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.context).toContain("<script>doNotRun()</script>");
    }
  });
});

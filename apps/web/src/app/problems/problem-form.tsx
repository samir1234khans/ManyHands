"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { saveProblemAction } from "./actions";
import type { ProblemFormState, ProblemFormValues } from "./problem-form-state";
import styles from "./problems.module.css";

function FieldError({ id, message }: Readonly<{ id: string; message: string | undefined }>) {
  return message ? (
    <p className="field-error" id={id}>
      {message}
    </p>
  ) : null;
}

function IntentButton({
  intent,
  label,
  tone = "primary",
}: Readonly<{
  intent: string;
  label: string;
  tone?: "danger" | "primary" | "secondary";
}>) {
  const { pending } = useFormStatus();
  const className =
    tone === "danger"
      ? "button button-danger"
      : tone === "secondary"
        ? "button button-secondary"
        : "button button-primary";

  return (
    <button className={className} disabled={pending} name="intent" type="submit" value={intent}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ProblemForm({ initialState }: Readonly<{ initialState: ProblemFormState }>) {
  const [state, formAction] = useActionState(saveProblemAction, initialState);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "error") {
      summaryRef.current?.focus();
    }
  }, [state.status, state.message]);

  const errorId = (field: keyof ProblemFormValues) => `${field}-error`;
  const invalid = (field: keyof ProblemFormValues) => Boolean(state.fieldErrors[field]);
  const hasExistingProblem = Boolean(state.problemId);
  const slugLocked = Boolean(state.currentStatus && state.currentStatus !== "draft");

  return (
    <form action={formAction} className={`profile-form ${styles.problemForm}`} noValidate>
      <input name="problemId" type="hidden" value={state.problemId ?? ""} />

      {state.message ? (
        <div
          className={`form-summary form-summary-${state.status}`}
          ref={summaryRef}
          role={state.status === "error" ? "alert" : "status"}
          tabIndex={-1}
        >
          <p>{state.message}</p>
          {state.status === "error" && Object.keys(state.fieldErrors).length > 0 ? (
            <ul>
              {Object.entries(state.fieldErrors).map(([field, message]) => (
                <li key={field}>
                  <a href={`#${field}`}>{message}</a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <section className={styles.formSection} aria-labelledby="problem-definition-title">
        <div>
          <p className="section-kicker">Problem, not prescribed solution</p>
          <h2 id="problem-definition-title">Define the unmet need</h2>
          <p className="field-help">
            Describe what people cannot do, who is affected, and what evidence or alternatives
            already exist. More than one Project may eventually pursue this Problem.
          </p>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="title">Problem title</label>
            <input
              aria-describedby={`title-help${invalid("title") ? ` ${errorId("title")}` : ""}`}
              aria-invalid={invalid("title")}
              defaultValue={state.values.title}
              id="title"
              maxLength={120}
              minLength={10}
              name="title"
              required
            />
            <p className="field-help" id="title-help">
              Name the unmet need without naming your preferred app or implementation.
            </p>
            <FieldError id={errorId("title")} message={state.fieldErrors.title} />
          </div>

          <div className="form-field">
            <label htmlFor="slug">Public URL slug</label>
            <input
              aria-describedby={`slug-help${invalid("slug") ? ` ${errorId("slug")}` : ""}`}
              aria-invalid={invalid("slug")}
              autoCapitalize="none"
              defaultValue={state.values.slug}
              id="slug"
              maxLength={80}
              minLength={3}
              name="slug"
              pattern="[a-z0-9][a-z0-9-]*[a-z0-9]"
              readOnly={slugLocked}
              required
              spellCheck={false}
            />
            <p className="field-help" id="slug-help">
              Lowercase letters, numbers, and single hyphens. Published URLs remain stable.
            </p>
            <FieldError id={errorId("slug")} message={state.fieldErrors.slug} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="summary">Short summary</label>
          <textarea
            aria-describedby={`summary-help${invalid("summary") ? ` ${errorId("summary")}` : ""}`}
            aria-invalid={invalid("summary")}
            defaultValue={state.values.summary}
            id="summary"
            maxLength={400}
            minLength={30}
            name="summary"
            required
            rows={4}
          />
          <p className="field-help" id="summary-help">
            A signed-out visitor should understand the need in one short paragraph.
          </p>
          <FieldError id={errorId("summary")} message={state.fieldErrors.summary} />
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="affectedPeople">Who is affected?</label>
            <textarea
              aria-describedby={
                invalid("affectedPeople") ? errorId("affectedPeople") : undefined
              }
              aria-invalid={invalid("affectedPeople")}
              defaultValue={state.values.affectedPeople}
              id="affectedPeople"
              maxLength={600}
              minLength={20}
              name="affectedPeople"
              required
              rows={6}
            />
            <FieldError
              id={errorId("affectedPeople")}
              message={state.fieldErrors.affectedPeople}
            />
          </div>

          <div className="form-field">
            <label htmlFor="context">Context and constraints</label>
            <textarea
              aria-describedby={invalid("context") ? errorId("context") : undefined}
              aria-invalid={invalid("context")}
              defaultValue={state.values.context}
              id="context"
              maxLength={3000}
              minLength={20}
              name="context"
              required
              rows={10}
            />
            <FieldError id={errorId("context")} message={state.fieldErrors.context} />
          </div>
        </div>
      </section>

      <section className={styles.formSection} aria-labelledby="problem-evidence-title">
        <div>
          <p className="section-kicker">Evidence before momentum</p>
          <h2 id="problem-evidence-title">Show what is known already</h2>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="evidence">Evidence or observations</label>
            <textarea
              aria-describedby={`evidence-help${invalid("evidence") ? ` ${errorId("evidence")}` : ""}`}
              aria-invalid={invalid("evidence")}
              defaultValue={state.values.evidence}
              id="evidence"
              maxLength={3000}
              name="evidence"
              rows={8}
            />
            <p className="field-help" id="evidence-help">
              Plain text only for this checkpoint. Do not paste private data or unsafe links.
            </p>
            <FieldError id={errorId("evidence")} message={state.fieldErrors.evidence} />
          </div>

          <div className="form-field">
            <label htmlFor="existingAlternatives">Existing alternatives</label>
            <textarea
              aria-describedby={
                invalid("existingAlternatives") ? errorId("existingAlternatives") : undefined
              }
              aria-invalid={invalid("existingAlternatives")}
              defaultValue={state.values.existingAlternatives}
              id="existingAlternatives"
              maxLength={3000}
              name="existingAlternatives"
              rows={8}
            />
            <FieldError
              id={errorId("existingAlternatives")}
              message={state.fieldErrors.existingAlternatives}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="platforms">Platforms or environments</label>
            <textarea
              defaultValue={state.values.platforms}
              id="platforms"
              name="platforms"
              placeholder="Linux, Android, low-bandwidth web"
              rows={4}
            />
            <p className="field-help">Separate up to 12 items with commas or new lines.</p>
          </div>

          <div className="form-field">
            <label htmlFor="tags">Useful public tags</label>
            <textarea
              defaultValue={state.values.tags}
              id="tags"
              name="tags"
              placeholder="creative tools, accessibility, public data"
              rows={4}
            />
            <p className="field-help">Separate up to 20 items with commas or new lines.</p>
          </div>
        </div>
      </section>

      {hasExistingProblem ? (
        <section className={styles.formSection} aria-labelledby="revision-summary-title">
          <div className="form-field">
            <label htmlFor="changeSummary" id="revision-summary-title">
              Revision summary
            </label>
            <input
              aria-describedby={`changeSummary-help${invalid("changeSummary") ? ` ${errorId("changeSummary")}` : ""}`}
              aria-invalid={invalid("changeSummary")}
              defaultValue={state.values.changeSummary}
              id="changeSummary"
              maxLength={500}
              minLength={5}
              name="changeSummary"
              required
            />
            <p className="field-help" id="changeSummary-help">
              Explain what meaning changed. This becomes part of the revision history.
            </p>
            <FieldError
              id={errorId("changeSummary")}
              message={state.fieldErrors.changeSummary}
            />
          </div>
        </section>
      ) : null}

      <aside className={styles.duplicateGuidance} aria-labelledby="duplicate-guidance-title">
        <h2 id="duplicate-guidance-title">Check before publishing</h2>
        <p>
          Search the public directory for similar needs and existing alternatives. Similar Problems
          are guidance, not an automatic rejection; a genuinely distinct context can still be
          published.
        </p>
        <a className="text-link" href={`/problems?q=${encodeURIComponent(state.values.title)}`}>
          Search for related Problems
          <span aria-hidden="true">↗</span>
        </a>
      </aside>

      <div className="form-actions">
        {state.currentStatus === null || state.currentStatus === "draft" ? (
          <>
            <IntentButton intent="save" label="Save private draft" tone="secondary" />
            <IntentButton intent="publish" label="Publish Problem" />
            {hasExistingProblem ? (
              <IntentButton intent="archive" label="Archive draft" tone="danger" />
            ) : null}
          </>
        ) : null}
        {state.currentStatus === "published" ? (
          <>
            <IntentButton intent="save" label="Save public revision" />
            <IntentButton intent="close" label="Mark need closed" tone="secondary" />
            <IntentButton intent="archive" label="Archive Problem" tone="danger" />
          </>
        ) : null}
        {state.currentStatus === "closed" ? (
          <>
            <IntentButton intent="reopen" label="Reopen Problem" />
            <IntentButton intent="archive" label="Archive Problem" tone="danger" />
          </>
        ) : null}
        {state.currentStatus === "archived" ? (
          <p className="privacy-note">
            Archived Problems remain historical records and cannot be silently reopened in this
            checkpoint.
          </p>
        ) : null}
        <a className="button button-secondary" href="/problems">
          Return to directory
        </a>
      </div>
    </form>
  );
}

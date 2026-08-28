import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { createSignInPath } from "@/lib/auth/return-path";

import { ProblemForm } from "../problem-form";
import type { ProblemFormState } from "../problem-form-state";
import styles from "../problems.module.css";

export const metadata: Metadata = {
  title: "Publish a Problem",
  description: "Describe an unmet need before choosing or building one solution.",
};

const initialState: ProblemFormState = {
  currentStatus: null,
  fieldErrors: {},
  message: null,
  problemId: null,
  status: "idle",
  values: {
    affectedPeople: "",
    changeSummary: "",
    context: "",
    evidence: "",
    existingAlternatives: "",
    platforms: "",
    slug: "",
    summary: "",
    tags: "",
    title: "",
  },
};

export default async function NewProblemPage() {
  const account = await getCurrentAccountContext();

  if (!account) {
    redirect(createSignInPath("/problems/new", "problem"));
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className={`shell ${styles.editorPage}`} tabIndex={-1}>
        <header className={styles.editorHeader}>
          <p className="eyebrow">Problem first</p>
          <h1>Publish an unmet need</h1>
          <p className={styles.lead}>
            Start with the people, context, evidence, and alternatives. A Project and repository can
            come later, and more than one Project may pursue the same Problem.
          </p>
        </header>

        {account.status !== "active" ? (
          <section className={styles.emptyState} aria-labelledby="inactive-problem-author-title">
            <h2 id="inactive-problem-author-title">This account cannot publish right now</h2>
            <p>
              Suspended and deletion-requested accounts keep attribution but cannot perform
              protected writes. Public Problems remain readable.
            </p>
            <a className="button button-secondary" href="/problems">
              Browse public Problems
            </a>
          </section>
        ) : (
          <ProblemForm initialState={initialState} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}

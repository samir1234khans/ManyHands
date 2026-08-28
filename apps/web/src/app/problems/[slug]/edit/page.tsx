import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { createSignInPath } from "@/lib/auth/return-path";
import { getOwnedProblemBySlug, problemRowToFormValues } from "@/lib/problems";

import { ProblemForm } from "../../problem-form";
import type { ProblemFormState } from "../../problem-form-state";
import styles from "../../problems.module.css";

export const metadata: Metadata = {
  title: "Edit Problem",
  description: "Revise a Problem through an explicit, inspectable history.",
};

export default async function EditProblemPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}>) {
  const { slug } = await params;
  const parameters = await searchParams;
  const account = await getCurrentAccountContext();

  if (!account) {
    redirect(createSignInPath(`/problems/${slug}/edit`, "problem_edit"));
  }

  const problem = await getOwnedProblemBySlug(account.supabase, account.accountId, slug);
  if (!problem) {
    notFound();
  }

  const initialState: ProblemFormState = {
    currentStatus: problem.status,
    fieldErrors: {},
    message: parameters.saved ? "The latest revision was saved." : null,
    problemId: problem.id,
    status: parameters.saved ? "success" : "idle",
    values: problemRowToFormValues(problem),
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className={`shell ${styles.editorPage}`} tabIndex={-1}>
        <header className={styles.editorHeader}>
          <div className={styles.metaRow}>
            <span className={styles.statusPill} data-status={problem.status}>
              {problem.status}
            </span>
            <span>Revision {problem.revision_number}</span>
          </div>
          <p className="eyebrow">Meaning changes stay visible</p>
          <h1>Edit your Problem</h1>
          <p className={styles.lead}>
            Update the definition, evidence, or lifecycle state. Published URLs remain stable and
            every save creates an immutable revision summary.
          </p>
          <div className={styles.actionRow}>
            {problem.status !== "draft" ? (
              <a className="button button-secondary" href={`/problems/${problem.slug}`}>
                View public Problem
              </a>
            ) : null}
            <a className="button button-secondary" href="/problems">
              Browse directory
            </a>
          </div>
        </header>

        {account.status !== "active" ? (
          <section className={styles.emptyState} aria-labelledby="inactive-problem-editor-title">
            <h2 id="inactive-problem-editor-title">This account cannot revise Problems</h2>
            <p>
              The current lifecycle state preserves attribution but blocks protected writes. The
              existing Problem definition remains unchanged.
            </p>
          </section>
        ) : (
          <ProblemForm initialState={initialState} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listPublicProblems } from "@/lib/problems";

import { ProblemCard } from "./problem-card";
import styles from "./problems.module.css";

export const metadata: Metadata = {
  title: "Problems",
  description:
    "Browse unmet needs before one repository or implementation becomes the default answer.",
};

export default async function ProblemsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ interaction?: string; q?: string }>;
}>) {
  const parameters = await searchParams;
  const result = await listPublicProblems(parameters.q ?? "");

  return (
    <>
      <SiteHeader />
      <main id="main-content" className={`shell ${styles.directoryPage}`} tabIndex={-1}>
        <header className={styles.directoryHeader}>
          <p className="eyebrow">Begin before the repository</p>
          <h1>Problems worth solving</h1>
          <p className={styles.lead}>
            A Problem describes an unmet need, the people affected, and the evidence already known.
            More than one Project can eventually pursue the same Problem.
          </p>
        </header>

        {parameters.interaction ? (
          <div className={styles.notice} role="status">
            <p>
              That interaction could not be completed from the current session or Problem state.
              Public reading remains available.
            </p>
          </div>
        ) : null}

        <section className={styles.directoryTools} aria-label="Problem directory tools">
          <form className={styles.searchForm} method="get">
            <div className={styles.searchField}>
              <label htmlFor="problem-search">Search public Problems</label>
              <input
                defaultValue={result.query}
                id="problem-search"
                maxLength={120}
                name="q"
                placeholder="Try accessibility, Linux, public data…"
                type="search"
              />
            </div>
            <button className="button button-secondary" type="submit">
              Search
            </button>
          </form>
          <a className="button button-primary" href="/problems/new">
            Publish a Problem
          </a>
        </section>

        {!result.configured ? (
          <section className={styles.degradedState} aria-labelledby="problem-setup-title">
            <p className="section-kicker">Public shell available</p>
            <h2 id="problem-setup-title">The Problem directory is not connected here yet</h2>
            <p>
              This environment has no public Supabase configuration. The route, explanation, and
              navigation remain usable; published Problems appear after a local or hosted database
              is configured and migrated.
            </p>
            <a
              className="button button-secondary"
              href="/auth/sign-in?reason=problem&next=/problems/new"
            >
              Read the sign-in explanation
            </a>
          </section>
        ) : result.problems.length === 0 ? (
          <section className={styles.emptyState} aria-labelledby="problem-empty-title">
            <p className="section-kicker">No false momentum</p>
            <h2 id="problem-empty-title">
              {result.query ? "No public Problems match that search" : "No public Problems yet"}
            </h2>
            <p>
              {result.query
                ? "Try a broader need, platform, or affected group. Search guidance never blocks a genuinely distinct Problem."
                : "The directory begins empty rather than inventing activity. A contributor can publish the first evidence-backed unmet need."}
            </p>
            <div className={styles.actionRow}>
              {result.query ? (
                <a className="button button-secondary" href="/problems">
                  Clear search
                </a>
              ) : null}
              <a className="button button-primary" href="/problems/new">
                Publish a Problem
              </a>
            </div>
          </section>
        ) : (
          <section aria-labelledby="problem-list-title">
            <div className="section-heading">
              <p className="section-kicker">Problem first</p>
              <h2 id="problem-list-title">
                {result.problems.length} public{" "}
                {result.problems.length === 1 ? "Problem" : "Problems"}
              </h2>
              {result.query ? <p>Filtered by “{result.query}”.</p> : null}
            </div>
            <div className={styles.problemGrid}>
              {result.problems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          </section>
        )}

        <noscript>
          <p className="noscript-note">
            Public Problem content is server-rendered. Search uses a normal form submission and does
            not require JavaScript.
          </p>
        </noscript>
      </main>
      <SiteFooter />
    </>
  );
}

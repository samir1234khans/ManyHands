import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { createSignInPath } from "@/lib/auth/return-path";
import { getPublicSupabaseConfig } from "@/lib/env";
import {
  getOwnedProblemBySlug,
  getProblemInteractionState,
  getPublicProblemBySlug,
  listPublicProblemRevisions,
} from "@/lib/problems";

import {
  toggleProblemFollowAction,
  toggleProblemNeedSignalAction,
} from "../actions";
import styles from "../problems.module.css";

export const metadata: Metadata = {
  title: "Problem",
  description: "Understand an unmet need, its context, evidence, demand, and revision history.",
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(value));
}

function resultMessage(parameters: {
  follow?: string;
  interaction?: string;
  need?: string;
  saved?: string;
}): string | null {
  if (parameters.saved) {
    return "The latest Problem definition is saved and visible according to its current status.";
  }
  if (parameters.need === "added") {
    return "Your private need signal was added. Only the aggregate count is public.";
  }
  if (parameters.need === "removed") {
    return "Your need signal was removed. The audit event remains private for abuse analysis.";
  }
  if (parameters.follow === "added") {
    return "You are following this Problem. Notification delivery is not part of this checkpoint.";
  }
  if (parameters.follow === "removed") {
    return "You are no longer following this Problem.";
  }
  if (parameters.interaction) {
    return "That interaction could not be completed safely. The public Problem remains readable.";
  }
  return null;
}

export default async function ProblemDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ follow?: string; interaction?: string; need?: string; saved?: string }>;
}>) {
  const { slug } = await params;
  const parameters = await searchParams;
  const configured = Boolean(getPublicSupabaseConfig());
  const problem = await getPublicProblemBySlug(slug);

  if (configured && !problem) {
    notFound();
  }

  if (!problem) {
    return (
      <>
        <SiteHeader />
        <main id="main-content" className={`shell ${styles.detailPage}`} tabIndex={-1}>
          <section className={styles.degradedState} aria-labelledby="problem-detail-setup-title">
            <p className="section-kicker">Public shell available</p>
            <h1 id="problem-detail-setup-title">Problem data is not connected in this environment</h1>
            <p>
              The requested route cannot resolve a public record without a configured database. No
              private configuration value is exposed.
            </p>
            <a className="button button-secondary" href="/problems">
              Return to Problems
            </a>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  const [account, revisions] = await Promise.all([
    getCurrentAccountContext(),
    listPublicProblemRevisions(problem.id),
  ]);
  const ownedProblem = account
    ? await getOwnedProblemBySlug(account.supabase, account.accountId, problem.slug)
    : null;
  const interactionState =
    account?.status === "active" && problem.status === "published"
      ? await getProblemInteractionState(account.supabase, problem.id)
      : null;
  const message = resultMessage(parameters);
  const authorName = problem.authorDisplayName ?? "A ManyHands contributor";
  const signInPath = createSignInPath(`/problems/${problem.slug}`, "problem_interaction");

  return (
    <>
      <SiteHeader />
      <main id="main-content" className={`shell ${styles.detailPage}`} tabIndex={-1}>
        <header className={styles.detailHeader}>
          <div className={styles.metaRow}>
            <span className={styles.statusPill} data-status={problem.status}>
              {problem.status}
            </span>
            <span>Revision {problem.revisionNumber}</span>
            <span>Updated {formatDate(problem.lastMeaningfulUpdateAt)}</span>
          </div>
          <p className="eyebrow">An unmet need, not a prescribed implementation</p>
          <h1>{problem.title}</h1>
          <p className={styles.lead}>{problem.summary}</p>
          <div className={styles.actionRow}>
            {ownedProblem ? (
              <a className="button button-primary" href={`/problems/${problem.slug}/edit`}>
                Edit your Problem
              </a>
            ) : null}
            <a className="button button-secondary" href="/problems">
              Browse all Problems
            </a>
          </div>
        </header>

        {message ? (
          <div className={styles.notice} role="status">
            <p>{message}</p>
          </div>
        ) : null}

        <div className={styles.detailLayout}>
          <div className={styles.detailMain}>
            <article className={styles.detailCard}>
              <section className={styles.detailSection} aria-labelledby="affected-title">
                <h2 id="affected-title">Who is affected</h2>
                <p className={styles.plainText}>{problem.affectedPeople}</p>
              </section>

              <section className={styles.detailSection} aria-labelledby="context-title">
                <h2 id="context-title">Context and constraints</h2>
                <p className={styles.plainText}>{problem.context}</p>
              </section>

              <section className={styles.detailSection} aria-labelledby="evidence-title">
                <h2 id="evidence-title">Evidence and observations</h2>
                <p className={styles.plainText}>
                  {problem.evidence ?? "No supporting evidence has been published yet."}
                </p>
              </section>

              <section className={styles.detailSection} aria-labelledby="alternatives-title">
                <h2 id="alternatives-title">Existing alternatives</h2>
                <p className={styles.plainText}>
                  {problem.existingAlternatives ??
                    "No existing alternatives have been documented yet. That is an evidence gap, not proof that none exist."}
                </p>
              </section>

              {problem.platforms.length > 0 || problem.tags.length > 0 ? (
                <section className={styles.detailSection} aria-labelledby="classification-title">
                  <h2 id="classification-title">Platforms and tags</h2>
                  <ul className={styles.tagList}>
                    {[...problem.platforms, ...problem.tags].map((item) => (
                      <li className={styles.tag} key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </article>

            <section className={styles.revisionCard} aria-labelledby="revisions-title">
              <p className="section-kicker">Meaning stays inspectable</p>
              <h2 id="revisions-title">Public revision history</h2>
              {revisions.length === 0 ? (
                <p>No public revision snapshots are available yet.</p>
              ) : (
                <ol className={styles.revisionList}>
                  {revisions.map((revision) => (
                    <li key={revision.id}>
                      <p>
                        <strong>Revision {revision.revisionNumber}:</strong> {revision.changeSummary}
                      </p>
                      <p className={styles.revisionMeta}>
                        {revision.status} · {formatDate(revision.createdAt)}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>

          <aside className={styles.detailSidebar}>
            <section className={styles.interactionCard} aria-labelledby="demand-title">
              <p className="section-kicker">Demand without a popularity contest</p>
              <h2 id="demand-title">Do you need this?</h2>
              <div className={styles.metricRow} aria-label="Public aggregate interest">
                <span className={styles.metric}>{problem.needSignalCount} need signals</span>
                <span className={styles.metric}>{problem.followCount} followers</span>
              </div>
              <p>
                A need signal is reversible and does not grant governance power. Optional context is
                private; only the aggregate count is public.
              </p>

              {problem.status !== "published" ? (
                <p className="privacy-note">
                  Interactions are closed because this Problem is {problem.status}.
                </p>
              ) : account?.status === "active" ? (
                <>
                  <form action={toggleProblemNeedSignalAction}>
                    <input name="slug" type="hidden" value={problem.slug} />
                    {!interactionState?.hasNeedSignal ? (
                      <>
                        <label htmlFor="privateContext">Optional private context</label>
                        <textarea
                          defaultValue={interactionState?.privateSignalContext ?? ""}
                          id="privateContext"
                          maxLength={500}
                          name="privateContext"
                          placeholder="Why does this need matter in your context?"
                        />
                      </>
                    ) : null}
                    <button className="button button-primary" type="submit">
                      {interactionState?.hasNeedSignal ? "Remove my need signal" : "I need this"}
                    </button>
                  </form>

                  <form action={toggleProblemFollowAction}>
                    <input name="slug" type="hidden" value={problem.slug} />
                    <button className="button button-secondary" type="submit">
                      {interactionState?.isFollowing ? "Stop following" : "Follow updates"}
                    </button>
                  </form>
                </>
              ) : account ? (
                <p className="privacy-note">
                  This account cannot perform protected writes in its current lifecycle state.
                </p>
              ) : (
                <a className="button button-primary" href={signInPath}>
                  Sign in to signal or follow
                </a>
              )}
            </section>

            <section className={styles.interactionCard} aria-labelledby="publisher-title">
              <p className="section-kicker">Published by choice</p>
              <h2 id="publisher-title">Problem publisher</h2>
              <p>
                {problem.authorHandle ? (
                  <a href={`/people/${problem.authorHandle}`}>{authorName}</a>
                ) : (
                  authorName
                )}
              </p>
              <p className="privacy-note">
                Private profile details and the identities behind need signals are not exposed here.
              </p>
            </section>

            <section className={styles.interactionCard} aria-labelledby="freshness-title">
              <p className="section-kicker">Freshness is evidence</p>
              <h2 id="freshness-title">Current record</h2>
              <dl>
                <div>
                  <dt>Published</dt>
                  <dd>{formatDate(problem.publishedAt)}</dd>
                </div>
                <div>
                  <dt>Last meaningful update</dt>
                  <dd>{formatDate(problem.lastMeaningfulUpdateAt)}</dd>
                </div>
                <div>
                  <dt>Revision</dt>
                  <dd>{problem.revisionNumber}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

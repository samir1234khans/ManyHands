import type { PublicProblem } from "@/lib/problems";

import styles from "./problems.module.css";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ProblemCard({ problem }: Readonly<{ problem: PublicProblem }>) {
  const authorName = problem.authorDisplayName ?? "A ManyHands contributor";

  return (
    <article className={styles.problemCard}>
      <div className={styles.metaRow}>
        <span className={styles.statusPill} data-status={problem.status}>
          {problem.status}
        </span>
        <span>Updated {formatDate(problem.lastMeaningfulUpdateAt)}</span>
      </div>

      <h2>
        <a href={`/problems/${problem.slug}`}>{problem.title}</a>
      </h2>
      <p className={styles.cardSummary}>{problem.summary}</p>

      <div className={styles.metricRow} aria-label="Problem activity summary">
        <span className={styles.metric}>{problem.needSignalCount} need signals</span>
        <span className={styles.metric}>{problem.followCount} followers</span>
        <span className={styles.metric}>{problem.revisionNumber} revisions</span>
      </div>

      {problem.tags.length > 0 ? (
        <ul className={styles.tagList} aria-label="Problem tags">
          {problem.tags.slice(0, 6).map((tag) => (
            <li className={styles.tag} key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <p className={styles.metaRow}>
        {problem.authorHandle ? (
          <>
            Published by <a href={`/people/${problem.authorHandle}`}>{authorName}</a>
          </>
        ) : (
          <>Published by {authorName}</>
        )}
      </p>
    </article>
  );
}

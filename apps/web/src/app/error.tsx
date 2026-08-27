"use client";

export default function ErrorState({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="state-page" id="main-content">
      <div className="state-card" role="alert">
        <p className="section-kicker">Something went wrong</p>
        <h1>We could not load this page safely.</h1>
        <p>
          No private error details are shown here. You can try the request again or return to the
          public homepage.
        </p>
        <div className="state-actions">
          <button className="button button-primary" type="button" onClick={reset}>
            Try again
          </button>
          <a className="button button-secondary" href="/">
            Return home
          </a>
        </div>
      </div>
    </main>
  );
}

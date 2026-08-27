export default function Loading() {
  return (
    <main className="state-page" id="main-content">
      <div className="state-card" role="status" aria-live="polite">
        <p className="section-kicker">ManyHands</p>
        <h1>Gathering the current project context…</h1>
        <p>This should only take a moment.</p>
        <div className="loading-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </main>
  );
}

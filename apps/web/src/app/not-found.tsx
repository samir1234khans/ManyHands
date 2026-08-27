export default function NotFound() {
  return (
    <main className="state-page" id="main-content">
      <div className="state-card">
        <p className="section-kicker">404 · Not found</p>
        <h1>That page wandered off.</h1>
        <p>The public roadmap and project source are still exactly where they should be.</p>
        <div className="state-actions">
          <a className="button button-primary" href="/">
            Return home
          </a>
          <a
            className="button button-secondary"
            href="https://github.com/samir1234khans/ManyHands/issues"
          >
            Browse open issues
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </main>
  );
}

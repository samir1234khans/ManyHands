import { siteConfig } from "@/lib/site-config";

const pillars = [
  {
    number: "01",
    title: "Begin with the problem",
    description:
      "Describe the unmet need, the people affected, and the evidence before one implementation becomes the default answer.",
  },
  {
    number: "02",
    title: "Let projects form openly",
    description:
      "More than one team can pursue the same problem, with visible scope, stewardship, health, and ways to contribute.",
  },
  {
    number: "03",
    title: "Keep code where it belongs",
    description:
      "GitHub remains the source for repositories, issues, pull requests, releases, and review. ManyHands makes the human context legible.",
  },
] as const;

const contributorLoop = [
  {
    title: "Name a shared problem",
    description: "Make the need understandable even to someone who never opens a repository.",
  },
  {
    title: "Form a credible project",
    description: "Publish scope, non-goals, stewardship, milestones, and honest project health.",
  },
  {
    title: "Show the next useful need",
    description:
      "Offer a bounded contribution with context, a reviewer, and an exact onboarding path.",
  },
  {
    title: "Ship through GitHub",
    description:
      "Review and merge the work there, then reflect the evidence back as understandable progress.",
  },
] as const;

const roadmapStates = [
  {
    label: "Contributor-ready repository",
    state: "Complete",
    tone: "complete",
  },
  {
    label: "Production application shell",
    state: "In progress",
    tone: "active",
  },
  {
    label: "Problem-first directory",
    state: "Next",
    tone: "next",
  },
] as const;

const contributionKinds = [
  "Engineering",
  "Product design",
  "Research",
  "Documentation",
  "Testing",
  "Accessibility",
  "Translation",
  "Community care",
] as const;

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="/" aria-label="ManyHands home">
            <span className="brand-mark" aria-hidden="true">
              M
            </span>
            <span>ManyHands</span>
          </a>

          <nav className="primary-nav" aria-label="Primary navigation">
            <a href="#principles">Principles</a>
            <a href="#how-it-works">How it works</a>
            <a href="#contribute">Contribute</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy-block">
            <p className="eyebrow">
              <span className="status-mark" aria-hidden="true" />
              Pre-alpha · building in public
            </p>
            <h1 id="hero-title">
              Big problems.
              <span>Built together.</span>
            </h1>
            <p className="hero-copy">
              ManyHands helps people gather around a shared need, form an open-source project,
              understand its real progress, and find one clear way to help.
            </p>
            <p className="product-boundary">{siteConfig.boundary}</p>

            <div className="hero-actions" aria-label="Project actions">
              <a className="button button-primary" href={siteConfig.roadmapUrl}>
                View public roadmap
                <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-secondary" href="#how-it-works">
                See the contributor loop
              </a>
            </div>

            <noscript>
              <p className="noscript-note">
                The public reading experience remains available without JavaScript.
              </p>
            </noscript>
          </div>

          <aside className="hero-panel" aria-labelledby="hero-panel-title">
            <p className="panel-kicker">The missing layer</p>
            <h2 id="hero-panel-title">Purpose, people, progress, and a doorway in.</h2>
            <ul className="check-list">
              <li>Problems can exist before repositories.</li>
              <li>Multiple projects can pursue one need.</li>
              <li>Progress is backed by visible evidence.</li>
              <li>Inactive work can ask for a new steward.</li>
            </ul>
          </aside>
        </section>

        <section className="section shell" id="principles" aria-labelledby="principles-title">
          <div className="section-heading">
            <p className="section-kicker">Problem first</p>
            <h2 id="principles-title">A coordination layer, not another code host.</h2>
            <p>
              The first release stays focused on the path from an unmet need to a useful, reviewable
              contribution.
            </p>
          </div>

          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article className="pillar-card" key={pillar.number}>
                <p className="card-number" aria-hidden="true">
                  {pillar.number}
                </p>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section section-contrast"
          id="how-it-works"
          aria-labelledby="loop-title"
        >
          <div className="shell contrast-grid">
            <div className="section-heading section-heading-compact">
              <p className="section-kicker">The contributor loop</p>
              <h2 id="loop-title">From “someone should build this” to “here is how I can help.”</h2>
              <p>
                Each step should reduce ambiguity. Nobody should need a private call just to find
                the right issue.
              </p>
            </div>

            <ol className="loop-list">
              {contributorLoop.map((step) => (
                <li key={step.title}>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section shell roadmap-section" aria-labelledby="roadmap-title">
          <div className="roadmap-copy">
            <p className="section-kicker">No vanity percentage</p>
            <h2 id="roadmap-title">Progress should explain itself.</h2>
            <p>
              ManyHands will derive progress from outcomes and evidence—not a hopeful number typed
              into a dashboard.
            </p>
            <a className="text-link" href={siteConfig.roadmapUrl}>
              Inspect the roadmap and acceptance criteria
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <ul className="roadmap-list" aria-label="Current roadmap state">
            {roadmapStates.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong className={`state state-${item.tone}`}>{item.state}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="section shell contribute-section"
          id="contribute"
          aria-labelledby="contribute-title"
        >
          <div className="contribute-card">
            <div>
              <p className="section-kicker">ManyHands builds ManyHands</p>
              <h2 id="contribute-title">Every useful skill should have a doorway.</h2>
              <p>
                Code matters, but so do clear writing, careful research, accessible design, testing,
                translation, moderation, and patient project stewardship.
              </p>
            </div>

            <ul className="skill-cloud" aria-label="Contribution areas">
              {contributionKinds.map((kind) => (
                <li key={kind}>{kind}</li>
              ))}
            </ul>

            <div className="contribute-actions">
              <a className="button button-primary" href={siteConfig.contributingUrl}>
                Read the contribution guide
                <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-secondary" href={siteConfig.issuesUrl}>
                Browse open issues
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>ManyHands is free software. Fork it, improve it, and send the homework back.</p>
          <nav aria-label="Project resources">
            <a href={siteConfig.repositoryUrl}>View source</a>
            <a href={siteConfig.licenseUrl}>{siteConfig.licenseName}</a>
            <a href={siteConfig.roadmapUrl}>Roadmap</a>
          </nav>
        </div>
      </footer>
    </>
  );
}

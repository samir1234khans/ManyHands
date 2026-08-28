import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <p>ManyHands is free software. Fork it, improve it, and send the homework back.</p>
        <nav aria-label="Project resources">
          <a href="/problems">Problems</a>
          <a href="/people">People</a>
          <a href="/accessibility">Accessibility</a>
          <a href={siteConfig.repositoryUrl}>View source</a>
          <a href={siteConfig.licenseUrl}>{siteConfig.licenseName}</a>
          <a href={siteConfig.roadmapUrl}>Roadmap</a>
        </nav>
      </div>
    </footer>
  );
}

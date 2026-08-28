import type { Metadata } from "next";

import { ProfileCard } from "@/components/profile-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listPublicProfiles } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Contributors",
  description: "Browse public ManyHands contributor profiles across code and non-code roles.",
};

export default async function PeoplePage() {
  const result = await listPublicProfiles();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell directory-page" tabIndex={-1}>
        <header className="content-hero">
          <p className="eyebrow">People who can build together</p>
          <h1>Public contributors</h1>
          <p className="content-lead">
            Engineering is one doorway. Research, design, documentation, testing, accessibility,
            translation, moderation, and stewardship belong here too.
          </p>
        </header>

        {!result.configured ? (
          <section className="empty-state" aria-labelledby="directory-setup-title">
            <h2 id="directory-setup-title">The public directory is not connected in this environment</h2>
            <p>
              The application shell remains public and usable. Contributor data appears after the
              local or hosted Supabase environment is configured.
            </p>
            <a className="button button-secondary" href="/auth/sign-in?reason=profile&next=/profile">
              Read the sign-in explanation
            </a>
          </section>
        ) : result.profiles.length === 0 ? (
          <section className="empty-state" aria-labelledby="empty-directory-title">
            <h2 id="empty-directory-title">No public profiles yet</h2>
            <p>
              Profiles begin private. A contributor appears here only after choosing public
              visibility.
            </p>
            <a className="button button-primary" href="/auth/sign-in?reason=profile&next=/profile">
              Create your contributor profile
            </a>
          </section>
        ) : (
          <section aria-labelledby="profile-list-title">
            <div className="section-heading">
              <p className="section-kicker">Visible by choice</p>
              <h2 id="profile-list-title">{result.profiles.length} public profiles</h2>
            </div>
            <div className="profile-grid">
              {result.profiles.map((profile) => (
                <ProfileCard key={profile.accountId} profile={profile} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

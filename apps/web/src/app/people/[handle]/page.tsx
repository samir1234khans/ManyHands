import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublicProfileByHandle } from "@/lib/profiles";

const availabilityLabels = {
  limited: "Limited availability",
  open: "Open to contribute",
  unavailable: "Not currently available",
} as const;

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ handle: string }> }>): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getPublicProfileByHandle(handle);

  return profile
    ? {
        title: profile.displayName,
        description: profile.biography ?? `Public ManyHands contributor profile for @${profile.handle}.`,
      }
    : { title: "Contributor not found" };
}

export default async function PublicProfilePage({
  params,
}: Readonly<{ params: Promise<{ handle: string }> }>) {
  const { handle } = await params;
  const profile = await getPublicProfileByHandle(handle);

  if (!profile) {
    notFound();
  }

  const contributionTags = [...profile.skills, ...profile.nonCodeRoles];

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell profile-page" tabIndex={-1}>
        <article className="public-profile">
          <header className="public-profile-header">
            <p className="eyebrow">Public contributor profile</p>
            <h1>{profile.displayName}</h1>
            <p className="profile-handle">@{profile.handle}</p>
            <p className={`availability availability-${profile.availability}`}>
              {availabilityLabels[profile.availability]}
            </p>
          </header>

          <section aria-labelledby="about-title">
            <h2 id="about-title">About</h2>
            <p>{profile.biography || "This contributor has not added a public biography yet."}</p>
          </section>

          {contributionTags.length > 0 ? (
            <section aria-labelledby="contribution-areas-title">
              <h2 id="contribution-areas-title">Contribution areas</h2>
              <ul className="profile-tags">
                {contributionTags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {profile.interests.length > 0 ? (
            <section aria-labelledby="interests-title">
              <h2 id="interests-title">Problems and domains of interest</h2>
              <ul className="profile-tags">
                {profile.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="profile-facts" aria-labelledby="context-title">
            <h2 id="context-title">Contribution context</h2>
            <dl>
              <div>
                <dt>Languages</dt>
                <dd>{profile.languages.length > 0 ? profile.languages.join(", ") : "Not specified"}</dd>
              </div>
              <div>
                <dt>Timezone</dt>
                <dd>{profile.timezone ?? "Not specified"}</dd>
              </div>
            </dl>
          </section>

          {profile.publicLinks.length > 0 ? (
            <section aria-labelledby="links-title">
              <h2 id="links-title">Public links</h2>
              <ul className="public-link-list">
                {profile.publicLinks.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} rel="me noreferrer">
                      {link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="state-actions">
            <a className="button button-secondary" href="/people">
              Back to public contributors
            </a>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

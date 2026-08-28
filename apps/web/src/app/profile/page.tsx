import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/auth/actions";
import { ProfileForm } from "./profile-form";
import type { ProfileFormValues } from "./profile-form-state";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAccountContext } from "@/lib/auth/current-account";
import {
  profileLinksToText,
  profileListToText,
} from "@/lib/auth/profile-input";
import { createSignInPath } from "@/lib/auth/return-path";
import { getOwnContributorProfile } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Your contributor profile",
  description: "Manage privacy-safe ManyHands contributor context and visibility.",
};

export default async function ProfilePage() {
  const context = await getCurrentAccountContext();

  if (!context) {
    redirect(createSignInPath("/profile", "profile"));
  }

  const profile = await getOwnContributorProfile(context.supabase, context.accountId);

  if (!profile) {
    return (
      <>
        <SiteHeader />
        <main id="main-content" className="shell identity-page" tabIndex={-1}>
          <section className="state-card">
            <p className="eyebrow">Profile unavailable</p>
            <h1>Your profile could not be loaded safely</h1>
            <p>
              The account exists, but its profile read model is unavailable. No replacement profile
              was created automatically.
            </p>
            <div className="state-actions">
              <a className="button button-secondary" href="/settings">
                Review account settings
              </a>
            </div>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (context.status !== "active") {
    const suspended = context.status === "suspended";
    return (
      <>
        <SiteHeader />
        <main id="main-content" className="shell identity-page" tabIndex={-1}>
          <section className="state-card">
            <p className="eyebrow">Account state</p>
            <h1>{suspended ? "Profile editing is suspended" : "Account deletion is pending"}</h1>
            <p>
              {suspended
                ? "Your existing attribution remains, but protected writes are disabled while the account is suspended."
                : "Profile writes are locked while the account deletion process completes or is safely compensated."}
            </p>
            <div className="state-actions">
              <a className="button button-secondary" href="/settings">
                View account status
              </a>
              <form action={signOutAction}>
                <button className="button button-secondary" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  const initialValues: ProfileFormValues = {
    availability: profile.availability,
    avatarUrl: profile.avatar_url ?? "",
    biography: profile.biography ?? "",
    displayName: profile.display_name,
    handle: profile.handle,
    interests: profileListToText(profile.interests),
    languages: profileListToText(profile.languages),
    nonCodeRoles: profileListToText(profile.non_code_roles),
    publicLinks: profileLinksToText(profile.public_links),
    skills: profileListToText(profile.skills),
    timezone: profile.timezone ?? "",
    visibility: profile.visibility,
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell profile-editor-page" tabIndex={-1}>
        <header className="content-hero">
          <p className="eyebrow">Contributor context, controlled by you</p>
          <h1>Your profile</h1>
          <p className="content-lead">
            Tell projects how you may want to help across code and non-code work. Your profile stays
            private unless you explicitly choose members or public visibility.
          </p>
        </header>
        <ProfileForm initialValues={initialValues} />
      </main>
      <SiteFooter />
    </>
  );
}

import { signOutAction } from "@/app/auth/actions";
import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { siteConfig } from "@/lib/site-config";

export async function SiteHeader() {
  const account = await getCurrentAccountContext();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="/" aria-label="ManyHands home">
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span>ManyHands</span>
        </a>

        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="/people">People</a>
          <a href={siteConfig.roadmapUrl}>Roadmap</a>
          {account ? (
            <>
              <a href="/profile">Profile</a>
              <a href="/settings">Settings</a>
              <form action={signOutAction}>
                <button className="nav-action" type="submit">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <a className="nav-action-link" href="/auth/sign-in">
              Sign in
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

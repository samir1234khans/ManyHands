import type { PublicContributorProfile } from "@/lib/profiles";

const availabilityLabels = {
  limited: "Limited availability",
  open: "Open to contribute",
  unavailable: "Not currently available",
} as const;

function initials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("en") ?? "")
    .join("") || "MH";
}

export function ProfileCard({ profile }: Readonly<{ profile: PublicContributorProfile }>) {
  const tags = [...profile.skills, ...profile.nonCodeRoles].slice(0, 5);

  return (
    <article className="profile-card">
      <div className="profile-card-heading">
        <span className="profile-avatar" aria-hidden="true">
          {initials(profile.displayName)}
        </span>
        <div>
          <h2>
            <a href={`/people/${profile.handle}`}>{profile.displayName}</a>
          </h2>
          <p className="profile-handle">@{profile.handle}</p>
        </div>
      </div>

      <p className={`availability availability-${profile.availability}`}>
        {availabilityLabels[profile.availability]}
      </p>

      <p className="profile-biography">
        {profile.biography || "This contributor has not added a public biography yet."}
      </p>

      {tags.length > 0 ? (
        <ul className="profile-tags" aria-label="Skills and contribution roles">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}

      <a className="text-link" href={`/people/${profile.handle}`}>
        View contributor profile
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

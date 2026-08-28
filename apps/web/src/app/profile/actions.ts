"use server";

import type { Json } from "@manyhands/data";
import { decideAuthorization } from "@manyhands/domain";
import { revalidatePath } from "next/cache";

import type { ProfileFormState, ProfileFormValues } from "./profile-form-state";
import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { logIdentityEvent } from "@/lib/auth/events";
import { validateProfileInput } from "@/lib/auth/profile-input";
import { getOwnContributorProfile } from "@/lib/profiles";

function readValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function captureValues(formData: FormData): ProfileFormValues {
  return {
    availability: readValue(formData, "availability"),
    avatarUrl: readValue(formData, "avatarUrl"),
    biography: readValue(formData, "biography"),
    displayName: readValue(formData, "displayName"),
    handle: readValue(formData, "handle"),
    interests: readValue(formData, "interests"),
    languages: readValue(formData, "languages"),
    nonCodeRoles: readValue(formData, "nonCodeRoles"),
    publicLinks: readValue(formData, "publicLinks"),
    skills: readValue(formData, "skills"),
    timezone: readValue(formData, "timezone"),
    visibility: readValue(formData, "visibility"),
  };
}

export async function updateProfileAction(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const values = captureValues(formData);
  const context = await getCurrentAccountContext();

  if (!context) {
    return {
      fieldErrors: {},
      message: "Your session is no longer valid. Sign in again before saving this profile.",
      status: "error",
      values,
    };
  }

  const authorization = decideAuthorization(context.principal, {
    capability: "profile.update",
    resource: {
      accountId: context.accountId,
      kind: "profile",
      visibility: "private",
    },
  });

  if (!authorization.allowed) {
    logIdentityEvent({
      name: "profile_update",
      outcome: "denied",
      reason: authorization.reason,
      route: "/profile",
    });
    return {
      fieldErrors: {},
      message:
        context.status === "suspended"
          ? "This account is suspended and cannot update its profile."
          : "This account cannot update its profile in the current lifecycle state.",
      status: "error",
      values,
    };
  }

  const validation = validateProfileInput(formData);

  if (!validation.ok) {
    return {
      fieldErrors: validation.fieldErrors,
      message: "Review the highlighted fields and try again.",
      status: "error",
      values,
    };
  }

  const existingProfile = await getOwnContributorProfile(context.supabase, context.accountId);
  const { value } = validation;
  const publicLinksJson: Json = value.publicLinks.map(({ label, url }) => ({ label, url }));
  const { error } = await context.supabase
    .from("contributor_profiles")
    .update({
      availability: value.availability,
      avatar_url: value.avatarUrl,
      biography: value.biography,
      display_name: value.displayName,
      handle: value.handle,
      interests: value.interests,
      languages: value.languages,
      non_code_roles: value.nonCodeRoles,
      public_links: publicLinksJson,
      skills: value.skills,
      timezone: value.timezone,
      visibility: value.visibility,
    })
    .eq("account_id", context.accountId);

  if (error) {
    const handleConflict = error.code === "23505";
    logIdentityEvent({
      name: "profile_update",
      outcome: "failed",
      reason: handleConflict ? "handle_conflict" : "database_write",
      route: "/profile",
    });
    return {
      fieldErrors: handleConflict
        ? { handle: "That handle is already in use. Choose another one." }
        : {},
      message: handleConflict
        ? "Choose another public handle and try again."
        : "The profile could not be saved safely. Your previous profile remains unchanged.",
      status: "error",
      values,
    };
  }

  logIdentityEvent({ name: "profile_update", outcome: "completed", route: "/profile" });
  revalidatePath("/profile");
  revalidatePath("/people");
  revalidatePath(`/people/${value.handle}`);
  if (existingProfile?.handle && existingProfile.handle !== value.handle) {
    revalidatePath(`/people/${existingProfile.handle}`);
  }

  return {
    fieldErrors: {},
    message:
      value.visibility === "public"
        ? "Profile saved. It is now visible in the public contributor directory."
        : "Profile saved with your selected visibility.",
    status: "success",
    values: {
      availability: value.availability,
      avatarUrl: value.avatarUrl ?? "",
      biography: value.biography ?? "",
      displayName: value.displayName,
      handle: value.handle,
      interests: value.interests.join(", "),
      languages: value.languages.join(", "),
      nonCodeRoles: value.nonCodeRoles.join(", "),
      publicLinks: value.publicLinks.map((link) => `${link.label} | ${link.url}`).join("\n"),
      skills: value.skills.join(", "),
      timezone: value.timezone ?? "",
      visibility: value.visibility,
    },
  };
}

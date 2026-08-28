"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { updateProfileAction } from "./actions";
import type { ProfileFormState, ProfileFormValues } from "./profile-form-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button button-primary" disabled={pending} type="submit">
      {pending ? "Saving profile…" : "Save profile"}
    </button>
  );
}

function FieldError({ id, message }: Readonly<{ id: string; message: string | undefined }>) {
  return message ? (
    <p className="field-error" id={id}>
      {message}
    </p>
  ) : null;
}

export function ProfileForm({ initialValues }: Readonly<{ initialValues: ProfileFormValues }>) {
  const initialState: ProfileFormState = {
    fieldErrors: {},
    message: null,
    status: "idle",
    values: initialValues,
  };
  const [state, formAction] = useActionState(updateProfileAction, initialState);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "error") {
      summaryRef.current?.focus();
    }
  }, [state.status, state.message]);

  const errorId = (field: keyof ProfileFormValues) => `${field}-error`;
  const invalid = (field: keyof ProfileFormValues) => Boolean(state.fieldErrors[field]);

  return (
    <form action={formAction} className="profile-form" noValidate>
      {state.message ? (
        <div
          className={`form-summary form-summary-${state.status}`}
          ref={summaryRef}
          role={state.status === "error" ? "alert" : "status"}
          tabIndex={-1}
        >
          <p>{state.message}</p>
          {state.status === "error" && Object.keys(state.fieldErrors).length > 0 ? (
            <ul>
              {Object.entries(state.fieldErrors).map(([field, message]) => (
                <li key={field}>
                  <a href={`#${field}`}>{message}</a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="displayName">Display name</label>
          <input
            aria-describedby={invalid("displayName") ? errorId("displayName") : undefined}
            aria-invalid={invalid("displayName")}
            autoComplete="name"
            defaultValue={state.values.displayName}
            id="displayName"
            maxLength={80}
            name="displayName"
            required
          />
          <FieldError id={errorId("displayName")} message={state.fieldErrors.displayName} />
        </div>

        <div className="form-field">
          <label htmlFor="handle">Public handle</label>
          <input
            aria-describedby={`handle-help${invalid("handle") ? ` ${errorId("handle")}` : ""}`}
            aria-invalid={invalid("handle")}
            autoCapitalize="none"
            autoComplete="username"
            defaultValue={state.values.handle}
            id="handle"
            maxLength={30}
            minLength={3}
            name="handle"
            pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])"
            required
            spellCheck={false}
          />
          <p className="field-help" id="handle-help">
            3–30 lowercase letters, numbers, and single hyphens. This becomes /people/your-handle.
          </p>
          <FieldError id={errorId("handle")} message={state.fieldErrors.handle} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="biography">Biography</label>
        <textarea
          aria-describedby={`biography-help${invalid("biography") ? ` ${errorId("biography")}` : ""}`}
          aria-invalid={invalid("biography")}
          defaultValue={state.values.biography}
          id="biography"
          maxLength={1000}
          name="biography"
          rows={6}
        />
        <p className="field-help" id="biography-help">
          Describe the problems, domains, and kinds of collaboration that interest you. Do not add
          private contact information.
        </p>
        <FieldError id={errorId("biography")} message={state.fieldErrors.biography} />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="skills">Engineering or technical skills</label>
          <textarea
            defaultValue={state.values.skills}
            id="skills"
            name="skills"
            placeholder="TypeScript, PostgreSQL, Linux packaging"
            rows={4}
          />
          <p className="field-help">Separate items with commas or new lines.</p>
        </div>
        <div className="form-field">
          <label htmlFor="nonCodeRoles">Non-code contribution roles</label>
          <textarea
            defaultValue={state.values.nonCodeRoles}
            id="nonCodeRoles"
            name="nonCodeRoles"
            placeholder="Product research, accessibility, documentation"
            rows={4}
          />
          <p className="field-help">
            Design, testing, translation, moderation, and care work belong here.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="interests">Problems and domains of interest</label>
          <textarea
            defaultValue={state.values.interests}
            id="interests"
            name="interests"
            placeholder="Creative tools on Linux, public-interest data"
            rows={4}
          />
        </div>
        <div className="form-field">
          <label htmlFor="languages">Languages</label>
          <textarea
            defaultValue={state.values.languages}
            id="languages"
            name="languages"
            placeholder="Hindi, English, Marwari"
            rows={4}
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="availability">Current availability</label>
          <select
            aria-describedby={invalid("availability") ? errorId("availability") : undefined}
            aria-invalid={invalid("availability")}
            defaultValue={state.values.availability}
            id="availability"
            name="availability"
          >
            <option value="unavailable">Not currently available</option>
            <option value="limited">Limited availability</option>
            <option value="open">Open to contribute</option>
          </select>
          <FieldError id={errorId("availability")} message={state.fieldErrors.availability} />
        </div>
        <div className="form-field">
          <label htmlFor="timezone">Timezone</label>
          <input
            aria-describedby={`timezone-help${invalid("timezone") ? ` ${errorId("timezone")}` : ""}`}
            aria-invalid={invalid("timezone")}
            autoComplete="off"
            defaultValue={state.values.timezone}
            id="timezone"
            name="timezone"
            placeholder="Asia/Kolkata"
          />
          <p className="field-help" id="timezone-help">
            Optional IANA timezone; it helps collaborators set realistic response expectations.
          </p>
          <FieldError id={errorId("timezone")} message={state.fieldErrors.timezone} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="publicLinks">Public links</label>
        <textarea
          aria-describedby={`publicLinks-help${invalid("publicLinks") ? ` ${errorId("publicLinks")}` : ""}`}
          aria-invalid={invalid("publicLinks")}
          defaultValue={state.values.publicLinks}
          id="publicLinks"
          name="publicLinks"
          placeholder={"Portfolio | https://example.com\nGitHub | https://github.com/example"}
          rows={5}
        />
        <p className="field-help" id="publicLinks-help">
          One HTTPS URL per line, optionally written as Label | https://example.com. Maximum 10.
        </p>
        <FieldError id={errorId("publicLinks")} message={state.fieldErrors.publicLinks} />
      </div>

      <div className="form-field">
        <label htmlFor="avatarUrl">Avatar image URL</label>
        <input
          aria-describedby={`avatarUrl-help${invalid("avatarUrl") ? ` ${errorId("avatarUrl")}` : ""}`}
          aria-invalid={invalid("avatarUrl")}
          autoComplete="url"
          defaultValue={state.values.avatarUrl}
          id="avatarUrl"
          name="avatarUrl"
          placeholder="https://example.com/avatar.png"
          type="url"
        />
        <p className="field-help" id="avatarUrl-help">
          Optional HTTPS URL. ManyHands currently uses text initials in the directory to avoid
          loading third-party images without warning.
        </p>
        <FieldError id={errorId("avatarUrl")} message={state.fieldErrors.avatarUrl} />
      </div>

      <fieldset className="form-field visibility-fieldset">
        <legend>Profile visibility</legend>
        <p className="field-help">
          Profiles begin private. You choose when other people can see them.
        </p>
        <label>
          <input
            defaultChecked={state.values.visibility === "private"}
            name="visibility"
            type="radio"
            value="private"
          />
          <span>
            <strong>Private</strong> — only you can read the profile.
          </span>
        </label>
        <label>
          <input
            defaultChecked={state.values.visibility === "members"}
            name="visibility"
            type="radio"
            value="members"
          />
          <span>
            <strong>Members</strong> — signed-in ManyHands users can read it.
          </span>
        </label>
        <label>
          <input
            defaultChecked={state.values.visibility === "public"}
            name="visibility"
            type="radio"
            value="public"
          />
          <span>
            <strong>Public</strong> — it appears in the signed-out contributor directory.
          </span>
        </label>
        <FieldError id={errorId("visibility")} message={state.fieldErrors.visibility} />
      </fieldset>

      <div className="form-actions">
        <SubmitButton />
        <a className="button button-secondary" href="/people">
          View public directory
        </a>
      </div>
    </form>
  );
}

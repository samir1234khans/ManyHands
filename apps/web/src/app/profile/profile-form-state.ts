export interface ProfileFormValues {
  readonly availability: string;
  readonly avatarUrl: string;
  readonly biography: string;
  readonly displayName: string;
  readonly handle: string;
  readonly interests: string;
  readonly languages: string;
  readonly nonCodeRoles: string;
  readonly publicLinks: string;
  readonly skills: string;
  readonly timezone: string;
  readonly visibility: string;
}

export interface ProfileFormState {
  readonly fieldErrors: Readonly<Record<string, string>>;
  readonly message: string | null;
  readonly status: "error" | "idle" | "success";
  readonly values: ProfileFormValues;
}

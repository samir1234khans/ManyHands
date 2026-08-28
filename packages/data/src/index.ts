import type { Database } from "./database.types";

export { Constants } from "./database.types";

export type {
  CompositeTypes,
  Database,
  Enums,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./database.types";

export type AccountRow = Database["private"]["Tables"]["accounts"]["Row"];
export type ContributorProfileRow = Database["public"]["Tables"]["contributor_profiles"]["Row"];
export type ContributorProfileInsert =
  Database["public"]["Tables"]["contributor_profiles"]["Insert"];
export type ContributorProfileUpdate =
  Database["public"]["Tables"]["contributor_profiles"]["Update"];
export type PublicProfileDirectoryRow = Database["public"]["Views"]["profile_directory"]["Row"];

export type ProblemRow = Database["public"]["Tables"]["problems"]["Row"];
export type ProblemRevisionRow = Database["public"]["Tables"]["problem_revisions"]["Row"];
export type ProblemNeedSignalRow = Database["public"]["Tables"]["problem_need_signals"]["Row"];
export type ProblemFollowRow = Database["public"]["Tables"]["problem_follows"]["Row"];
export type ProblemDirectoryRow = Database["public"]["Views"]["problem_directory"]["Row"];

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

import type { Database } from "./database.types";

export type AccountRow = Database["private"]["Tables"]["accounts"]["Row"];
export type ContributorProfileRow =
  Database["public"]["Tables"]["contributor_profiles"]["Row"];
export type ContributorProfileInsert =
  Database["public"]["Tables"]["contributor_profiles"]["Insert"];
export type ContributorProfileUpdate =
  Database["public"]["Tables"]["contributor_profiles"]["Update"];
export type PublicProfileDirectoryRow =
  Database["public"]["Views"]["profile_directory"]["Row"];

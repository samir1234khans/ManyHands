export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  private: {
    Tables: {
      accounts: {
        Row: {
          anonymized_at: string | null
          auth_user_id: string | null
          created_at: string
          deletion_requested_at: string | null
          id: string
          status: Database["private"]["Enums"]["account_status"]
          suspended_at: string | null
          suspension_reason: string | null
          updated_at: string
        }
        Insert: {
          anonymized_at?: string | null
          auth_user_id?: string | null
          created_at?: string
          deletion_requested_at?: string | null
          id?: string
          status?: Database["private"]["Enums"]["account_status"]
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string
        }
        Update: {
          anonymized_at?: string | null
          auth_user_id?: string | null
          created_at?: string
          deletion_requested_at?: string | null
          id?: string
          status?: Database["private"]["Enums"]["account_status"]
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      problem_interaction_events: {
        Row: {
          account_id: string
          action: string
          created_at: string
          id: string
          problem_id: string
        }
        Insert: {
          account_id: string
          action: string
          created_at?: string
          id?: string
          problem_id: string
        }
        Update: {
          account_id?: string
          action?: string
          created_at?: string
          id?: string
          problem_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_interaction_events_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_moderation_events: {
        Row: {
          created_at: string
          id: string
          moderation_state: Database["public"]["Enums"]["problem_moderation_state"]
          problem_id: string
          reason: string
        }
        Insert: {
          created_at?: string
          id?: string
          moderation_state: Database["public"]["Enums"]["problem_moderation_state"]
          problem_id: string
          reason: string
        }
        Update: {
          created_at?: string
          id?: string
          moderation_state?: Database["public"]["Enums"]["problem_moderation_state"]
          problem_id?: string
          reason?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assert_problem_interaction_rate_limit: {
        Args: { target_account_id: string }
        Returns: undefined
      }
      current_account_id: { Args: never; Returns: string }
      current_active_account_id: { Args: never; Returns: string }
    }
    Enums: {
      account_status:
        | "active"
        | "suspended"
        | "deletion_requested"
        | "anonymized"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      contributor_profiles: {
        Row: {
          account_id: string
          availability: Database["public"]["Enums"]["availability_level"]
          avatar_url: string | null
          biography: string | null
          created_at: string
          display_name: string
          handle: string
          interests: string[]
          languages: string[]
          non_code_roles: string[]
          public_links: Json
          skills: string[]
          timezone: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["profile_visibility"]
        }
        Insert: {
          account_id: string
          availability?: Database["public"]["Enums"]["availability_level"]
          avatar_url?: string | null
          biography?: string | null
          created_at?: string
          display_name: string
          handle: string
          interests?: string[]
          languages?: string[]
          non_code_roles?: string[]
          public_links?: Json
          skills?: string[]
          timezone?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["profile_visibility"]
        }
        Update: {
          account_id?: string
          availability?: Database["public"]["Enums"]["availability_level"]
          avatar_url?: string | null
          biography?: string | null
          created_at?: string
          display_name?: string
          handle?: string
          interests?: string[]
          languages?: string[]
          non_code_roles?: string[]
          public_links?: Json
          skills?: string[]
          timezone?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["profile_visibility"]
        }
        Relationships: []
      }
      problem_follows: {
        Row: {
          account_id: string
          created_at: string
          problem_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          problem_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          problem_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_follows_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problem_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_follows_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_need_signals: {
        Row: {
          account_id: string
          created_at: string
          private_context: string | null
          problem_id: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          private_context?: string | null
          problem_id: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          private_context?: string | null
          problem_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_need_signals_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problem_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_need_signals_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_revisions: {
        Row: {
          affected_people: string
          author_account_id: string
          change_summary: string
          context: string
          created_at: string
          editor_account_id: string
          evidence: string | null
          existing_alternatives: string | null
          id: string
          is_public: boolean
          moderation_state: Database["public"]["Enums"]["problem_moderation_state"]
          platforms: string[]
          problem_id: string
          revision_number: number
          slug: string
          status: Database["public"]["Enums"]["problem_status"]
          summary: string
          tags: string[]
          title: string
        }
        Insert: {
          affected_people: string
          author_account_id: string
          change_summary: string
          context: string
          created_at?: string
          editor_account_id: string
          evidence?: string | null
          existing_alternatives?: string | null
          id?: string
          is_public: boolean
          moderation_state: Database["public"]["Enums"]["problem_moderation_state"]
          platforms: string[]
          problem_id: string
          revision_number: number
          slug: string
          status: Database["public"]["Enums"]["problem_status"]
          summary: string
          tags: string[]
          title: string
        }
        Update: {
          affected_people?: string
          author_account_id?: string
          change_summary?: string
          context?: string
          created_at?: string
          editor_account_id?: string
          evidence?: string | null
          existing_alternatives?: string | null
          id?: string
          is_public?: boolean
          moderation_state?: Database["public"]["Enums"]["problem_moderation_state"]
          platforms?: string[]
          problem_id?: string
          revision_number?: number
          slug?: string
          status?: Database["public"]["Enums"]["problem_status"]
          summary?: string
          tags?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_revisions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problem_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_revisions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      problems: {
        Row: {
          affected_people: string
          archived_at: string | null
          author_account_id: string
          closed_at: string | null
          context: string
          created_at: string
          evidence: string | null
          existing_alternatives: string | null
          id: string
          last_meaningful_update_at: string
          moderation_state: Database["public"]["Enums"]["problem_moderation_state"]
          platforms: string[]
          published_at: string | null
          revision_number: number
          slug: string
          status: Database["public"]["Enums"]["problem_status"]
          summary: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          affected_people: string
          archived_at?: string | null
          author_account_id: string
          closed_at?: string | null
          context: string
          created_at?: string
          evidence?: string | null
          existing_alternatives?: string | null
          id?: string
          last_meaningful_update_at?: string
          moderation_state?: Database["public"]["Enums"]["problem_moderation_state"]
          platforms?: string[]
          published_at?: string | null
          revision_number?: number
          slug: string
          status?: Database["public"]["Enums"]["problem_status"]
          summary: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          affected_people?: string
          archived_at?: string | null
          author_account_id?: string
          closed_at?: string | null
          context?: string
          created_at?: string
          evidence?: string | null
          existing_alternatives?: string | null
          id?: string
          last_meaningful_update_at?: string
          moderation_state?: Database["public"]["Enums"]["problem_moderation_state"]
          platforms?: string[]
          published_at?: string | null
          revision_number?: number
          slug?: string
          status?: Database["public"]["Enums"]["problem_status"]
          summary?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      problem_directory: {
        Row: {
          affected_people: string | null
          author_account_id: string | null
          author_display_name: string | null
          author_handle: string | null
          context: string | null
          created_at: string | null
          evidence: string | null
          existing_alternatives: string | null
          follow_count: number | null
          id: string | null
          last_meaningful_update_at: string | null
          need_signal_count: number | null
          platforms: string[] | null
          published_at: string | null
          revision_number: number | null
          slug: string | null
          status: Database["public"]["Enums"]["problem_status"] | null
          summary: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      profile_directory: {
        Row: {
          account_id: string | null
          availability: Database["public"]["Enums"]["availability_level"] | null
          avatar_url: string | null
          biography: string | null
          display_name: string | null
          handle: string | null
          interests: string[] | null
          languages: string[] | null
          non_code_roles: string[] | null
          public_links: Json | null
          skills: string[] | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          availability?:
            | Database["public"]["Enums"]["availability_level"]
            | null
          avatar_url?: string | null
          biography?: string | null
          display_name?: string | null
          handle?: string | null
          interests?: string[] | null
          languages?: string[] | null
          non_code_roles?: string[] | null
          public_links?: Json | null
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          availability?:
            | Database["public"]["Enums"]["availability_level"]
            | null
          avatar_url?: string | null
          biography?: string | null
          display_name?: string | null
          handle?: string | null
          interests?: string[] | null
          languages?: string[] | null
          non_code_roles?: string[] | null
          public_links?: Json | null
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_restore_account: {
        Args: { target_auth_user_id: string }
        Returns: boolean
      }
      admin_set_problem_moderation: {
        Args: {
          desired_state: Database["public"]["Enums"]["problem_moderation_state"]
          reason: string
          target_problem_id: string
        }
        Returns: boolean
      }
      admin_suspend_account: {
        Args: { reason: string; target_auth_user_id: string }
        Returns: boolean
      }
      create_problem: {
        Args: {
          change_summary: string
          desired_status: Database["public"]["Enums"]["problem_status"]
          problem_affected_people: string
          problem_context: string
          problem_evidence: string
          problem_existing_alternatives: string
          problem_platforms: string[]
          problem_slug: string
          problem_summary: string
          problem_tags: string[]
          problem_title: string
        }
        Returns: string
      }
      current_account_context: {
        Args: never
        Returns: {
          account_id: string
          status: Database["private"]["Enums"]["account_status"]
        }[]
      }
      current_problem_interactions: {
        Args: { target_problem_id: string }
        Returns: {
          has_need_signal: boolean
          is_following: boolean
          private_signal_context: string
        }[]
      }
      problem_follow_count: {
        Args: { target_problem_id: string }
        Returns: number
      }
      problem_need_signal_count: {
        Args: { target_problem_id: string }
        Returns: number
      }
      request_account_deletion: {
        Args: never
        Returns: Database["private"]["Enums"]["account_status"]
      }
      restore_failed_account_deletion: {
        Args: { target_auth_user_id: string }
        Returns: boolean
      }
      save_problem: {
        Args: {
          change_summary: string
          desired_status: Database["public"]["Enums"]["problem_status"]
          problem_affected_people: string
          problem_context: string
          problem_evidence: string
          problem_existing_alternatives: string
          problem_platforms: string[]
          problem_slug: string
          problem_summary: string
          problem_tags: string[]
          problem_title: string
          target_problem_id: string
        }
        Returns: string
      }
      toggle_problem_follow: {
        Args: { target_problem_id: string }
        Returns: boolean
      }
      toggle_problem_need_signal: {
        Args: { signal_context: string; target_problem_id: string }
        Returns: boolean
      }
    }
    Enums: {
      availability_level: "unavailable" | "limited" | "open"
      problem_moderation_state: "clear" | "restricted" | "removed"
      problem_status: "draft" | "published" | "closed" | "archived"
      profile_visibility: "private" | "members" | "public"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  private: {
    Enums: {
      account_status: [
        "active",
        "suspended",
        "deletion_requested",
        "anonymized",
      ],
    },
  },
  public: {
    Enums: {
      availability_level: ["unavailable", "limited", "open"],
      problem_moderation_state: ["clear", "restricted", "removed"],
      problem_status: ["draft", "published", "closed", "archived"],
      profile_visibility: ["private", "members", "public"],
    },
  },
} as const

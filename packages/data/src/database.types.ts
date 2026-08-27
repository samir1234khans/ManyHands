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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
    }
    Views: {
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
      admin_suspend_account: {
        Args: { reason: string; target_auth_user_id: string }
        Returns: boolean
      }
      current_account_context: {
        Args: never
        Returns: {
          account_id: string
          status: Database["private"]["Enums"]["account_status"]
        }[]
      }
      request_account_deletion: {
        Args: never
        Returns: Database["private"]["Enums"]["account_status"]
      }
      restore_failed_account_deletion: {
        Args: { target_auth_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      availability_level: "unavailable" | "limited" | "open"
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
      profile_visibility: ["private", "members", "public"],
    },
  },
} as const

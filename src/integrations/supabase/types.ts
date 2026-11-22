export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      daily_checkins: {
        Row: {
          energy: number | null
          id: string
          local_date: string
          mood: number | null
          owner_id: string
        }
        Insert: {
          energy?: number | null
          id?: string
          local_date: string
          mood?: number | null
          owner_id?: string
        }
        Update: {
          energy?: number | null
          id?: string
          local_date?: string
          mood?: number | null
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_checkins_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_priorities: {
        Row: {
          id: string
          local_date: string
          owner_id: string
          position: number
          task_id: string
        }
        Insert: {
          id?: string
          local_date: string
          owner_id?: string
          position: number
          task_id: string
        }
        Update: {
          id?: string
          local_date?: string
          owner_id?: string
          position?: number
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_priorities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_priorities_task_id_owner_id_fkey"
            columns: ["task_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      inbox_items: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          owner_id: string
          sorted_at: string | null
          task_id: string | null
          url: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind: string
          owner_id?: string
          sorted_at?: string | null
          task_id?: string | null
          url?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          owner_id?: string
          sorted_at?: string | null
          task_id?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inbox_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inbox_items_task_id_owner_id_fkey"
            columns: ["task_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      profiles: {
        Row: {
          appearance: string
          avatar_path: string | null
          content_language: string
          display_name: string
          id: string
          timezone: string
        }
        Insert: {
          appearance?: string
          avatar_path?: string | null
          content_language?: string
          display_name?: string
          id: string
          timezone?: string
        }
        Update: {
          appearance?: string
          avatar_path?: string | null
          content_language?: string
          display_name?: string
          id?: string
          timezone?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string
          context_label: string
          created_at: string
          due_date: string | null
          energy_demand: number | null
          estimated_minutes: number | null
          id: string
          next_step: string
          owner_id: string
          status: string
          title: string
        }
        Insert: {
          category?: string
          context_label?: string
          created_at?: string
          due_date?: string | null
          energy_demand?: number | null
          estimated_minutes?: number | null
          id?: string
          next_step?: string
          owner_id?: string
          status?: string
          title: string
        }
        Update: {
          category?: string
          context_label?: string
          created_at?: string
          due_date?: string | null
          energy_demand?: number | null
          estimated_minutes?: number | null
          id?: string
          next_step?: string
          owner_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      convert_capture_to_task: { Args: { capture_id: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

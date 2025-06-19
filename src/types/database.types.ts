export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string
          created_at: string
          end_time: string
          id: string
          notes: string
          service_id: string
          start_time: string
          status: string
          stylist_id: string
          updated_at: string
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone: string
          created_at?: string
          end_time: string
          id?: string
          notes: string
          service_id: string
          start_time: string
          status: string
          stylist_id: string
          updated_at?: string
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string
          service_id?: string
          start_time?: string
          status?: string
          stylist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "stylists"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          duration_minutes: number
          id?: string
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      services_offered: {
        Row: {
          created_at: string
          custom_duration: number | null
          custom_price: number | null
          id: string
          is_active: boolean
          service_id: string
          stylist_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_duration?: number | null
          custom_price?: number | null
          id?: string
          is_active?: boolean
          service_id: string
          stylist_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_duration?: number | null
          custom_price?: number | null
          id?: string
          is_active?: boolean
          service_id?: string
          stylist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_offered_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_offered_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "stylists"
            referencedColumns: ["id"]
          },
        ]
      }
      stylists: {
        Row: {
          created_at: string
          description: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string
          profile_picture: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          phone: string
          profile_picture: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string
          profile_picture?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stylists_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      unavailability: {
        Row: {
          created_at: string
          end_datetime: string
          id: string
          is_all_day: boolean
          reason: string
          start_datetime: string
          stylist_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_datetime: string
          id?: string
          is_all_day?: boolean
          reason: string
          start_datetime: string
          stylist_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_datetime?: string
          id?: string
          is_all_day?: boolean
          reason?: string
          start_datetime?: string
          stylist_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unavailability_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "stylists"
            referencedColumns: ["id"]
          },
        ]
      }
      work_schedule: {
        Row: {
          created_at: string
          end_time: string
          id: string
          start_time: string
          stylist_id: string
          updated_at: string
          weekday: number
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          stylist_id: string
          updated_at?: string
          weekday: number
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          stylist_id?: string
          updated_at?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_schedules_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "stylists"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_stylist_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_schedules_for_current_stylist: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          end_time: string
          id: string
          start_time: string
          stylist_id: string
          updated_at: string
          weekday: number
        }[]
      }
      get_stylists_for_service: {
        Args: { p_service_id: string }
        Returns: {
          created_at: string
          description: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string
          profile_picture: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      booking_status: "pending" | "accepted" | "rejected" | "cancelled"
      user_role: "admin" | "stylist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "accepted", "rejected", "cancelled"],
      user_role: ["admin", "stylist"],
    },
  },
} as const

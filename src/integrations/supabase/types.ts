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
      faculty_profiles: {
        Row: {
          address: string | null
          approved_by: string | null
          created_at: string | null
          department: string
          designation: string
          employee_id: string | null
          experience_years: number | null
          full_name: string
          id: string
          phone_number: string | null
          qualification: string
          specialization: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          approved_by?: string | null
          created_at?: string | null
          department: string
          designation: string
          employee_id?: string | null
          experience_years?: number | null
          full_name: string
          id?: string
          phone_number?: string | null
          qualification: string
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          approved_by?: string | null
          created_at?: string | null
          department?: string
          designation?: string
          employee_id?: string | null
          experience_years?: number | null
          full_name?: string
          id?: string
          phone_number?: string | null
          qualification?: string
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hod_profiles: {
        Row: {
          address: string | null
          created_at: string | null
          department: string
          employee_id: string | null
          experience_years: number | null
          full_name: string
          id: string
          phone_number: string | null
          qualification: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          department: string
          employee_id?: string | null
          experience_years?: number | null
          full_name: string
          id?: string
          phone_number?: string | null
          qualification: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          department?: string
          employee_id?: string | null
          experience_years?: number | null
          full_name?: string
          id?: string
          phone_number?: string | null
          qualification?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          address: string | null
          approved_by: string | null
          batch: string
          created_at: string | null
          department: string
          full_name: string
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          phone_number: string | null
          roll_number: string | null
          semester: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          approved_by?: string | null
          batch: string
          created_at?: string | null
          department: string
          full_name: string
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          phone_number?: string | null
          roll_number?: string | null
          semester: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          approved_by?: string | null
          batch?: string
          created_at?: string | null
          department?: string
          full_name?: string
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          phone_number?: string | null
          roll_number?: string | null
          semester?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          email_verified: boolean | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          approver_id: string | null
          comments: string | null
          created_at: string | null
          id: string
          requested_at: string | null
          reviewed_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          requested_at?: string | null
          reviewed_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          requested_at?: string | null
          reviewed_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "student" | "faculty" | "hod"
      verification_status: "pending" | "approved" | "rejected"
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
      user_role: ["student", "faculty", "hod"],
      verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const

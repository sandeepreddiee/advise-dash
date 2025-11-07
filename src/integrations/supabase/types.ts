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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      advising_notes: {
        Row: {
          advisor_id: string
          created_at: string | null
          note_date: string | null
          note_id: number
          note_text: string
          student_id: string
        }
        Insert: {
          advisor_id: string
          created_at?: string | null
          note_date?: string | null
          note_id?: never
          note_text: string
          student_id: string
        }
        Update: {
          advisor_id?: string
          created_at?: string | null
          note_date?: string | null
          note_id?: never
          note_text?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advising_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      attendance: {
        Row: {
          attendance_id: number
          attendance_pct: number | null
          course_id: string
          created_at: string | null
          month: string | null
          student_id: string
          term_id: string
        }
        Insert: {
          attendance_id?: never
          attendance_pct?: number | null
          course_id: string
          created_at?: string | null
          month?: string | null
          student_id: string
          term_id: string
        }
        Update: {
          attendance_id?: never
          attendance_pct?: number | null
          course_id?: string
          created_at?: string | null
          month?: string | null
          student_id?: string
          term_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendance_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["term_id"]
          },
        ]
      }
      courses: {
        Row: {
          course_id: string
          created_at: string | null
          dept: string
          level: number | null
          title: string
        }
        Insert: {
          course_id?: string
          created_at?: string | null
          dept: string
          level?: number | null
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          dept?: string
          level?: number | null
          title?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string
          created_at: string | null
          enrollment_id: string
          student_id: string
          term_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          enrollment_id?: string
          student_id: string
          term_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          enrollment_id?: string
          student_id?: string
          term_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "enrollments_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["term_id"]
          },
        ]
      }
      enrollments_grades: {
        Row: {
          course_gpa: number | null
          enrollment_id: string
          numeric_grade: number | null
        }
        Insert: {
          course_gpa?: number | null
          enrollment_id: string
          numeric_grade?: number | null
        }
        Update: {
          course_gpa?: number | null
          enrollment_id?: string
          numeric_grade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_grades_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "enrollments"
            referencedColumns: ["enrollment_id"]
          },
        ]
      }
      financial_aid: {
        Row: {
          aid_amount_usd: number | null
          household_income_usd: number | null
          outstanding_balance_usd: number | null
          scholarship_flag: boolean | null
          student_id: string
          work_hours_per_week: number | null
        }
        Insert: {
          aid_amount_usd?: number | null
          household_income_usd?: number | null
          outstanding_balance_usd?: number | null
          scholarship_flag?: boolean | null
          student_id: string
          work_hours_per_week?: number | null
        }
        Update: {
          aid_amount_usd?: number | null
          household_income_usd?: number | null
          outstanding_balance_usd?: number | null
          scholarship_flag?: boolean | null
          student_id?: string
          work_hours_per_week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_aid_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      lms_events: {
        Row: {
          assignments_submitted: number | null
          course_id: string
          created_at: string | null
          date: string | null
          event_id: number
          grain: string | null
          logins: number | null
          student_id: string
          term_id: string
          time_on_platform_min: number | null
        }
        Insert: {
          assignments_submitted?: number | null
          course_id: string
          created_at?: string | null
          date?: string | null
          event_id?: never
          grain?: string | null
          logins?: number | null
          student_id: string
          term_id: string
          time_on_platform_min?: number | null
        }
        Update: {
          assignments_submitted?: number | null
          course_id?: string
          created_at?: string | null
          date?: string | null
          event_id?: never
          grain?: string | null
          logins?: number | null
          student_id?: string
          term_id?: string
          time_on_platform_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lms_events_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "lms_events_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "lms_events_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["term_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      risk_scores: {
        Row: {
          created_at: string | null
          intervention_type: string | null
          note_date: string | null
          risk_score: number | null
          risk_tier: Database["public"]["Enums"]["risk_tier"]
          student_id: string
          term_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          intervention_type?: string | null
          note_date?: string | null
          risk_score?: number | null
          risk_tier: Database["public"]["Enums"]["risk_tier"]
          student_id: string
          term_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          intervention_type?: string | null
          note_date?: string | null
          risk_score?: number | null
          risk_tier?: Database["public"]["Enums"]["risk_tier"]
          student_id?: string
          term_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "risk_scores_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["term_id"]
          },
        ]
      }
      students: {
        Row: {
          age: number | null
          created_at: string | null
          credits_completed: number | null
          cumulative_gpa: number | null
          first_gen: boolean | null
          gender: string | null
          major: string | null
          name: string
          residency_status:
            | Database["public"]["Enums"]["residency_status"]
            | null
          student_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          credits_completed?: number | null
          cumulative_gpa?: number | null
          first_gen?: boolean | null
          gender?: string | null
          major?: string | null
          name: string
          residency_status?:
            | Database["public"]["Enums"]["residency_status"]
            | null
          student_id?: string
        }
        Update: {
          age?: number | null
          created_at?: string | null
          credits_completed?: number | null
          cumulative_gpa?: number | null
          first_gen?: boolean | null
          gender?: string | null
          major?: string | null
          name?: string
          residency_status?:
            | Database["public"]["Enums"]["residency_status"]
            | null
          student_id?: string
        }
        Relationships: []
      }
      term_gpas: {
        Row: {
          student_id: string
          term_gpa: number | null
          term_id: string
        }
        Insert: {
          student_id: string
          term_gpa?: number | null
          term_id: string
        }
        Update: {
          student_id?: string
          term_gpa?: number | null
          term_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "term_gpas_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "term_gpas_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["term_id"]
          },
        ]
      }
      terms: {
        Row: {
          created_at: string | null
          start_date: string
          term_id: string
          term_name: string
          weeks: number | null
        }
        Insert: {
          created_at?: string | null
          start_date: string
          term_id?: string
          term_name: string
          weeks?: number | null
        }
        Update: {
          created_at?: string | null
          start_date?: string
          term_id?: string
          term_name?: string
          weeks?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "advisor" | "student"
      residency_status: "On-Campus" | "Off-Campus" | "Commuter"
      risk_tier: "Low" | "Medium" | "High"
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
  public: {
    Enums: {
      app_role: ["admin", "advisor", "student"],
      residency_status: ["On-Campus", "Off-Campus", "Commuter"],
      risk_tier: ["Low", "Medium", "High"],
    },
  },
} as const

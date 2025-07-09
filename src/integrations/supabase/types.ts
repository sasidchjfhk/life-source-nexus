export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      approvals: {
        Row: {
          approved_at: string | null
          approver_id: string | null
          comments: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approver_id?: string | null
          comments?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approver_id?: string | null
          comments?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          approval_status: string
          created_at: string
          email: string
          hospital_id: string | null
          id: string
          license_number: string
          name: string
          phone: string
          specialization: string
          updated_at: string
          years_of_experience: number | null
        }
        Insert: {
          approval_status?: string
          created_at?: string
          email: string
          hospital_id?: string | null
          id?: string
          license_number: string
          name: string
          phone: string
          specialization: string
          updated_at?: string
          years_of_experience?: number | null
        }
        Update: {
          approval_status?: string
          created_at?: string
          email?: string
          hospital_id?: string | null
          id?: string
          license_number?: string
          name?: string
          phone?: string
          specialization?: string
          updated_at?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          approval_status: string
          availability: boolean | null
          blood_type: string
          created_at: string | null
          id: string
          location: string | null
          name: string
          organ: string
        }
        Insert: {
          approval_status?: string
          availability?: boolean | null
          blood_type: string
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          organ: string
        }
        Update: {
          approval_status?: string
          availability?: boolean | null
          blood_type?: string
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          organ?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          address: string
          approval_status: string
          bed_capacity: number | null
          contact_person: string
          created_at: string
          email: string
          hospital_type: string
          id: string
          license_number: string
          name: string
          phone: string
          specialties: string[] | null
          updated_at: string
        }
        Insert: {
          address: string
          approval_status?: string
          bed_capacity?: number | null
          contact_person: string
          created_at?: string
          email: string
          hospital_type: string
          id?: string
          license_number: string
          name: string
          phone: string
          specialties?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string
          approval_status?: string
          bed_capacity?: number | null
          contact_person?: string
          created_at?: string
          email?: string
          hospital_type?: string
          id?: string
          license_number?: string
          name?: string
          phone?: string
          specialties?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          blockchain_tx_hash: string | null
          donor_id: string | null
          id: string
          match_score: number | null
          matched_at: string | null
          recipient_id: string | null
          status: string | null
        }
        Insert: {
          blockchain_tx_hash?: string | null
          donor_id?: string | null
          id?: string
          match_score?: number | null
          matched_at?: string | null
          recipient_id?: string | null
          status?: string | null
        }
        Update: {
          blockchain_tx_hash?: string | null
          donor_id?: string | null
          id?: string
          match_score?: number | null
          matched_at?: string | null
          recipient_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          profile_data: Json | null
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          profile_data?: Json | null
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          profile_data?: Json | null
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      recipients: {
        Row: {
          approval_status: string
          blood_type: string
          created_at: string | null
          id: string
          location: string | null
          name: string
          required_organ: string
          urgency_level: number | null
        }
        Insert: {
          approval_status?: string
          blood_type: string
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          required_organ: string
          urgency_level?: number | null
        }
        Update: {
          approval_status?: string
          blood_type?: string
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          required_organ?: string
          urgency_level?: number | null
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
    Enums: {},
  },
} as const

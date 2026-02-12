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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          assignee_id: string | null
          brand_name: string
          category: string | null
          company_name: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          max_area_pyeong: number | null
          min_area_pyeong: number | null
          preferred_areas: Json | null
          requirements: string | null
          sub_category: string | null
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          brand_name: string
          category?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          max_area_pyeong?: number | null
          min_area_pyeong?: number | null
          preferred_areas?: Json | null
          requirements?: string | null
          sub_category?: string | null
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          brand_name?: string
          category?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          max_area_pyeong?: number | null
          min_area_pyeong?: number | null
          preferred_areas?: Json | null
          requirements?: string | null
          sub_category?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      buildings: {
        Row: {
          address_jibun: string | null
          address_road: string | null
          approval_date: string | null
          building_area_sqm: number | null
          building_coverage: number | null
          created_at: string
          created_by: string | null
          dong: string | null
          far_area_sqm: number | null
          floor_area_ratio: number | null
          gross_area_sqm: number | null
          gugun: string | null
          id: string
          jibun: string | null
          land_area_sqm: number | null
          latitude: number | null
          longitude: number | null
          main_use: string | null
          name: string
          parking: string | null
          roof_type: string | null
          sido: string | null
          structure: string | null
          total_floors_above: number | null
          total_floors_below: number | null
          updated_at: string
        }
        Insert: {
          address_jibun?: string | null
          address_road?: string | null
          approval_date?: string | null
          building_area_sqm?: number | null
          building_coverage?: number | null
          created_at?: string
          created_by?: string | null
          dong?: string | null
          far_area_sqm?: number | null
          floor_area_ratio?: number | null
          gross_area_sqm?: number | null
          gugun?: string | null
          id?: string
          jibun?: string | null
          land_area_sqm?: number | null
          latitude?: number | null
          longitude?: number | null
          main_use?: string | null
          name: string
          parking?: string | null
          roof_type?: string | null
          sido?: string | null
          structure?: string | null
          total_floors_above?: number | null
          total_floors_below?: number | null
          updated_at?: string
        }
        Update: {
          address_jibun?: string | null
          address_road?: string | null
          approval_date?: string | null
          building_area_sqm?: number | null
          building_coverage?: number | null
          created_at?: string
          created_by?: string | null
          dong?: string | null
          far_area_sqm?: number | null
          floor_area_ratio?: number | null
          gross_area_sqm?: number | null
          gugun?: string | null
          id?: string
          jibun?: string | null
          land_area_sqm?: number | null
          latitude?: number | null
          longitude?: number | null
          main_use?: string | null
          name?: string
          parking?: string | null
          roof_type?: string | null
          sido?: string | null
          structure?: string | null
          total_floors_above?: number | null
          total_floors_below?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          area_max: number | null
          area_min: number | null
          assignee_id: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          customer_type: string | null
          email: string | null
          grade: string | null
          home_phone: string | null
          id: string
          memo: string | null
          name: string
          other_phone: string | null
          phone: string | null
          preferred_area: Json | null
          source: string | null
          updated_at: string
        }
        Insert: {
          area_max?: number | null
          area_min?: number | null
          assignee_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          grade?: string | null
          home_phone?: string | null
          id?: string
          memo?: string | null
          name: string
          other_phone?: string | null
          phone?: string | null
          preferred_area?: Json | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          area_max?: number | null
          area_min?: number | null
          assignee_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          grade?: string | null
          home_phone?: string | null
          id?: string
          memo?: string | null
          name?: string
          other_phone?: string | null
          phone?: string | null
          preferred_area?: Json | null
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      floors: {
        Row: {
          area_sqm: number | null
          building_id: string
          created_at: string
          floor_label: string | null
          floor_number: number
          id: string
          main_use: string | null
          other_use: string | null
        }
        Insert: {
          area_sqm?: number | null
          building_id: string
          created_at?: string
          floor_label?: string | null
          floor_number: number
          id?: string
          main_use?: string | null
          other_use?: string | null
        }
        Update: {
          area_sqm?: number | null
          building_id?: string
          created_at?: string
          floor_label?: string | null
          floor_number?: number
          id?: string
          main_use?: string | null
          other_use?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "floors_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      lease_info: {
        Row: {
          building_id: string
          created_at: string
          deposit: number | null
          exclusive_area_pyeong: number | null
          floor_label: string | null
          id: string
          is_hidden: boolean | null
          is_vacant: boolean | null
          last_modified_by: string | null
          lease_area_pyeong: number | null
          listing_id: string | null
          maintenance_fee: number | null
          monthly_rent: number | null
          move_in_date: string | null
          notes: string | null
          source: string | null
          tenant_type: string | null
          updated_at: string
        }
        Insert: {
          building_id: string
          created_at?: string
          deposit?: number | null
          exclusive_area_pyeong?: number | null
          floor_label?: string | null
          id?: string
          is_hidden?: boolean | null
          is_vacant?: boolean | null
          last_modified_by?: string | null
          lease_area_pyeong?: number | null
          listing_id?: string | null
          maintenance_fee?: number | null
          monthly_rent?: number | null
          move_in_date?: string | null
          notes?: string | null
          source?: string | null
          tenant_type?: string | null
          updated_at?: string
        }
        Update: {
          building_id?: string
          created_at?: string
          deposit?: number | null
          exclusive_area_pyeong?: number | null
          floor_label?: string | null
          id?: string
          is_hidden?: boolean | null
          is_vacant?: boolean | null
          last_modified_by?: string | null
          lease_area_pyeong?: number | null
          listing_id?: string | null
          maintenance_fee?: number | null
          monthly_rent?: number | null
          move_in_date?: string | null
          notes?: string | null
          source?: string | null
          tenant_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lease_info_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lease_info_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          ad_title: string | null
          assignee_id: string | null
          building_id: string | null
          classification: string | null
          created_at: string
          deposit: number | null
          description: string | null
          id: string
          is_exclusive: boolean | null
          is_public: boolean | null
          is_recommended: boolean | null
          is_urgent: boolean | null
          listing_number: string | null
          listing_type: string
          maintenance_fee: number | null
          monthly_rent: number | null
          price_per_pyeong: number | null
          sale_price: number | null
          secret_memo: string | null
          status: string | null
          sub_class: Json | null
          tags: Json | null
          updated_at: string
          workspace: string
          yield_rate: number | null
        }
        Insert: {
          ad_title?: string | null
          assignee_id?: string | null
          building_id?: string | null
          classification?: string | null
          created_at?: string
          deposit?: number | null
          description?: string | null
          id?: string
          is_exclusive?: boolean | null
          is_public?: boolean | null
          is_recommended?: boolean | null
          is_urgent?: boolean | null
          listing_number?: string | null
          listing_type?: string
          maintenance_fee?: number | null
          monthly_rent?: number | null
          price_per_pyeong?: number | null
          sale_price?: number | null
          secret_memo?: string | null
          status?: string | null
          sub_class?: Json | null
          tags?: Json | null
          updated_at?: string
          workspace?: string
          yield_rate?: number | null
        }
        Update: {
          ad_title?: string | null
          assignee_id?: string | null
          building_id?: string | null
          classification?: string | null
          created_at?: string
          deposit?: number | null
          description?: string | null
          id?: string
          is_exclusive?: boolean | null
          is_public?: boolean | null
          is_recommended?: boolean | null
          is_urgent?: boolean | null
          listing_number?: string | null
          listing_type?: string
          maintenance_fee?: number | null
          monthly_rent?: number | null
          price_per_pyeong?: number | null
          sale_price?: number | null
          secret_memo?: string | null
          status?: string | null
          sub_class?: Json | null
          tags?: Json | null
          updated_at?: string
          workspace?: string
          yield_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vacancy_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          field_changed: string
          id: string
          lease_info_id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          field_changed: string
          id?: string
          lease_info_id: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          field_changed?: string
          id?: string
          lease_info_id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vacancy_history_lease_info_id_fkey"
            columns: ["lease_info_id"]
            isOneToOne: false
            referencedRelation: "lease_info"
            referencedColumns: ["id"]
          },
        ]
      }
      work_logs: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          file_url: string | null
          id: string
          log_date: string | null
          log_type: string | null
          reference_id: string
          reference_type: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          log_date?: string | null
          log_type?: string | null
          reference_id: string
          reference_type: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          log_date?: string | null
          log_type?: string | null
          reference_id?: string
          reference_type?: string
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

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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      advertisements: {
        Row: {
          button_text: string | null
          button_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          id: string
          image_url: string
          is_active: boolean | null
          start_date: string | null
          title: string | null
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          start_date?: string | null
          title?: string | null
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          start_date?: string | null
          title?: string | null
        }
        Relationships: []
      }
      chairman_messages: {
        Row: {
          created_at: string | null
          designation: string | null
          id: string
          is_active: boolean | null
          message: string
          name: string
          photo_url: string | null
        }
        Insert: {
          created_at?: string | null
          designation?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          name: string
          photo_url?: string | null
        }
        Update: {
          created_at?: string | null
          designation?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          name?: string
          photo_url?: string | null
        }
        Relationships: []
      }
      contact_enquiries: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_read: boolean | null
          is_replied: boolean | null
          message: string | null
          mobile: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_read?: boolean | null
          is_replied?: boolean | null
          message?: string | null
          mobile: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_read?: boolean | null
          is_replied?: boolean | null
          message?: string | null
          mobile?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: Database["public"]["Enums"]["gallery_category"] | null
          created_at: string | null
          description: string | null
          event_date: string | null
          id: string
          image_url: string
          is_active: boolean | null
          title: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["gallery_category"] | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          title?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["gallery_category"] | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          title?: string | null
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          button_text: string | null
          button_url: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          subtitle: string | null
          title: string | null
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      live_darshan: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          mode: string | null
          video_url: string | null
          youtube_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mode?: string | null
          video_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mode?: string | null
          video_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          category: Database["public"]["Enums"]["member_category"] | null
          created_at: string | null
          designation: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          photo_url: string | null
          show_on_home: boolean | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["member_category"] | null
          created_at?: string | null
          designation?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          photo_url?: string | null
          show_on_home?: boolean | null
        }
        Update: {
          category?: Database["public"]["Enums"]["member_category"] | null
          created_at?: string | null
          designation?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          photo_url?: string | null
          show_on_home?: boolean | null
        }
        Relationships: []
      }
      news: {
        Row: {
          created_at: string | null
          featured_image_url: string | null
          full_description: string | null
          id: string
          is_active: boolean | null
          publish_date: string | null
          short_description: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          featured_image_url?: string | null
          full_description?: string | null
          id?: string
          is_active?: boolean | null
          publish_date?: string | null
          short_description?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          featured_image_url?: string | null
          full_description?: string | null
          id?: string
          is_active?: boolean | null
          publish_date?: string | null
          short_description?: string | null
          title?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          content: string
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          link_text: string | null
          link_url: string | null
          priority: Database["public"]["Enums"]["notice_priority"] | null
          start_date: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          priority?: Database["public"]["Enums"]["notice_priority"] | null
          start_date?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          priority?: Database["public"]["Enums"]["notice_priority"] | null
          start_date?: string | null
        }
        Relationships: []
      }
      policies: {
        Row: {
          content: string
          created_at: string | null
          id: string
          last_revised: string | null
          policy_type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          last_revised?: string | null
          policy_type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          last_revised?: string | null
          policy_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_branch: string | null
          bank_ifsc: string | null
          bank_name: string | null
          created_at: string | null
          donation_qr_url: string | null
          email: string | null
          facebook_enabled: boolean | null
          facebook_url: string | null
          google_maps_embed_url: string | null
          id: string
          instagram_enabled: boolean | null
          instagram_url: string | null
          latitude: string | null
          logo_url: string | null
          longitude: string | null
          phone: string | null
          registration_no: string | null
          site_name: string | null
          updated_at: string | null
          upi_id: string | null
          whatsapp: string | null
          youtube_enabled: boolean | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_branch?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          created_at?: string | null
          donation_qr_url?: string | null
          email?: string | null
          facebook_enabled?: boolean | null
          facebook_url?: string | null
          google_maps_embed_url?: string | null
          id?: string
          instagram_enabled?: boolean | null
          instagram_url?: string | null
          latitude?: string | null
          logo_url?: string | null
          longitude?: string | null
          phone?: string | null
          registration_no?: string | null
          site_name?: string | null
          updated_at?: string | null
          upi_id?: string | null
          whatsapp?: string | null
          youtube_enabled?: boolean | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_branch?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          created_at?: string | null
          donation_qr_url?: string | null
          email?: string | null
          facebook_enabled?: boolean | null
          facebook_url?: string | null
          google_maps_embed_url?: string | null
          id?: string
          instagram_enabled?: boolean | null
          instagram_url?: string | null
          latitude?: string | null
          logo_url?: string | null
          longitude?: string | null
          phone?: string | null
          registration_no?: string | null
          site_name?: string | null
          updated_at?: string | null
          upi_id?: string | null
          whatsapp?: string | null
          youtube_enabled?: boolean | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      temple_info: {
        Row: {
          content: string
          created_at: string | null
          id: string
          section_name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          section_name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          section_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      temple_timings: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          timing: string
          title: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          timing: string
          title: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          timing?: string
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
      gallery_category:
        | "मंदिर"
        | "धार्मिक आयोजन"
        | "पूजा"
        | "बैठक"
        | "सामाजिक गतिविधियाँ"
        | "अन्य"
      member_category:
        | "संरक्षक"
        | "पदाधिकारी"
        | "स्थाई कार्यकारिणी"
        | "कार्यकारी सदस्य"
      notice_priority: "low" | "medium" | "high"
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
      app_role: ["admin", "editor", "user"],
      gallery_category: [
        "मंदिर",
        "धार्मिक आयोजन",
        "पूजा",
        "बैठक",
        "सामाजिक गतिविधियाँ",
        "अन्य",
      ],
      member_category: [
        "संरक्षक",
        "पदाधिकारी",
        "स्थाई कार्यकारिणी",
        "कार्यकारी सदस्य",
      ],
      notice_priority: ["low", "medium", "high"],
    },
  },
} as const

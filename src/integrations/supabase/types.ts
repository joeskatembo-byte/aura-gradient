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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          department_id: string | null
          id: string
          letter: string
          published_at: string
          title: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          id?: string
          letter?: string
          published_at?: string
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          id?: string
          letter?: string
          published_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          anonymous: boolean
          created_at: string
          details: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_date: string | null
          status: Database["public"]["Enums"]["request_status"]
          subject: string
        }
        Insert: {
          anonymous?: boolean
          created_at?: string
          details?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          subject: string
        }
        Update: {
          anonymous?: boolean
          created_at?: string
          details?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          subject?: string
        }
        Relationships: []
      }
      bible_verses: {
        Row: {
          active: boolean
          created_at: string
          id: string
          position: number
          reference: string
          text: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          position?: number
          reference: string
          text: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          position?: number
          reference?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          anonymous: boolean
          created_at: string
          full_name: string | null
          id: string
          message: string
          phone: string | null
          status: Database["public"]["Enums"]["request_status"]
          subject: string
        }
        Insert: {
          anonymous?: boolean
          created_at?: string
          full_name?: string | null
          id?: string
          message: string
          phone?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          subject: string
        }
        Update: {
          anonymous?: boolean
          created_at?: string
          full_name?: string | null
          id?: string
          message?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          subject?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          icon: string
          id: string
          lead_name: string | null
          letter: string
          mission: string | null
          name: string
          news: string | null
          slug: string
          tagline: string | null
          tone: string
          updated_at: string
          urgent_schedule: string | null
          usual_schedule: string | null
          vision: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          icon?: string
          id?: string
          lead_name?: string | null
          letter?: string
          mission?: string | null
          name: string
          news?: string | null
          slug: string
          tagline?: string | null
          tone?: string
          updated_at?: string
          urgent_schedule?: string | null
          usual_schedule?: string | null
          vision?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          icon?: string
          id?: string
          lead_name?: string | null
          letter?: string
          mission?: string | null
          name?: string
          news?: string | null
          slug?: string
          tagline?: string | null
          tone?: string
          updated_at?: string
          urgent_schedule?: string | null
          usual_schedule?: string | null
          vision?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donor_name: string | null
          id: string
          message: string | null
          method: string
          project_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donor_name?: string | null
          id?: string
          message?: string | null
          method?: string
          project_id?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donor_name?: string | null
          id?: string
          message?: string | null
          method?: string
          project_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "finance_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          active: boolean
          answer: string
          created_at: string
          id: string
          position: number
          question: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          answer: string
          created_at?: string
          id?: string
          position?: number
          question: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          answer?: string
          created_at?: string
          id?: string
          position?: number
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      finance_projects: {
        Row: {
          budget_raised: number
          budget_total: number
          created_at: string
          description: string
          id: string
          image_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          budget_raised?: number
          budget_total?: number
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          budget_raised?: number
          budget_total?: number
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          active: boolean
          created_at: string
          href: string
          id: string
          label: string
          position: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          href: string
          id?: string
          label: string
          position?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          href?: string
          id?: string
          label?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          active: boolean
          badge: string
          community_image_url: string | null
          community_subtitle: string
          community_title: string
          created_at: string
          event_detail: string
          event_title: string
          id: string
          members_count: number
          members_label: string
          primary_href: string
          primary_label: string
          secondary_href: string
          secondary_label: string
          title_line1: string
          title_line2: string
          typed_phrases: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          badge?: string
          community_image_url?: string | null
          community_subtitle?: string
          community_title?: string
          created_at?: string
          event_detail?: string
          event_title?: string
          id?: string
          members_count?: number
          members_label?: string
          primary_href?: string
          primary_label?: string
          secondary_href?: string
          secondary_label?: string
          title_line1?: string
          title_line2?: string
          typed_phrases?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          badge?: string
          community_image_url?: string | null
          community_subtitle?: string
          community_title?: string
          created_at?: string
          event_detail?: string
          event_title?: string
          id?: string
          members_count?: number
          members_label?: string
          primary_href?: string
          primary_label?: string
          secondary_href?: string
          secondary_label?: string
          title_line1?: string
          title_line2?: string
          typed_phrases?: string
          updated_at?: string
        }
        Relationships: []
      }
      leaders: {
        Row: {
          active: boolean
          bio: string
          created_at: string
          id: string
          initials: string
          name: string
          position: number
          quote: string
          role: string
          short: string
          since: string
          tone: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          bio?: string
          created_at?: string
          id?: string
          initials: string
          name: string
          position?: number
          quote?: string
          role: string
          short?: string
          since?: string
          tone?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          bio?: string
          created_at?: string
          id?: string
          initials?: string
          name?: string
          position?: number
          quote?: string
          role?: string
          short?: string
          since?: string
          tone?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_items: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string | null
          id: string
          likes_count: number
          media_url: string | null
          story: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          likes_count?: number
          media_url?: string | null
          story?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          likes_count?: number
          media_url?: string | null
          story?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_items_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      media_likes: {
        Row: {
          created_at: string
          id: string
          media_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_likes_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
        ]
      }
      meditations: {
        Row: {
          active: boolean
          author: string
          book: string
          created_at: string
          created_by: string | null
          id: string
          initial: string
          message: string
          published_at: string
          reference: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          author?: string
          book: string
          created_at?: string
          created_by?: string | null
          id?: string
          initial?: string
          message: string
          published_at?: string
          reference?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          author?: string
          book?: string
          created_at?: string
          created_by?: string | null
          id?: string
          initial?: string
          message?: string
          published_at?: string
          reference?: string
          updated_at?: string
        }
        Relationships: []
      }
      participation_rates: {
        Row: {
          created_at: string
          created_by: string | null
          department_id: string
          id: string
          note: string | null
          period: string
          rate: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department_id: string
          id?: string
          note?: string | null
          period: string
          rate: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department_id?: string
          id?: string
          note?: string | null
          period?: string
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "participation_rates_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          anonymous: boolean
          answered_at: string | null
          created_at: string
          details: string | null
          full_name: string | null
          id: string
          phone: string | null
          status: Database["public"]["Enums"]["request_status"]
          subject: string
        }
        Insert: {
          anonymous?: boolean
          answered_at?: string | null
          created_at?: string
          details?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          subject: string
        }
        Update: {
          anonymous?: boolean
          answered_at?: string | null
          created_at?: string
          details?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          subject?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avenue: string | null
          birth_date: string | null
          children_count: number
          commune: string | null
          created_at: string
          department_id: string | null
          emergency_contact: string | null
          first_name: string
          first_slug: string | null
          id: string
          last_name: string
          last_slug: string | null
          login_email: string | null
          login_slug: string | null
          marital_status: string | null
          parcelle: string | null
          phone: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          avenue?: string | null
          birth_date?: string | null
          children_count?: number
          commune?: string | null
          created_at?: string
          department_id?: string | null
          emergency_contact?: string | null
          first_name?: string
          first_slug?: string | null
          id: string
          last_name?: string
          last_slug?: string | null
          login_email?: string | null
          login_slug?: string | null
          marital_status?: string | null
          parcelle?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          avenue?: string | null
          birth_date?: string | null
          children_count?: number
          commune?: string | null
          created_at?: string
          department_id?: string | null
          emergency_contact?: string | null
          first_name?: string
          first_slug?: string | null
          id?: string
          last_name?: string
          last_slug?: string | null
          login_email?: string | null
          login_slug?: string | null
          marital_status?: string | null
          parcelle?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          created_by: string | null
          day_of_week: number | null
          department_id: string | null
          description: string | null
          event_date: string | null
          id: string
          place: string | null
          scope: string
          start_time: string | null
          tag: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          day_of_week?: number | null
          department_id?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          place?: string | null
          scope?: string
          start_time?: string | null
          tag?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          day_of_week?: number | null
          department_id?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          place?: string | null
          scope?: string
          start_time?: string | null
          tag?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address: string
          church_name: string
          created_at: string
          email: string
          facebook_url: string
          footer_contact_title: string
          footer_credit: string
          footer_nav_title: string
          id: string
          instagram_url: string
          phone: string
          schedule_main: string
          tagline: string
          twitter_url: string
          updated_at: string
          whatsapp_url: string
          youtube_url: string
        }
        Insert: {
          address?: string
          church_name?: string
          created_at?: string
          email?: string
          facebook_url?: string
          footer_contact_title?: string
          footer_credit?: string
          footer_nav_title?: string
          id?: string
          instagram_url?: string
          phone?: string
          schedule_main?: string
          tagline?: string
          twitter_url?: string
          updated_at?: string
          whatsapp_url?: string
          youtube_url?: string
        }
        Update: {
          address?: string
          church_name?: string
          created_at?: string
          email?: string
          facebook_url?: string
          footer_contact_title?: string
          footer_credit?: string
          footer_nav_title?: string
          id?: string
          instagram_url?: string
          phone?: string
          schedule_main?: string
          tagline?: string
          twitter_url?: string
          updated_at?: string
          whatsapp_url?: string
          youtube_url?: string
        }
        Relationships: []
      }
      testimonies: {
        Row: {
          content: string
          created_at: string
          display_name: string
          id: string
          likes_count: number
          photo_url: string | null
          published: boolean
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          display_name: string
          id?: string
          likes_count?: number
          photo_url?: string | null
          published?: boolean
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          display_name?: string
          id?: string
          likes_count?: number
          photo_url?: string | null
          published?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      testimony_likes: {
        Row: {
          created_at: string
          id: string
          testimony_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          testimony_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          testimony_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimony_likes_testimony_id_fkey"
            columns: ["testimony_id"]
            isOneToOne: false
            referencedRelation: "testimonies"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_entries: {
        Row: {
          created_at: string
          id: string
          position: number
          text: string
          title: string
          year: string
        }
        Insert: {
          created_at?: string
          id?: string
          position?: number
          text: string
          title: string
          year: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          text?: string
          title?: string
          year?: string
        }
        Relationships: []
      }
      upcoming_events: {
        Row: {
          active: boolean
          created_at: string
          date_label: string
          detail: string
          id: string
          position: number
          title: string
          tone: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          date_label: string
          detail?: string
          id?: string
          position?: number
          title: string
          tone?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          date_label?: string
          detail?: string
          id?: string
          position?: number
          title?: string
          tone?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          department_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_steps: {
        Row: {
          active: boolean
          answer: string
          created_at: string
          icon: string
          id: string
          label: string
          position: number
          question: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          answer: string
          created_at?: string
          icon?: string
          id?: string
          label: string
          position?: number
          question: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          answer?: string
          created_at?: string
          icon?: string
          id?: string
          label?: string
          position?: number
          question?: string
          updated_at?: string
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
      is_admin: { Args: never; Returns: boolean }
      leads_department: { Args: { _dept: string }; Returns: boolean }
      resolve_login: { Args: { _name: string }; Returns: string }
    }
    Enums: {
      app_role: "berger" | "chef_departement" | "fidele"
      request_status: "nouveau" | "en_cours" | "traite" | "rejete"
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
    Enums: {
      app_role: ["berger", "chef_departement", "fidele"],
      request_status: ["nouveau", "en_cours", "traite", "rejete"],
    },
  },
} as const

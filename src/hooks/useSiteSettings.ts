import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as SupabaseClient;

export type SiteSettings = {
  church_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  whatsapp_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
  schedule_main: string;
  footer_nav_title: string;
  footer_contact_title: string;
  footer_credit: string;
};

export const defaultSettings: SiteSettings = {
  church_name: "Église Nouvelle Vie",
  tagline:
    "Une maison de foi au cœur de la République Démocratique du Congo. Une seule église, plusieurs nations, un seul Sauveur.",
  address: "Av. de la Foi, Kinshasa, RDC",
  phone: "+243 000 000 000",
  email: "contact@nouvellevie.cd",
  whatsapp_url: "#",
  facebook_url: "#",
  instagram_url: "#",
  youtube_url: "#",
  twitter_url: "#",
  schedule_main: "Dimanche 09h00 & 17h00 · Mercredi 18h30",
  footer_nav_title: "Navigation",
  footer_contact_title: "Contact",
  footer_credit: "Fait avec foi en RDC 🇨🇩",
};

export function useSiteSettings(): SiteSettings {
  const { data } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await db.from("site_settings").select("*").order("created_at").limit(1);
      if (error) throw error;
      return (data?.[0] ?? null) as Partial<SiteSettings> | null;
    },
  });

  return { ...defaultSettings, ...(data ?? {}) };
}

CREATE TABLE public.hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge text NOT NULL DEFAULT '',
  title_line1 text NOT NULL DEFAULT '',
  title_line2 text NOT NULL DEFAULT '',
  typed_phrases text NOT NULL DEFAULT '',
  primary_label text NOT NULL DEFAULT '',
  primary_href text NOT NULL DEFAULT '#',
  secondary_label text NOT NULL DEFAULT '',
  secondary_href text NOT NULL DEFAULT '#',
  community_title text NOT NULL DEFAULT '',
  community_subtitle text NOT NULL DEFAULT '',
  community_image_url text,
  members_count integer NOT NULL DEFAULT 0,
  members_label text NOT NULL DEFAULT '',
  event_title text NOT NULL DEFAULT '',
  event_detail text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hero_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_content TO authenticated;
GRANT ALL ON public.hero_content TO service_role;

ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_content_public_read" ON public.hero_content
  FOR SELECT USING (active = true);

CREATE POLICY "hero_content_admin_all" ON public.hero_content
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TRIGGER update_hero_content_updated_at
  BEFORE UPDATE ON public.hero_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.hero_content (
  badge, title_line1, title_line2, typed_phrases,
  primary_label, primary_href, secondary_label, secondary_href,
  community_title, community_subtitle,
  members_count, members_label, event_title, event_detail
) VALUES (
  'Église Nouvelle Vie · Kinshasa, RDC',
  'Bienvenue à',
  'la Maison.',
  'Une famille de foi. Une seule église, plusieurs nations.|Venez tel que vous êtes — repartez transformé.|Une maison où chacun trouve sa place et sa destinée.|Adorer, grandir, servir : ensemble, au cœur de Kinshasa.',
  'Rejoindre un culte', '#actualites',
  'Voir en direct', '#mediatheque',
  'Une foi. Plusieurs visages.',
  'Chaque dimanche, une famille qui loue ensemble.',
  2847, 'Membres actifs dans la famille',
  'Nuit d''intercession nationale',
  'Vendredi 31 juillet · 20h00'
);
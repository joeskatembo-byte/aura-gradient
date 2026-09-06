CREATE TABLE public.footer_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  href text NOT NULL,
  position integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.footer_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.footer_links TO authenticated;
GRANT ALL ON public.footer_links TO service_role;

ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "footer_links_public_read" ON public.footer_links FOR SELECT USING (true);
CREATE POLICY "footer_links_admin_write" ON public.footer_links FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER t_footer_links BEFORE UPDATE ON public.footer_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS footer_nav_title text NOT NULL DEFAULT 'Navigation',
  ADD COLUMN IF NOT EXISTS footer_contact_title text NOT NULL DEFAULT 'Contact',
  ADD COLUMN IF NOT EXISTS footer_credit text NOT NULL DEFAULT 'Fait avec foi en RDC 🇨🇩';

INSERT INTO public.footer_links (label, href, position) VALUES
  ('Accueil', '/', 1),
  ('À propos', '/a-propos', 2),
  ('Don', '/don', 3),
  ('Contact', '/contact', 4),
  ('Inscription', '/inscription', 5);
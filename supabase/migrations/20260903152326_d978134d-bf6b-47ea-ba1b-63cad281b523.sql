CREATE TABLE public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.faq_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faq_items TO authenticated;
GRANT ALL ON public.faq_items TO service_role;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQ publique" ON public.faq_items FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent la FAQ" ON public.faq_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE TRIGGER faq_items_updated BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.bible_verses (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  text text not null,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.bible_verses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bible_verses TO authenticated;
GRANT ALL ON public.bible_verses TO service_role;
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Versets publics" ON public.bible_verses FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent les versets" ON public.bible_verses FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE TRIGGER bible_verses_updated BEFORE UPDATE ON public.bible_verses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.site_settings (
  id uuid primary key default gen_random_uuid(),
  church_name text not null default 'Église Nouvelle Vie',
  tagline text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  whatsapp_url text not null default '',
  facebook_url text not null default '',
  instagram_url text not null default '',
  youtube_url text not null default '',
  twitter_url text not null default '',
  schedule_main text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Paramètres publics" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent les paramètres" ON public.site_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.faq_items (question, answer, position) VALUES
('À quelle heure sont les cultes ?','Les cultes ont lieu chaque dimanche à 09h00 et 17h00, avec une réunion de prière le mercredi à 18h30.',1),
('Comment devenir membre ?','Remplissez le formulaire d''inscription en ligne, puis un serviteur vous contactera pour un entretien d''accueil.',2),
('Puis-je prendre rendez-vous avec le pasteur ?','Oui, via le formulaire dédié dans la section Contact. Une confirmation vous sera envoyée sous 48h.',3),
('Comment soutenir la mission ?','Vous pouvez faire un don ponctuel ou récurrent depuis la page Don, en toute sécurité.',4),
('L''église a-t-elle des programmes pour la jeunesse ?','Absolument. Séminaires, camps, veillées et cellules de jeunes rythment l''année.',5);

INSERT INTO public.bible_verses (reference, text, position) VALUES
('Jean 3:16','Car Dieu a tant aimé le monde qu''il a donné son Fils unique.',1),
('Psaume 23:1','L''Éternel est mon berger, je ne manquerai de rien.',2),
('Philippiens 4:13','Je puis tout par celui qui me fortifie.',3),
('Ésaïe 41:10','Ne crains rien, car je suis avec toi.',4);

INSERT INTO public.site_settings (church_name, tagline, address, phone, email, whatsapp_url, facebook_url, instagram_url, youtube_url, twitter_url, schedule_main) VALUES
('Église Nouvelle Vie','Une maison de foi au cœur de la République Démocratique du Congo. Une seule église, plusieurs nations, un seul Sauveur.','Av. de la Foi, Kinshasa, RDC','+243 000 000 000','contact@nouvellevie.cd','#','#','#','#','#','Dimanche 09h00 & 17h00 · Mercredi 18h30');
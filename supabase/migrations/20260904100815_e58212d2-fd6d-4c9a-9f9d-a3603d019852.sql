CREATE TABLE public.leaders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  initials text NOT NULL,
  tone text NOT NULL DEFAULT 'from-ig-blue to-ig-purple',
  short text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  quote text NOT NULL DEFAULT '',
  since text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.leaders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leaders TO authenticated;
GRANT ALL ON public.leaders TO service_role;
ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read leaders" ON public.leaders FOR SELECT TO anon, authenticated USING (active = true OR public.is_admin());
CREATE POLICY "Admins manage leaders" ON public.leaders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_leaders BEFORE UPDATE ON public.leaders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.vision_steps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  label text NOT NULL,
  answer text NOT NULL,
  icon text NOT NULL DEFAULT 'flame',
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vision_steps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vision_steps TO authenticated;
GRANT ALL ON public.vision_steps TO service_role;
ALTER TABLE public.vision_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read vision" ON public.vision_steps FOR SELECT TO anon, authenticated USING (active = true OR public.is_admin());
CREATE POLICY "Admins manage vision" ON public.vision_steps FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_vision_steps BEFORE UPDATE ON public.vision_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.upcoming_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date_label text NOT NULL,
  title text NOT NULL,
  detail text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT 'from-ig-blue to-ig-purple',
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.upcoming_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.upcoming_events TO authenticated;
GRANT ALL ON public.upcoming_events TO service_role;
ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read upcoming" ON public.upcoming_events FOR SELECT TO anon, authenticated USING (active = true OR public.is_admin());
CREATE POLICY "Admins manage upcoming" ON public.upcoming_events FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_upcoming_events BEFORE UPDATE ON public.upcoming_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO public.leaders (name, role, initials, tone, short, bio, quote, since, position) VALUES
('Pasteur Emmanuel Kabasele','Fondateur & Pasteur principal','EK','from-ig-blue to-ig-purple','Théologien, bâtisseur, père spirituel de la maison.','Né à Kananga, Emmanuel Kabasele consacre sa vie au ministère depuis 1996. Diplômé en théologie pastorale et en gestion des organisations, il fonde l''Église Nouvelle Vie en 2003. Il a formé plus de 400 ouvriers et supervise aujourd''hui sept implantations à travers la RDC.','Une église qui ne sert pas sa ville n''a pas encore compris l''Évangile.','Depuis 2003',1),
('Maman Judith Kabasele','Co-fondatrice & Ministère des femmes','JK','from-ig-magenta to-ig-orange','Mentore de milliers de femmes et de mères de la communauté.','Judith Kabasele dirige le ministère des femmes et le pôle d''accompagnement familial. Assistante sociale de formation, elle a lancé le programme « Mama Sikia » qui soutient les mères célibataires par la formation professionnelle et le micro-crédit solidaire.','Relever une femme, c''est relever toute une génération.','Depuis 2003',2),
('Révérend Patrick Ilunga','Président du conseil d''administration','PI','from-ig-indigo to-ig-pink','Garant de la gouvernance et de la transparence financière.','Ancien cadre bancaire à Lubumbashi, Patrick Ilunga préside le conseil d''administration depuis 2012. Il a mis en place le système d''audit annuel indépendant et la publication trimestrielle des comptes de l''église.','La confiance se construit avec des chiffres clairs et un cœur droit.','Depuis 2012',3),
('Évangéliste Sarah Mbuyi','Directrice de l''évangélisation','SM','from-ig-red to-ig-gold','Stratège des campagnes et des sorties de terrain.','Sarah Mbuyi coordonne les campagnes d''évangélisation urbaines et rurales. En cinq ans, elle a organisé plus de 120 sorties et formé 300 évangélistes de rue, avec un accent particulier sur la jeunesse des quartiers populaires.','L''Évangile marche encore mieux à pied, dans la poussière des quartiers.','Depuis 2017',4),
('Diacre Joseph Mwamba','Administration & Œuvres sociales','JM','from-ig-purple to-ig-blue','Logistique, entraide et action sociale au quotidien.','Joseph Mwamba pilote les opérations : bâtiments, sécurité, distribution alimentaire et bourses scolaires. Son équipe accompagne chaque mois près de 800 familles vulnérables de Kinshasa.','Servir discrètement, c''est encore servir grandement.','Depuis 2010',5),
('Sœur Esther Lokwa','Direction louange & médias','EL','from-ig-gold to-ig-magenta','Voix, scène, studio et diffusion en direct.','Esther Lokwa dirige la chorale, l''orchestre et le studio média. Elle a produit quatre albums de louange en lingala et français et supervise la diffusion hebdomadaire des cultes en ligne.','L''adoration n''est pas un spectacle, c''est une rencontre.','Depuis 2014',6);

INSERT INTO public.vision_steps (question, label, answer, icon, position) VALUES
('Quelle est notre raison d''être ?','Notre raison d''être','Révéler le cœur de Dieu à une génération congolaise assoiffée de sens, en faisant de chaque personne accueillie un disciple debout, utile à sa famille et à sa nation.','flame',1),
('Où allons-nous ?','Notre vision','Être d''ici 2035 une communauté de 50 000 disciples formés, implantée dans les 26 provinces, connue pour son intégrité, sa compassion et son excellence.','compass',2),
('Comment y allons-nous ?','Notre mission','Enseigner la Parole avec clarté, servir les plus fragiles avec dignité, former des leaders intègres et célébrer une adoration vivante, en présentiel comme en ligne.','target',3),
('Qu''est-ce qui nous tient debout ?','Nos valeurs','La foi, l''hospitalité, la transparence financière, le respect de la personne et le travail bien fait. Ce que nous faisons pour Dieu mérite l''excellence.','heart',4);

INSERT INTO public.upcoming_events (date_label, title, detail, tone, position) VALUES
('02 – 08 août','Semaine de la famille','Séminaire couples mardi et jeudi 18h, culte familial dimanche 09h.','from-ig-blue to-ig-purple',1),
('09 – 15 août','Camp jeunesse « Debout »','Départ vendredi 06h pour Kisantu, retour lundi. Culte de clôture dimanche 15h.','from-ig-purple to-ig-pink',2),
('16 – 22 août','Semaine d''action de grâce','Concert le samedi 19h, culte de reconnaissance dimanche 09h.','from-ig-pink to-ig-orange',3),
('23 – 29 août','Rentrée scolaire solidaire','Distribution de kits samedi 09h, prière pour les élèves dimanche.','from-ig-orange to-ig-gold',4);

-- ROLES
CREATE TYPE public.app_role AS ENUM ('berger', 'chef_departement', 'fidele');
CREATE TYPE public.request_status AS ENUM ('nouveau', 'en_cours', 'traite', 'rejete');

CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  letter text NOT NULL DEFAULT 'E',
  vision text,
  mission text,
  contact_phone text,
  contact_email text,
  usual_schedule text,
  urgent_schedule text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.departments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  commune text,
  avenue text,
  parcelle text,
  marital_status text,
  children_count int NOT NULL DEFAULT 0,
  phone text,
  emergency_contact text,
  photo_url text,
  birth_date date,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'berger');
$$;

CREATE OR REPLACE FUNCTION public.leads_department(_dept uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'chef_departement'
      AND (_dept IS NULL OR department_id = _dept)
  );
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, commune, avenue, parcelle, marital_status, children_count, phone, emergency_contact, birth_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.raw_user_meta_data->>'commune',
    NEW.raw_user_meta_data->>'avenue',
    NEW.raw_user_meta_data->>'parcelle',
    NEW.raw_user_meta_data->>'marital_status',
    COALESCE((NEW.raw_user_meta_data->>'children_count')::int, 0),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'emergency_contact',
    (NULLIF(NEW.raw_user_meta_data->>'birth_date','')::date)
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'fidele') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "Départements visibles par tous" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent les départements" ON public.departments FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Chefs modifient leur département" ON public.departments FOR UPDATE TO authenticated
  USING (public.leads_department(id)) WITH CHECK (public.leads_department(id));

CREATE POLICY "Profils lisibles par les membres" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Chacun modifie son profil" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin()) WITH CHECK (id = auth.uid() OR public.is_admin());
CREATE POLICY "Chacun crée son profil" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Bergers suppriment un profil" ON public.profiles FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "Rôles lisibles par les membres" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Bergers gèrent les rôles" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PROGRAMMES
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  department_id uuid REFERENCES public.departments(id) ON DELETE CASCADE,
  day_of_week int,
  start_time text,
  event_date date,
  scope text NOT NULL DEFAULT 'hebdomadaire',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.programs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Programmes publics" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent les programmes" ON public.programs FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Chefs gèrent leurs programmes" ON public.programs FOR ALL TO authenticated
  USING (public.leads_department(department_id)) WITH CHECK (public.leads_department(department_id));

-- ACTUALITES
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'communique',
  content text NOT NULL,
  letter text NOT NULL DEFAULT 'E',
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Actualités publiques" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent les actualités" ON public.announcements FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Chefs gèrent leurs actualités" ON public.announcements FOR ALL TO authenticated
  USING (public.leads_department(department_id)) WITH CHECK (public.leads_department(department_id));

-- TEMOIGNAGES
CREATE TABLE public.testimonies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  photo_url text,
  content text NOT NULL,
  likes_count int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.testimonies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonies TO authenticated;
GRANT ALL ON public.testimonies TO service_role;
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Témoignages publiés visibles" ON public.testimonies FOR SELECT USING (published OR public.is_admin() OR user_id = auth.uid());
CREATE POLICY "Tout le monde peut témoigner" ON public.testimonies FOR INSERT WITH CHECK (published = false);
CREATE POLICY "Bergers gèrent les témoignages" ON public.testimonies FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.testimony_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  testimony_id uuid NOT NULL REFERENCES public.testimonies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (testimony_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.testimony_likes TO authenticated;
GRANT ALL ON public.testimony_likes TO service_role;
ALTER TABLE public.testimony_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes témoignages lisibles" ON public.testimony_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Chacun aime un témoignage" ON public.testimony_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Chacun retire son like" ON public.testimony_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- MEDIATHEQUE
CREATE TABLE public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  story text,
  category text NOT NULL DEFAULT 'Photos',
  media_url text,
  thumbnail_url text,
  likes_count int NOT NULL DEFAULT 0,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_items TO authenticated;
GRANT ALL ON public.media_items TO service_role;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Médias publics" ON public.media_items FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent les médias" ON public.media_items FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Chefs gèrent leurs médias" ON public.media_items FOR ALL TO authenticated
  USING (public.leads_department(department_id)) WITH CHECK (public.leads_department(department_id));

CREATE TABLE public.media_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid NOT NULL REFERENCES public.media_items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (media_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.media_likes TO authenticated;
GRANT ALL ON public.media_likes TO service_role;
ALTER TABLE public.media_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes médias lisibles" ON public.media_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Chacun aime un média" ON public.media_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Chacun retire son like média" ON public.media_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- FORMULAIRES
CREATE TABLE public.prayer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  anonymous boolean NOT NULL DEFAULT false,
  subject text NOT NULL,
  phone text,
  details text,
  status public.request_status NOT NULL DEFAULT 'nouveau',
  answered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.prayer_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayer_requests TO authenticated;
GRANT ALL ON public.prayer_requests TO service_role;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Envoyer une demande de prière" ON public.prayer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Responsables lisent les prières" ON public.prayer_requests FOR SELECT TO authenticated
  USING (public.is_admin() OR public.leads_department(NULL));
CREATE POLICY "Responsables traitent les prières" ON public.prayer_requests FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.leads_department(NULL)) WITH CHECK (true);
CREATE POLICY "Bergers suppriment les prières" ON public.prayer_requests FOR DELETE TO authenticated USING (public.is_admin());

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  anonymous boolean NOT NULL DEFAULT false,
  subject text NOT NULL,
  phone text,
  details text,
  preferred_date date,
  status public.request_status NOT NULL DEFAULT 'nouveau',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.appointments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Demander un rendez-vous" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Bergers gèrent les rendez-vous" ON public.appointments FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  anonymous boolean NOT NULL DEFAULT false,
  subject text NOT NULL,
  phone text,
  message text NOT NULL,
  status public.request_status NOT NULL DEFAULT 'nouveau',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Écrire à l'église" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Bergers gèrent les messages" ON public.contact_messages FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- FINANCES
CREATE TABLE public.finance_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  budget_total numeric NOT NULL DEFAULT 0,
  budget_raised numeric NOT NULL DEFAULT 0,
  image_url text,
  status text NOT NULL DEFAULT 'en_cours',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.finance_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_projects TO authenticated;
GRANT ALL ON public.finance_projects TO service_role;
ALTER TABLE public.finance_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projets publics" ON public.finance_projects FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent les projets" ON public.finance_projects FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name text,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  method text NOT NULL DEFAULT 'mobile_money',
  project_id uuid REFERENCES public.finance_projects(id) ON DELETE SET NULL,
  message text,
  status text NOT NULL DEFAULT 'annonce',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.donations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Annoncer un don" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Voir ses dons" ON public.donations FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Bergers gèrent les dons" ON public.donations FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PARTICIPATION
CREATE TABLE public.participation_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  period text NOT NULL,
  rate numeric NOT NULL,
  note text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.participation_rates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participation_rates TO authenticated;
GRANT ALL ON public.participation_rates TO service_role;
ALTER TABLE public.participation_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participation lisible" ON public.participation_rates FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent la participation" ON public.participation_rates FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Chefs déclarent leur participation" ON public.participation_rates FOR ALL TO authenticated
  USING (public.leads_department(department_id)) WITH CHECK (public.leads_department(department_id));

-- FRISE CHRONOLOGIQUE
CREATE TABLE public.timeline_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL,
  text text NOT NULL,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.timeline_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timeline_entries TO authenticated;
GRANT ALL ON public.timeline_entries TO service_role;
ALTER TABLE public.timeline_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Frise publique" ON public.timeline_entries FOR SELECT USING (true);
CREATE POLICY "Bergers gèrent la frise" ON public.timeline_entries FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- TRIGGERS updated_at
CREATE TRIGGER t_departments BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_programs BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_media BEFORE UPDATE ON public.media_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_projects BEFORE UPDATE ON public.finance_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COMPTEURS DE LIKES
CREATE OR REPLACE FUNCTION public.sync_testimony_likes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.testimonies SET likes_count = likes_count + 1 WHERE id = NEW.testimony_id;
  ELSE
    UPDATE public.testimonies SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.testimony_id;
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER t_testimony_likes AFTER INSERT OR DELETE ON public.testimony_likes
FOR EACH ROW EXECUTE FUNCTION public.sync_testimony_likes();

CREATE OR REPLACE FUNCTION public.sync_media_likes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.media_items SET likes_count = likes_count + 1 WHERE id = NEW.media_id;
  ELSE
    UPDATE public.media_items SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.media_id;
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER t_media_likes AFTER INSERT OR DELETE ON public.media_likes
FOR EACH ROW EXECUTE FUNCTION public.sync_media_likes();

-- DONNEES DE DEMARRAGE
INSERT INTO public.departments (name, slug, letter, vision, mission, contact_phone, usual_schedule, urgent_schedule) VALUES
('Louange & Adoration', 'louange', 'L', 'Conduire l''assemblée dans la présence de Dieu.', 'Former des adorateurs sincères et préparer les cultes.', '+243 810 000 001', 'Répétition : mardi & vendredi 17h00', 'Répétition générale samedi 15h00'),
('Jeunesse', 'jeunesse', 'J', 'Une génération debout pour Christ.', 'Encadrer, former et envoyer les jeunes.', '+243 810 000 002', 'Réunion : samedi 15h00', 'Camp jeunesse en préparation'),
('Intercession', 'intercession', 'I', 'Veiller et prier sans relâche.', 'Porter l''église et la nation dans la prière.', '+243 810 000 003', 'Prière : mercredi 18h30', 'Nuit de prière chaque dernier vendredi'),
('Évangélisation', 'evangelisation', 'V', 'Atteindre chaque quartier de Kinshasa.', 'Annoncer l''Évangile et faire des disciples.', '+243 810 000 004', 'Sortie : dimanche 07h30', 'Croisade trimestrielle'),
('Œuvres sociales', 'oeuvres-sociales', 'O', 'Servir avec compassion.', 'Assister les veuves, orphelins et malades.', '+243 810 000 005', 'Visites : jeudi 10h00', 'Assistance d''urgence sur appel'),
('École du dimanche', 'ecole-du-dimanche', 'D', 'Enraciner les enfants dans la Parole.', 'Enseigner la Bible aux enfants avec créativité.', '+243 810 000 006', 'Dimanche 09h00', 'Fête des enfants en décembre');

INSERT INTO public.timeline_entries (year, title, text, position) VALUES
('1998', 'La première cellule de prière', 'Douze personnes se réunissent dans un salon de Kinshasa pour prier chaque soir.', 1),
('2004', 'Première implantation', 'La communauté ouvre son premier lieu de culte permanent.', 2),
('2012', 'Naissance des départements', 'Louange, jeunesse et intercession sont structurés officiellement.', 3),
('2019', 'Rayonnement national', 'Sept implantations à travers le pays et des croisades régulières.', 4),
('2026', 'Une maison numérique', 'L''église lance sa plateforme en ligne pour rester connectée à ses fidèles.', 5);

INSERT INTO public.finance_projects (title, description, budget_total, budget_raised, status) VALUES
('Construction du nouveau temple', 'Un sanctuaire de 3 000 places pour accueillir la communauté grandissante.', 250000, 118000, 'en_cours'),
('Forage d''eau potable', 'Un forage au service du quartier et des familles voisines de l''église.', 32000, 21500, 'en_cours'),
('Bourse scolaire des orphelins', 'Frais scolaires annuels pour 140 enfants pris en charge par l''église.', 48000, 48000, 'termine'),
('Studio média & podcast', 'Équipement audio et vidéo pour diffuser les enseignements.', 27000, 27000, 'termine');

INSERT INTO public.testimonies (display_name, content, likes_count, published) VALUES
('Grâce Mukendi', 'Le Seigneur m''a délivrée d''une longue maladie. À Lui seul la gloire !', 128, true),
('Emmanuel Tshisekedi', 'Après trois ans sans emploi, Dieu m''a ouvert une porte. Merci Jésus.', 94, true),
('Miriam Ilunga', 'Mon foyer restauré, mes enfants convertis. La prière change tout.', 212, true),
('Josué Kabila', 'Baptisé le mois dernier, ma vie n''est plus la même. Gloire à Dieu.', 76, true);

INSERT INTO public.media_items (title, description, story, category, likes_count) VALUES
('Convention 2026', '3 jours d''enseignement puissant', 'La convention annuelle a rassemblé plus de 4 000 fidèles autour du thème de la foi agissante.', 'Affiches', 54),
('Nuit de louange', 'Une nuit face à Dieu', 'Douze heures d''adoration ininterrompue portées par la chorale et les jeunes.', 'Affiches', 33),
('Baptême Congo River', '12 nouvelles âmes', 'Douze nouveaux convertis ont été baptisés dans le fleuve Congo au lever du soleil.', 'Photos', 87),
('Chorale du dimanche', 'Louange qui élève', 'La chorale prépare chaque semaine un répertoire nouveau pour le culte solennel.', 'Photos', 41),
('La foi en action', 'Épisode 12 · Past. Daniel', 'Un enseignement sur la foi qui produit des œuvres concrètes dans le quotidien.', 'Podcasts', 29),
('Culte du 20 juillet', 'Prédication complète', 'Retrouvez l''intégralité du message sur la persévérance dans l''épreuve.', 'Vidéos', 62);

INSERT INTO public.announcements (title, category, content, letter) VALUES
('Culte de dimanche', 'culte', 'Culte solennel à 09h00, thème : « La foi qui déplace les montagnes ».', 'E'),
('Séminaire jeunesse', 'seminaire', 'Trois jours de formation spirituelle pour la jeunesse. Inscription ouverte.', 'J'),
('Intercession nationale', 'intercession', 'Nuit de prière pour la RDC. Rejoignez-nous en présentiel ou en direct.', 'I'),
('Évangélisation de rue', 'evangelisation', 'Sortie évangélique à Kinshasa – quartier Matonge. Tous mobilisés.', 'V'),
('Anniversaire — Sœur Grâce', 'anniversaire', 'Célébrons ensemble une année de plus dans la grâce du Seigneur.', 'F');

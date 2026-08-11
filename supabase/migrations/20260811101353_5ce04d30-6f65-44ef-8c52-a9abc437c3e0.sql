CREATE TABLE public.meditations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL,
  reference text NOT NULL DEFAULT '',
  message text NOT NULL,
  author text NOT NULL DEFAULT '',
  initial text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  published_at date NOT NULL DEFAULT current_date,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.meditations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meditations TO authenticated;
GRANT ALL ON public.meditations TO service_role;

ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Méditations actives visibles" ON public.meditations
  FOR SELECT USING (active OR public.is_admin());

CREATE POLICY "Bergers gèrent les méditations" ON public.meditations
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER t_meditations BEFORE UPDATE ON public.meditations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.meditations (book, reference, message, author, initial, active)
VALUES ('Matthieu', '11:28', '« Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos. » Une invitation qui traverse les siècles et rejoint votre cœur aujourd''hui.', 'Past. Daniel Mbayo', 'D', true);
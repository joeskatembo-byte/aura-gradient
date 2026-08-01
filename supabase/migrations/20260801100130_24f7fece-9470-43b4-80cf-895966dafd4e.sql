
ALTER TABLE public.profiles
  ADD COLUMN login_email text,
  ADD COLUMN login_slug text,
  ADD COLUMN first_slug text,
  ADD COLUMN last_slug text;

CREATE UNIQUE INDEX profiles_login_slug_key ON public.profiles (login_slug) WHERE login_slug IS NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (
    id, first_name, last_name, commune, avenue, parcelle, marital_status,
    children_count, phone, emergency_contact, birth_date, photo_url,
    department_id, login_email, login_slug, first_slug, last_slug
  )
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
    (NULLIF(NEW.raw_user_meta_data->>'birth_date','')::date),
    NEW.raw_user_meta_data->>'photo_url',
    (NULLIF(NEW.raw_user_meta_data->>'department_id','')::uuid),
    NEW.email,
    NEW.raw_user_meta_data->>'login_slug',
    NEW.raw_user_meta_data->>'first_slug',
    NEW.raw_user_meta_data->>'last_slug'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'fidele') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.resolve_login(_name text)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _slug text := _name;
  _email text;
  _count int;
BEGIN
  IF _slug IS NULL OR length(_slug) < 2 THEN RETURN NULL; END IF;
  SELECT count(*), min(login_email) INTO _count, _email
  FROM public.profiles
  WHERE login_email IS NOT NULL
    AND (login_slug = _slug OR first_slug = _slug OR last_slug = _slug);
  IF _count = 1 THEN RETURN _email; END IF;
  RETURN NULL;
END; $$;

GRANT EXECUTE ON FUNCTION public.resolve_login(text) TO anon, authenticated;

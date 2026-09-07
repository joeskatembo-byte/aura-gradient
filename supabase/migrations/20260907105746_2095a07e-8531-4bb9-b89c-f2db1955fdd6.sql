ALTER TABLE public.departments
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS lead_name text,
  ADD COLUMN IF NOT EXISTS icon text NOT NULL DEFAULT 'users',
  ADD COLUMN IF NOT EXISTS tone text NOT NULL DEFAULT 'from-ig-blue to-ig-purple',
  ADD COLUMN IF NOT EXISTS news text;

ALTER TABLE public.programs
  ADD COLUMN IF NOT EXISTS place text,
  ADD COLUMN IF NOT EXISTS tag text;
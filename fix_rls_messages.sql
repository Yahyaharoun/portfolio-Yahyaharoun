-- 1. CRÉATION DE LA TABLE MESSAGES (Si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CRÉATION DE LA TABLE PARTNERSHIP_REQUESTS (Si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.partnership_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  website text,
  project_type text NOT NULL,
  budget_range text NOT NULL,
  description text NOT NULL,
  attachment_url text,
  status text DEFAULT 'nouveau',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ACTIVATION RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;

-- 4. POLITIQUES RLS
-- (Supprime les anciennes politiques si elles existent pour éviter les doublons)
DROP POLICY IF EXISTS "anyone_can_insert_message" ON public.messages;
DROP POLICY IF EXISTS "anyone_can_insert_partnership" ON public.partnership_requests;

-- Autoriser l'insertion anonyme
CREATE POLICY "anyone_can_insert_message" ON public.messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "anyone_can_insert_partnership" ON public.partnership_requests FOR INSERT TO public WITH CHECK (true);

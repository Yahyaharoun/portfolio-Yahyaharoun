-- ============================================================================
-- SCHEMA SUPABASE - Portfolio PWA Yahya Haroun
-- A executer dans Supabase > SQL Editor
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- PROFILES (lie a auth.users, definit qui est admin)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Yahya Haroun',
  title text default 'Developpeur Full Stack',
  bio text,
  vision text,
  avatar_url text,
  email text,
  phone text,
  linkedin_url text,
  github_url text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TECHNOLOGIES (referentiel des technologies utilisees dans les projets)
-- ---------------------------------------------------------------------------
create table if not exists technologies (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  icon text,
  category text check (category in ('frontend', 'backend', 'database', 'devops', 'other')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PROJECTS
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  type text not null,
  context text,
  solution text,
  description text,
  impact text,
  demo_url text,
  repo_url text,
  cover_image_url text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_technologies (
  project_id uuid references projects(id) on delete cascade,
  technology_id uuid references technologies(id) on delete cascade,
  primary key (project_id, technology_id)
);

create table if not exists project_images (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- EXPERIENCES (timeline)
-- ---------------------------------------------------------------------------
create table if not exists experiences (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  organization text,
  type text check (type in ('formation', 'entrepreneuriat', 'projet', 'stage', 'autre')),
  description text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CERTIFICATIONS
-- ---------------------------------------------------------------------------
create table if not exists certifications (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  issuer text,
  issue_date date,
  credential_url text,
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- GALLERY
-- ---------------------------------------------------------------------------
create table if not exists gallery (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  category text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TESTIMONIALS
-- ---------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  author_role text,
  company text,
  content text not null,
  external_url text,
  avatar_url text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ARTICLES (blog)
-- ---------------------------------------------------------------------------
create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  category text check (category in ('developpement', 'cybersecurite', 'ia', 'entrepreneuriat')),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CONTACTS (messages du formulaire de contact)
-- ---------------------------------------------------------------------------
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PARTNERSHIP_REQUESTS
-- ---------------------------------------------------------------------------
create table if not exists partnership_requests (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  company text,
  website text,
  project_type text not null check (
    project_type in ('application_web', 'saas', 'site_internet', 'automatisation', 'ia', 'cybersecurite')
  ),
  budget_range text not null check (
    budget_range in ('moins_100000', '100000_500000', 'plus_500000')
  ),
  description text not null,
  attachment_url text,
  status text not null default 'nouveau' check (status in ('nouveau', 'en_cours', 'traite', 'archive')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ANALYTICS (compteurs simples, alimentes par les routes API)
-- ---------------------------------------------------------------------------
create table if not exists analytics (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null check (event_type in ('page_view', 'cv_download', 'project_view', 'contact_sent', 'partnership_sent')),
  page_path text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CV_DATA (donnees structurees utilisees pour generer le PDF)
-- ---------------------------------------------------------------------------
create table if not exists cv_data (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  professional_title text not null,
  summary text,
  skills jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table profiles enable row level security;
alter table technologies enable row level security;
alter table projects enable row level security;
alter table project_technologies enable row level security;
alter table project_images enable row level security;
alter table experiences enable row level security;
alter table certifications enable row level security;
alter table gallery enable row level security;
alter table testimonials enable row level security;
alter table articles enable row level security;
alter table contacts enable row level security;
alter table partnership_requests enable row level security;
alter table analytics enable row level security;
alter table cv_data enable row level security;

-- Fonction utilitaire : verifie si l'utilisateur courant est admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- --- Lecture publique du contenu publie ---
create policy "public read published projects" on projects for select using (is_published = true);
create policy "public read technologies" on technologies for select using (true);
create policy "public read project_technologies" on project_technologies for select using (true);
create policy "public read project_images" on project_images for select using (true);
create policy "public read published experiences" on experiences for select using (is_published = true);
create policy "public read published certifications" on certifications for select using (is_published = true);
create policy "public read published gallery" on gallery for select using (is_published = true);
create policy "public read published testimonials" on testimonials for select using (is_published = true);
create policy "public read published articles" on articles for select using (is_published = true);
create policy "public read active cv_data" on cv_data for select using (is_active = true);
create policy "public read own profile info" on profiles for select using (true);

-- --- Ecriture publique restreinte (formulaires) ---
create policy "anyone can insert contact" on contacts for insert with check (true);
create policy "anyone can insert partnership request" on partnership_requests for insert with check (true);
create policy "anyone can insert analytics event" on analytics for insert with check (true);

-- --- Acces complet admin sur toutes les tables de gestion ---
create policy "admin full access profiles" on profiles for all using (is_admin()) with check (is_admin());
create policy "admin full access technologies" on technologies for all using (is_admin()) with check (is_admin());
create policy "admin full access projects" on projects for all using (is_admin()) with check (is_admin());
create policy "admin full access project_technologies" on project_technologies for all using (is_admin()) with check (is_admin());
create policy "admin full access project_images" on project_images for all using (is_admin()) with check (is_admin());
create policy "admin full access experiences" on experiences for all using (is_admin()) with check (is_admin());
create policy "admin full access certifications" on certifications for all using (is_admin()) with check (is_admin());
create policy "admin full access gallery" on gallery for all using (is_admin()) with check (is_admin());
create policy "admin full access testimonials" on testimonials for all using (is_admin()) with check (is_admin());
create policy "admin full access articles" on articles for all using (is_admin()) with check (is_admin());
create policy "admin read contacts" on contacts for select using (is_admin());
create policy "admin update contacts" on contacts for update using (is_admin()) with check (is_admin());
create policy "admin delete contacts" on contacts for delete using (is_admin());
create policy "admin read partnership_requests" on partnership_requests for select using (is_admin());
create policy "admin update partnership_requests" on partnership_requests for update using (is_admin()) with check (is_admin());
create policy "admin delete partnership_requests" on partnership_requests for delete using (is_admin());
create policy "admin read analytics" on analytics for select using (is_admin());
create policy "admin full access cv_data" on cv_data for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- TRIGGER : creation automatique du profil a l'inscription (premier admin)
-- ============================================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'admin');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- STORAGE BUCKETS (a creer aussi via l'interface Supabase > Storage)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "admin upload media" on storage.objects for insert with check (bucket_id = 'media' and is_admin());
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and is_admin());
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and is_admin());

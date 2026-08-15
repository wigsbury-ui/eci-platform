-- =============================================================================
-- ECI Supabase bootstrap
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- Project should already be renamed to ECI.
-- WARNING: This permanently deletes Evalent schemas/data in public + intelligence.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- PART 1 — Clear Evalent content
-- -----------------------------------------------------------------------------

drop schema if exists intelligence cascade;

drop schema if exists public cascade;
create schema public;

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on schema public to postgres, anon, authenticated, service_role;
grant all on schema public to public;

alter default privileges in schema public
  grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to postgres, anon, authenticated, service_role;
alter default privileges in schema public
  grant all on functions to postgres, anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- PART 2 — Extensions
-- -----------------------------------------------------------------------------

create extension if not exists "pgcrypto";
-- Optional for future chatbot embeddings (safe if unavailable on free tier):
-- create extension if not exists vector;

-- -----------------------------------------------------------------------------
-- PART 3 — Core ECI tables
-- -----------------------------------------------------------------------------

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  city text not null,
  status text not null default 'prospect'
    check (status in ('prospect', 'setting_up', 'active', 'paused')),
  logo_url text,
  website text,
  contact_name text,
  contact_email text,
  student_count integer,
  year_joined integer,
  curriculum text[],
  accreditations text[],
  description text,
  short_bio text,
  is_public boolean not null default false,
  image_url text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'school_partner'
    check (role in ('investor', 'school_partner', 'employee', 'board_member', 'admin', 'super_admin')),
  school_id uuid references public.schools(id) on delete set null,
  job_title text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.document_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  sort_order integer not null default 0
);

create table public.document_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scope text not null
    check (scope in ('network', 'school', 'investor_marketing', 'investor_dd', 'team')),
  school_id uuid references public.schools(id) on delete cascade,
  parent_id uuid references public.document_folders(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category_id uuid references public.document_categories(id) on delete set null,
  doc_type text not null default 'guidance'
    check (doc_type in ('guidance', 'template', 'policy', 'form', 'report', 'marketing', 'due_diligence')),
  access_level text not null default 'school_partner',
  scope text not null default 'network'
    check (scope in ('network', 'school', 'investor_marketing', 'investor_dd', 'team')),
  school_id uuid references public.schools(id) on delete set null,
  folder_path text default '/',
  parent_folder_id uuid references public.document_folders(id) on delete set null,
  file_url text,
  file_name text,
  file_size_kb integer,
  version text default '1.0',
  is_published boolean not null default false,
  download_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text[],
  is_pinned boolean not null default false,
  published_at timestamptz not null default now()
);

create table public.investor_enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  organisation text,
  email text not null,
  phone text,
  country text,
  investment_type text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  visibility text not null
    check (visibility in ('network', 'school', 'internal')),
  school_id uuid references public.schools(id) on delete cascade,
  location text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.message_threads (
  id uuid primary key default gen_random_uuid(),
  thread_type text not null
    check (thread_type in ('direct', 'school_channel', 'team')),
  title text,
  school_id uuid references public.schools(id) on delete cascade,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.message_participants (
  thread_id uuid references public.message_threads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  primary key (thread_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.message_threads(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  body text not null,
  attachment_url text,
  created_at timestamptz not null default now()
);

create table public.chat_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  audience text not null,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

create table public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text,
  audience text[] not null,
  content text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- PART 4 — Role helper (used by login / dashboard routing)
-- -----------------------------------------------------------------------------

create or replace function public.get_my_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

grant execute on function public.get_my_role() to anon, authenticated;

-- Auto-create a profile row when a user is created in Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'school_partner')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- PART 5 — Row Level Security (starter policies)
-- -----------------------------------------------------------------------------

alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.document_categories enable row level security;
alter table public.document_folders enable row level security;
alter table public.documents enable row level security;
alter table public.announcements enable row level security;
alter table public.investor_enquiries enable row level security;
alter table public.calendar_events enable row level security;
alter table public.message_threads enable row level security;
alter table public.message_participants enable row level security;
alter table public.messages enable row level security;
alter table public.chat_logs enable row level security;
alter table public.knowledge_chunks enable row level security;

-- Public can read public schools
create policy "Public schools are readable"
  on public.schools for select
  using (is_public = true or auth.uid() is not null);

-- Staff can manage schools
create policy "Staff manage schools"
  on public.schools for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('employee', 'admin', 'board_member', 'super_admin')
    )
  );

-- Profiles: users read own; staff read all
create policy "Users read own profile"
  on public.profiles for select
  using (id = auth.uid() or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('employee', 'admin', 'board_member', 'super_admin')
  ));

create policy "Users update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Staff manage profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'super_admin')
    )
  );

-- Document categories / published docs readable to authenticated
create policy "Authenticated read categories"
  on public.document_categories for select
  to authenticated
  using (true);

create policy "Staff manage categories"
  on public.document_categories for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('employee', 'admin', 'board_member', 'super_admin')
    )
  );

create policy "Read published documents"
  on public.documents for select
  to authenticated
  using (
    is_published = true
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('employee', 'admin', 'board_member', 'super_admin')
    )
  );

create policy "Staff manage documents"
  on public.documents for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('employee', 'admin', 'board_member', 'super_admin')
    )
  );

create policy "Staff manage folders"
  on public.document_folders for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('employee', 'admin', 'board_member', 'super_admin')
    )
  );

create policy "Authenticated read folders"
  on public.document_folders for select
  to authenticated
  using (true);

-- Announcements
create policy "Authenticated read announcements"
  on public.announcements for select
  to authenticated
  using (true);

create policy "Staff manage announcements"
  on public.announcements for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('employee', 'admin', 'board_member', 'super_admin')
    )
  );

-- Investor enquiries: anyone can insert (public form); staff can read
create policy "Anyone insert enquiries"
  on public.investor_enquiries for insert
  with check (true);

create policy "Staff read enquiries"
  on public.investor_enquiries for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('employee', 'admin', 'board_member', 'super_admin')
    )
  );

-- Calendar / messaging / chat — authenticated for now (tighten later)
create policy "Authenticated calendar read"
  on public.calendar_events for select to authenticated using (true);
create policy "Staff calendar write"
  on public.calendar_events for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('school_partner', 'employee', 'admin', 'board_member', 'super_admin')
    )
  );

create policy "Authenticated threads"
  on public.message_threads for all to authenticated using (true) with check (true);
create policy "Authenticated participants"
  on public.message_participants for all to authenticated using (true) with check (true);
create policy "Authenticated messages"
  on public.messages for all to authenticated using (true) with check (true);

create policy "Users insert chat logs"
  on public.chat_logs for insert to authenticated with check (true);
create policy "Staff read chat logs"
  on public.chat_logs for select
  using (
    user_id = auth.uid() or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'super_admin')
    )
  );

create policy "Authenticated read knowledge"
  on public.knowledge_chunks for select to authenticated using (published = true);

-- -----------------------------------------------------------------------------
-- PART 6 — Seed network schools + document categories
-- -----------------------------------------------------------------------------

insert into public.schools (
  name, country, city, status, website, year_joined, curriculum, short_bio, description, is_public
) values
(
  'Ellesmere College Riyadh',
  'Saudi Arabia',
  'Riyadh',
  'active',
  'https://ellesmerecollegeriyadh.com',
  2024,
  array['Early Years', 'IGCSE', 'IB Pathways', 'American Diploma'],
  'British-heritage education for ages 3–18 in the heart of Riyadh, delivering High Performance Learning in a nurturing, inclusive community.',
  'Ellesmere College Riyadh brings the Ellesmere educational philosophy to the Kingdom of Saudi Arabia through partnership with the Glory & Princeton International Schools Group.',
  true
),
(
  'Ellesmere College Muscat',
  'Oman',
  'Muscat',
  'active',
  null,
  2023,
  array['IB Continuum', 'Early Years to Grade 12'],
  'A vibrant international school combining the International Baccalaureate with Ellesmere’s Life:Ready ethos in Oman’s capital.',
  'Opened in 2023, Ellesmere College Muscat serves students from early years to Grade 12.',
  true
),
(
  'Ellesmere College Doha',
  'Qatar',
  'Doha',
  'setting_up',
  null,
  null,
  array['British Curriculum', 'Co-curricular Excellence'],
  'Purpose-built campus in Qatar offering world-class British education with cutting-edge facilities.',
  'Ellesmere College Doha is the newest addition to the Ellesmere international family, opening soon.',
  true
);

insert into public.document_categories (name, description, icon, sort_order) values
  ('Quality Assurance', 'Inspection and brand standards', 'shield', 1),
  ('Safeguarding', 'Safeguarding policies and templates', 'heart', 2),
  ('Curriculum', 'Curriculum frameworks and mapping', 'book', 3),
  ('Operations', 'Operational guidance for partners', 'clipboard-check', 4);

insert into public.announcements (title, body, audience, is_pinned) values
(
  'Welcome to the ECI partner platform',
  'This portal provides network documentation, shared calendars, and messaging with the ECI team.',
  array['school_partner', 'employee', 'admin', 'super_admin'],
  true
);

-- -----------------------------------------------------------------------------
-- PART 7 — Done. Next manual steps are listed in the chat reply.
-- -----------------------------------------------------------------------------

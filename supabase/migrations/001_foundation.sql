-- ECI platform foundation schema (apply in Supabase SQL editor or via CLI)
-- Extends existing profiles/schools/documents with dual archives, calendar, messaging, chat logs.

create extension if not exists vector;

-- Roles: investor | school_partner | employee | board_member | admin | super_admin
alter table if exists profiles
  add column if not exists role text;

-- Document dual-archive fields
alter table if exists documents
  add column if not exists scope text default 'network',
  add column if not exists school_id uuid references schools(id) on delete set null,
  add column if not exists folder_path text default '/',
  add column if not exists parent_folder_id uuid;

create table if not exists document_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scope text not null check (scope in ('network','school','investor_marketing','investor_dd','team')),
  school_id uuid references schools(id) on delete cascade,
  parent_id uuid references document_folders(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  visibility text not null check (visibility in ('network','school','internal')),
  school_id uuid references schools(id) on delete cascade,
  location text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists message_threads (
  id uuid primary key default gen_random_uuid(),
  thread_type text not null check (thread_type in ('direct','school_channel','team')),
  title text,
  school_id uuid references schools(id) on delete cascade,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists message_participants (
  thread_id uuid references message_threads(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  last_read_at timestamptz,
  primary key (thread_id, user_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references message_threads(id) on delete cascade,
  sender_id uuid references profiles(id) on delete set null,
  body text not null,
  attachment_url text,
  created_at timestamptz default now()
);

create table if not exists chat_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  audience text not null,
  question text not null,
  answer text not null,
  created_at timestamptz default now()
);

create table if not exists knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text,
  audience text[] not null,
  content text not null,
  embedding vector(1536),
  published boolean default true,
  created_at timestamptz default now()
);

create or replace function get_my_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

-- Storage buckets (create in dashboard if not present):
-- school-docs, investor-packs, team-docs
;
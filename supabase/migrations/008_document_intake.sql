-- Document intake: colleague uploads for staff review and articulation drafting.
-- Files live in storage bucket doc-intake (private). Public upload via API + secret token only.

create table public.document_intake_batches (
  id uuid primary key default gen_random_uuid(),
  submitter_name text not null,
  submitter_email text not null,
  department text,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'in_review', 'ready_for_articulation', 'promoted', 'archived')),
  review_notes text,
  suggested_pillar text
    check (suggested_pillar is null or suggested_pillar in (
      'governance', 'safeguarding', 'curriculum', 'operations', 'quality_assurance'
    )),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.document_intake_files (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.document_intake_batches(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  file_size_bytes bigint not null default 0,
  mime_type text,
  extracted_text text,
  created_at timestamptz not null default now()
);

create index document_intake_files_batch_id_idx on public.document_intake_files(batch_id);
create index document_intake_batches_status_idx on public.document_intake_batches(status);
create index document_intake_batches_created_at_idx on public.document_intake_batches(created_at desc);

-- Articulation drafts produced from intake source material
create table public.document_drafts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pillar text
    check (pillar is null or pillar in (
      'governance', 'safeguarding', 'curriculum', 'operations', 'quality_assurance'
    )),
  prompt_notes text,
  source_batch_id uuid references public.document_intake_batches(id) on delete set null,
  source_file_ids uuid[] not null default '{}',
  body_markdown text,
  status text not null default 'draft'
    check (status in ('draft', 'in_review', 'approved', 'archived')),
  created_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.document_intake_batches enable row level security;
alter table public.document_intake_files enable row level security;
alter table public.document_drafts enable row level security;

create policy "Staff read intake batches"
  on public.document_intake_batches for select
  to authenticated
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff manage intake batches"
  on public.document_intake_batches for update
  to authenticated
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff read intake files"
  on public.document_intake_files for select
  to authenticated
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff manage drafts"
  on public.document_drafts for all
  to authenticated
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

-- Storage bucket (private, 50 MB per object)
insert into storage.buckets (id, name, public, file_size_limit)
values ('doc-intake', 'doc-intake', false, 52428800)
on conflict (id) do update set file_size_limit = 52428800;

create policy "Staff read doc-intake objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'doc-intake'
    and public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin')
  );

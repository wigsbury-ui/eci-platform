-- Auto-generated colleague upload links (no Vercel DOCUMENT_INTAKE_TOKEN required).
-- Staff create/revoke links in Team → Doc intake. Tokens validate against this table.

create table public.document_intake_links (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  label text not null default 'Colleague upload',
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index document_intake_links_active_idx
  on public.document_intake_links(is_active)
  where is_active = true;

create index document_intake_links_token_idx
  on public.document_intake_links(token);

alter table public.document_intake_links enable row level security;

create policy "Staff read intake links"
  on public.document_intake_links for select
  to authenticated
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff insert intake links"
  on public.document_intake_links for insert
  to authenticated
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff update intake links"
  on public.document_intake_links for update
  to authenticated
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

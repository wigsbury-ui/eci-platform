-- Phase C: agreements ledger, evidence files, partner notifications, storage bucket

create table if not exists public.school_service_agreements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  service_group smallint not null check (service_group between 1 and 3),
  activated_at timestamptz not null default now(),
  activated_by uuid references public.profiles(id) on delete set null,
  notes text,
  unique (school_id, service_group)
);

alter table public.promise_evidence
  add column if not exists file_url text,
  add column if not exists file_name text,
  add column if not exists storage_path text;

create table if not exists public.delivery_notifications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  promise_id uuid references public.service_promises(id) on delete set null,
  audience text not null check (audience in ('school_partner', 'staff')),
  kind text not null check (kind in ('status_change', 'evidence_added', 'overdue', 'review_reminder')),
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists school_service_agreements_school_idx on public.school_service_agreements(school_id);
create index if not exists delivery_notifications_school_idx on public.delivery_notifications(school_id);
create index if not exists delivery_notifications_audience_idx on public.delivery_notifications(audience);
create index if not exists delivery_notifications_unread_idx on public.delivery_notifications(school_id, read_at);

alter table public.school_service_agreements enable row level security;
alter table public.delivery_notifications enable row level security;

create policy "Staff read school_service_agreements"
  on public.school_service_agreements for select
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff manage school_service_agreements"
  on public.school_service_agreements for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "School partners read own agreements"
  on public.school_service_agreements for select
  using (
    public.current_user_role() = 'school_partner'
    and school_id = (select school_id from public.profiles where id = auth.uid())
  );

create policy "Staff read delivery_notifications"
  on public.delivery_notifications for select
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff manage delivery_notifications"
  on public.delivery_notifications for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "School partners read own delivery_notifications"
  on public.delivery_notifications for select
  using (
    audience = 'school_partner'
    and public.current_user_role() = 'school_partner'
    and school_id = (select school_id from public.profiles where id = auth.uid())
  );

create policy "School partners mark notifications read"
  on public.delivery_notifications for update
  using (
    audience = 'school_partner'
    and public.current_user_role() = 'school_partner'
    and school_id = (select school_id from public.profiles where id = auth.uid())
  )
  with check (
    audience = 'school_partner'
    and public.current_user_role() = 'school_partner'
    and school_id = (select school_id from public.profiles where id = auth.uid())
  );

-- Private bucket for uploaded delivery evidence (50 MB per file)
insert into storage.buckets (id, name, public, file_size_limit)
values ('delivery-evidence', 'delivery-evidence', false, 52428800)
on conflict (id) do update set file_size_limit = 52428800;

create policy "Staff read delivery-evidence objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'delivery-evidence'
    and public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin')
  );

create policy "Staff upload delivery-evidence objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'delivery-evidence'
    and public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin')
  );

create policy "Staff delete delivery-evidence objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'delivery-evidence'
    and public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin')
  );

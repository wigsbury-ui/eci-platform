-- Partner delivery accountability: promise ledger per school (Phase A — Group 1 MVP)

create table if not exists public.service_promises (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  service_id text not null,
  service_group smallint not null check (service_group between 1 and 3),
  title text not null,
  promise_text text,
  success_criteria jsonb not null default '[]'::jsonb,
  status text not null default 'pending_verification'
    check (status in ('green', 'amber', 'red', 'pending_verification', 'over_delivered')),
  owner_profile_id uuid references public.profiles(id) on delete set null,
  owner_name text,
  next_review_at date,
  last_reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, service_id)
);

create table if not exists public.promise_evidence (
  id uuid primary key default gen_random_uuid(),
  promise_id uuid not null references public.service_promises(id) on delete cascade,
  title text not null,
  url text,
  added_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.promise_reviews (
  id uuid primary key default gen_random_uuid(),
  promise_id uuid not null references public.service_promises(id) on delete cascade,
  reviewed_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id) on delete set null,
  previous_status text,
  new_status text not null,
  notes text
);

create index if not exists service_promises_school_idx on public.service_promises(school_id);
create index if not exists service_promises_status_idx on public.service_promises(status);
create index if not exists service_promises_group_idx on public.service_promises(service_group);
create index if not exists promise_evidence_promise_idx on public.promise_evidence(promise_id);
create index if not exists promise_reviews_promise_idx on public.promise_reviews(promise_id);

create or replace function public.touch_service_promise_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists service_promises_updated_at on public.service_promises;
create trigger service_promises_updated_at
  before update on public.service_promises
  for each row execute function public.touch_service_promise_updated_at();

alter table public.service_promises enable row level security;
alter table public.promise_evidence enable row level security;
alter table public.promise_reviews enable row level security;

create policy "Staff read service_promises"
  on public.service_promises for select
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff manage service_promises"
  on public.service_promises for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff read promise_evidence"
  on public.promise_evidence for select
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff manage promise_evidence"
  on public.promise_evidence for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff read promise_reviews"
  on public.promise_reviews for select
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

create policy "Staff manage promise_reviews"
  on public.promise_reviews for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

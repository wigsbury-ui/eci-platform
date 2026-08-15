-- Fix RLS infinite recursion on profiles / schools
-- Run in Supabase SQL Editor

-- Helper: read caller's role without triggering profiles RLS
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

grant execute on function public.current_user_role() to anon, authenticated;

-- Recreate profile policies without self-referential exists()
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Staff manage profiles" on public.profiles;

create policy "Users read own profile"
  on public.profiles for select
  using (
    id = auth.uid()
    or public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin')
  );

create policy "Users update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Staff manage profiles"
  on public.profiles for all
  using (public.current_user_role() in ('admin', 'super_admin'))
  with check (public.current_user_role() in ('admin', 'super_admin'));

-- Schools: keep public read simple; staff write via helper
drop policy if exists "Public schools are readable" on public.schools;
drop policy if exists "Staff manage schools" on public.schools;

create policy "Public schools are readable"
  on public.schools for select
  using (is_public = true or auth.uid() is not null);

create policy "Staff manage schools"
  on public.schools for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

-- Same pattern for other staff policies that queried profiles directly
drop policy if exists "Staff manage categories" on public.document_categories;
create policy "Staff manage categories"
  on public.document_categories for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

drop policy if exists "Read published documents" on public.documents;
drop policy if exists "Staff manage documents" on public.documents;
create policy "Read published documents"
  on public.documents for select
  to authenticated
  using (
    is_published = true
    or public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin')
  );
create policy "Staff manage documents"
  on public.documents for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

drop policy if exists "Staff manage folders" on public.document_folders;
create policy "Staff manage folders"
  on public.document_folders for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

drop policy if exists "Staff manage announcements" on public.announcements;
create policy "Staff manage announcements"
  on public.announcements for all
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

drop policy if exists "Staff read enquiries" on public.investor_enquiries;
create policy "Staff read enquiries"
  on public.investor_enquiries for select
  using (public.current_user_role() in ('employee', 'admin', 'board_member', 'super_admin'));

drop policy if exists "Staff calendar write" on public.calendar_events;
create policy "Staff calendar write"
  on public.calendar_events for all
  using (public.current_user_role() in ('school_partner', 'employee', 'admin', 'board_member', 'super_admin'))
  with check (public.current_user_role() in ('school_partner', 'employee', 'admin', 'board_member', 'super_admin'));

drop policy if exists "Staff read chat logs" on public.chat_logs;
create policy "Staff read chat logs"
  on public.chat_logs for select
  using (
    user_id = auth.uid()
    or public.current_user_role() in ('admin', 'super_admin')
  );

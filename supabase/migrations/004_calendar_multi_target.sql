-- Multi-calendar targeting: events can appear on the admin/team calendar
-- and/or any combination of school calendars (or all schools).

alter table public.calendar_events
  add column if not exists show_on_admin boolean not null default true;

alter table public.calendar_events
  add column if not exists all_schools boolean not null default false;

alter table public.calendar_events
  add column if not exists school_ids text[] not null default '{}';

-- Backfill from legacy visibility + school_id
update public.calendar_events
set all_schools = true
where visibility = 'network' and all_schools = false;

update public.calendar_events
set school_ids = array[school_id::text]
where visibility = 'school'
  and school_id is not null
  and (school_ids is null or cardinality(school_ids) = 0);

update public.calendar_events
set show_on_admin = true
where visibility in ('internal', 'network', 'school');

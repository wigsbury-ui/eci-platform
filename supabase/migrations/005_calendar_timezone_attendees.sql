-- Timezone, named attendees, and richer meeting metadata for calendar blocks.

alter table public.calendar_events
  add column if not exists timezone text not null default 'Europe/London';

alter table public.calendar_events
  add column if not exists attendees text[] not null default '{}';

comment on column public.calendar_events.timezone is
  'IANA timezone for wall-clock meeting times (e.g. Asia/Riyadh).';

comment on column public.calendar_events.attendees is
  'Display names of people involved in the meeting.';

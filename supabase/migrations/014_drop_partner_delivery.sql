-- Remove partner delivery module (tables + storage bucket) if present in live DB

drop policy if exists "Staff read delivery-evidence objects" on storage.objects;
drop policy if exists "Staff upload delivery-evidence objects" on storage.objects;
drop policy if exists "Staff delete delivery-evidence objects" on storage.objects;

delete from storage.objects where bucket_id = 'delivery-evidence';
delete from storage.buckets where id = 'delivery-evidence';

drop table if exists public.delivery_notifications cascade;
drop table if exists public.school_service_agreements cascade;
drop table if exists public.promise_reviews cascade;
drop table if exists public.promise_evidence cascade;
drop table if exists public.service_promises cascade;

drop function if exists public.touch_service_promise_updated_at() cascade;

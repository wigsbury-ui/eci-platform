-- Roll back partner delivery module (removed from application)

drop table if exists public.delivery_notifications cascade;
drop table if exists public.promise_reviews cascade;
drop table if exists public.promise_evidence cascade;
drop table if exists public.school_service_agreements cascade;
drop table if exists public.service_promises cascade;

-- Storage bucket from phase C (objects removed with bucket)
delete from storage.objects where bucket_id = 'delivery-evidence';
delete from storage.buckets where id = 'delivery-evidence';

-- Phase B: document-linked evidence + school partner read access

alter table public.promise_evidence
  add column if not exists document_id uuid references public.documents(id) on delete set null;

create index if not exists promise_evidence_document_idx on public.promise_evidence(document_id);

-- School partners: read-only delivery visibility for their campus
create policy "School partners read own service_promises"
  on public.service_promises for select
  using (
    public.current_user_role() = 'school_partner'
    and school_id = (select school_id from public.profiles where id = auth.uid())
  );

create policy "School partners read own promise_evidence"
  on public.promise_evidence for select
  using (
    exists (
      select 1
      from public.service_promises sp
      join public.profiles p on p.id = auth.uid()
      where sp.id = promise_evidence.promise_id
        and p.role = 'school_partner'
        and sp.school_id = p.school_id
    )
  );

create policy "School partners read own promise_reviews"
  on public.promise_reviews for select
  using (
    exists (
      select 1
      from public.service_promises sp
      join public.profiles p on p.id = auth.uid()
      where sp.id = promise_reviews.promise_id
        and p.role = 'school_partner'
        and sp.school_id = p.school_id
    )
  );

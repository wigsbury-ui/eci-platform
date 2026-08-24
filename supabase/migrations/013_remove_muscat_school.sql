-- Remove Ellesmere College Muscat (no longer an ECI partner school)

delete from public.schools
where name ilike '%Ellesmere College Muscat%'
   or name ilike '%Ellesmere%Muscat%'
   or (city ilike 'Muscat' and name ilike '%Ellesmere%');

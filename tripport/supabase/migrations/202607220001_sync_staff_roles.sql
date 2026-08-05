-- Keep a manager/editor's profile in step with the approved staff list.
-- This also repairs profiles that were created before the staff entry existed.

insert into public.profiles (id, email, role)
select
  users.id,
  users.email,
  staff.role
from auth.users as users
join public.staff_members as staff
  on lower(staff.email) = lower(users.email)
where staff.enabled = true
on conflict (id) do update
set
  email = excluded.email,
  role = excluded.role,
  updated_at = now();

create or replace function public.sync_tripport_staff_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    update public.profiles
    set role = 'viewer', updated_at = now()
    where lower(email) = lower(old.email);
    return old;
  end if;

  if tg_op = 'UPDATE' and lower(old.email) <> lower(new.email) then
    update public.profiles
    set role = 'viewer', updated_at = now()
    where lower(email) = lower(old.email);
  end if;

  update public.profiles
  set
    email = new.email,
    role = case when new.enabled then new.role else 'viewer'::public.tripport_role end,
    updated_at = now()
  where lower(email) = lower(new.email);

  return new;
end;
$$;

drop trigger if exists sync_tripport_staff_profile on public.staff_members;
create trigger sync_tripport_staff_profile
after insert or update or delete on public.staff_members
for each row execute function public.sync_tripport_staff_profile();

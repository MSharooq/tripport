-- Tripport Manager: content, access control and media permissions.
-- Run this migration in the Supabase SQL editor once for the project.

create extension if not exists pgcrypto;

do $$ begin
  create type public.content_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.tripport_role as enum ('manager', 'editor', 'viewer');
exception when duplicate_object then null;
end $$;

create table if not exists public.staff_members (
  email text primary key,
  role public.tripport_role not null default 'editor',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role public.tripport_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.packages (
  id text primary key,
  slug text not null unique,
  title text not null,
  status public.content_status not null default 'draft',
  package_type text not null default 'private-tour',
  destination_state text not null default 'Kerala',
  duration_days integer not null default 1 check (duration_days > 0),
  duration_nights integer not null default 0 check (duration_nights >= 0),
  cover_image text not null default '',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.travel_guides (
  slug text primary key,
  title text not null,
  status public.content_status not null default 'draft',
  cover_image text not null default '',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists packages_status_updated_at_idx on public.packages (status, updated_at desc);
create index if not exists travel_guides_status_updated_at_idx on public.travel_guides (status, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists packages_updated_at on public.packages;
create trigger packages_updated_at before update on public.packages for each row execute function public.set_updated_at();
drop trigger if exists travel_guides_updated_at on public.travel_guides;
create trigger travel_guides_updated_at before update on public.travel_guides for each row execute function public.set_updated_at();
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

create or replace function public.handle_new_tripport_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_role public.tripport_role;
begin
  select role into assigned_role
  from public.staff_members
  where lower(email) = lower(new.email) and enabled = true;

  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce(assigned_role, 'viewer'::public.tripport_role))
  on conflict (id) do update set email = excluded.email, role = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_tripport on auth.users;
create trigger on_auth_user_created_tripport
  after insert on auth.users
  for each row execute procedure public.handle_new_tripport_user();

create or replace function public.tripport_staff_role()
returns public.tripport_role
language sql
stable
security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_tripport_staff()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce(public.tripport_staff_role() in ('manager', 'editor'), false);
$$;

create or replace function public.is_tripport_manager()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce(public.tripport_staff_role() = 'manager', false);
$$;

alter table public.staff_members enable row level security;
alter table public.profiles enable row level security;
alter table public.packages enable row level security;
alter table public.travel_guides enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles for select to authenticated using (id = auth.uid());

drop policy if exists "Managers can manage staff" on public.staff_members;
create policy "Managers can manage staff" on public.staff_members for all to authenticated using (public.is_tripport_manager()) with check (public.is_tripport_manager());

drop policy if exists "Public can read published packages" on public.packages;
create policy "Public can read published packages" on public.packages for select using (status = 'published');
drop policy if exists "Staff can manage packages" on public.packages;
create policy "Staff can manage packages" on public.packages for all to authenticated using (public.is_tripport_staff()) with check (public.is_tripport_staff());

drop policy if exists "Public can read published travel guides" on public.travel_guides;
create policy "Public can read published travel guides" on public.travel_guides for select using (status = 'published');
drop policy if exists "Staff can manage travel guides" on public.travel_guides;
create policy "Staff can manage travel guides" on public.travel_guides for all to authenticated using (public.is_tripport_staff()) with check (public.is_tripport_staff());

drop policy if exists "Staff can manage site settings" on public.site_settings;
create policy "Staff can manage site settings" on public.site_settings for all to authenticated using (public.is_tripport_staff()) with check (public.is_tripport_staff());

-- The public site only needs to read final image URLs. Uploads remain staff-only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tripport-media', 'tripport-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Tripport staff can manage media" on storage.objects;
create policy "Tripport staff can manage media" on storage.objects for all to authenticated
using (bucket_id = 'tripport-media' and public.is_tripport_staff())
with check (bucket_id = 'tripport-media' and public.is_tripport_staff());

-- Before an approved staff member signs in, add them to the staff list. Replace the example email.
-- insert into public.staff_members (email, role) values ('your-email@example.com', 'manager');

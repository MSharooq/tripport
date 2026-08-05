-- Tripport Manager: destinations and genuine traveller testimonials.
-- Run this migration in the Supabase SQL editor after the earlier Manager migrations.

create table if not exists public.destinations (
  slug text primary key,
  name text not null,
  status public.content_status not null default 'draft',
  region text not null default '',
  ideal_nights text not null default '',
  cover_image text not null default '',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  status public.content_status not null default 'draft',
  rating smallint not null default 5 check (rating between 1 and 5),
  consent_confirmed boolean not null default false,
  featured boolean not null default true,
  image text not null default '',
  sort_order integer not null default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists destinations_status_updated_at_idx on public.destinations (status, updated_at desc);
create index if not exists testimonials_status_sort_order_idx on public.testimonials (status, sort_order asc, updated_at desc);

drop trigger if exists destinations_updated_at on public.destinations;
create trigger destinations_updated_at before update on public.destinations for each row execute function public.set_updated_at();
drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials for each row execute function public.set_updated_at();

alter table public.destinations enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "Public can read published destinations" on public.destinations;
create policy "Public can read published destinations" on public.destinations for select using (status = 'published');
drop policy if exists "Staff can manage destinations" on public.destinations;
create policy "Staff can manage destinations" on public.destinations for all to authenticated using (public.is_tripport_staff()) with check (public.is_tripport_staff());

drop policy if exists "Public can read published testimonials" on public.testimonials;
create policy "Public can read published testimonials" on public.testimonials for select using (status = 'published');
drop policy if exists "Staff can manage testimonials" on public.testimonials;
create policy "Staff can manage testimonials" on public.testimonials for all to authenticated using (public.is_tripport_staff()) with check (public.is_tripport_staff());

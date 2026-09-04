-- Public review submissions stay private until a Tripport manager approves them.
-- Run this after the existing Tripport Manager migrations.

create table if not exists public.testimonial_submissions (
  id uuid primary key,
  status text not null default 'pending' check (status in ('uploading', 'pending', 'approved', 'rejected', 'archived')),
  display_name text not null check (char_length(display_name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  location text not null default '' check (char_length(location) <= 100),
  title text not null check (char_length(title) between 1 and 140),
  quote text not null check (char_length(quote) between 1 and 3000),
  rating smallint not null check (rating between 1 and 5),
  itinerary_slug text not null default '' check (char_length(itinerary_slug) <= 160),
  media jsonb not null default '[]'::jsonb,
  publication_consent boolean not null default false,
  source text not null default 'website' check (source = 'website'),
  reviewer_note text not null default '' check (char_length(reviewer_note) <= 1000),
  testimonial_id text references public.testimonials(id) on delete set null,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonial_submissions_status_created_at_idx
  on public.testimonial_submissions (status, created_at desc);

drop trigger if exists testimonial_submissions_updated_at on public.testimonial_submissions;
create trigger testimonial_submissions_updated_at
  before update on public.testimonial_submissions
  for each row execute function public.set_updated_at();

alter table public.testimonial_submissions enable row level security;

-- There is intentionally no anonymous read or write policy. Public requests
-- use a server-only Supabase key, and submitted stories stay private by default.
drop policy if exists "Staff can manage testimonial submissions" on public.testimonial_submissions;
create policy "Staff can manage testimonial submissions"
  on public.testimonial_submissions
  for all to authenticated
  using (public.is_tripport_staff())
  with check (public.is_tripport_staff());

-- Attachments are private while a review is being checked. The public form
-- receives a short-lived signed upload URL from the server, rather than direct
-- public write access to the existing Tripport media bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tripport-review-submissions',
  'tripport-review-submissions',
  false,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Tripport staff can manage testimonial submission media" on storage.objects;
create policy "Tripport staff can manage testimonial submission media"
  on storage.objects
  for all to authenticated
  using (bucket_id = 'tripport-review-submissions' and public.is_tripport_staff())
  with check (bucket_id = 'tripport-review-submissions' and public.is_tripport_staff());

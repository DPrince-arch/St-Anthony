create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  type text not null check (type in ('mass_intention', 'thanksgiving', 'priest_appointment')),
  parishioner_name text not null,
  email text not null default '',
  phone text not null,
  intention_type text,
  intention_for text,
  requested_date date not null,
  mass_time text,
  appointment_reason text,
  preferred_time_slot text,
  notes text,
  receipt_path text,
  receipt_uploaded_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'completed')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_created_at_idx
  on public.bookings (created_at desc);
create index if not exists bookings_status_created_at_idx
  on public.bookings (status, created_at desc);
create index if not exists bookings_type_created_at_idx
  on public.bookings (type, created_at desc);
create index if not exists bookings_date_status_mass_time_idx
  on public.bookings (requested_date, status, mass_time, created_at desc);

alter table public.bookings enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'booking-receipts',
  'booking-receipts',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.booking_status_counts()
returns table (status text, booking_count bigint)
language sql
security invoker
set search_path = ''
as $$
  select b.status, count(*)
  from public.bookings as b
  group by b.status
$$;

revoke all on function public.booking_status_counts() from public, anon, authenticated;
grant execute on function public.booking_status_counts() to service_role;
grant all on public.bookings to service_role;

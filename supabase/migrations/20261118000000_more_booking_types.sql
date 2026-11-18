-- New booking types (weddings, funerals, wake keeps, requiem & birthday Masses,
-- harvest thanksgiving), payments (tithe, harvest levy, donation, offering),
-- and a column for their type-specific answers.

alter table public.bookings drop constraint if exists bookings_type_check;
alter table public.bookings add constraint bookings_type_check check (type in (
  'mass_intention',
  'thanksgiving',
  'birthday_mass',
  'requiem_mass',
  'wedding_mass',
  'funeral',
  'wake_keep',
  'harvest_thanksgiving',
  'priest_appointment',
  'tithe',
  'harvest_levy',
  'donation',
  'offering'
));

alter table public.bookings
  add column if not exists details jsonb not null default '{}'::jsonb;

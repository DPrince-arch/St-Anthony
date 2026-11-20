-- Retention: approved, completed and rejected bookings are deleted (with their
-- receipts) one week after the decision. The app does the deleting
-- (src/lib/bookingRetention.ts), because storage files must be removed through
-- the Storage API rather than SQL.

alter table public.bookings
  add column if not exists decided_at timestamptz,        -- when it was approved / rejected / completed
  add column if not exists receipt_deleted_at timestamptz; -- when its receipt image was removed

-- Bookings already decided before this migration get a full week from now.
update public.bookings
set decided_at = now()
where status <> 'pending' and decided_at is null;

create index if not exists bookings_decided_at_idx
  on public.bookings (decided_at)
  where decided_at is not null;

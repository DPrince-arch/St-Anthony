import { addDays } from './dates';

/** Approved, completed and rejected bookings are kept this long after the decision. */
export const RETENTION_DAYS = 7;

/**
 * The day a decided booking will be deleted (YYYY-MM-DD), or undefined while it is pending.
 * - rejected: one week after rejection
 * - approved / completed: one week after approval AND one week after the booked date,
 *   so an approved Mass intention is never deleted before the Mass has been said.
 */
export function scheduledDeletionDate(booking: { decidedAt?: string; requestedDate: string; status: string }) {
  if (!booking.decidedAt || booking.status === 'pending') return undefined;
  const afterDecision = addDays(booking.decidedAt.slice(0, 10), RETENTION_DAYS);
  if (booking.status === 'rejected') return afterDecision;
  const afterBookedDate = addDays(booking.requestedDate, RETENTION_DAYS);
  return afterDecision > afterBookedDate ? afterDecision : afterBookedDate;
}

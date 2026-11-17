// Calendar dates (YYYY-MM-DD) as the parish experiences them. Used on both the
// server and in the browser, so "today" is the same everywhere and doesn't
// depend on the server's or the visitor's device time zone.

export const PARISH_TIME_ZONE = 'Africa/Lagos';

const parishDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: PARISH_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

/** Today's date in the parish time zone, as YYYY-MM-DD. */
export function todayInParish(): string {
  return parishDateFormat.format(new Date());
}

/** Adds (or subtracts) whole days to a YYYY-MM-DD date. */
export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

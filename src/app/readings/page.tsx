import { Suspense } from 'react';
import { connection } from 'next/server';
import { PageShell } from '@/components/PageShell';
import { ReadingsSection } from '@/components/ReadingsSection';
import { getReadings, todayIsoDate } from '@/lib/data';
import { isValidIsoDate } from '@/lib/liturgicalData';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function ReadingsPage({ searchParams }: { searchParams: SearchParams }) {
  // ?date=YYYY-MM-DD selects the day; without it, today is shown.
  const date = searchParams.then(params => (typeof params.date === 'string' ? params.date : undefined));

  return (
    <PageShell activePath="/readings" headerDate={date} footerTagline="Daily Liturgical Readings • Lectionary Roman Rite">
      <Suspense fallback={<ReadingsSection readings={null} selectedDate="" loading />}>
        <Readings date={date} />
      </Suspense>
    </PageShell>
  );
}

async function Readings({ date }: { date: Promise<string | undefined> }) {
  await connection();
  const selectedDate = (await date) ?? todayIsoDate();

  if (!selectedDate) {
    return <ReadingsSection readings={null} selectedDate="" />;
  }
  if (!isValidIsoDate(selectedDate)) {
    return <ReadingsSection readings={null} selectedDate={selectedDate} error="Date must be a valid date in YYYY-MM-DD format." />;
  }

  const result = await getReadings(selectedDate);
  return <ReadingsSection readings={result.readings} selectedDate={selectedDate} error={result.error} />;
}

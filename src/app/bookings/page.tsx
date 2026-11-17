import { Suspense } from 'react';
import { connection } from 'next/server';
import { PageShell } from '@/components/PageShell';
import { BookingsSection } from '@/components/BookingsSection';
import { getPublicSettings } from '@/lib/data';
import { BookingType } from '@/lib/types';

const bookingTypes: BookingType[] = ['mass_intention', 'thanksgiving', 'priest_appointment'];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function BookingsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageShell activePath="/bookings" footerTagline="Parish Secretariat • Mass Stipend & Intentions">
      <Suspense fallback={<div className="py-16 text-center font-serif text-stone-500">Loading booking portal...</div>}>
        <Bookings searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}

async function Bookings({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const { type } = await searchParams;
  const defaultType = bookingTypes.find(bookingType => bookingType === type) ?? 'mass_intention';
  return <BookingsSection settings={getPublicSettings()} defaultType={defaultType} />;
}

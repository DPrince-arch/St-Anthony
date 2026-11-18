import { Suspense } from 'react';
import { connection } from 'next/server';
import { PageShell } from '@/components/PageShell';
import { BookingsSection } from '@/components/BookingsSection';
import { getPublicSettings } from '@/lib/data';
import { getBookingConfig, isBookingType, sectionOfGroup } from '@/lib/bookingCatalog';

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
  // Payment types (tithe, donation...) live on /payments, so they aren't opened here.
  const defaultType =
    isBookingType(type) && sectionOfGroup(getBookingConfig(type).group) === 'bookings' ? type : 'mass_intention';
  return <BookingsSection settings={getPublicSettings()} defaultType={defaultType} section="bookings" />;
}

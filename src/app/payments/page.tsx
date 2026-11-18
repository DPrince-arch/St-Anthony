import { Suspense } from 'react';
import { connection } from 'next/server';
import { PageShell } from '@/components/PageShell';
import { BookingsSection } from '@/components/BookingsSection';
import { getPublicSettings } from '@/lib/data';
import { getBookingConfig, isBookingType, sectionOfGroup } from '@/lib/bookingCatalog';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function PaymentsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageShell activePath="/payments" footerTagline="Parish Secretariat • Tithes, Levies, Donations & Offerings">
      <Suspense fallback={<div className="py-16 text-center font-serif text-stone-500">Loading payments...</div>}>
        <Payments searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}

async function Payments({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const { type } = await searchParams;
  const defaultType =
    isBookingType(type) && sectionOfGroup(getBookingConfig(type).group) === 'payments' ? type : 'tithe';
  return <BookingsSection settings={getPublicSettings()} defaultType={defaultType} section="payments" />;
}

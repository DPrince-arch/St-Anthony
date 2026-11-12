'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { BookingsSection } from '@/components/BookingsSection';
import { ParishSettings, BookingType, DailyLiturgicalReadings } from '@/lib/types';
import { getLiturgicalReadingsForDate } from '@/lib/liturgicalData';

function BookingsContent() {
  const searchParams = useSearchParams();
  const rawType = searchParams.get('type');
  const validTypes: BookingType[] = ['mass_intention', 'thanksgiving', 'priest_appointment'];
  const initialType: BookingType = validTypes.includes(rawType as BookingType)
    ? (rawType as BookingType)
    : 'mass_intention';

  const [settings, setSettings] = useState<ParishSettings | null>(null);
  const [readings, setReadings] = useState<DailyLiturgicalReadings | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setReadings(getLiturgicalReadingsForDate(today));

    fetch('/api/settings')
      .then(res => res.json())
      .then(json => {
        if (json.success) setSettings(json.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      <Header liturgicalData={readings} activePath="/bookings" />
      <BottomNav />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200/90 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-amber-800" />
            <span>Back to Home</span>
          </Link>
        </div>

        <BookingsSection
          settings={settings}
          defaultType={initialType}
        />
      </main>

      <footer className="border-t border-stone-200/80 bg-white/90 py-8 px-4 text-center text-xs text-stone-500 mb-16 md:mb-0">
        <p className="font-serif font-bold text-sm text-stone-800">St. Anthony Catholic Church</p>
        <p className="text-stone-500">Parish Secretariat &bull; Mass Stipend & Intentions</p>
      </footer>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="font-serif text-stone-500">Loading booking portal...</div>
      </div>
    }>
      <BookingsContent />
    </Suspense>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { PrayersSection } from '@/components/PrayersSection';
import { DailyLiturgicalReadings } from '@/lib/types';
import { getLiturgicalReadingsForDate } from '@/lib/liturgicalData';

export default function PrayersPage() {
  const [readings, setReadings] = useState<DailyLiturgicalReadings | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const data = getLiturgicalReadingsForDate(today);
    setReadings(data);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      <Header liturgicalData={readings} activePath="/prayers" />
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

        <PrayersSection />
      </main>

      <footer className="border-t border-stone-200/80 bg-white/90 py-8 px-4 text-center text-xs text-stone-500 mb-16 md:mb-0">
        <p className="font-serif font-bold text-sm text-stone-800">St. Anthony Catholic Church</p>
        <p className="text-stone-500">Holy Rosary, Catholic Litanies & Traditional Prayers</p>
      </footer>
    </div>
  );
}

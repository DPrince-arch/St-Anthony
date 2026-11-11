'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Church } from 'lucide-react';
import { AdminPanel } from '@/components/AdminPanel';
import { Booking, Announcement, ParishSettings } from '@/lib/types';

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<ParishSettings | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const refreshParishData = async () => {
    try {
      const [annRes, setRes, bookRes] = await Promise.all([
        fetch('/api/announcements'),
        fetch('/api/settings'),
        fetch('/api/bookings')
      ]);

      if (annRes.ok) {
        const annJson = await annRes.json();
        if (annJson.success) setAnnouncements(annJson.data);
      }

      if (setRes.ok) {
        const setJson = await setRes.json();
        if (setJson.success) setSettings(setJson.data);
      }

      if (bookRes.ok) {
        const bookJson = await bookRes.json();
        if (bookJson.success) setBookings(bookJson.data);
      }
    } catch (err) {
      console.error("Error refreshing parish data:", err);
    }
  };

  useEffect(() => {
    refreshParishData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="h-1.5 w-full bg-amber-900" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 transition-colors">
            <ArrowLeft className="w-4 h-4 text-amber-800" />
            <span>Return to Parish Home</span>
          </Link>

          <div className="flex items-center space-x-2">
            <img src="/st-anthony.jpg" alt="St. Anthony" className="w-8 h-8 rounded-full object-cover object-top ring-2 ring-amber-400" />
            <span className="font-serif font-bold text-sm text-stone-900">Parish Administration</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AdminPanel
          bookings={bookings}
          announcements={announcements}
          settings={settings}
          onRefreshData={refreshParishData}
          isAdminAuthenticated={isAdminAuthenticated}
          setIsAdminAuthenticated={setIsAdminAuthenticated}
        />
      </main>
    </div>
  );
}

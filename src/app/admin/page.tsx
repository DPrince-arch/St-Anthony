'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminPanel } from '@/components/AdminPanel';
import { Booking, BookingPagination, BookingStatus, BookingType, Announcement, ParishSettings } from '@/lib/types';

const initialPagination: BookingPagination = {
  page: 1,
  pageSize: 20,
  total: 0,
  pages: 1,
  statusCounts: { pending: 0, approved: 0, rejected: 0, completed: 0 }
};

async function fetchParishData() {
  const [annRes, setRes] = await Promise.all([
    fetch('/api/announcements'),
    fetch('/api/settings')
  ]);
  if (!annRes.ok || !setRes.ok) throw new Error('Failed to refresh parish data');

  const [annJson, setJson] = await Promise.all([annRes.json(), setRes.json()]);
  return { annJson, setJson };
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingPagination, setBookingPagination] = useState(initialPagination);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<ParishSettings | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const bookingRequestId = useRef(0);

  const refreshParishData = useCallback(async () => {
    try {
      const { annJson, setJson } = await fetchParishData();
      if (annJson.success) setAnnouncements(annJson.data);
      if (setJson.success) setSettings(setJson.data);
    } catch (err) {
      console.error('Error refreshing parish data:', err);
    }
  }, []);

  const loadBookings = useCallback(async (
    page: number,
    status: 'all' | BookingStatus,
    type: 'all' | BookingType,
    passcode: string,
    requestedDate?: string,
    massTime?: string,
    pageSize = initialPagination.pageSize
  ) => {
    const requestId = ++bookingRequestId.current;
    setBookingsLoading(true);
    setBookingsError('');

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        status,
        type
      });
      if (requestedDate) params.set('requestedDate', requestedDate);
      if (massTime) params.set('massTime', massTime);
      const response = await fetch(`/api/bookings?${params}`, {
        headers: { Authorization: `Bearer ${passcode}` }
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load bookings');
      }

      if (requestId === bookingRequestId.current) {
        setBookings(result.data);
        setBookingPagination(result.pagination);
      }
    } catch (err) {
      if (requestId === bookingRequestId.current) {
        setBookingsError(err instanceof Error ? err.message : 'Failed to load bookings');
      }
    } finally {
      if (requestId === bookingRequestId.current) setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void fetchParishData()
      .then(({ annJson, setJson }) => {
        if (!active) return;
        if (annJson.success) setAnnouncements(annJson.data);
        if (setJson.success) setSettings(setJson.data);
      })
      .catch((err: unknown) => console.error('Error refreshing parish data:', err));

    return () => {
      active = false;
    };
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
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-400 bg-amber-950 p-1 flex items-center justify-center">
              <img src="/church-icon.svg" alt="Church Emblem" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif font-bold text-sm text-stone-900">Parish Administration</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AdminPanel
          bookings={bookings}
          bookingPagination={bookingPagination}
          bookingsLoading={bookingsLoading}
          bookingsError={bookingsError}
          onLoadBookings={loadBookings}
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

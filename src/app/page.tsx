'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HomePortal } from '@/components/HomePortal';
import { ReadingsSection } from '@/components/ReadingsSection';
import { PrayersSection } from '@/components/PrayersSection';
import { BookingsSection } from '@/components/BookingsSection';
import { AnnouncementsSection } from '@/components/AnnouncementsSection';
import { AdminPanel } from '@/components/AdminPanel';
import { MassScheduleModal } from '@/components/MassScheduleModal';
import { DailyLiturgicalReadings, Booking, Announcement, ParishSettings, BookingType } from '@/lib/types';
import { getLiturgicalReadingsForDate } from '@/lib/liturgicalData';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedBookingType, setSelectedBookingType] = useState<BookingType>('mass_intention');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  
  // Data States
  const [readings, setReadings] = useState<DailyLiturgicalReadings | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<ParishSettings | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Initialize date on client mount to prevent prerender hydration mismatches
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Load Liturgical Readings when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;

    // Generate readings immediately using local liturgical engine (100% offline & fast)
    const localData = getLiturgicalReadingsForDate(selectedDate);
    setReadings(localData);

    // Try fetching from API endpoint as well
    fetch(`/api/readings?date=${selectedDate}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setReadings(json.data);
        }
      })
      .catch(() => console.log('Using local liturgical data engine fallback'));
  }, [selectedDate]);

  // Load Announcements, Settings, and Bookings
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
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <Header
        liturgicalData={readings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdminAuthenticated}
        onOpenAdmin={() => {
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Navigation Sub-Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadAnnouncementsCount={announcements.filter(a => a.isPinned).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back to Home Button (Shown only when in a sub-section) */}
        {activeTab !== 'home' && (
          <div className="mb-4">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200/90 shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-800" />
              <span>Back to Main Menu</span>
            </button>
          </div>
        )}

        {/* HOME PORTAL SECTION (Sectioned card grid styled after reference) */}
        {activeTab === 'home' && (
          <HomePortal
            onNavigate={(tab, bType) => {
              setActiveTab(tab);
              if (bType) setSelectedBookingType(bType);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSchedule={() => setIsScheduleOpen(true)}
          />
        )}

        {/* READINGS */}
        {activeTab === 'readings' && (
          <ReadingsSection
            initialReadings={readings}
            selectedDate={selectedDate || '2026-11-10'}
            onDateChange={setSelectedDate}
          />
        )}

        {/* PRAYERS */}
        {activeTab === 'prayers' && (
          <PrayersSection />
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
          <BookingsSection
            settings={settings}
            defaultType={selectedBookingType}
            onBookingSuccess={() => refreshParishData()}
          />
        )}

        {/* ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <AnnouncementsSection
            announcements={announcements}
          />
        )}

        {/* ADMIN PANEL */}
        {activeTab === 'admin' && (
          <AdminPanel
            bookings={bookings}
            announcements={announcements}
            settings={settings}
            onRefreshData={refreshParishData}
            isAdminAuthenticated={isAdminAuthenticated}
            setIsAdminAuthenticated={setIsAdminAuthenticated}
          />
        )}
      </main>

      {/* Mass Schedule Modal */}
      <MassScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        settings={settings}
      />

      {/* Parish Footer */}
      <footer className="border-t border-stone-200/80 bg-white/90 py-8 px-4 text-center text-xs text-stone-500 mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-serif font-bold text-sm text-stone-800">
            St. Anthony Catholic Church
          </p>
          <p className="text-stone-500">
            {settings?.parishAddress || "124 St. Anthony Way, Archdiocese of Lagos"} • Tel: {settings?.contactPhone || "+234 803 123 4567"}
          </p>
          <p className="text-[11px] text-stone-400">
            Ad Maiorem Dei Gloriam (AMDG) • Roman Catholic Parish Portal
          </p>
        </div>
      </footer>
    </div>
  );
}

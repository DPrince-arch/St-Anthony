'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HomePortal } from '@/components/HomePortal';
import { SplashScreen } from '@/components/SplashScreen';
import { MassScheduleModal } from '@/components/MassScheduleModal';
import { ParishSettings } from '@/lib/types';
import { useLiturgicalReadings } from '@/lib/useLiturgicalReadings';

export default function Home() {
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const { readings } = useLiturgicalReadings();
  const [settings, setSettings] = useState<ParishSettings | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // Fetch announcements for badge and settings for schedule modal
    fetch('/api/announcements')
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          const pinnedAnnouncements = (json.data as unknown[]).filter(
            (announcement: unknown): announcement is { isPinned: boolean } =>
              typeof announcement === 'object' &&
              announcement !== null &&
              'isPinned' in announcement &&
              typeof announcement.isPinned === 'boolean'
          );
          setUnreadCount(pinnedAnnouncements.filter(announcement => announcement.isPinned).length);
        }
      })
      .catch(() => {});

    fetch('/api/settings')
      .then(res => res.json())
      .then(json => {
        if (json.success) setSettings(json.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Loading / Splash Screen with St. Anthony Picture */}
      <SplashScreen />

      {/* Top Header */}
      <Header
        liturgicalData={readings}
        activePath="/"
      />

      {/* Navigation Sub-Bar */}
      <BottomNav unreadAnnouncementsCount={unreadCount} />

      {/* Main Home Portal: Clean buttons for each section (No floral patterns) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <HomePortal
          onOpenSchedule={() => setIsScheduleOpen(true)}
        />
      </main>

      {/* Mass Schedule Modal */}
      <MassScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        settings={settings}
      />
    </div>
  );
}

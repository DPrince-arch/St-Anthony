'use client';

import React from 'react';
import { LayoutGrid, BookOpen, Heart, CalendarPlus, Megaphone, Shield } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadAnnouncementsCount?: number;
}

export function BottomNav({ activeTab, setActiveTab, unreadAnnouncementsCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: LayoutGrid },
    { id: 'readings', label: 'Readings', icon: BookOpen },
    { id: 'prayers', label: 'Prayers', icon: Heart },
    { id: 'bookings', label: 'Bookings', icon: CalendarPlus },
    { id: 'announcements', label: 'Notices', icon: Megaphone, badge: unreadAnnouncementsCount > 0 },
    { id: 'admin', label: 'Admin', icon: Shield }
  ];

  return (
    <>
      {/* Desktop / Tablet Sub-Navigation Bar */}
      <nav className="hidden md:block bg-stone-100/90 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center space-x-1 py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-white text-amber-950 shadow-xs border border-stone-200/80 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1 shadow-lg safe-area-bottom">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-amber-900 font-semibold'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-amber-800' : ''}`} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 ring-1 ring-white" />
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight leading-none">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-4 h-0.5 bg-amber-800 rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

'use client';

import React from 'react';
import { ArrowRight, BookOpen, Heart, CalendarPlus, Megaphone, Shield, Clock, Church, Sparkles } from 'lucide-react';
import { BookingType } from '@/lib/types';

interface HomePortalProps {
  onNavigate: (tab: string, bookingType?: BookingType) => void;
  onOpenSchedule: () => void;
}

export function HomePortal({ onNavigate, onOpenSchedule }: HomePortalProps) {
  const sections = [
    {
      id: 'readings',
      title: 'Daily Liturgical Readings',
      subtitle: 'First reading, psalm, gospel & daily homily',
      action: () => onNavigate('readings')
    },
    {
      id: 'prayers',
      title: 'Prayers & Holy Rosary',
      subtitle: 'Mysteries, interactive bead counter & litanies',
      action: () => onNavigate('prayers')
    },
    {
      id: 'mass_booking',
      title: 'Mass Intentions Booking',
      subtitle: 'Offer a Mass & upload stipend receipt',
      action: () => onNavigate('bookings', 'mass_intention')
    },
    {
      id: 'thanksgiving',
      title: 'Thanksgiving Offering',
      subtitle: 'Birthdays, anniversaries & harvest thanks',
      action: () => onNavigate('bookings', 'thanksgiving')
    },
    {
      id: 'priest_appointment',
      title: 'Appointment with Priest',
      subtitle: 'Confession, counseling & spiritual direction',
      action: () => onNavigate('bookings', 'priest_appointment')
    },
    {
      id: 'announcements',
      title: 'Parish Announcements',
      subtitle: 'Weekly bulletin, societies & urgent notices',
      action: () => onNavigate('announcements')
    },
    {
      id: 'schedule',
      title: 'Mass & Confession Schedule',
      subtitle: 'Daily Mass timetable & office visiting hours',
      action: onOpenSchedule
    },
    {
      id: 'st_anthony_litany',
      title: 'Litany of Saint Anthony',
      subtitle: 'Patron saint of lost things and the poor',
      action: () => onNavigate('prayers')
    },
    {
      id: 'admin_portal',
      title: 'Parish Staff & Admin Portal',
      subtitle: 'Verify receipts, print altar sheets & post notices',
      action: () => onNavigate('admin')
    }
  ];

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 overflow-hidden">
      {/* Decorative Floral Background Corners (Styled after user reference) */}
      <div className="absolute -top-10 -left-10 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none opacity-85 select-none">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Leaves */}
          <path d="M120 70 C160 50 190 90 170 130 C150 110 130 90 120 70 Z" fill="#8f9f78" opacity="0.6"/>
          <path d="M60 130 C70 170 110 180 130 150 C110 140 80 130 60 130 Z" fill="#a4b38d" opacity="0.7"/>
          <path d="M140 140 C170 160 190 200 170 230 C150 200 145 170 140 140 Z" fill="#8f9f78" opacity="0.5"/>
          <path d="M40 70 C20 110 50 140 80 130 C70 100 50 80 40 70 Z" fill="#b9c7a5" opacity="0.6"/>
          
          {/* Top Blossom */}
          <g transform="translate(130, 80)">
            <circle cx="0" cy="0" r="14" fill="#d4af37" opacity="0.8"/>
            <circle cx="0" cy="-22" r="18" fill="#fdfaf3" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="21" cy="-7" r="18" fill="#fcf8ef" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="13" cy="18" r="18" fill="#fefcf7" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="-13" cy="18" r="18" fill="#faf5eb" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="-21" cy="-7" r="18" fill="#fdfaf3" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="0" cy="0" r="9" fill="#c99e32"/>
            {/* Stamen dots */}
            <circle cx="-3" cy="-3" r="1.5" fill="#8b5e14"/>
            <circle cx="3" cy="-3" r="1.5" fill="#8b5e14"/>
            <circle cx="0" cy="3" r="1.5" fill="#8b5e14"/>
          </g>

          {/* Lower Blossom */}
          <g transform="translate(80, 160) scale(0.85)">
            <circle cx="0" cy="-22" r="18" fill="#fdfaf3" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="21" cy="-7" r="18" fill="#fcf8ef" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="13" cy="18" r="18" fill="#fefcf7" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="-13" cy="18" r="18" fill="#faf5eb" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="-21" cy="-7" r="18" fill="#fdfaf3" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="0" cy="0" r="9" fill="#c99e32"/>
          </g>
        </svg>
      </div>

      <div className="absolute -bottom-10 -right-10 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none opacity-85 select-none rotate-180">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M120 70 C160 50 190 90 170 130 C150 110 130 90 120 70 Z" fill="#8f9f78" opacity="0.6"/>
          <path d="M60 130 C70 170 110 180 130 150 C110 140 80 130 60 130 Z" fill="#a4b38d" opacity="0.7"/>
          <g transform="translate(130, 80)">
            <circle cx="0" cy="-22" r="18" fill="#fdfaf3" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="21" cy="-7" r="18" fill="#fcf8ef" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="13" cy="18" r="18" fill="#fefcf7" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="-13" cy="18" r="18" fill="#faf5eb" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="-21" cy="-7" r="18" fill="#fdfaf3" stroke="#e8ded1" strokeWidth="1.5"/>
            <circle cx="0" cy="0" r="9" fill="#c99e32"/>
          </g>
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full z-10 text-center space-y-8 sm:space-y-10">
        {/* Top Header Block */}
        <div className="space-y-3 pt-2 sm:pt-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto shadow-md ring-4 ring-amber-300/40 bg-amber-950">
            <img
              src="/st-anthony.jpg"
              alt="St. Anthony of Padua"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-stone-500 block mb-1">
              YOU ARE WELCOME TO
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-950 tracking-tight leading-tight">
              St. Anthony Catholic Church
            </h1>
          </div>

          <p className="font-serif italic text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-4">
            We would be delighted to welcome you to the Lord&apos;s house. Please begin by choosing where you would like to go.
          </p>
        </div>

        {/* Section Divider & Question */}
        <div className="space-y-4">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 block">
            WHERE WOULD YOU LIKE TO BEGIN?
          </span>

          {/* Cards Grid (3 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 text-left">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={sec.action}
                className="group bg-white/95 hover:bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between text-left active:scale-[0.98]"
              >
                <div className="pr-2">
                  <h3 className="font-serif font-semibold text-stone-900 group-hover:text-amber-950 text-base sm:text-[17px] leading-snug transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-1 font-sans">
                    {sec.subtitle}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-stone-50 group-hover:bg-amber-100/80 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Help Section (Matching reference footer) */}
        <div className="pt-8 sm:pt-10 border-t border-stone-200/60 max-w-xl mx-auto space-y-1">
          <h4 className="font-serif font-bold text-sm sm:text-base text-stone-800">
            Need help with your booking or pastoral intention?
          </h4>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            If you have a question about Mass intentions, sacramental preparations, or pastoral counseling, reach out to the parish office or visit Father&apos;s office on Wednesdays and Thursdays.
          </p>
        </div>
      </div>
    </div>
  );
}

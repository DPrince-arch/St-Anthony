'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  BookOpen, 
  Heart, 
  CalendarPlus, 
  Megaphone, 
  ShieldCheck, 
  Clock, 
  Church, 
  Gift, 
  UserCheck 
} from 'lucide-react';

interface HomePortalProps {
  onOpenSchedule: () => void;
}

export function HomePortal({ onOpenSchedule }: HomePortalProps) {
  const sections = [
    {
      id: 'readings',
      title: 'Daily Liturgical Readings',
      subtitle: 'First reading, psalm, gospel & pastoral reflection',
      href: '/readings',
      icon: BookOpen,
      iconColor: 'text-amber-800 bg-amber-50'
    },
    {
      id: 'prayers',
      title: 'Prayers & Holy Rosary',
      subtitle: 'Holy Rosary, Litanies, Divine Mercy & devotions',
      href: '/prayers',
      icon: Heart,
      iconColor: 'text-rose-800 bg-rose-50'
    },
    {
      id: 'mass_booking',
      title: 'Mass Intentions Booking',
      subtitle: 'Book a Mass, upload stipend receipt & get reference',
      href: '/bookings?type=mass_intention',
      icon: Church,
      iconColor: 'text-emerald-800 bg-emerald-50'
    },
    {
      id: 'thanksgiving',
      title: 'Thanksgiving Offering',
      subtitle: 'Birthdays, wedding anniversaries & harvest thanks',
      href: '/bookings?type=thanksgiving',
      icon: Gift,
      iconColor: 'text-amber-800 bg-amber-50'
    },
    {
      id: 'priest_appointment',
      title: 'Appointment with Priest',
      subtitle: 'Confession, counseling & spiritual direction',
      href: '/bookings?type=priest_appointment',
      icon: UserCheck,
      iconColor: 'text-blue-800 bg-blue-50'
    },
    {
      id: 'announcements',
      title: 'Parish Announcements',
      subtitle: 'Weekly church bulletin, societies & urgent notices',
      href: '/announcements',
      icon: Megaphone,
      iconColor: 'text-orange-800 bg-orange-50'
    },
    {
      id: 'schedule',
      title: 'Mass & Confession Schedule',
      subtitle: 'Weekly Mass timetable & office visiting hours',
      onClick: onOpenSchedule,
      icon: Clock,
      iconColor: 'text-stone-800 bg-stone-100'
    },
    {
      id: 'admin_portal',
      title: 'Parish Staff & Admin Portal',
      subtitle: 'Verify receipts, print altar sheets & post notices',
      href: '/admin',
      icon: ShieldCheck,
      iconColor: 'text-amber-900 bg-amber-100'
    }
  ];

  return (
    <div className="min-h-[75vh] flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6">
      {/* Main Content Container (No floral patterns) */}
      <div className="max-w-4xl mx-auto w-full text-center space-y-8 sm:space-y-10">
        {/* Top Header Block */}
        <div className="space-y-3 pt-2 sm:pt-4">
          {/* Church Crest Emblem */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto shadow-md ring-4 ring-amber-500/20 bg-gradient-to-br from-amber-900 to-red-950 flex items-center justify-center p-2 text-white">
            <img
              src="/church-icon.svg"
              alt="St. Anthony Catholic Church"
              className="w-full h-full object-contain"
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
            We would be delighted to welcome you to the Lord&apos;s house. Please select a section below to proceed.
          </p>
        </div>

        {/* Section Divider & Question */}
        <div className="space-y-4">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 block">
            CHOOSE A SECTION TO PROCEED
          </span>

          {/* Section Buttons Grid (Sends user to each new page) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 text-left">
            {sections.map((sec) => {
              const Icon = sec.icon;

              const cardContent = (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3.5 pr-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sec.iconColor} transition-transform group-hover:scale-105`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-stone-900 group-hover:text-amber-950 text-base sm:text-[17px] leading-snug transition-colors">
                        {sec.title}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-sans">
                        {sec.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-stone-50 group-hover:bg-amber-100 flex items-center justify-center shrink-0 transition-colors ml-2">
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );

              if (sec.href) {
                return (
                  <Link
                    key={sec.id}
                    href={sec.href}
                    className="group bg-white hover:bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all duration-200 flex items-center text-left active:scale-[0.98]"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <button
                  key={sec.id}
                  onClick={sec.onClick}
                  className="group bg-white hover:bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all duration-200 flex items-center text-left active:scale-[0.98] w-full"
                >
                  {cardContent}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Help Section */}
        <div className="pt-8 sm:pt-10 border-t border-stone-200/60 max-w-xl mx-auto space-y-1">
          <h4 className="font-serif font-bold text-sm sm:text-base text-stone-800">
            Need help with your booking or pastoral intention?
          </h4>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            If you have a question about Mass intentions, confessions, or sacramental preparations, visit the parish secretariat or contact Father&apos;s office.
          </p>
        </div>
      </div>
    </div>
  );
}

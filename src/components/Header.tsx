'use client';

import React from 'react';
import Link from 'next/link';
import { Church, ShieldCheck, Bell } from 'lucide-react';
import { DailyLiturgicalReadings } from '@/lib/types';
import { LITURGICAL_COLORS } from '@/lib/liturgicalData';

interface HeaderProps {
  liturgicalData?: DailyLiturgicalReadings | null;
  activePath?: string;
}

export function Header({ liturgicalData, activePath = '/' }: HeaderProps) {
  const colorInfo = liturgicalData ? LITURGICAL_COLORS[liturgicalData.color] : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs transition-all">
      {/* Liturgical Stripe */}
      <div 
        className="h-1.5 w-full transition-colors duration-500"
        style={{ backgroundColor: colorInfo?.hex || '#8b1d24' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Parish Brand -> Links to Home */}
        <Link 
          href="/"
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-md ring-2 ring-amber-500/30 group-hover:scale-105 transition-transform shrink-0 bg-gradient-to-br from-red-900 to-amber-950 flex items-center justify-center p-1.5">
            <img 
              src="/church-icon.svg" 
              alt="St. Anthony Catholic Church Emblem" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-serif font-bold text-base sm:text-lg text-stone-900 tracking-tight leading-tight group-hover:text-amber-900 transition-colors">
                St. Anthony
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-600 border border-stone-200">
                Catholic
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">Parish Portal & Liturgy</p>
          </div>
        </Link>

        {/* Liturgical Status Banner & Navigation Links */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {liturgicalData && (
            <div className="hidden md:flex items-center space-x-2 bg-stone-100/80 px-3 py-1.5 rounded-full border border-stone-200 text-xs text-stone-700">
              <span 
                className="w-2.5 h-2.5 rounded-full shadow-xs" 
                style={{ backgroundColor: colorInfo?.hex }}
              />
              <span className="font-medium">{liturgicalData.season}</span>
              <span className="text-stone-300">•</span>
              <span className="truncate max-w-[200px] text-stone-600 font-serif italic">
                {liturgicalData.rank}
              </span>
            </div>
          )}

          {/* Quick Announcements Link */}
          <Link
            href="/announcements"
            className={`p-2 rounded-full transition-colors relative ${
              activePath === '/announcements' 
                ? 'bg-amber-100 text-amber-900' 
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
            title="Parish Announcements"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
          </Link>

          {/* Admin Link */}
          <Link
            href="/admin"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activePath === '/admin'
                ? 'bg-amber-900 text-amber-50 shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Admin Portal</span>
            <span className="sm:hidden">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

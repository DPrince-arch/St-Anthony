'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete?: () => void;
  minDisplayTime?: number; // ms
}

export function SplashScreen({ onComplete, minDisplayTime = 1400 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if splash has already been shown in this tab session
    const hasLoaded = sessionStorage.getItem('st_anthony_splash_shown');
    if (hasLoaded) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('st_anthony_splash_shown', 'true');
        onComplete?.();
      }, 500); // 500ms fade transition
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a0f0f] text-amber-50 transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background warm radiant glow */}
      <div className="absolute inset-0 bg-radial from-amber-900/30 via-[#180a0a]/90 to-[#0e0505] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
        {/* St. Anthony Portrait in Halo Ring */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/40 via-yellow-400/50 to-amber-600/40 rounded-3xl blur-md opacity-80 animate-pulse" />
          <div className="relative w-48 h-64 sm:w-56 sm:h-72 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-amber-400/80 bg-stone-900">
            <img
              src="/st-anthony.jpg"
              alt="Saint Anthony of Padua with Child Jesus"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Church Inscription */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-400">
            Roman Catholic Church
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            St. Anthony
          </h1>
          <p className="font-serif italic text-xs sm:text-sm text-amber-200/80">
            &ldquo;Si quaeris miracula... Saint Anthony, pray for us&rdquo;
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 space-y-2 pt-2">
          <div className="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-300 rounded-full animate-[loading_1.4s_ease-in-out_infinite]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300/60 font-sans block">
            Entering Sanctuary...
          </span>
        </div>
      </div>
    </div>
  );
}

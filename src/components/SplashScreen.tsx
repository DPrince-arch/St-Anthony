'use client';

import React, { useEffect } from 'react';

const SHOWN_KEY = 'st_anthony_splash_shown';
// Must match the animation delay + duration of .splash-screen in globals.css.
const SPLASH_TOTAL_MS = 550;

// Runs while the HTML is parsed, before first paint: hide the splash if it was
// already shown in this tab session (e.g. on a refresh of the home page).
const SKIP_IF_SEEN = `try{if(sessionStorage.getItem('${SHOWN_KEY}'))document.documentElement.dataset.splashSeen=''}catch(e){}`;

/**
 * The fade-out is pure CSS (.splash-screen in globals.css), so it doesn't wait
 * for JavaScript to load. This component only remembers that it was shown.
 */
export function SplashScreen() {
  useEffect(() => {
    try {
      sessionStorage.setItem(SHOWN_KEY, 'true');
    } catch {
      // Storage unavailable (e.g. private mode): the splash just shows again next time.
    }
    // Once it has faded, also hide it for client-side navigations back to the home page.
    const timer = setTimeout(() => {
      document.documentElement.dataset.splashSeen = '';
    }, SPLASH_TOTAL_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <script
      // Executes only in the server-rendered HTML; on the client React renders it as inert text/plain.
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SKIP_IF_SEEN }}
    />
    <div className="splash-screen fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a0f0f] text-amber-50">
      {/* Background warm radiant glow */}
      <div className="absolute inset-0 bg-radial from-amber-900/30 via-[#180a0a]/90 to-[#0e0505] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
        {/* St. Anthony Portrait in Halo Ring */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-linear-to-r from-amber-500/40 via-yellow-400/50 to-amber-600/40 rounded-3xl blur-md opacity-80 animate-pulse" />
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
            &ldquo;Antho ..... Padua &rdquo;<br />
            &ldquo;Antho ..... Padua &rdquo;<br />
            &ldquo;Antho ..... One Big, United & Happy Family &rdquo;
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 space-y-2 pt-2">
          <div className="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-amber-600 to-amber-300 rounded-full animate-[loading_1.4s_ease-in-out_infinite]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300/60 font-sans block">
            Entering Sanctuary...
          </span>
        </div>
      </div>
    </div>
    </>
  );
}

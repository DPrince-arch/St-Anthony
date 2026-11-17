import { Suspense, type ReactNode } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import { ArrowLeft } from 'lucide-react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SplashScreen } from './SplashScreen';
import { getAnnouncements, getReadings, todayIsoDate } from '@/lib/data';
import { isValidIsoDate } from '@/lib/liturgicalData';

interface PageShellProps {
  activePath: string;
  children: ReactNode;
  /** Footer subtitle. Pages without one (home) get no footer. */
  footerTagline?: string;
  /** Show the red dot on the Notices tab when there are pinned announcements. */
  showNoticesBadge?: boolean;
  /** Date whose liturgical colour the header shows. Defaults to today. */
  headerDate?: Promise<string | undefined>;
}

/**
 * Shared layout for the public pages: header, navigation, back link and footer.
 * The home page ('/') additionally gets the splash screen, and no back link.
 * Header and nav render immediately and fill in their data as it streams in.
 */
export function PageShell({ activePath, children, footerTagline, showNoticesBadge = false, headerDate }: PageShellProps) {
  const isHome = activePath === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {isHome && <SplashScreen />}

      <Suspense fallback={<Header activePath={activePath} />}>
        <LiturgicalHeader activePath={activePath} date={headerDate} />
      </Suspense>

      {showNoticesBadge ? (
        <Suspense fallback={<BottomNav />}>
          <NavWithNoticesBadge />
        </Suspense>
      ) : (
        <BottomNav />
      )}

      <main className={`flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 ${isHome ? 'py-4 sm:py-6' : 'py-6 sm:py-8'}`}>
        {!isHome && (
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200/90 shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-800" />
              <span>Back to Home</span>
            </Link>
          </div>
        )}

        {children}
      </main>

      {footerTagline && (
        <footer className="border-t border-stone-200/80 bg-white/90 py-8 px-4 text-center text-xs text-stone-500 mb-16 md:mb-0">
          <p className="font-serif font-bold text-sm text-stone-800">St. Anthony Catholic Church</p>
          <p className="text-stone-500">{footerTagline}</p>
        </footer>
      )}
    </div>
  );
}

async function LiturgicalHeader({ activePath, date }: { activePath: string; date?: Promise<string | undefined> }) {
  await connection();
  const day = (await date) ?? todayIsoDate();
  const readings = isValidIsoDate(day) ? (await getReadings(day)).readings : null;
  return <Header liturgicalData={readings} activePath={activePath} />;
}

async function NavWithNoticesBadge() {
  await connection();
  const pinnedCount = getAnnouncements().filter(announcement => announcement.isPinned).length;
  return <BottomNav unreadAnnouncementsCount={pinnedCount} />;
}

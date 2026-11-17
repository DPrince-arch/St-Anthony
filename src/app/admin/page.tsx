import { Suspense } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import { ArrowLeft } from 'lucide-react';
import { AdminPanel } from '@/components/AdminPanel';
import { getAnnouncements, getPublicSettings } from '@/lib/data';

export default function AdminPage() {
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
        <Suspense fallback={<div className="py-16 text-center font-serif text-stone-500">Loading admin portal...</div>}>
          <AdminWithData />
        </Suspense>
      </main>
    </div>
  );
}

async function AdminWithData() {
  await connection();
  return <AdminPanel announcements={getAnnouncements()} settings={getPublicSettings()} />;
}

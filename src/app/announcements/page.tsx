import { Suspense } from 'react';
import { connection } from 'next/server';
import { PageShell } from '@/components/PageShell';
import { AnnouncementsSection } from '@/components/AnnouncementsSection';
import { getAnnouncements } from '@/lib/data';

export default function AnnouncementsPage() {
  return (
    <PageShell activePath="/announcements" showNoticesBadge footerTagline="Parish Bulletin • Notices & Society Updates">
      <Suspense fallback={<AnnouncementsSection announcements={[]} />}>
        <Announcements />
      </Suspense>
    </PageShell>
  );
}

async function Announcements() {
  await connection();
  return <AnnouncementsSection announcements={getAnnouncements()} />;
}

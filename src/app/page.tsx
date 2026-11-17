import { Suspense } from 'react';
import { connection } from 'next/server';
import { PageShell } from '@/components/PageShell';
import { HomePortal } from '@/components/HomePortal';
import { getPublicSettings } from '@/lib/data';

export default function Home() {
  return (
    <PageShell activePath="/" showNoticesBadge>
      <Suspense fallback={<HomePortal settings={null} />}>
        <HomeWithSettings />
      </Suspense>
    </PageShell>
  );
}

async function HomeWithSettings() {
  await connection();
  return <HomePortal settings={getPublicSettings()} />;
}

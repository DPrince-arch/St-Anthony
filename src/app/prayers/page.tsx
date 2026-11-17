import { PageShell } from '@/components/PageShell';
import { PrayersSection } from '@/components/PrayersSection';

export default function PrayersPage() {
  return (
    <PageShell activePath="/prayers" footerTagline="Holy Rosary, Catholic Litanies & Traditional Prayers">
      <PrayersSection />
    </PageShell>
  );
}

import Link from 'next/link';

import { Compass } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6">
      <EmptyState
        title={t('title')}
        description={t('description')}
        icon={<Compass className="size-5" />}
        className="w-full"
        action={
          <Button asChild className="rounded-full">
            <Link href="/">{t('back')}</Link>
          </Button>
        }
      />
    </main>
  );
}

import { getTranslations } from 'next-intl/server';

import { LoadingState } from '@/components/shared';

export default async function Loading() {
  const t = await getTranslations('Loading');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6">
      <LoadingState
        className="w-full"
        title={t('title')}
        description={t('description')}
        lines={4}
      />
    </main>
  );
}

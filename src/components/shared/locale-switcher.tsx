'use client';

import { useEffect, useState, useTransition } from 'react';

import { LoaderCircle } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { localeCookieName, locales, type AppLocale } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingLocale, setPendingLocale] = useState<AppLocale | null>(null);

  useEffect(() => {
    if (!pendingLocale || pendingLocale === locale) {
      return;
    }

    window.document.cookie = `${localeCookieName}=${pendingLocale}; path=/; max-age=31536000; samesite=lax`;

    startTransition(() => {
      router.refresh();
    });
  }, [locale, pendingLocale, router, startTransition]);

  function handleLocaleChange(nextLocale: string) {
    if (nextLocale === locale) {
      return;
    }

    setPendingLocale(nextLocale as AppLocale);
  }

  return (
    <div className="px-3 py-2">
      <div className="bg-muted inline-flex w-[116px] items-center rounded-lg p-0.5">
        <div className="grid w-full grid-cols-2 gap-1">
          {locales.map((supportedLocale) => {
            const isActive = supportedLocale === (pendingLocale ?? locale);

            return (
              <Button
                key={supportedLocale}
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => handleLocaleChange(supportedLocale)}
                className={cn(
                  'h-7 rounded-md px-2 text-[11px] font-medium',
                  isActive && 'bg-background text-foreground hover:bg-background shadow-sm'
                )}
              >
                {isPending && isActive ? <LoaderCircle className="size-3 animate-spin" /> : null}
                {supportedLocale === 'pt-BR' ? 'PT' : 'EN'}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

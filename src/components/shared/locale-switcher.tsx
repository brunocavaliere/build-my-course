'use client';

import { useTransition } from 'react';

import { Languages, LoaderCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { localeCookieName, localeLabels, locales, type AppLocale } from '@/i18n/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations('LocaleSwitcher');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(nextLocale: string) {
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground px-2 text-xs font-medium tracking-[0.14em] uppercase">
        {t('label')}
      </p>
      <Select value={locale} onValueChange={handleLocaleChange} disabled={isPending}>
        <SelectTrigger className="h-9 w-full rounded-xl">
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Languages className="size-4" />
          )}
          <SelectValue placeholder={t('placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {locales.map((supportedLocale) => (
            <SelectItem key={supportedLocale} value={supportedLocale}>
              {localeLabels[supportedLocale]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

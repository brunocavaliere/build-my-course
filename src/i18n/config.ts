export const locales = ['pt-BR', 'en-US'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'pt-BR';
export const localeCookieName = 'NEXT_LOCALE';

export const localeLabels: Record<AppLocale, string> = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (United States)',
};

export function hasLocale(value: string | null | undefined): value is AppLocale {
  return Boolean(value && locales.includes(value as AppLocale));
}

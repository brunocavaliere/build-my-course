import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, hasLocale, localeCookieName } from '@/i18n/config';

async function loadMessages(locale: string) {
  const messageFiles = await Promise.all([
    import(`../../messages/${locale}/brand.json`),
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/home.json`),
    import(`../../messages/${locale}/auth.json`),
    import(`../../messages/${locale}/courses.json`),
    import(`../../messages/${locale}/lessons.json`),
  ]);

  return Object.assign({}, ...messageFiles.map((file) => file.default));
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get(localeCookieName)?.value;
  const locale = hasLocale(requestedLocale) ? requestedLocale : defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});

import type { Metadata } from 'next';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import { env } from '@/env';
import { brand } from '@/lib/brand';
import { AppProviders } from '@/providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  openGraph: {
    title: brand.name,
    description: brand.description,
    siteName: brand.name,
    type: 'website',
    url: env.NEXT_PUBLIC_APP_URL,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: brand.name,
    description: brand.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full">
        <NextIntlClientProvider>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

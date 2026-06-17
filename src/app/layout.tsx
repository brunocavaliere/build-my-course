import type { Metadata } from 'next';

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
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: brand.name,
    description: brand.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

'use client';

import type { PropsWithChildren } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </QueryProvider>
    </ThemeProvider>
  );
}

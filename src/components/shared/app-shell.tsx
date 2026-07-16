'use client';

import type { PropsWithChildren, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AppShellProps = PropsWithChildren<{
  header?: ReactNode;
  className?: string;
}>;

export function AppShell({ children, className, header }: AppShellProps) {
  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {header ? (
          <header className="border-border/70 bg-background/90 sticky top-0 z-30 shrink-0 border-b backdrop-blur">
            <div className="mx-auto flex min-h-16 w-full max-w-[1200px] items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
              <div className="min-w-0 flex-1">{header}</div>
            </div>
          </header>
        ) : null}

        <main className={cn('flex min-h-0 flex-1 flex-col overflow-y-auto', className)}>
          {children}
        </main>
      </div>
    </div>
  );
}

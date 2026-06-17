'use client';

import type { PropsWithChildren, ReactNode } from 'react';
import { useState } from 'react';

import { PanelLeftClose } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type AppShellProps = PropsWithChildren<{
  header?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}>;

export function AppShell({ children, className, header, sidebar }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      {sidebar ? (
        <>
          <aside className="border-border/70 bg-background fixed inset-y-0 left-0 z-40 hidden w-72 border-r lg:flex lg:flex-col">
            {sidebar}
          </aside>

          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent
              side="left"
              className="border-border/70 bg-background w-[min(86vw,20rem)] border-r p-0 sm:max-w-none"
            >
              <SheetTitle className="sr-only">Navegacao principal</SheetTitle>
              <aside className="flex h-full flex-col">{sidebar}</aside>
            </SheetContent>
          </Sheet>
        </>
      ) : null}

      <div className={cn('flex min-h-screen min-w-0 flex-1 flex-col', sidebar && 'lg:pl-72')}>
        {header ? (
          <header className="border-border/70 bg-background/90 sticky top-0 z-30 shrink-0 border-b backdrop-blur">
            <div className="flex min-h-16 items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
              {sidebar ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Abrir menu lateral"
                  className="rounded-xl lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <PanelLeftClose className="size-4" />
                </Button>
              ) : null}

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

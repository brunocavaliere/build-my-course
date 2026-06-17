'use client';

import { useEffect, useRef, useState } from 'react';

import { LogOut } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SidebarUserMenuProps = {
  userLabel?: string | null;
  userEmail?: string | null;
  signOutAction: () => void | Promise<void>;
};

function getFallbackLabel(userLabel?: string | null) {
  if (!userLabel) {
    return 'BM';
  }

  const initials = userLabel
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return initials || 'BM';
}

export function SidebarUserMenu({ signOutAction, userEmail, userLabel }: SidebarUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (!isOpen) {
      return;
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {isOpen ? (
        <Card className="bg-background border-border/70 absolute right-0 bottom-full z-50 mb-2 w-56 rounded-2xl py-2 shadow-lg">
          <CardContent className="space-y-1 px-2">
            <ThemeToggle
              variant="ghost"
              size="default"
              label="Toggle theme"
              className="w-full justify-start rounded-xl"
            />

            <form action={signOutAction}>
              <Button type="submit" variant="ghost" className="w-full justify-start rounded-xl">
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card className="bg-muted/40 border-border/70 rounded-2xl py-0 shadow-none">
        <button
          type="button"
          className={cn(
            'hover:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors',
            isOpen && 'bg-accent'
          )}
          aria-label="Open user menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <Avatar>
            <AvatarFallback>{getFallbackLabel(userLabel)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userLabel ?? 'Signed in user'}</p>
            <p className="text-muted-foreground truncate text-xs">{userEmail}</p>
          </div>
        </button>
      </Card>
    </div>
  );
}

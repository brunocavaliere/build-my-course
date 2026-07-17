'use client';

import { useEffect, useRef, useState } from 'react';

import { LogOut } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { SubmitButton } from '@/components/ui/submit-button';
import { cn } from '@/lib/utils';

type UserMenuProps = {
  labels?: {
    openUserMenu?: string;
    signedInUser?: string;
    signOut?: string;
    signingOut?: string;
    toggleTheme?: string;
  };
  localeSwitcher?: React.ReactNode;
  userLabel?: string | null;
  userEmail?: string | null;
  signOutAction: () => void | Promise<void>;
};

function getFallbackLabel(userLabel?: string | null) {
  if (!userLabel) {
    return 'BC';
  }

  const initials = userLabel
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return initials || 'BC';
}

export function UserMenu({
  labels,
  localeSwitcher,
  signOutAction,
  userEmail,
  userLabel,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setIsRendered(true);

    requestAnimationFrame(() => {
      setIsOpen(true);
    });
  }

  function closeMenu() {
    setIsOpen(false);

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setIsRendered(false);
      closeTimeoutRef.current = null;
    }, 160);
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (isOpen && !containerRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    }

    if (!isRendered) {
      return;
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen, isRendered]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {isRendered ? (
        <Card
          className={cn(
            'bg-background border-border/70 absolute top-full right-0 z-50 mt-2 w-56 rounded-2xl py-2 shadow-lg transition-all duration-150 ease-out',
            isOpen
              ? 'translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
          )}
        >
          <CardContent className="space-y-1 px-2">
            <div className="space-y-0.5 px-3 py-2">
              <p className="truncate text-sm font-medium">
                {userLabel ?? labels?.signedInUser ?? 'Signed in user'}
              </p>
              {userEmail ? (
                <p className="text-muted-foreground truncate text-xs">{userEmail}</p>
              ) : null}
            </div>

            <ThemeToggle ariaLabel={labels?.toggleTheme ?? 'Alternar tema'} />
            {localeSwitcher}

            <form action={signOutAction}>
              <SubmitButton
                variant="ghost"
                className="w-full justify-start rounded-xl"
                idleIcon={<LogOut className="size-4" />}
                pendingLabel={labels?.signingOut ?? 'Signing out...'}
              >
                {labels?.signOut ?? 'Sign out'}
              </SubmitButton>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <button
        type="button"
        className={cn(
          'hover:bg-accent hover:border-border/70 flex size-9 cursor-pointer items-center justify-center rounded-full border border-transparent text-left transition-colors',
          isOpen && 'bg-accent border-border/70'
        )}
        aria-label={labels?.openUserMenu ?? 'Open user menu'}
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            closeMenu();
            return;
          }

          openMenu();
        }}
      >
        <Avatar className="size-9">
          <AvatarFallback>{getFallbackLabel(userLabel)}</AvatarFallback>
        </Avatar>
      </button>
    </div>
  );
}

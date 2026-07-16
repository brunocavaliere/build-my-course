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
        <Card className="bg-background border-border/70 absolute top-full right-0 z-50 mt-2 w-56 rounded-2xl py-2 shadow-lg">
          <CardContent className="space-y-1 px-2">
            <ThemeToggle
              variant="ghost"
              size="default"
              label={labels?.toggleTheme ?? 'Alternar tema'}
              ariaLabel={labels?.toggleTheme ?? 'Alternar tema'}
              className="w-full justify-start rounded-xl"
            />
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
          'hover:bg-accent flex items-center gap-3 rounded-full border px-2.5 py-1.5 text-left transition-colors',
          isOpen && 'bg-accent'
        )}
        aria-label={labels?.openUserMenu ?? 'Open user menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Avatar className="size-8">
          <AvatarFallback>{getFallbackLabel(userLabel)}</AvatarFallback>
        </Avatar>

        <div className="hidden min-w-0 sm:block">
          <p className="max-w-36 truncate text-sm font-medium">
            {userLabel ?? labels?.signedInUser ?? 'Signed in user'}
          </p>
          <p className="text-muted-foreground max-w-36 truncate text-xs">{userEmail}</p>
        </div>
      </button>
    </div>
  );
}

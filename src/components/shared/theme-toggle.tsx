'use client';

import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  ariaLabel?: string;
  className?: string;
};

export function ThemeToggle({ ariaLabel = 'Alternar tema', className }: ThemeToggleProps = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <div className={cn('px-3 py-2', className)}>
      <div className="bg-muted inline-flex w-[116px] items-center rounded-lg p-0.5">
        <div className="grid w-full grid-cols-2 gap-1" role="group" aria-label={ariaLabel}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Tema claro"
            aria-pressed={!isDarkMode}
            onClick={() => setTheme('light')}
            className={cn(
              'h-7 rounded-md px-2',
              !isDarkMode && 'bg-background text-foreground hover:bg-background shadow-sm'
            )}
          >
            <Sun className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Tema escuro"
            aria-pressed={isDarkMode}
            onClick={() => setTheme('dark')}
            className={cn(
              'h-7 rounded-md px-2',
              isDarkMode && 'bg-background text-foreground hover:bg-background shadow-sm'
            )}
          >
            <Moon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

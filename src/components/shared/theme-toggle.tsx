'use client';

import type { ComponentProps } from 'react';

import { SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

type ThemeToggleProps = {
  ariaLabel?: string;
  className?: string;
  label?: string;
  variant?: ComponentProps<typeof Button>['variant'];
  size?: ComponentProps<typeof Button>['size'];
};

export function ThemeToggle({
  ariaLabel = 'Alternar tema',
  className,
  label,
  variant = 'ghost',
  size = 'icon',
}: ThemeToggleProps = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      aria-label={ariaLabel}
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
    >
      <SunMoon className="size-4" />
      {label ? <span>{label}</span> : null}
    </Button>
  );
}

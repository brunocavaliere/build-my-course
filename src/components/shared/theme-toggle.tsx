'use client';

import type { ComponentProps } from 'react';

import { SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

type ThemeToggleProps = {
  className?: string;
  label?: string;
  variant?: ComponentProps<typeof Button>['variant'];
  size?: ComponentProps<typeof Button>['size'];
};

export function ThemeToggle({
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
      aria-label="Alternar tema"
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
    >
      <SunMoon className="size-4" />
      {label ? <span>{label}</span> : null}
    </Button>
  );
}

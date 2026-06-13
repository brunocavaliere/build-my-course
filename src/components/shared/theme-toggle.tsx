'use client';

import { SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="Alternar tema"
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
    >
      <SunMoon className="size-4" />
    </Button>
  );
}

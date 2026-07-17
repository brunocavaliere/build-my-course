'use client';

import type { ReactNode } from 'react';

import { BrandWordmark } from '@/components/shared/brand-wordmark';
import { cn } from '@/lib/utils';

type AppHeaderProps = {
  actions?: ReactNode;
  className?: string;
  userMenu?: ReactNode;
};

export function AppHeader({ actions, className, userMenu }: AppHeaderProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <BrandWordmark />

      <div className="ml-auto flex items-center gap-2">
        {actions}
        {userMenu}
      </div>
    </div>
  );
}

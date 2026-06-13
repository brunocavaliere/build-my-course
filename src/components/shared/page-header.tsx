import type { ReactNode } from 'react';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ actions, className, description, title }: PageHeaderProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {description ? (
            <p className="text-muted-foreground max-w-3xl text-sm leading-6 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
      <Separator />
    </div>
  );
}

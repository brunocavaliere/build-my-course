import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ action, className, description, icon, title }: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'bg-card/80 border-border/80 rounded-3xl border border-dashed py-0 text-center shadow-sm backdrop-blur',
        className
      )}
    >
      <CardHeader className="items-center px-6 pt-12">
        {icon ? (
          <div className="bg-accent text-foreground mb-4 flex size-12 items-center justify-center rounded-2xl">
            {icon}
          </div>
        ) : null}
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-muted-foreground max-w-md text-sm leading-6">{description}</p>
      </CardHeader>
      {action ? <CardContent className="flex justify-center pb-12">{action}</CardContent> : null}
    </Card>
  );
}

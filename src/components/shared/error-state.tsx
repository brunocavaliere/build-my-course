import type { ReactNode } from 'react';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ErrorStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export function ErrorState({
  action,
  className,
  description,
  icon,
  onRetry,
  retryLabel = 'Tentar novamente',
  title,
}: ErrorStateProps) {
  return (
    <Card
      className={cn(
        'bg-card/80 border-border/80 rounded-3xl border py-0 text-center shadow-sm backdrop-blur',
        className
      )}
    >
      <CardHeader className="items-center px-6 pt-12">
        <div className="bg-destructive/12 text-destructive mb-4 flex size-12 items-center justify-center rounded-2xl">
          {icon ?? <AlertTriangle className="size-5" />}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-muted-foreground max-w-md text-sm leading-6">{description}</p>
      </CardHeader>
      {action || onRetry ? (
        <CardContent className="flex flex-col items-center gap-3 pb-12">
          {onRetry ? (
            <Button onClick={onRetry} className="rounded-full">
              {retryLabel}
            </Button>
          ) : null}
          {action}
        </CardContent>
      ) : null}
    </Card>
  );
}

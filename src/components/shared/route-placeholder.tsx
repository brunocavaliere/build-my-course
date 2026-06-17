import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type RoutePlaceholderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  body: string;
  action?: ReactNode;
};

export function RoutePlaceholder({
  action,
  body,
  description,
  eyebrow,
  title,
}: RoutePlaceholderProps) {
  return (
    <Card className="border-border/70 rounded-3xl shadow-none">
      <CardHeader className="space-y-3">
        {eyebrow ? (
          <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-sm leading-6">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-muted-foreground text-sm leading-6">{body}</p>
        {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

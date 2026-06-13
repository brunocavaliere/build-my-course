import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type LoadingStateProps = {
  className?: string;
  description?: string;
  lines?: number;
  title?: string;
};

export function LoadingState({
  className,
  description = 'Estamos preparando os dados e a estrutura visual desta area.',
  lines = 3,
  title = 'Carregando conteudo',
}: LoadingStateProps) {
  return (
    <Card className={cn('bg-card/80 border-border/70 rounded-3xl shadow-sm', className)}>
      <CardHeader className="space-y-3">
        <Skeleton className="h-5 w-40 rounded-full" />
        <div className="space-y-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={`${title}-${index}`}
            className="h-14 rounded-2xl"
            style={{
              width: `${100 - index * 8}%`,
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
}

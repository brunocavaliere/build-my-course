'use client';

import { Check } from 'lucide-react';

import { useExample } from '@/components/example/hooks/use-example';
import { ErrorState, LoadingState } from '@/components/shared';
import { getMetricLabel } from '@/components/example/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_ERROR_MESSAGES } from '@/lib/errors';

export function ExampleCard() {
  const { features, isError, isLoading, metrics } = useExample();

  return (
    <Card className="border-border/70 bg-card/80 rounded-3xl shadow-sm backdrop-blur">
      <CardHeader className="gap-3">
        <CardTitle className="text-lg">Exemplo de modulo</CardTitle>
        <CardDescription>
          O componente visual recebe apenas o necessario da camada de hook. A composicao de dados
          fica fora da view.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <LoadingState
            className="border-0 bg-transparent shadow-none"
            title="Carregando metricas do modulo"
            description="Buscando dados de exemplo para demonstrar a camada de server state."
            lines={2}
          />
        ) : null}

        {isError ? (
          <ErrorState
            className="border-0 bg-transparent shadow-none"
            title="Falha ao carregar metricas"
            description={DEFAULT_ERROR_MESSAGES.queryDescription}
          />
        ) : null}

        {!isLoading && !isError ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-border/70 bg-background/70 rounded-2xl border p-4"
                aria-label={getMetricLabel(metric)}
              >
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  {metric.label}
                </p>
                <p className="mt-2 text-sm font-semibold">{metric.value}</p>
                <p className="text-muted-foreground mt-1 text-sm">{metric.hint}</p>
              </div>
            ))}
          </div>
        ) : null}

        <ul className="text-muted-foreground grid gap-3 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="text-foreground mt-0.5 size-4 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

import { describe, expect, it } from 'vitest';

import { screen } from '@/tests/render';
import { render } from '@/tests/render';

import { ExampleCard } from '@/components/example';

describe('ExampleCard', () => {
  it('renderiza o card com titulo, descricao e loading inicial', () => {
    render(<ExampleCard />);

    expect(screen.getByText('Exemplo de modulo')).toBeInTheDocument();
    expect(
      screen.getByText(/o componente visual recebe apenas o necessario da camada de hook/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Carregando metricas do modulo')).toBeInTheDocument();
  });

  it('mostra as metricas e features esperadas apos resolver a query', async () => {
    render(<ExampleCard />);

    expect(await screen.findByText('shadcn/ui')).toBeInTheDocument();
    expect(screen.getByText('Light / Dark')).toBeInTheDocument();
    expect(screen.getByText('Padronizada')).toBeInTheDocument();
    expect(screen.getByText('App Router com `src/` e alias `@/*`.')).toBeInTheDocument();
    expect(
      screen.getByText(/Base preparada para integrar React Query futuramente\./i)
    ).toBeInTheDocument();
    expect(screen.queryByText('Carregando metricas do modulo')).not.toBeInTheDocument();
  });
});

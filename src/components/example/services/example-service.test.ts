import { describe, expect, it } from 'vitest';

import { getExampleMetrics } from '@/components/example/services/example-service';

describe('getExampleMetrics', () => {
  it('retorna as metricas esperadas do modulo de exemplo', async () => {
    await expect(getExampleMetrics()).resolves.toEqual([
      {
        label: 'UI',
        value: 'shadcn/ui',
        hint: 'Componentes trazidos para dentro do codigo do projeto.',
      },
      {
        label: 'Tema',
        value: 'Light / Dark',
        hint: 'Tema semantico com CSS variables e next-themes.',
      },
      {
        label: 'DX',
        value: 'Padronizada',
        hint: 'Estrutura previsivel para crescer por dominio.',
      },
    ]);
  });
});

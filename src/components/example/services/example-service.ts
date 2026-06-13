import type { ExampleMetric } from '@/components/example/types';

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getExampleMetrics(): Promise<ExampleMetric[]> {
  await delay(40);

  return [
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
  ];
}

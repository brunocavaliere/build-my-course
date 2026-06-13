export const queryKeys = {
  example: {
    all: ['example'] as const,
    detail: (id: string | number) => ['example', 'detail', id] as const,
    metrics: () => ['example', 'metrics'] as const,
  },
} as const;

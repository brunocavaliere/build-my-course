import { render, screen } from '@testing-library/react';

vi.mock('@/env', () => ({
  env: {
    isDevelopment: true,
  },
}));

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="rq-devtools" />,
}));

import { createQueryClient, QueryProvider } from '@/providers/query-provider';

describe('QueryProvider', () => {
  it('creates a query client with the expected defaults', () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(60_000);
    expect(defaults?.refetchOnWindowFocus).toBe(false);
    expect(defaults?.retry).toBe(1);
  });

  it('renders children and devtools in development', () => {
    render(
      <QueryProvider>
        <div>Query child</div>
      </QueryProvider>
    );

    expect(screen.getByText('Query child')).toBeInTheDocument();
    expect(screen.getByTestId('rq-devtools')).toBeInTheDocument();
  });
});

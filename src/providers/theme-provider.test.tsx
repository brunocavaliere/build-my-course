import { render, screen } from '@testing-library/react';

import { ThemeProvider } from '@/providers/theme-provider';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

describe('ThemeProvider', () => {
  it('renders children through next-themes provider', () => {
    render(
      <ThemeProvider attribute="class">
        <div>Theme child</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByText('Theme child')).toBeInTheDocument();
  });
});

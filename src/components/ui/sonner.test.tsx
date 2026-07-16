import { render } from '@testing-library/react';
import { useTheme } from 'next-themes';

import { Toaster } from '@/components/ui/sonner';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('sonner', () => ({
  Toaster: (props: Record<string, unknown>) => (
    <div data-testid="sonner" data-theme={String(props.theme)} />
  ),
}));

describe('Toaster', () => {
  it('passes the current theme to sonner', () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark' } as never);

    const { getByTestId } = render(<Toaster />);

    expect(getByTestId('sonner')).toHaveAttribute('data-theme', 'dark');
  });
});

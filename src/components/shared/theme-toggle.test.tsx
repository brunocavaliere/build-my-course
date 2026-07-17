import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from 'next-themes';

import { ThemeToggle } from '@/components/shared/theme-toggle';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  it('switches from dark to light', async () => {
    const user = userEvent.setup();
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: 'dark',
      setTheme,
    } as never);

    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: /tema claro/i }));

    expect(setTheme).toHaveBeenCalledWith('light');
    expect(screen.getByRole('group', { name: /alternar tema/i })).toBeInTheDocument();
  });
});

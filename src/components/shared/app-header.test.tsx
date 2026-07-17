import { render, screen } from '@testing-library/react';
import { AppHeader } from '@/components/shared/app-header';

describe('AppHeader', () => {
  it('shows the brand and actions', () => {
    render(<AppHeader actions={<button type="button">Generate</button>} />);

    expect(screen.getByRole('link', { name: /build my course/i })).toHaveAttribute('href', '/app');
    expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument();
  });
});

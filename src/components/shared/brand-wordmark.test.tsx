import { render, screen } from '@testing-library/react';

import { BrandWordmark } from '@/components/shared/brand-wordmark';

describe('BrandWordmark', () => {
  it('renders the split wordmark inside a link by default', () => {
    render(<BrandWordmark />);

    const link = screen.getByRole('link', { name: /build my course/i });
    expect(link).toHaveAttribute('href', '/app');
    expect(link).toHaveTextContent('BuildMy Course');
  });

  it('renders without a link when href is disabled', () => {
    render(<BrandWordmark href={null} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('My Course')).toBeInTheDocument();
  });
});

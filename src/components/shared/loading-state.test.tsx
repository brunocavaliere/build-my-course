import { render, screen } from '@testing-library/react';

import { LoadingState } from '@/components/shared/loading-state';

describe('LoadingState', () => {
  it('renders title, description, and the requested number of skeleton lines', () => {
    const { container } = render(
      <LoadingState title="Loading lessons" description="Preparing content." lines={4} />
    );

    expect(screen.getByText('Loading lessons')).toBeInTheDocument();
    expect(screen.getByText('Preparing content.')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(5);
  });
});

import { render } from '@testing-library/react';

import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('renders the skeleton slot', () => {
    const { container } = render(<Skeleton className="h-4 w-8" />);

    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
  });
});

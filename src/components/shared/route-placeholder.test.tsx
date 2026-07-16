import { render, screen } from '@testing-library/react';

import { RoutePlaceholder } from '@/components/shared/route-placeholder';

describe('RoutePlaceholder', () => {
  it('renders all placeholder sections', () => {
    render(
      <RoutePlaceholder
        eyebrow="Beta"
        title="Coming soon"
        description="This area is under construction."
        body="More content will land here soon."
        action={<button type="button">Notify me</button>}
      />
    );

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText('This area is under construction.')).toBeInTheDocument();
    expect(screen.getByText('More content will land here soon.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Notify me' })).toBeInTheDocument();
  });
});

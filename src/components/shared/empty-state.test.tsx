import { render, screen } from '@testing-library/react';

import { EmptyState } from '@/components/shared/empty-state';

describe('EmptyState', () => {
  it('renders title, description, icon, and action', () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Create your first item."
        icon={<span>ICON</span>}
        action={<button type="button">Create</button>}
      />
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Create your first item.')).toBeInTheDocument();
    expect(screen.getByText('ICON')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });
});

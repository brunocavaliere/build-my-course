import { render, screen } from '@testing-library/react';

import { PageHeader } from '@/components/shared/page-header';

describe('PageHeader', () => {
  it('renders title, description, actions, and separator', () => {
    const { container } = render(
      <PageHeader
        title="Courses"
        description="Manage your courses."
        actions={<button type="button">New</button>}
      />
    );

    expect(screen.getByRole('heading', { name: 'Courses' })).toBeInTheDocument();
    expect(screen.getByText('Manage your courses.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
  });
});

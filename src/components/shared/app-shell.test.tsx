import { render, screen } from '@testing-library/react';

import { AppShell } from '@/components/shared/app-shell';

describe('AppShell', () => {
  it('renders header and main content', () => {
    render(
      <AppShell header={<div>Header content</div>}>
        <div>Main content</div>
      </AppShell>
    );

    expect(screen.getByText('Header content')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });
});

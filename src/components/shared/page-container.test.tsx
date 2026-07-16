import { render, screen } from '@testing-library/react';

import { PageContainer } from '@/components/shared/page-container';

describe('PageContainer', () => {
  it('renders children inside the shared max-width container', () => {
    const { container } = render(
      <PageContainer>
        <div>Page body</div>
      </PageContainer>
    );

    expect(screen.getByText('Page body')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('max-w-[1200px]');
  });
});

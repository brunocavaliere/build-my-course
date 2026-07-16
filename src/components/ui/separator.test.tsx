import { render } from '@testing-library/react';

import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
  it('renders with vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" decorative={false} />);

    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });
});

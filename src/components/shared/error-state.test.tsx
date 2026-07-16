import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorState } from '@/components/shared/error-state';

describe('ErrorState', () => {
  it('renders retry button and custom action', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        title="Error"
        description="Something failed."
        onRetry={onRetry}
        action={<button type="button">Support</button>}
      />
    );

    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Support' })).toBeInTheDocument();
  });
});

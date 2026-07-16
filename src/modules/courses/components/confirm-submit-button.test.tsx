'use client';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConfirmSubmitButton } from '@/modules/courses/components/confirm-submit-button';

describe('ConfirmSubmitButton', () => {
  it('opens the confirmation dialog', async () => {
    const user = userEvent.setup();

    render(
      <ConfirmSubmitButton action={async () => undefined} description="Delete this item forever.">
        Delete
      </ConfirmSubmitButton>
    );

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Delete this item forever.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });
});

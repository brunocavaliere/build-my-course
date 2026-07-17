'use client';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UserMenu } from '@/components/shared/user-menu';

describe('UserMenu', () => {
  it('opens the menu and shows theme toggle and sign out action', async () => {
    const user = userEvent.setup();

    render(
      <UserMenu
        userLabel="Bruno Cavaliere"
        userEmail="bruno@example.com"
        signOutAction={async () => undefined}
      />
    );

    await user.click(screen.getByRole('button', { name: /open user menu/i }));

    expect(screen.getByRole('group', { name: /alternar tema/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    expect(screen.getByText('Bruno Cavaliere')).toBeInTheDocument();
    expect(screen.getByText('bruno@example.com')).toBeInTheDocument();
  });

  it('falls back to BC initials when no label is provided', () => {
    render(<UserMenu userEmail="bruno@example.com" signOutAction={async () => undefined} />);

    expect(screen.getByText('BC')).toBeInTheDocument();
  });
});

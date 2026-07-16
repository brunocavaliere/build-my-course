import { render, screen } from '@testing-library/react';

import { SignInButton, SignOutButton } from '@/components/shared/auth-buttons';

vi.mock('@/auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

describe('auth buttons', () => {
  it('renders sign in button with custom label', () => {
    render(<SignInButton provider="google" label="Continue with Google" />);

    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('renders sign out button with default label', () => {
    render(<SignOutButton />);

    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });
});

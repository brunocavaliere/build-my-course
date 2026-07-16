import { LogIn, LogOut } from 'lucide-react';

import { signIn, signOut } from '@/auth';
import { SubmitButton } from '@/components/ui/submit-button';

type SignInButtonProps = {
  className?: string;
  label?: string;
  provider: 'github' | 'google';
};

export function SignInButton({ className, label = 'Sign in', provider }: SignInButtonProps) {
  return (
    <form
      action={async () => {
        'use server';
        await signIn(provider, { redirectTo: '/app' });
      }}
    >
      <SubmitButton
        className={className}
        idleIcon={<LogIn className="size-4" />}
        pendingLabel="Signing in..."
      >
        {label}
      </SubmitButton>
    </form>
  );
}

type SignOutButtonProps = {
  className?: string;
  label?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
};

export function SignOutButton({
  className,
  label = 'Sign out',
  variant = 'outline',
}: SignOutButtonProps) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <SubmitButton
        variant={variant}
        className={className}
        idleIcon={<LogOut className="size-4" />}
        pendingLabel="Signing out..."
      >
        {label}
      </SubmitButton>
    </form>
  );
}

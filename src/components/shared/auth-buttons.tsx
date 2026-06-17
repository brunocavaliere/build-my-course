import { LogIn, LogOut } from 'lucide-react';

import { signIn, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

type SignInButtonProps = {
  className?: string;
  label?: string;
};

export function SignInButton({ className, label = 'Sign in with GitHub' }: SignInButtonProps) {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('github', { redirectTo: '/app' });
      }}
    >
      <Button type="submit" className={className}>
        <LogIn className="size-4" />
        {label}
      </Button>
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
      <Button type="submit" variant={variant} className={className}>
        <LogOut className="size-4" />
        {label}
      </Button>
    </form>
  );
}

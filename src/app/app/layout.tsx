import type { PropsWithChildren } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Sparkles } from 'lucide-react';

import { auth, signOut } from '@/auth';
import { AppHeader, AppShell, UserMenu } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userLabel = session.user.name ?? session.user.email ?? 'Build My Course user';
  const signOutAction = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  };

  return (
    <AppShell
      header={
        <AppHeader
          actions={
            <Button asChild className="rounded-full">
              <Link href="/app/courses/new">
                <Sparkles className="size-4" />
                Generate Course
              </Link>
            </Button>
          }
          userMenu={
            <UserMenu
              userLabel={userLabel}
              userEmail={session.user.email}
              signOutAction={signOutAction}
            />
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}

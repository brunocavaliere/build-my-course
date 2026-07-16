import type { PropsWithChildren } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { auth, signOut } from '@/auth';
import { AppHeader, AppShell, LocaleSwitcher, UserMenu } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth();
  const headerT = await getTranslations('AppHeader');
  const userMenuT = await getTranslations('UserMenu');
  const courseFormT = await getTranslations('GenerateCourseForm');

  if (!session?.user) {
    redirect('/login');
  }

  const userLabel = session.user.name ?? session.user.email ?? userMenuT('signedInUser');
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
              <Link href="/app/new">
                <Sparkles className="size-4" />
                {courseFormT('submit')}
              </Link>
            </Button>
          }
          labels={{
            backToCourse: headerT('backToCourse'),
            backToCourses: headerT('backToCourses'),
          }}
          userMenu={
            <UserMenu
              labels={{
                openUserMenu: userMenuT('openUserMenu'),
                signedInUser: userMenuT('signedInUser'),
                signOut: userMenuT('signOut'),
                signingOut: userMenuT('signingOut'),
                toggleTheme: userMenuT('toggleTheme'),
              }}
              localeSwitcher={<LocaleSwitcher />}
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

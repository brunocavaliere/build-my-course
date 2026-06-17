import { redirect } from 'next/navigation';

import { BookOpenText, ShieldCheck } from 'lucide-react';

import { auth, isAuthReady } from '@/auth';
import { SignInButton } from '@/components/shared/auth-buttons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { brand } from '@/lib/brand';

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect('/app');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md rounded-[2rem] border shadow-none">
        <CardHeader className="space-y-4">
          <div className="bg-foreground text-background flex size-12 items-center justify-center rounded-2xl">
            <BookOpenText className="size-5" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">{brand.name}</CardTitle>
            <CardDescription className="text-sm leading-6">{brand.tagline}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-6">
            Sign in to access your private dashboard and manage personalized courses.
          </p>

          {isAuthReady ? (
            <SignInButton className="w-full rounded-full" />
          ) : (
            <div className="bg-muted/50 space-y-3 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="size-4" />
                Auth configuration required
              </div>
              <p className="text-muted-foreground text-sm leading-6">
                Define `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` to
                enable GitHub login.
              </p>
              <Button disabled className="w-full rounded-full">
                Sign in with GitHub
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

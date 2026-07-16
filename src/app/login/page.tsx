import { redirect } from 'next/navigation';

import { ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { auth, isAuthReady, isGitHubAuthConfigured, isGoogleAuthConfigured } from '@/auth';
import { SignInButton } from '@/components/shared/auth-buttons';
import { BrandWordmark } from '@/components/shared/brand-wordmark';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { brand } from '@/lib/brand';

export default async function LoginPage() {
  const session = await auth();
  const t = await getTranslations('Login');
  const brandT = await getTranslations('Brand');

  if (session?.user) {
    redirect('/app');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md rounded-[2rem] border shadow-none">
        <CardHeader className="space-y-4">
          <BrandWordmark href="/" />
          <div className="space-y-2">
            <CardTitle className="text-3xl">{brand.name}</CardTitle>
            <CardDescription className="text-sm leading-6">{brandT('tagline')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-6">{t('description')}</p>

          {isAuthReady ? (
            <div className="space-y-3">
              {isGoogleAuthConfigured ? (
                <SignInButton
                  provider="google"
                  className="w-full rounded-full"
                  label={t('signInWithGoogle')}
                />
              ) : null}
              {isGitHubAuthConfigured ? (
                <SignInButton
                  provider="github"
                  className="w-full rounded-full"
                  label={t('signInWithGitHub')}
                />
              ) : null}
            </div>
          ) : (
            <div className="bg-muted/50 space-y-3 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="size-4" />
                {t('authRequired')}
              </div>
              <p className="text-muted-foreground text-sm leading-6">{t('authHelp')}</p>
              <Button disabled className="w-full rounded-full">
                {t('signIn')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

import Link from 'next/link';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { auth, isAuthReady, isGitHubAuthConfigured, isGoogleAuthConfigured } from '@/auth';
import { SignInButton } from '@/components/shared/auth-buttons';
import { BrandWordmark } from '@/components/shared/brand-wordmark';
import { PageContainer } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { brand } from '@/lib/brand';

export default async function Home() {
  const session = await auth();
  const t = await getTranslations('Home');
  const brandT = await getTranslations('Brand');

  return (
    <main className="min-h-screen">
      <PageContainer className="mx-auto w-full max-w-6xl gap-16 py-8 sm:py-10">
        <header className="flex items-center justify-between gap-4">
          <BrandWordmark href="/" />

          {session?.user ? (
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/app">{t('openDashboard')}</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/login">{t('signIn')}</Link>
            </Button>
          )}
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.24em] uppercase">
                {t('eyebrow')}
              </p>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  {brand.name}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-balance text-neutral-600 dark:text-neutral-300">
                  {brandT('tagline')}
                </p>
                <p className="max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
                  {brandT('description')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {session?.user ? (
                <Button asChild className="rounded-full">
                  <Link href="/app">
                    {t('openDashboard')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : isAuthReady ? (
                <div className="flex flex-wrap gap-3">
                  {isGoogleAuthConfigured ? (
                    <SignInButton
                      provider="google"
                      className="rounded-full"
                      label={t('signInWithGoogle')}
                    />
                  ) : null}
                  {isGitHubAuthConfigured ? (
                    <SignInButton
                      provider="github"
                      className="rounded-full"
                      label={t('signInWithGitHub')}
                    />
                  ) : null}
                </div>
              ) : (
                <Button asChild className="rounded-full">
                  <Link href="/login">
                    {t('openLogin')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/app/new">{t('seeCourseSetup')}</Link>
              </Button>
            </div>
          </div>

          <Card className="border-border/70 rounded-[2rem] shadow-none">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl">{t('featureTitle')}</CardTitle>
              <CardDescription className="text-sm leading-6">
                {t('featureDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[t('feature1'), t('feature2'), t('feature3')].map((item) => (
                <div key={item} className="bg-muted/50 flex items-center gap-3 rounded-2xl p-4">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <p className="text-sm leading-6">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
              {t('howItWorksEyebrow')}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">{t('howItWorksTitle')}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: t('step1'),
                title: t('step1Title'),
              },
              {
                step: t('step2'),
                title: t('step2Title'),
              },
              {
                step: t('step3'),
                title: t('step3Title'),
              },
            ].map((item) => (
              <Card key={item.step} className="border-border/70 rounded-3xl shadow-none">
                <CardHeader className="space-y-3">
                  <CardDescription className="text-xs font-medium tracking-[0.18em] uppercase">
                    {item.step}
                  </CardDescription>
                  <CardTitle className="text-xl leading-7">{item.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <footer className="border-border/70 flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">{brand.name}</p>
          <p className="text-muted-foreground">{brandT('tagline')}</p>
        </footer>
      </PageContainer>
    </main>
  );
}

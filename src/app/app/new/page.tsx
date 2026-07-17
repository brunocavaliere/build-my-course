import Link from 'next/link';

import { ArrowLeft, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { generateCourseAction } from '@/app/app/courses/actions';
import { GenerateCourseForm } from '@/modules/courses/components/generate-course-form';
import { PageContainer, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type NewCoursePageProps = {
  searchParams: Promise<{
    generateError?: string;
  }>;
};

export default async function NewCoursePage({ searchParams }: NewCoursePageProps) {
  const { generateError } = await searchParams;
  const t = await getTranslations('NewCoursePage');
  const formT = await getTranslations('GenerateCourseForm');

  return (
    <PageContainer>
      <Button asChild variant="ghost" className="w-fit rounded-full pl-0 hover:bg-transparent">
        <Link href="/app">
          <ArrowLeft className="size-4" />
          {t('backToCourses')}
        </Link>
      </Button>

      <PageHeader title={t('title')} description={t('description')} />

      <Card className="border-border/70 w-full rounded-[2rem] shadow-none">
        <CardHeader className="space-y-3">
          <div className="bg-muted flex size-12 items-center justify-center rounded-2xl">
            <Sparkles className="size-5" />
          </div>
          <div className="space-y-2">
            <CardTitle>{t('cardTitle')}</CardTitle>
            <CardDescription className="text-sm leading-6">{t('cardDescription')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <GenerateCourseForm
            action={generateCourseAction}
            error={generateError}
            labels={{
              goalLabel: formT('goalLabel'),
              goalPlaceholder: formT('goalPlaceholder'),
              levelBeginner: formT('levels.beginner'),
              levelIntermediate: formT('levels.intermediate'),
              levelAdvanced: formT('levels.advanced'),
              levelLabel: formT('levelLabel'),
              levelPlaceholder: formT('levelPlaceholder'),
              submit: formT('submit'),
              submitting: formT('submitting'),
              weeksLabel: formT('weeksLabel'),
              weeksPlaceholder: formT('weeksPlaceholder'),
            }}
            secondaryAction={
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/app">{t('cancel')}</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}

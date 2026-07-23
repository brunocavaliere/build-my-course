import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Sparkles } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { auth } from '@/auth';
import { CourseCard } from '@/modules/courses/components/course-card';
import { listCoursesByUserId } from '@/modules/courses/queries';
import { EmptyState, PageContainer, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default async function AppPage() {
  const session = await auth();
  const t = await getTranslations('CoursesPage');
  const cardT = await getTranslations('CourseCard');
  const locale = await getLocale();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const courseList = await listCoursesByUserId(session.user.id);

  return (
    <PageContainer>
      <PageHeader title={t('title')} description={t('description')} />

      {courseList.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {courseList.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              locale={locale}
              formatters={{
                created: (date) => cardT('created', { date }),
                weeks: (count) => cardT('weeks', { count }),
              }}
              labels={{
                open: cardT('open'),
                level: cardT('level'),
                language: cardT('language'),
              }}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          action={
            <Button asChild className="rounded-full">
              <Link href="/app/new">
                <Sparkles className="size-4" />
                {t('generateFirstCourse')}
              </Link>
            </Button>
          }
        />
      )}
    </PageContainer>
  );
}

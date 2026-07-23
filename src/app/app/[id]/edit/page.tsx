import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { auth } from '@/auth';
import { updateCourseAction } from '@/app/app/courses/actions';
import { PageContainer, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { CourseForm } from '@/modules/courses/components/course-form';
import { getCourseByIdForUser } from '@/modules/courses/queries';

type EditCoursePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditCoursePage({ params, searchParams }: EditCoursePageProps) {
  const session = await auth();
  const headerT = await getTranslations('AppHeader');
  const { id } = await params;
  const { error } = await searchParams;
  const userId = session?.user?.id;

  if (!userId) {
    notFound();
  }

  const course = await getCourseByIdForUser(id, userId);

  if (!course) {
    notFound();
  }

  return (
    <PageContainer>
      <Button asChild variant="ghost" className="w-fit rounded-full pl-0 hover:bg-transparent">
        <Link href={`/app/${course.id}`}>
          <ArrowLeft className="size-4" />
          {headerT('backToCourse')}
        </Link>
      </Button>

      <PageHeader title="Edit Course" description="Update the basic metadata for this course." />

      <CourseForm
        action={updateCourseAction.bind(null, course.id)}
        submitLabel="Save changes"
        error={error}
        defaultValues={{
          title: course.title,
          goal: course.goal,
          description: course.description,
          level: course.level,
          courseLanguage: course.courseLanguage,
          estimatedWeeks: course.estimatedWeeks,
        }}
        secondaryAction={
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/app/${course.id}`}>Cancel</Link>
          </Button>
        }
      />
    </PageContainer>
  );
}

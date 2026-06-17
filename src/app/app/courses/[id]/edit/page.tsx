import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { auth } from '@/auth';
import { updateCourseAction } from '@/app/app/courses/actions';
import { CourseForm } from '@/modules/courses/components/course-form';
import { getCourseByIdForUser } from '@/modules/courses/queries';
import { PageContainer, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';

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
      <PageHeader
        title="Edit Course"
        description="Update the basic metadata for this course."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/app/courses/${course.id}`}>
              <ArrowLeft className="size-4" />
              Back to Course
            </Link>
          </Button>
        }
      />

      <CourseForm
        action={updateCourseAction.bind(null, course.id)}
        submitLabel="Save changes"
        error={error}
        defaultValues={{
          title: course.title,
          goal: course.goal,
          description: course.description,
          level: course.level,
          estimatedWeeks: course.estimatedWeeks,
        }}
        secondaryAction={
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/app/courses/${course.id}`}>Cancel</Link>
          </Button>
        }
      />
    </PageContainer>
  );
}

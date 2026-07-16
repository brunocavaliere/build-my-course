import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Sparkles } from 'lucide-react';

import { auth } from '@/auth';
import { CourseCard } from '@/modules/courses/components/course-card';
import { listCoursesByUserId } from '@/modules/courses/queries';
import { EmptyState, PageContainer, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default async function CoursesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const courseList = await listCoursesByUserId(session.user.id);

  return (
    <PageContainer>
      <PageHeader title="Courses" description="Browse and manage personalized learning paths." />

      {courseList.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {courseList.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No courses yet"
          description="Create your first manual course to start shaping the learning path."
          action={
            <Button asChild className="rounded-full">
              <Link href="/app/courses/new">
                <Sparkles className="size-4" />
                Generate first course
              </Link>
            </Button>
          }
        />
      )}
    </PageContainer>
  );
}

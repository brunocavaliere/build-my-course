import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CheckCircle2, Circle } from 'lucide-react';

import { auth } from '@/auth';
import { deleteCourseAction, toggleLessonProgressAction } from '@/app/app/courses/actions';
import { ConfirmSubmitButton } from '@/modules/courses/components/confirm-submit-button';
import { DeleteCourseButton } from '@/modules/courses/components/delete-course-button';
import {
  getCourseWithContentByIdForUser,
  listLessonProgressByUserId,
} from '@/modules/courses/queries';
import { EmptyState, PageContainer, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type CourseDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatProgress(total: number, completed: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const session = await auth();
  const { id } = await params;
  const userId = session?.user?.id;

  if (!userId) {
    notFound();
  }

  const course = await getCourseWithContentByIdForUser(id, userId);

  if (!course) {
    notFound();
  }

  const progressEntries = await listLessonProgressByUserId(userId);
  const progressMap = new Map(
    progressEntries.map((entry) => [
      entry.lessonId,
      {
        completed: entry.completed,
        completedAt: entry.completedAt,
      },
    ])
  );

  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (sum, module) =>
      sum + module.lessons.filter((lesson) => progressMap.get(lesson.id)?.completed).length,
    0
  );
  const completionPercentage = formatProgress(totalLessons, completedLessons);

  return (
    <PageContainer>
      <PageHeader
        title={course.title}
        description={course.description ?? course.goal}
        actions={
          <DeleteCourseButton action={deleteCourseAction.bind(null, course.id)}>
            Delete Course
          </DeleteCourseButton>
        }
      />

      <section className="mx-auto w-full max-w-5xl space-y-8">
        <Card className="border-border/70 rounded-[2rem] shadow-none">
          <CardContent className="grid gap-6 py-6">
            <div className="grid gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                Goal
              </p>
              <p className="text-sm leading-7">{course.goal}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border px-4 py-4">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                  Progress
                </p>
                <p className="mt-2 text-2xl font-semibold">{completionPercentage}%</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </div>

              <div className="rounded-2xl border px-4 py-4">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                  Level
                </p>
                <p className="mt-2 text-lg font-medium">{course.level ?? 'Not specified'}</p>
              </div>

              <div className="rounded-2xl border px-4 py-4">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                  Duration
                </p>
                <p className="mt-2 text-lg font-medium">
                  {course.estimatedWeeks ? `${course.estimatedWeeks} weeks` : 'Flexible'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {course.modules.length ? (
          <section className="space-y-8">
            {course.modules.map((module) => (
              <section key={module.id} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                    Module {module.position}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight">{module.title}</h2>
                  {module.description ? (
                    <p className="text-muted-foreground text-sm leading-7">{module.description}</p>
                  ) : null}
                  {module.estimatedMinutes ? (
                    <p className="text-muted-foreground text-sm">
                      {module.estimatedMinutes} minutes
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  {module.lessons.map((lesson) => {
                    const isCompleted = Boolean(progressMap.get(lesson.id)?.completed);

                    return (
                      <Card key={lesson.id} className="border-border/70 rounded-2xl shadow-none">
                        <CardContent className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                                Lesson {lesson.position}
                              </span>
                              <span className="text-muted-foreground text-xs">•</span>
                              <span
                                className={
                                  isCompleted
                                    ? 'inline-flex items-center gap-1 text-xs text-emerald-400'
                                    : 'text-muted-foreground inline-flex items-center gap-1 text-xs'
                                }
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                                ) : (
                                  <Circle className="size-3.5" />
                                )}
                                {isCompleted ? 'Completed' : 'Not completed'}
                              </span>
                            </div>

                            <Link
                              href={`/app/courses/${course.id}/lessons/${lesson.id}`}
                              className="hover:text-primary block text-lg font-medium transition-colors"
                            >
                              {lesson.title}
                            </Link>

                            {lesson.description ? (
                              <p className="text-muted-foreground text-sm leading-6">
                                {lesson.description}
                              </p>
                            ) : null}

                            {lesson.estimatedMinutes ? (
                              <p className="text-muted-foreground text-sm">
                                {lesson.estimatedMinutes} minutes
                              </p>
                            ) : null}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button asChild variant="secondary" className="rounded-full">
                              <Link href={`/app/courses/${course.id}/lessons/${lesson.id}`}>
                                Open lesson
                              </Link>
                            </Button>
                            <ConfirmSubmitButton
                              action={toggleLessonProgressAction.bind(
                                null,
                                course.id,
                                lesson.id,
                                !isCompleted
                              )}
                              title={
                                isCompleted
                                  ? 'Mark this lesson as not completed?'
                                  : 'Mark this lesson as completed?'
                              }
                              description="You can change this again later."
                              className="rounded-full"
                              variant="outline"
                              confirmLabel={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                            >
                              {isCompleted ? 'Mark incomplete' : 'Mark complete'}
                            </ConfirmSubmitButton>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            ))}
          </section>
        ) : (
          <EmptyState title="No modules yet" description="This course does not have modules yet." />
        )}
      </section>
    </PageContainer>
  );
}

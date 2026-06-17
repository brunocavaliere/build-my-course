import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

import { auth } from '@/auth';
import { toggleLessonProgressFromLessonPageAction } from '@/app/app/courses/actions';
import { MarkdownContent } from '@/components/shared/markdown-content';
import { EmptyState, PageContainer, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmSubmitButton } from '@/modules/courses/components/confirm-submit-button';
import { getLessonDetailByIdsForUser } from '@/modules/courses/queries';
import { updateCourseLessonContentByIdForUser } from '@/modules/courses/services';
import { generateLessonContent } from '@/modules/lessons/services/generate-lesson-content';

type LessonDetailsPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export default async function LessonDetailsPage({ params }: LessonDetailsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id: courseId, lessonId } = await params;

  const lessonDetail = await getLessonDetailByIdsForUser(courseId, lessonId, session.user.id);

  if (!lessonDetail) {
    notFound();
  }

  const { lesson, progress } = lessonDetail;
  const isCompleted = Boolean(progress?.completed);
  let lessonContent = lesson.content?.trim() || null;
  let generationError: string | null = null;

  if (!lessonContent) {
    try {
      lessonContent = await generateLessonContent({
        courseTitle: lesson.module.course.title,
        courseGoal: lesson.module.course.goal,
        level: lesson.module.course.level,
        moduleTitle: lesson.module.title,
        moduleDescription: lesson.module.description,
        lessonTitle: lesson.title,
        lessonDescription: lesson.description,
      });

      await updateCourseLessonContentByIdForUser({
        lessonId,
        userId: session.user.id,
        content: lessonContent,
      });
    } catch (error) {
      generationError =
        error instanceof Error ? error.message : 'Unable to generate lesson content right now.';
    }
  }

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader
        title={lesson.title}
        description={lesson.description ?? 'Lesson details and generated content.'}
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/app/courses/${courseId}`}>
              <ArrowLeft className="size-4" />
              Back to Course
            </Link>
          </Button>
        }
      />

      <section className="space-y-6">
        <Card className="border-border/70 rounded-[2rem] shadow-none">
          <CardContent className="flex flex-col gap-4 py-6">
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              <span>{lesson.module.course.title}</span>
              <span>•</span>
              <span>{lesson.module.title}</span>
              {lesson.estimatedMinutes ? (
                <>
                  <span>•</span>
                  <span>{lesson.estimatedMinutes} min</span>
                </>
              ) : null}
              <span>•</span>
              <span
                className={
                  isCompleted
                    ? 'inline-flex items-center gap-1 text-emerald-400'
                    : 'inline-flex items-center gap-1'
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

            {lesson.module.description ? (
              <p className="text-muted-foreground text-sm leading-7">{lesson.module.description}</p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <ConfirmSubmitButton
                action={toggleLessonProgressFromLessonPageAction.bind(
                  null,
                  courseId,
                  lessonId,
                  !isCompleted
                )}
                title={
                  isCompleted
                    ? 'Mark this lesson as not completed?'
                    : 'Mark this lesson as completed?'
                }
                description="You can change this again later."
                variant="secondary"
                className="rounded-full"
                confirmLabel={isCompleted ? 'Mark incomplete' : 'Mark complete'}
              >
                {isCompleted ? 'Mark incomplete' : 'Mark complete'}
              </ConfirmSubmitButton>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 rounded-[2rem] shadow-none">
          <CardContent className="py-8">
            {generationError ? (
              <div className="text-destructive bg-destructive/10 rounded-2xl px-4 py-3 text-sm">
                {generationError}
              </div>
            ) : lessonContent ? (
              <MarkdownContent content={lessonContent} className="space-y-6" />
            ) : (
              <EmptyState
                className="border-0 bg-transparent p-0 text-left shadow-none"
                title="No generated content yet"
                description="We could not prepare this lesson right now."
              />
            )}
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}

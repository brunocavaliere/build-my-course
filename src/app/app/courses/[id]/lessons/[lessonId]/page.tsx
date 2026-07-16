import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { CheckCircle2, Circle } from 'lucide-react';

import { auth } from '@/auth';
import {
  generateLessonContentAction,
  generatePracticeExercisesAction,
  toggleLessonProgressFromLessonPageAction,
} from '@/app/app/courses/actions';
import { MarkdownContent } from '@/components/shared/markdown-content';
import { EmptyState, PageContainer, PageHeader } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmSubmitButton } from '@/modules/courses/components/confirm-submit-button';
import { getLessonDetailByIdsForUser } from '@/modules/courses/queries';
import { LessonContentActionForm } from '@/modules/lessons/components/lesson-content-action-button';
import { PracticeExercisesPanel } from '@/modules/lessons/components/practice-exercises-panel';

type LessonDetailsPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
  searchParams: Promise<{
    aiError?: string;
    practiceError?: string;
    tab?: string;
  }>;
};

export default async function LessonDetailsPage({ params, searchParams }: LessonDetailsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id: courseId, lessonId } = await params;
  const { aiError, practiceError, tab } = await searchParams;

  const lessonDetail = await getLessonDetailByIdsForUser(courseId, lessonId, session.user.id);

  if (!lessonDetail) {
    notFound();
  }

  const { lesson, progress } = lessonDetail;
  const isCompleted = Boolean(progress?.completed);
  const lessonContent = lesson.content?.trim() || null;
  const practiceExercises = lesson.practiceExercises ?? [];
  const generationError: string | null = aiError ?? null;
  const practiceGenerationError: string | null = practiceError ?? null;

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader
        title={lesson.title}
        description={lesson.description ?? 'Lesson details and generated content.'}
        actions={
          <LessonContentActionForm
            action={generateLessonContentAction.bind(null, courseId, lessonId)}
            hasContent={Boolean(lessonContent)}
          />
        }
      />

      <section className="space-y-6">
        <Tabs defaultValue={tab === 'practice' ? 'practice' : 'lesson'}>
          <TabsList>
            <TabsTrigger value="lesson">Lesson</TabsTrigger>
            <TabsTrigger value="practice">Practice Exercises</TabsTrigger>
          </TabsList>

          <TabsContent value="lesson">
            <Card className="border-border/70 rounded-[2rem] shadow-none">
              <CardContent className="space-y-6 py-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

                {lesson.module.description ? (
                  <p className="text-muted-foreground text-sm leading-7">
                    {lesson.module.description}
                  </p>
                ) : null}

                {generationError ? (
                  <div className="text-destructive bg-destructive/10 rounded-2xl px-4 py-3 text-sm">
                    {generationError}
                  </div>
                ) : lessonContent ? (
                  <MarkdownContent content={lessonContent} className="space-y-6" />
                ) : (
                  <div className="space-y-6">
                    <EmptyState
                      className="border-0 bg-transparent p-0 text-left shadow-none"
                      title="No generated content yet"
                      description="Generate this lesson content when you are ready."
                    />
                    <LessonContentActionForm
                      action={generateLessonContentAction.bind(null, courseId, lessonId)}
                      hasContent={false}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice">
            <PracticeExercisesPanel
              action={generatePracticeExercisesAction.bind(null, courseId, lessonId)}
              exercises={practiceExercises}
              error={practiceGenerationError}
            />
          </TabsContent>
        </Tabs>
      </section>
    </PageContainer>
  );
}

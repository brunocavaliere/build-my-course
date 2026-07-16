import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { CheckCircle2, Circle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

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
  const t = await getTranslations('LessonDetailsPage');

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
    <PageContainer>
      <PageHeader
        title={lesson.title}
        description={lesson.description ?? t('descriptionFallback')}
        actions={
          <LessonContentActionForm
            action={generateLessonContentAction.bind(null, courseId, lessonId)}
            hasContent={Boolean(lessonContent)}
            labels={{
              generate: t('generateLessonContent'),
              regenerate: t('regenerateContent'),
              regenerating: t('generatingLessonContent'),
              dialogTitle: t('regenerateDialogTitle'),
              dialogDescription: t('regenerateDialogDescription'),
              cancel: t('cancel'),
            }}
          />
        }
      />

      <section className="space-y-6">
        <Tabs defaultValue={tab === 'practice' ? 'practice' : 'lesson'}>
          <TabsList>
            <TabsTrigger value="lesson">{t('lessonTab')}</TabsTrigger>
            <TabsTrigger value="practice">{t('practiceTab')}</TabsTrigger>
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
                      {isCompleted ? t('completed') : t('notCompleted')}
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
                      isCompleted ? t('markLessonIncompleteTitle') : t('markLessonCompleteTitle')
                    }
                    description={t('markLessonDescription')}
                    variant="secondary"
                    className="rounded-full"
                    confirmLabel={isCompleted ? t('markIncomplete') : t('markComplete')}
                    cancelLabel={t('cancel')}
                  >
                    {isCompleted ? t('markIncomplete') : t('markComplete')}
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
                      title={t('noContentTitle')}
                      description={t('noContentDescription')}
                    />
                    <LessonContentActionForm
                      action={generateLessonContentAction.bind(null, courseId, lessonId)}
                      hasContent={false}
                      labels={{
                        generate: t('generateLessonContent'),
                        regenerating: t('generatingLessonContent'),
                      }}
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
              labels={{
                emptyTitle: t('noPracticeTitle'),
                emptyDescription: t('noPracticeDescription'),
                generate: t('generatePracticeExercises'),
                generating: t('generatingExercises'),
                moreTitle: t('needMorePractice'),
                moreDescription: t('needMorePracticeDescription'),
                moreCta: t('generateMoreExercises'),
                exercise: t('exercise'),
                multipleChoice: t('multipleChoice'),
                appliedTask: t('appliedTask'),
                reflection: t('reflection'),
                shortAnswer: t('shortAnswer'),
                checkAnswer: t('checkAnswer'),
                correct: t('correctAnswer'),
                incorrect: t('incorrectAnswer'),
                explanation: t('explanation'),
                answerGuidance: t('answerGuidance'),
              }}
            />
          </TabsContent>
        </Tabs>
      </section>
    </PageContainer>
  );
}

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { auth } from '@/auth';
import {
  generateLessonContentAction,
  generateLessonRecommendedMaterialsAction,
  generatePracticeExercisesAction,
  toggleLessonProgressFromLessonPageAction,
} from '@/app/app/courses/actions';
import { MarkdownContent } from '@/components/shared/markdown-content';
import { PageContainer, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LessonContentBlocks } from '@/modules/lessons/components/lesson-content-blocks';
import { AutoGenerateLessonContent } from '@/modules/lessons/components/auto-generate-lesson-content';
import { ConfirmSubmitButton } from '@/modules/courses/components/confirm-submit-button';
import { getLessonDetailByIdsForUser } from '@/modules/courses/queries';
import { LessonContentActionForm } from '@/modules/lessons/components/lesson-content-action-button';
import { PracticeExercisesPanel } from '@/modules/lessons/components/practice-exercises-panel';
import { RecommendedMaterialsPanel } from '@/modules/lessons/components/recommended-materials-panel';

type LessonDetailsPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
  searchParams: Promise<{
    aiError?: string;
    materialsError?: string;
    practiceError?: string;
    tab?: string;
  }>;
};

export default async function LessonDetailsPage({ params, searchParams }: LessonDetailsPageProps) {
  const session = await auth();
  const t = await getTranslations('LessonDetailsPage');
  const headerT = await getTranslations('AppHeader');

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id: courseId, lessonId } = await params;
  const { aiError, materialsError, practiceError, tab } = await searchParams;

  if (aiError) {
    const cleanLessonPath = `/app/${courseId}/lessons/${lessonId}`;
    redirect(tab ? `${cleanLessonPath}?tab=${encodeURIComponent(tab)}` : cleanLessonPath);
  }

  const lessonDetail = await getLessonDetailByIdsForUser(courseId, lessonId, session.user.id);

  if (!lessonDetail) {
    notFound();
  }

  const { lesson, progress } = lessonDetail;
  const isCompleted = Boolean(progress?.completed);
  const lessonContent = lesson.content?.trim() || null;
  const lessonContentBlocks = lesson.contentBlocks ?? [];
  const practiceExercises = lesson.practiceExercises ?? [];
  const recommendedMaterials = lesson.recommendedMaterials ?? [];
  const materialsGenerationError: string | null = materialsError ?? null;
  const practiceGenerationError: string | null = practiceError ?? null;
  const defaultTab = tab === 'practice' ? 'practice' : tab === 'materials' ? 'materials' : 'lesson';

  return (
    <PageContainer>
      <Button asChild variant="ghost" className="w-fit rounded-full pl-0 hover:bg-transparent">
        <Link href={`/app/${courseId}`}>
          <ArrowLeft className="size-4" />
          {headerT('backToCourse')}
        </Link>
      </Button>

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
              dialogHint: t('regenerateDialogHint'),
              cancel: t('cancel'),
            }}
          />
        }
      />

      <section className="space-y-6">
        <Tabs defaultValue={defaultTab}>
          <TabsList>
            <TabsTrigger value="lesson">{t('lessonTab')}</TabsTrigger>
            <TabsTrigger value="practice">{t('practiceTab')}</TabsTrigger>
            <TabsTrigger value="materials">{t('materialsTab')}</TabsTrigger>
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

                {!lessonContent ? (
                  <AutoGenerateLessonContent
                    action={generateLessonContentAction.bind(null, courseId, lessonId)}
                    labels={{
                      title: t('generatingLessonContent'),
                      description: t('autoGeneratingLessonDescription'),
                      retry: t('tryAgain'),
                    }}
                  />
                ) : lessonContentBlocks.length ? (
                  <LessonContentBlocks
                    blocks={lessonContentBlocks}
                    labels={{
                      objectives: t('lessonObjectives'),
                      guidedExample: t('guidedExample'),
                      keyInsight: t('keyInsight'),
                      commonMistake: t('commonMistake'),
                      correction: t('mistakeCorrection'),
                      checkpoint: t('checkpoint'),
                      revealAnswer: t('revealCheckpointAnswer'),
                      process: t('stepByStep'),
                      summary: t('lessonSummary'),
                    }}
                  />
                ) : lessonContent ? (
                  <MarkdownContent content={lessonContent} className="space-y-6" />
                ) : null}
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
                chooseAnswer: t('chooseAnswer'),
                revealAnswer: t('revealAnswer'),
                correct: t('correctAnswer'),
                incorrect: t('incorrectAnswer'),
                explanation: t('explanation'),
                yourAnswer: t('yourAnswer'),
                correctOption: t('correctOption'),
                tryAgain: t('tryAgain'),
              }}
            />
          </TabsContent>

          <TabsContent value="materials">
            <RecommendedMaterialsPanel
              action={generateLessonRecommendedMaterialsAction.bind(null, courseId, lessonId)}
              materials={recommendedMaterials}
              error={materialsGenerationError}
              labels={{
                sectionVideo: t('recommendedVideos'),
                sectionArticle: t('recommendedReadings'),
                sectionBook: t('recommendedBooks'),
                emptyTitle: t('noMaterialsTitle'),
                emptyDescription: t('noMaterialsDescription'),
                generate: t('generateMaterials'),
                regenerate: t('refreshMaterials'),
                generating: t('generatingMaterials'),
                open: t('openMaterial'),
                refreshTitle: t('refreshMaterialsTitle'),
                refreshDescription: t('refreshMaterialsDescription'),
              }}
            />
          </TabsContent>
        </Tabs>
      </section>
    </PageContainer>
  );
}

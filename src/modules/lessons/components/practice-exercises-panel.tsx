import { Sparkles } from 'lucide-react';

import { EmptyState } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { SubmitButton } from '@/components/ui/submit-button';
import type { LessonPracticeExercise } from '@/modules/courses/types';
import { PracticeExerciseCard } from '@/modules/lessons/components/practice-exercise-card';

type PracticeExercisesPanelProps = {
  action: () => void | Promise<void>;
  exercises: LessonPracticeExercise[];
  error?: string | null;
  labels?: {
    emptyTitle?: string;
    emptyDescription?: string;
    generate?: string;
    generating?: string;
    moreTitle?: string;
    moreDescription?: string;
    moreCta?: string;
    exercise?: string;
    multipleChoice?: string;
    appliedTask?: string;
    reflection?: string;
    shortAnswer?: string;
    checkAnswer?: string;
    correct?: string;
    incorrect?: string;
    explanation?: string;
    answerGuidance?: string;
  };
};

export function PracticeExercisesPanel({
  action,
  exercises,
  error,
  labels,
}: PracticeExercisesPanelProps) {
  return (
    <div className="space-y-6">
      {error ? (
        <div className="text-destructive bg-destructive/10 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      {exercises.length ? (
        <>
          <div className="grid gap-4">
            {exercises.map((exercise, index) => (
              <PracticeExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                labels={labels}
              />
            ))}
          </div>

          <Card className="border-border/70 rounded-[2rem] shadow-none">
            <CardContent className="space-y-4 py-6">
              <div className="space-y-1">
                <p className="text-sm font-medium">{labels?.moreTitle ?? 'Need more practice?'}</p>
                <p className="text-muted-foreground text-sm">
                  {labels?.moreDescription ??
                    'Generate another batch of exercises for this lesson.'}
                </p>
              </div>

              <form action={action}>
                <SubmitButton
                  className="rounded-full"
                  idleIcon={<Sparkles className="size-4" />}
                  pendingLabel={labels?.generating ?? 'Generating exercises...'}
                >
                  {labels?.moreCta ?? 'Generate more exercises'}
                </SubmitButton>
              </form>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-border/70 rounded-[2rem] shadow-none">
          <CardContent className="space-y-6 py-8">
            <EmptyState
              className="border-0 bg-transparent p-0 shadow-none"
              title={labels?.emptyTitle ?? 'No practice exercises yet'}
              description={
                labels?.emptyDescription ?? 'Generate a first batch of exercises for this lesson.'
              }
            />

            <form action={action} className="flex justify-center">
              <SubmitButton
                className="rounded-full"
                idleIcon={<Sparkles className="size-4" />}
                pendingLabel={labels?.generating ?? 'Generating exercises...'}
              >
                {labels?.generate ?? 'Generate practice exercises'}
              </SubmitButton>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

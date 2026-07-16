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
};

export function PracticeExercisesPanel({ action, exercises, error }: PracticeExercisesPanelProps) {
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
              <PracticeExerciseCard key={exercise.id} exercise={exercise} index={index} />
            ))}
          </div>

          <Card className="border-border/70 rounded-[2rem] shadow-none">
            <CardContent className="space-y-4 py-6">
              <div className="space-y-1">
                <p className="text-sm font-medium">Need more practice?</p>
                <p className="text-muted-foreground text-sm">
                  Generate another batch of exercises for this lesson.
                </p>
              </div>

              <form action={action}>
                <SubmitButton
                  className="rounded-full"
                  idleIcon={<Sparkles className="size-4" />}
                  pendingLabel="Generating exercises..."
                >
                  Generate more exercises
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
              title="No practice exercises yet"
              description="Generate a first batch of exercises for this lesson."
            />

            <form action={action} className="flex justify-center">
              <SubmitButton
                className="rounded-full"
                idleIcon={<Sparkles className="size-4" />}
                pendingLabel="Generating exercises..."
              >
                Generate practice exercises
              </SubmitButton>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

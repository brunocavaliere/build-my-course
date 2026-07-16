'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LessonPracticeExercise } from '@/modules/courses/types';

type PracticeExerciseCardProps = {
  exercise: LessonPracticeExercise;
  index: number;
};

function getExerciseTypeLabel(type: LessonPracticeExercise['type']) {
  switch (type) {
    case 'multiple_choice':
      return 'Multiple Choice';
    case 'applied_task':
      return 'Applied Task';
    case 'reflection':
      return 'Reflection';
    case 'short_answer':
    default:
      return 'Short Answer';
  }
}

export function PracticeExerciseCard({ exercise, index }: PracticeExerciseCardProps) {
  const multipleChoiceOptions = exercise.type === 'multiple_choice' ? exercise.options : null;
  const isMultipleChoice =
    exercise.type === 'multiple_choice' &&
    Array.isArray(multipleChoiceOptions) &&
    multipleChoiceOptions.length > 0 &&
    typeof exercise.correctOptionIndex === 'number';

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);

  const isCorrect =
    hasCheckedAnswer &&
    selectedOptionIndex !== null &&
    selectedOptionIndex === exercise.correctOptionIndex;

  return (
    <Card className="border-border/70 rounded-[2rem] shadow-none">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{getExerciseTypeLabel(exercise.type)}</Badge>
          <span className="text-muted-foreground text-xs">Exercise {index + 1}</span>
        </div>
        <CardTitle className="text-xl">{exercise.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        <p className="text-sm leading-7">{exercise.instructions}</p>

        {isMultipleChoice ? (
          <div className="space-y-3">
            <div className="space-y-2">
              {multipleChoiceOptions!.map((option, optionIndex) => {
                const isSelected = selectedOptionIndex === optionIndex;
                const isCorrectOption =
                  hasCheckedAnswer && optionIndex === exercise.correctOptionIndex;
                const isWrongSelected =
                  hasCheckedAnswer && isSelected && optionIndex !== exercise.correctOptionIndex;

                return (
                  <button
                    key={`${exercise.id}-${optionIndex}`}
                    type="button"
                    onClick={() => {
                      setSelectedOptionIndex(optionIndex);
                      setHasCheckedAnswer(false);
                    }}
                    className={cn(
                      'border-border/70 bg-muted/30 hover:bg-muted/50 flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors',
                      isSelected && 'border-primary/60 bg-primary/8',
                      isCorrectOption && 'border-emerald-500/60 bg-emerald-500/10',
                      isWrongSelected && 'border-destructive/60 bg-destructive/10'
                    )}
                  >
                    <span className="bg-background text-muted-foreground inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <p className="text-sm leading-6">{option}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className="rounded-full"
                disabled={selectedOptionIndex === null}
                onClick={() => setHasCheckedAnswer(true)}
              >
                Check answer
              </Button>

              {hasCheckedAnswer ? (
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCorrect ? 'text-emerald-400' : 'text-destructive'
                  )}
                >
                  {isCorrect ? 'Correct answer.' : 'Incorrect answer.'}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {exercise.answerGuidance ? (
          <div className="bg-muted/50 rounded-2xl px-4 py-3">
            <p className="text-sm font-medium">
              {isMultipleChoice && hasCheckedAnswer ? 'Explanation' : 'What good looks like'}
            </p>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              {exercise.answerGuidance}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

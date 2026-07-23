'use client';

import { useEffect, useRef, useState } from 'react';

import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LessonPracticeExercise } from '@/modules/courses/types';

type PracticeExerciseCardProps = {
  exercise: LessonPracticeExercise;
  index: number;
  labels?: {
    exercise?: string;
    chooseAnswer?: string;
    revealAnswer?: string;
    correct?: string;
    incorrect?: string;
    explanation?: string;
    yourAnswer?: string;
    correctOption?: string;
    tryAgain?: string;
  };
};

export function PracticeExerciseCard({ exercise, index, labels }: PracticeExerciseCardProps) {
  const multipleChoiceOptions = Array.isArray(exercise.options) ? exercise.options : [];
  const correctOptionIndex =
    typeof exercise.correctOptionIndex === 'number' ? exercise.correctOptionIndex : null;
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardHeight, setCardHeight] = useState(420);
  const frontCardRef = useRef<HTMLDivElement | null>(null);
  const backCardRef = useRef<HTMLDivElement | null>(null);

  const isCorrect =
    isFlipped &&
    correctOptionIndex !== null &&
    selectedOptionIndex !== null &&
    selectedOptionIndex === correctOptionIndex;

  const selectedOption =
    selectedOptionIndex !== null ? multipleChoiceOptions[selectedOptionIndex] : null;
  const correctOption =
    correctOptionIndex !== null ? multipleChoiceOptions[correctOptionIndex] : null;

  useEffect(() => {
    function updateHeight() {
      const frontHeight = frontCardRef.current?.scrollHeight ?? 0;
      const backHeight = backCardRef.current?.scrollHeight ?? 0;
      const nextHeight = Math.max(frontHeight, backHeight, 420);

      setCardHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight));
    }

    updateHeight();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    if (frontCardRef.current) {
      observer.observe(frontCardRef.current);
    }

    if (backCardRef.current) {
      observer.observe(backCardRef.current);
    }

    return () => observer.disconnect();
  }, [
    exercise.answerGuidance,
    exercise.instructions,
    exercise.title,
    multipleChoiceOptions.length,
  ]);

  return (
    <div className="perspective-[1600px]">
      <div
        className="relative transition-transform duration-500 [transform-style:preserve-3d]"
        style={{
          height: `${cardHeight}px`,
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <Card
          ref={frontCardRef}
          className="border-border/70 absolute inset-0 flex flex-col overflow-hidden rounded-[2rem] shadow-none [backface-visibility:hidden]"
        >
          <CardHeader className="space-y-3">
            <span className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
              {labels?.exercise ?? 'Exercise'} {index + 1}
            </span>
            <CardTitle className="text-xl">{exercise.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex h-full flex-col">
            <p className="text-muted-foreground text-sm leading-7">{exercise.instructions}</p>

            <div className="mt-5 space-y-2">
              {multipleChoiceOptions.map((option, optionIndex) => {
                const isSelected = selectedOptionIndex === optionIndex;

                return (
                  <button
                    key={`${exercise.id}-${optionIndex}`}
                    type="button"
                    onClick={() => setSelectedOptionIndex(optionIndex)}
                    className={cn(
                      'border-border/70 bg-muted/20 hover:bg-muted/40 flex w-full cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors',
                      isSelected && 'border-primary/60 bg-primary/8'
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

            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
              <p className="text-muted-foreground text-sm">
                {labels?.chooseAnswer ?? 'Choose one option to continue.'}
              </p>

              <Button
                type="button"
                className="rounded-full"
                disabled={selectedOptionIndex === null || correctOptionIndex === null}
                onClick={() => setIsFlipped(true)}
              >
                {labels?.revealAnswer ?? 'Reveal answer'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          ref={backCardRef}
          className="border-border/70 absolute inset-0 flex flex-col overflow-hidden rounded-[2rem] shadow-none [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle2 className="size-5 text-emerald-400" />
              ) : (
                <XCircle className="text-destructive size-5" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  isCorrect ? 'text-emerald-400' : 'text-destructive'
                )}
              >
                {isCorrect
                  ? (labels?.correct ?? 'Correct answer.')
                  : (labels?.incorrect ?? 'Incorrect answer.')}
              </span>
            </div>
            <CardTitle className="text-xl">{exercise.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-sm font-medium">{labels?.explanation ?? 'Explanation'}</p>

                <div className="flex flex-wrap gap-3">
                  {selectedOption ? (
                    <div className="bg-muted/25 rounded-2xl border px-3 py-2">
                      <p className="text-muted-foreground text-xs font-medium tracking-[0.12em] uppercase">
                        {labels?.yourAnswer ?? 'Your answer'}
                      </p>
                      <p className="mt-1 text-sm font-medium">{selectedOption}</p>
                    </div>
                  ) : null}

                  {correctOption ? (
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2">
                      <p className="text-xs font-medium tracking-[0.12em] text-emerald-400 uppercase">
                        {labels?.correctOption ?? 'Correct answer'}
                      </p>
                      <p className="mt-1 text-sm font-medium text-emerald-50">{correctOption}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              {exercise.answerGuidance ? (
                <div className="border-border/60 border-l-2 pl-4">
                  <p className="text-muted-foreground text-sm leading-7">
                    {exercise.answerGuidance}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-auto flex justify-end pt-5">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setIsFlipped(false)}
              >
                <RotateCcw className="size-4" />
                {labels?.tryAgain ?? 'Try again'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

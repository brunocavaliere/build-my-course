'use client';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PracticeExerciseCard } from '@/modules/lessons/components/practice-exercise-card';
import type { LessonPracticeExercise } from '@/modules/courses/types';

const multipleChoiceExercise = {
  id: 'exercise-1',
  lessonId: 'lesson-1',
  title: 'SQL Basics',
  instructions: 'Choose the statement that best defines SQL.',
  type: 'multiple_choice',
  options: ['A', 'B', 'C', 'D'],
  correctOptionIndex: 1,
  answerGuidance: 'SQL is used to query and manipulate relational data.',
  createdAt: new Date('2026-07-16T12:00:00Z'),
  updatedAt: new Date('2026-07-16T12:00:00Z'),
} as LessonPracticeExercise;

describe('PracticeExerciseCard', () => {
  it('checks a correct multiple choice answer', async () => {
    const user = userEvent.setup();

    render(<PracticeExerciseCard exercise={multipleChoiceExercise} index={0} />);

    await user.click(screen.getByRole('button', { name: /b/i }));
    await user.click(screen.getByRole('button', { name: /check answer/i }));

    expect(screen.getByText('Correct answer.')).toBeInTheDocument();
    expect(screen.getByText('Explanation')).toBeInTheDocument();
  });

  it('renders answer guidance for non multiple choice exercises', () => {
    render(
      <PracticeExerciseCard
        exercise={{
          ...multipleChoiceExercise,
          type: 'short_answer',
          options: null,
          correctOptionIndex: null,
        }}
        index={1}
      />
    );

    expect(screen.getByText('What good looks like')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /check answer/i })).not.toBeInTheDocument();
  });
});

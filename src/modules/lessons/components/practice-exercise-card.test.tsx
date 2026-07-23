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
    await user.click(screen.getByRole('button', { name: /reveal answer/i }));

    expect(screen.getByText('Correct answer.')).toBeInTheDocument();
    expect(screen.getByText('Explanation')).toBeInTheDocument();
    expect(screen.getByText(/your answer:/i)).toBeInTheDocument();
    expect(screen.getByText(/correct answer:/i)).toBeInTheDocument();
  });

  it('lets the learner flip back and try again', async () => {
    const user = userEvent.setup();

    render(<PracticeExerciseCard exercise={multipleChoiceExercise} index={1} />);

    await user.click(screen.getByRole('button', { name: /b/i }));
    await user.click(screen.getByRole('button', { name: /reveal answer/i }));
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByRole('button', { name: /reveal answer/i })).toBeInTheDocument();
  });

  it('supports localized labels on the back of the card', async () => {
    const user = userEvent.setup();

    render(
      <PracticeExerciseCard
        exercise={multipleChoiceExercise}
        index={0}
        labels={{
          revealAnswer: 'Ver resposta',
          correct: 'Resposta correta.',
          explanation: 'Explicação',
          yourAnswer: 'Sua resposta',
          correctOption: 'Resposta correta',
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: /b/i }));
    await user.click(screen.getByRole('button', { name: /ver resposta/i }));

    expect(screen.getAllByText(/resposta correta/i)).not.toHaveLength(0);
    expect(screen.getByText(/sua resposta:/i)).toBeInTheDocument();
  });
});

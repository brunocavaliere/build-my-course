import { render, screen } from '@testing-library/react';

import { PracticeExercisesPanel } from '@/modules/lessons/components/practice-exercises-panel';
import type { LessonPracticeExercise } from '@/modules/courses/types';

const exercises = [
  {
    id: 'exercise-1',
    lessonId: 'lesson-1',
    title: 'Exercise A',
    instructions: 'Answer A.',
    type: 'short_answer',
    options: null,
    correctOptionIndex: null,
    answerGuidance: 'Keep it concise.',
    createdAt: new Date('2026-07-16T12:00:00Z'),
    updatedAt: new Date('2026-07-16T12:00:00Z'),
  },
] as LessonPracticeExercise[];

describe('PracticeExercisesPanel', () => {
  it('renders the empty state when there are no exercises', () => {
    render(<PracticeExercisesPanel action={async () => undefined} exercises={[]} />);

    expect(screen.getByText('No practice exercises yet')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /generate practice exercises/i })
    ).toBeInTheDocument();
  });

  it('renders the exercises list and generate more action', () => {
    render(
      <PracticeExercisesPanel
        action={async () => undefined}
        exercises={exercises}
        error="Temporary issue"
      />
    );

    expect(screen.getByText('Temporary issue')).toBeInTheDocument();
    expect(screen.getByText('Exercise A')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate more exercises/i })).toBeInTheDocument();
  });
});

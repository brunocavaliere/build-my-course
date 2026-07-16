import { render, screen } from '@testing-library/react';

import { LessonForm } from '@/modules/courses/components/lesson-form';

describe('LessonForm', () => {
  it('renders lesson fields and values', () => {
    render(
      <LessonForm
        action={async () => undefined}
        submitLabel="Save lesson"
        defaultValues={{
          title: 'JSX',
          description: 'Lesson summary',
          content: 'Lesson body',
          estimatedMinutes: 30,
        }}
      />
    );

    expect(screen.getByDisplayValue('JSX')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lesson summary')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lesson body')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });
});

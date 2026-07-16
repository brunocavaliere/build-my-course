import { render, screen } from '@testing-library/react';

import { CourseForm } from '@/modules/courses/components/course-form';

describe('CourseForm', () => {
  it('renders values, error, and submit label', () => {
    render(
      <CourseForm
        action={async () => undefined}
        error="Save failed"
        submitLabel="Save course"
        defaultValues={{
          title: 'React Roadmap',
          goal: 'Get job ready',
          description: 'A custom path',
          level: 'Beginner',
          estimatedWeeks: 6,
        }}
        secondaryAction={<button type="button">Cancel</button>}
      />
    );

    expect(screen.getByText('Save failed')).toBeInTheDocument();
    expect(screen.getByDisplayValue('React Roadmap')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Get job ready')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save course' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});

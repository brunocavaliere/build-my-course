import { render, screen } from '@testing-library/react';

import { GenerateCourseForm } from '@/modules/courses/components/generate-course-form';

describe('GenerateCourseForm', () => {
  it('renders defaults and error state', () => {
    render(
      <GenerateCourseForm
        action={async () => undefined}
        error="Generation failed"
        defaultValues={{
          goal: 'Learn React for frontend roles',
          level: 'Advanced',
          courseLanguage: 'es-ES',
          estimatedWeeks: 10,
        }}
        secondaryAction={<button type="button">Cancel</button>}
      />
    );

    expect(screen.getByText('Generation failed')).toBeInTheDocument();
    expect(screen.getByLabelText(/learning goal/i)).toHaveValue('Learn React for frontend roles');
    expect(screen.getAllByText('Español').length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate course/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});

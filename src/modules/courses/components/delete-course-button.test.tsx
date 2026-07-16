'use client';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DeleteCourseButton } from '@/modules/courses/components/delete-course-button';

describe('DeleteCourseButton', () => {
  it('opens a destructive confirmation dialog', async () => {
    const user = userEvent.setup();

    render(<DeleteCourseButton action={async () => undefined} />);

    await user.click(screen.getByRole('button', { name: /delete course/i }));

    expect(screen.getByText(/are you sure you want to delete this course/i)).toBeInTheDocument();
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});

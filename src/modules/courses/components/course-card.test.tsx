import { render, screen } from '@testing-library/react';

import { CourseCard } from '@/modules/courses/components/course-card';
import type { Course } from '@/modules/courses/types';

const course = {
  id: 'course-1',
  userId: 'user-1',
  title: 'React Foundations',
  goal: 'Become job-ready with React.',
  description: 'A practical React path.',
  level: 'Beginner',
  estimatedWeeks: 8,
  createdAt: new Date('2026-07-16T12:00:00Z'),
  updatedAt: new Date('2026-07-16T12:00:00Z'),
} as Course;

describe('CourseCard', () => {
  it('renders course metadata and destination link', () => {
    render(<CourseCard course={course} />);

    expect(screen.getByText('React Foundations')).toBeInTheDocument();
    expect(screen.getByText('Become job-ready with React.')).toBeInTheDocument();
    expect(screen.getByText('A practical React path.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open/i })).toHaveAttribute(
      'href',
      '/app/courses/course-1'
    );
    expect(screen.getByText(/level: beginner/i)).toBeInTheDocument();
    expect(screen.getByText(/8 weeks/i)).toBeInTheDocument();
  });
});

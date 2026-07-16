import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import { AppHeader } from '@/components/shared/app-header';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('AppHeader', () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue('/app');
  });

  it('shows the brand on the courses list page', () => {
    render(<AppHeader actions={<button type="button">Generate</button>} />);

    expect(screen.getByRole('link', { name: /build my course/i })).toHaveAttribute('href', '/app');
    expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument();
  });

  it('shows a back link on a course page', () => {
    vi.mocked(usePathname).mockReturnValue('/app/course-1');

    render(<AppHeader />);

    expect(screen.getByRole('link', { name: /back to courses/i })).toHaveAttribute('href', '/app');
  });

  it('shows a lesson back link when inside a lesson', () => {
    vi.mocked(usePathname).mockReturnValue('/app/course-1/lessons/lesson-1');

    render(<AppHeader />);

    expect(screen.getByRole('link', { name: /back to course/i })).toHaveAttribute(
      'href',
      '/app/course-1'
    );
  });
});

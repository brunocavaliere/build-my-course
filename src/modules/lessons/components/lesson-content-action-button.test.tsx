'use client';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LessonContentActionForm } from '@/modules/lessons/components/lesson-content-action-button';

describe('LessonContentActionForm', () => {
  it('renders a direct submit when content does not exist', () => {
    render(<LessonContentActionForm action={async () => ({ error: null })} hasContent={false} />);

    expect(screen.getByRole('button', { name: /generate lesson content/i })).toBeInTheDocument();
    expect(screen.queryByText(/regenerate lesson content/i)).not.toBeInTheDocument();
  });

  it('opens a confirmation dialog when regenerating', async () => {
    const user = userEvent.setup();

    render(
      <LessonContentActionForm
        action={async () => ({ error: null })}
        hasContent
        labels={{ dialogHint: 'Materials stay preserved.' }}
      />
    );

    await user.click(screen.getByRole('button', { name: /regenerate content/i }));

    expect(screen.getByText(/regenerate lesson content/i)).toBeInTheDocument();
    expect(screen.getByText(/previous lesson content will be replaced/i)).toBeInTheDocument();
    expect(screen.getByText(/materials stay preserved/i)).toBeInTheDocument();
  });
});

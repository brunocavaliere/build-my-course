'use client';

import { render, screen, waitFor } from '@testing-library/react';

import { AutoGenerateLessonContent } from '@/modules/lessons/components/auto-generate-lesson-content';

describe('AutoGenerateLessonContent', () => {
  it('submits automatically and shows loading copy', async () => {
    const action = vi.fn(async () => ({ error: null }));

    render(
      <AutoGenerateLessonContent
        action={action}
        labels={{
          title: 'Gerando conteúdo da aula...',
          description: 'Estamos preparando esta aula para você.',
        }}
      />
    );

    expect(screen.getByText('Gerando conteúdo da aula...')).toBeInTheDocument();
    expect(screen.getByText('Estamos preparando esta aula para você.')).toBeInTheDocument();

    await waitFor(() => {
      expect(action).toHaveBeenCalled();
    });
  });
});

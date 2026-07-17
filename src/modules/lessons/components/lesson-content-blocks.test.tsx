'use client';

import { render, screen } from '@testing-library/react';

import { LessonContentBlocks } from '@/modules/lessons/components/lesson-content-blocks';

describe('LessonContentBlocks', () => {
  it('renders markdown and code blocks separately', () => {
    render(
      <LessonContentBlocks
        blocks={[
          {
            type: 'markdown',
            content: '## Overview\nIntro text',
            position: 1,
          },
          {
            type: 'code',
            content: 'const value = 1;',
            language: 'ts',
            position: 2,
          },
        ]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Overview', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Intro text')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('ts')).toBeInTheDocument();
    expect(screen.getByText(/const value = 1;/)).toBeInTheDocument();
  });
});

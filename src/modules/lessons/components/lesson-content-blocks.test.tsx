'use client';

import { render, screen } from '@testing-library/react';

import { LessonContentBlocks } from '@/modules/lessons/components/lesson-content-blocks';

describe('LessonContentBlocks', () => {
  it('renders legacy markdown and code blocks separately', () => {
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

  it('renders pedagogical blocks with their learning affordances', () => {
    render(
      <LessonContentBlocks
        blocks={[
          {
            type: 'objective',
            title: 'Objetivos da aula',
            items: ['Entender entidades', 'Criar relacionamentos'],
            position: 1,
          },
          {
            type: 'example',
            title: 'Uma loja virtual',
            content: 'Vamos modelar os pedidos de uma loja.',
            position: 2,
          },
          {
            type: 'mistake',
            title: 'Duplicar clientes',
            content: 'Os dados ficam inconsistentes.',
            correction: 'Crie uma entidade Cliente separada.',
            position: 3,
          },
          {
            type: 'checkpoint',
            title: 'Antes de continuar',
            question: 'Onde deve ficar o nome do cliente?',
            answer: 'Na entidade Cliente.',
            position: 4,
          },
        ]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Objetivos da aula' })).toBeInTheDocument();
    expect(screen.getByText('Guided example')).toBeInTheDocument();
    expect(screen.getByText('Common mistake')).toBeInTheDocument();
    expect(screen.getByText('Reveal explanation')).toBeInTheDocument();
    expect(screen.getByText('Na entidade Cliente.')).toBeInTheDocument();
  });
});

import {
  lessonContentBlocksToMarkdown,
  splitLessonContentIntoBlocks,
} from '@/lib/lesson-content-blocks';

describe('splitLessonContentIntoBlocks', () => {
  it('splits markdown and code fences into ordered blocks', () => {
    const blocks = splitLessonContentIntoBlocks(`# Lesson Title

## Overview
Intro text

\`\`\`ts
const value = 1;
\`\`\`

## Summary
Final text`);

    expect(blocks).toHaveLength(3);
    expect(blocks[0]).toMatchObject({
      type: 'markdown',
      position: 1,
    });
    expect(blocks[1]).toMatchObject({
      type: 'code',
      language: 'ts',
      content: 'const value = 1;',
      position: 2,
    });
    expect(blocks[2]).toMatchObject({
      type: 'markdown',
      position: 3,
    });
  });

  it('returns an empty array for blank content', () => {
    expect(splitLessonContentIntoBlocks('   \n\n  ')).toEqual([]);
  });

  it('creates a markdown representation from pedagogical blocks', () => {
    const markdown = lessonContentBlocksToMarkdown([
      {
        type: 'objective',
        title: 'Objetivos',
        items: ['Entender o conceito', 'Aplicar o conceito'],
        position: 1,
      },
      {
        type: 'mistake',
        title: 'Erro comum',
        content: 'Confundir os conceitos.',
        correction: 'Compare as responsabilidades de cada conceito.',
        position: 2,
      },
      {
        type: 'checkpoint',
        title: 'Reflita',
        question: 'Qual conceito usar?',
        answer: 'Use aquele que representa a intenção.',
        position: 3,
      },
    ]);

    expect(markdown).toContain('- Entender o conceito');
    expect(markdown).toContain('Compare as responsabilidades');
    expect(markdown).toContain('**Qual conceito usar?**');
  });
});

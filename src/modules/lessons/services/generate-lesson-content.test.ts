vi.mock('@/env', () => ({
  env: {
    OPENAI_API_KEY: 'test-key',
    openAiModel: 'test-model',
  },
}));

import { generateLessonContent } from '@/modules/lessons/services/generate-lesson-content';

const input = {
  courseTitle: 'SQL Course',
  courseGoal: 'Learn SQL',
  level: 'Beginner',
  moduleTitle: 'Fundamentals',
  moduleDescription: 'Core SQL ideas',
  lessonTitle: 'Introduction to SQL',
  lessonDescription: 'Understand SQL basics',
};

describe('generateLessonContent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns validated markdown from output_text', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: `# Introduction to SQL
## Overview
Overview text
## Key Concepts
Concept text
## Examples
Example text
## Common Mistakes
Mistake text
## Summary
Summary text`,
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result).toContain('# Introduction to SQL');
    expect(result).toContain('## Summary');
  });

  it('throws a timeout-specific message', async () => {
    const timeoutError = new Error('timed out');
    timeoutError.name = 'AbortError';
    vi.spyOn(global, 'fetch').mockRejectedValue(timeoutError);

    await expect(generateLessonContent(input)).rejects.toThrow(
      'Lesson generation timed out. Please try again.'
    );
  });

  it('rejects incomplete markdown', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: '# Something else',
      }),
    } as Response);

    await expect(generateLessonContent(input)).rejects.toThrow(
      'Generated lesson content did not match requested lesson.'
    );
  });

  it('extracts lesson text from nested output content', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output: [
          {
            content: [
              { text: '# Introduction to SQL' },
              { text: '## Overview\nOverview text' },
              { text: '## Key Concepts\nConcept text' },
              { text: '## Examples\nExample text' },
              { text: '## Common Mistakes\nMistake text' },
              { text: '## Summary\nSummary text' },
            ],
          },
        ],
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result).toContain('## Examples');
  });

  it('uses provider error message when the request fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({
        error: { message: 'Provider said no' },
      }),
    } as Response);

    await expect(generateLessonContent(input)).rejects.toThrow('Provider said no');
  });

  it('throws when OpenAI returns empty content', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output: [{ content: [{ text: '   ' }] }],
      }),
    } as Response);

    await expect(generateLessonContent(input)).rejects.toThrow(
      'OpenAI returned empty lesson content.'
    );
  });

  it('maps unknown thrown values to a generic message', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue('unexpected');

    await expect(generateLessonContent(input)).rejects.toThrow(
      'Unable to generate lesson content right now.'
    );
  });
});

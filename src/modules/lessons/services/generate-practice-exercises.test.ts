vi.mock('@/env', () => ({
  env: {
    OPENAI_API_KEY: 'test-key',
    openAiModel: 'test-model',
  },
}));

import { generatePracticeExercises } from '@/modules/lessons/services/generate-practice-exercises';

const input = {
  courseTitle: 'SQL Course',
  courseGoal: 'Learn SQL',
  level: 'Beginner',
  moduleTitle: 'Fundamentals',
  moduleDescription: 'Core SQL ideas',
  lessonTitle: 'Introduction to SQL',
  lessonDescription: 'Understand SQL basics',
  lessonContent: '# Intro',
  count: 2,
  existingExerciseTitles: ['Existing one'],
};

describe('generatePracticeExercises', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns normalized exercises from parsed output', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: {
          exercises: [
            {
              title: ' SQL meaning ',
              instructions: ' Choose the best answer. ',
              type: 'multiple_choice',
              options: [' A ', ' B ', ' C ', ' D '],
              correctOptionIndex: 0,
              answerGuidance: ' Focus on database language. ',
            },
          ],
        },
      }),
    } as Response);

    const result = await generatePracticeExercises(input);

    expect(result).toEqual([
      {
        title: 'SQL meaning',
        instructions: 'Choose the best answer.',
        type: 'multiple_choice',
        options: ['A', 'B', 'C', 'D'],
        correctOptionIndex: 0,
        answerGuidance: 'Focus on database language.',
      },
    ]);
  });

  it('falls back to output_text parsing', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
          exercises: [
            {
              title: 'Exercise 1',
              instructions: 'Do it',
              type: 'short_answer',
              options: null,
              correctOptionIndex: null,
              answerGuidance: null,
            },
          ],
        }),
      }),
    } as Response);

    const result = await generatePracticeExercises(input);

    expect(result[0].title).toBe('Exercise 1');
  });

  it('maps timeouts to a user-friendly error', async () => {
    const timeoutError = new Error('timed out');
    timeoutError.name = 'TimeoutError';
    vi.spyOn(global, 'fetch').mockRejectedValue(timeoutError);

    await expect(generatePracticeExercises(input)).rejects.toThrow(
      'Practice exercise generation timed out. Please try again.'
    );
  });

  it('extracts exercises from nested output text', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output: [
          {
            content: [
              {
                text: JSON.stringify({
                  exercises: [
                    {
                      title: 'Exercise 1',
                      instructions: 'Do it',
                      type: 'reflection',
                      options: null,
                      correctOptionIndex: null,
                      answerGuidance: 'Think about it',
                    },
                  ],
                }),
              },
            ],
          },
        ],
      }),
    } as Response);

    const result = await generatePracticeExercises(input);

    expect(result[0].type).toBe('reflection');
  });

  it('uses provider error message when available', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({
        error: { message: 'Practice provider error' },
      }),
    } as Response);

    await expect(generatePracticeExercises(input)).rejects.toThrow('Practice provider error');
  });

  it('throws when structured exercises are missing', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output: [{ content: [{ text: '' }] }],
      }),
    } as Response);

    await expect(generatePracticeExercises(input)).rejects.toThrow(
      'OpenAI did not return structured practice exercises.'
    );
  });

  it('maps unknown thrown values to a generic message', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue('unexpected');

    await expect(generatePracticeExercises(input)).rejects.toThrow(
      'Unable to generate practice exercises right now.'
    );
  });
});

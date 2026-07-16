vi.mock('@/env', () => ({
  env: {
    OPENAI_API_KEY: 'test-key',
    openAiModel: 'test-model',
  },
}));

import { generateCourseBlueprint } from '@/modules/courses/services/generate-course-blueprint';

describe('generateCourseBlueprint', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes parsed structured output', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: {
          title: ' React Course ',
          description: ' Learn well ',
          modules: [
            {
              title: ' Basics ',
              description: ' Start here ',
              estimatedMinutes: null,
              lessons: [
                { title: ' Intro ', description: ' A ', estimatedMinutes: 20 },
                { title: ' JSX ', description: ' B ', estimatedMinutes: 25 },
              ],
            },
            {
              title: ' State ',
              description: null,
              estimatedMinutes: 60,
              lessons: [
                { title: ' Hooks ', description: null, estimatedMinutes: 30 },
                { title: ' Effects ', description: null, estimatedMinutes: 30 },
              ],
            },
            {
              title: ' Practice ',
              description: null,
              estimatedMinutes: 50,
              lessons: [
                { title: ' Build ', description: null, estimatedMinutes: 25 },
                { title: ' Review ', description: null, estimatedMinutes: 25 },
              ],
            },
          ],
        },
      }),
    } as Response);

    const result = await generateCourseBlueprint({
      goal: 'Get a frontend job',
      level: 'Beginner',
      estimatedWeeks: 8,
    });

    expect(result.title).toBe('React Course');
    expect(result.description).toBe('Learn well');
    expect(result.modules[0].estimatedMinutes).toBe(45);
    expect(result.modules[0].lessons[0].title).toBe('Intro');
  });

  it('falls back to output_text parsing', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
          title: 'Course',
          description: null,
          modules: [
            {
              title: 'Module 1',
              description: null,
              estimatedMinutes: 20,
              lessons: [
                { title: 'Lesson 1', description: null, estimatedMinutes: 10 },
                { title: 'Lesson 2', description: null, estimatedMinutes: 10 },
              ],
            },
            {
              title: 'Module 2',
              description: null,
              estimatedMinutes: 20,
              lessons: [
                { title: 'Lesson 3', description: null, estimatedMinutes: 10 },
                { title: 'Lesson 4', description: null, estimatedMinutes: 10 },
              ],
            },
            {
              title: 'Module 3',
              description: null,
              estimatedMinutes: 20,
              lessons: [
                { title: 'Lesson 5', description: null, estimatedMinutes: 10 },
                { title: 'Lesson 6', description: null, estimatedMinutes: 10 },
              ],
            },
          ],
        }),
      }),
    } as Response);

    const result = await generateCourseBlueprint({
      goal: 'Goal',
      level: 'Intermediate',
      estimatedWeeks: 6,
    });

    expect(result.modules).toHaveLength(3);
  });

  it('throws API errors with provider message when available', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({
        error: { message: 'Rate limit' },
      }),
    } as Response);

    await expect(
      generateCourseBlueprint({
        goal: 'Goal',
        level: 'Intermediate',
        estimatedWeeks: 6,
      })
    ).rejects.toThrow('Rate limit');
  });

  it('extracts structured text from nested output content', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output: [
          {
            content: [
              {
                text: JSON.stringify({
                  title: 'Course',
                  description: null,
                  modules: [
                    {
                      title: 'Module 1',
                      description: null,
                      estimatedMinutes: 20,
                      lessons: [
                        { title: 'Lesson 1', description: null, estimatedMinutes: 10 },
                        { title: 'Lesson 2', description: null, estimatedMinutes: 10 },
                      ],
                    },
                    {
                      title: 'Module 2',
                      description: null,
                      estimatedMinutes: 20,
                      lessons: [
                        { title: 'Lesson 3', description: null, estimatedMinutes: 10 },
                        { title: 'Lesson 4', description: null, estimatedMinutes: 10 },
                      ],
                    },
                    {
                      title: 'Module 3',
                      description: null,
                      estimatedMinutes: 20,
                      lessons: [
                        { title: 'Lesson 5', description: null, estimatedMinutes: 10 },
                        { title: 'Lesson 6', description: null, estimatedMinutes: 10 },
                      ],
                    },
                  ],
                }),
              },
            ],
          },
        ],
      }),
    } as Response);

    const result = await generateCourseBlueprint({
      goal: 'Goal',
      level: 'Intermediate',
      estimatedWeeks: 6,
    });

    expect(result.title).toBe('Course');
  });

  it('throws a generic OpenAI error when no provider message exists', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response);

    await expect(
      generateCourseBlueprint({
        goal: 'Goal',
        level: 'Intermediate',
        estimatedWeeks: 6,
      })
    ).rejects.toThrow('OpenAI request failed.');
  });

  it('throws when structured content is missing', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output: [{ content: [{ text: '   ' }] }],
      }),
    } as Response);

    await expect(
      generateCourseBlueprint({
        goal: 'Goal',
        level: 'Intermediate',
        estimatedWeeks: 6,
      })
    ).rejects.toThrow('OpenAI did not return structured course content.');
  });
});

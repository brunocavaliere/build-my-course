vi.mock('@/env', () => ({
  env: {
    OPENAI_API_KEY: 'test-key',
    openAiModel: 'test-model',
  },
}));

import { generateLessonRecommendedMaterials } from '@/modules/lessons/services/generate-lesson-recommended-materials';

const input = {
  courseTitle: 'SQL Course',
  courseGoal: 'Learn SQL',
  level: 'Beginner',
  courseLanguage: 'pt-BR',
  moduleTitle: 'Fundamentals',
  moduleDescription: 'Core SQL ideas',
  lessonTitle: 'Introduction to SQL',
  lessonDescription: 'Understand SQL basics',
  lessonContent: '# Introduction to SQL\n## Visão geral\nSQL basics.',
};

describe('generateLessonRecommendedMaterials', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns normalized materials from parsed output', async () => {
    const fetchMock = vi.spyOn(global, 'fetch');

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          output_parsed: {
            materials: [
              {
                type: 'video',
                title: ' SQL Intro ',
                description: ' Useful overview for beginners. ',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                author: 'Teacher',
                sourceName: 'YouTube',
              },
              {
                type: 'book',
                title: ' Learning SQL ',
                description: ' Good follow-up reference. ',
                url: null,
                author: 'Alan Beaulieu',
                sourceName: null,
              },
            ],
          },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
      } as Response);

    const result = await generateLessonRecommendedMaterials(input);

    expect(result).toEqual([
      {
        type: 'video',
        title: 'SQL Intro',
        description: 'Useful overview for beginners.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        author: 'Teacher',
        sourceName: 'YouTube',
      },
      {
        type: 'book',
        title: 'Learning SQL',
        description: 'Good follow-up reference.',
        url: null,
        author: 'Alan Beaulieu',
        sourceName: null,
      },
    ]);
  });

  it('drops video items that are not valid youtube links', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: {
          materials: [
            {
              type: 'video',
              title: 'Video',
              description: 'Bad link',
              url: 'https://example.com/video',
              author: null,
              sourceName: 'Example',
            },
            {
              type: 'article',
              title: 'Article',
              description: 'Still useful',
              url: 'https://example.com/article',
              author: null,
              sourceName: 'Example',
            },
          ],
        },
      }),
    } as Response);

    const result = await generateLessonRecommendedMaterials(input);

    expect(result).toHaveLength(1);
    expect(result[0]?.type).toBe('article');
  });

  it('replaces invalid youtube videos before returning materials', async () => {
    const fetchMock = vi.spyOn(global, 'fetch');

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          output_parsed: {
            materials: [
              {
                type: 'video',
                title: 'Broken video',
                description: 'Unavailable',
                url: 'https://www.youtube.com/watch?v=broken123',
                author: null,
                sourceName: 'YouTube',
              },
              {
                type: 'article',
                title: 'Article',
                description: 'Still useful',
                url: 'https://example.com/article',
                author: null,
                sourceName: 'Example',
              },
            ],
          },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          output_parsed: {
            materials: [
              {
                type: 'video',
                title: 'Replacement video',
                description: 'Valid replacement',
                url: 'https://www.youtube.com/watch?v=valid123',
                author: null,
                sourceName: 'YouTube',
              },
            ],
          },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
      } as Response);

    const result = await generateLessonRecommendedMaterials(input);

    expect(result).toEqual([
      {
        type: 'article',
        title: 'Article',
        description: 'Still useful',
        url: 'https://example.com/article',
        author: null,
        sourceName: 'Example',
      },
      {
        type: 'video',
        title: 'Replacement video',
        description: 'Valid replacement',
        url: 'https://www.youtube.com/watch?v=valid123',
        author: null,
        sourceName: 'YouTube',
      },
    ]);
  });

  it('throws a timeout-specific message', async () => {
    const timeoutError = new Error('timed out');
    timeoutError.name = 'AbortError';
    vi.spyOn(global, 'fetch').mockRejectedValue(timeoutError);

    await expect(generateLessonRecommendedMaterials(input)).rejects.toThrow(
      'Recommended materials generation timed out. Please try again.'
    );
  });

  it('uses provider error message when the request fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({
        error: { message: 'Provider said no' },
      }),
    } as Response);

    await expect(generateLessonRecommendedMaterials(input)).rejects.toThrow('Provider said no');
  });
});

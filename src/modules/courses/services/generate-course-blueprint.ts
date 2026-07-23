import { z } from 'zod';

import { brand } from '@/lib/brand';
import { env } from '@/env';
import { getCourseLanguagePromptLabel } from '@/modules/courses/lib/course-language';
import type { GeneratedCourseBlueprint } from '@/modules/courses/types';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

const generatedLessonSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(280).nullable(),
  estimatedMinutes: z.number().int().positive().max(240).nullable(),
});

const generatedModuleSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(280).nullable(),
  estimatedMinutes: z.number().int().positive().max(600).nullable(),
  lessons: z.array(generatedLessonSchema).min(2).max(8),
});

const generatedCourseBlueprintSchema = z.object({
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().max(400).nullable(),
  modules: z.array(generatedModuleSchema).min(3).max(10),
});

const generatedCourseBlueprintJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'description', 'modules'],
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 140,
    },
    description: {
      type: ['string', 'null'],
      maxLength: 400,
    },
    modules: {
      type: 'array',
      minItems: 3,
      maxItems: 10,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'description', 'estimatedMinutes', 'lessons'],
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 120,
          },
          description: {
            type: ['string', 'null'],
            maxLength: 280,
          },
          estimatedMinutes: {
            type: ['integer', 'null'],
            minimum: 1,
            maximum: 600,
          },
          lessons: {
            type: 'array',
            minItems: 2,
            maxItems: 8,
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['title', 'description', 'estimatedMinutes'],
              properties: {
                title: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 120,
                },
                description: {
                  type: ['string', 'null'],
                  maxLength: 280,
                },
                estimatedMinutes: {
                  type: ['integer', 'null'],
                  minimum: 1,
                  maximum: 240,
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

function buildSystemPrompt() {
  return [
    `You are course planner for ${brand.name}.`,
    'Create clear, practical course outlines.',
    'Return one complete course with modules and lessons only.',
    'Do not include quizzes, certificates, chat, videos, books, links, or external resources.',
    'Descriptions must be concise and actionable.',
    'Use realistic lesson durations.',
  ].join(' ');
}

function buildUserPrompt(input: {
  goal: string;
  level: string;
  courseLanguage: string;
  estimatedWeeks: number;
}) {
  const promptLanguage = getCourseLanguagePromptLabel(input.courseLanguage);

  return [
    `Learning goal: ${input.goal}`,
    `Level: ${input.level}`,
    `Generate the full course in: ${promptLanguage}`,
    `Estimated duration in weeks: ${input.estimatedWeeks}`,
    'Plan enough modules and lessons to fit that duration.',
    'Prefer progression from fundamentals to applied practice.',
    'Keep module and lesson titles short.',
    'All titles, descriptions, modules, and lessons must be written in that language.',
  ].join('\n');
}

function extractTextFromOutput(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const outputText = Reflect.get(payload, 'output_text');

  if (typeof outputText === 'string' && outputText.trim().length > 0) {
    return outputText;
  }

  const output = Reflect.get(payload, 'output');

  if (!Array.isArray(output)) {
    return null;
  }

  const textParts: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const content = Reflect.get(item, 'content');

    if (!Array.isArray(content)) {
      continue;
    }

    for (const entry of content) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }

      const text = Reflect.get(entry, 'text');

      if (typeof text === 'string' && text.trim().length > 0) {
        textParts.push(text);
      }
    }
  }

  return textParts.length ? textParts.join('\n') : null;
}

function extractParsedOutput(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const outputParsed = Reflect.get(payload, 'output_parsed');

  if (outputParsed && typeof outputParsed === 'object') {
    return outputParsed;
  }

  const output = Reflect.get(payload, 'output');

  if (!Array.isArray(output)) {
    return null;
  }

  for (const item of output) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const content = Reflect.get(item, 'content');

    if (!Array.isArray(content)) {
      continue;
    }

    for (const entry of content) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }

      const parsed = Reflect.get(entry, 'parsed');

      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  }

  return null;
}

function normalizeBlueprint(input: GeneratedCourseBlueprint): GeneratedCourseBlueprint {
  return {
    title: input.title.trim(),
    description: input.description?.trim() || null,
    modules: input.modules.map((module) => ({
      title: module.title.trim(),
      description: module.description?.trim() || null,
      estimatedMinutes: (() => {
        const fallbackMinutes = module.lessons.reduce(
          (total, lesson) => total + (lesson.estimatedMinutes ?? 0),
          0
        );

        return module.estimatedMinutes ?? (fallbackMinutes > 0 ? fallbackMinutes : null);
      })(),
      lessons: module.lessons.map((lesson) => ({
        title: lesson.title.trim(),
        description: lesson.description?.trim() || null,
        estimatedMinutes: lesson.estimatedMinutes ?? null,
      })),
    })),
  };
}

function getErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const error = Reflect.get(payload, 'error');

  if (!error || typeof error !== 'object') {
    return null;
  }

  const message = Reflect.get(error, 'message');

  return typeof message === 'string' ? message : null;
}

export async function generateCourseBlueprint(input: {
  goal: string;
  level: string;
  courseLanguage: string;
  estimatedWeeks: number;
}): Promise<GeneratedCourseBlueprint> {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.openAiModel,
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: buildSystemPrompt(),
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: buildUserPrompt(input),
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'course_blueprint',
          strict: true,
          schema: generatedCourseBlueprintJsonSchema,
        },
      },
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload) ?? 'OpenAI request failed.');
  }

  const parsedPayload = extractParsedOutput(payload);

  if (parsedPayload) {
    return normalizeBlueprint(generatedCourseBlueprintSchema.parse(parsedPayload));
  }

  const outputText = extractTextFromOutput(payload);

  if (!outputText) {
    throw new Error('OpenAI did not return structured course content.');
  }

  const parsedJson = JSON.parse(outputText) as unknown;

  return normalizeBlueprint(generatedCourseBlueprintSchema.parse(parsedJson));
}

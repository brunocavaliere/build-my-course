import { z } from 'zod';

import { env } from '@/env';
import { getCourseLanguagePromptLabel } from '@/modules/courses/lib/course-language';
import type { GeneratedPracticeExercise } from '@/modules/courses/types';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const REQUEST_TIMEOUT_MS = 45_000;

const generatedPracticeExerciseSchema = z.object({
  title: z.string().trim().min(1).max(120),
  instructions: z.string().trim().min(1).max(600),
  type: z.literal('multiple_choice'),
  options: z.array(z.string().trim().min(1).max(160)).min(4).max(4),
  correctOptionIndex: z.number().int().min(0).max(3),
  answerGuidance: z.string().trim().max(520).nullable(),
});

const generatedPracticeExercisesSchema = z.object({
  exercises: z.array(generatedPracticeExerciseSchema).min(1).max(6),
});

const generatedPracticeExercisesJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['exercises'],
  properties: {
    exercises: {
      type: 'array',
      minItems: 1,
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'title',
          'instructions',
          'type',
          'options',
          'correctOptionIndex',
          'answerGuidance',
        ],
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 120,
          },
          instructions: {
            type: 'string',
            minLength: 1,
            maxLength: 600,
          },
          type: {
            type: 'string',
            enum: ['multiple_choice'],
          },
          options: {
            type: 'array',
            minItems: 4,
            maxItems: 4,
            items: {
              type: 'string',
              minLength: 1,
              maxLength: 160,
            },
          },
          correctOptionIndex: {
            type: 'integer',
            minimum: 0,
            maximum: 3,
          },
          answerGuidance: {
            type: ['string', 'null'],
            maxLength: 520,
          },
        },
      },
    },
  },
} as const;

function buildSystemPrompt() {
  return [
    'You are an instructional designer creating practice exercises for a lesson.',
    'Return practical exercises only.',
    'Generate only multiple_choice exercises.',
    'Keep exercises specific, concise, and matched to the lesson level.',
    'Do not include solutions, external links, or markdown formatting.',
    'Each exercise must include exactly 4 plausible options.',
    'Set correctOptionIndex to the zero-based index of the correct option.',
    'Make distractors realistic, distinct, and not tricky.',
    'answerGuidance should explain why the correct answer is right and why the distractors do not fit.',
  ].join(' ');
}

function buildUserPrompt(input: {
  courseTitle: string;
  courseGoal: string;
  level: string | null;
  courseLanguage: string;
  moduleTitle: string;
  moduleDescription: string | null;
  lessonTitle: string;
  lessonDescription: string | null;
  lessonContent: string | null;
  count: number;
  existingExerciseTitles: string[];
}) {
  const existingTitles =
    input.existingExerciseTitles.length > 0 ? input.existingExerciseTitles.join(' | ') : 'None yet';
  const promptLanguage = getCourseLanguagePromptLabel(input.courseLanguage);

  return [
    `Course title: ${input.courseTitle}`,
    `Course goal: ${input.courseGoal}`,
    `Course level: ${input.level ?? 'Not specified'}`,
    `Write every exercise in: ${promptLanguage}`,
    `Module title: ${input.moduleTitle}`,
    `Module description: ${input.moduleDescription ?? 'Not specified'}`,
    `Lesson title: ${input.lessonTitle}`,
    `Lesson description: ${input.lessonDescription ?? 'Not specified'}`,
    `Lesson content: ${input.lessonContent ?? 'Not generated yet'}`,
    `Number of new exercises needed: ${input.count}`,
    `Existing exercise titles to avoid repeating: ${existingTitles}`,
    'Generate only new exercises.',
    'Each exercise should be directly answerable by the learner without needing external material.',
    'Every exercise must be multiple_choice.',
    'There must be exactly one correct option in each exercise.',
    'answerGuidance should be a concise but useful explanation in 2 to 4 sentences.',
    'All learner-facing text must be in the requested language.',
    'Never mix languages unless the requested language itself requires it.',
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

function normalizeExercises(input: { exercises: GeneratedPracticeExercise[] }) {
  return input.exercises.map((exercise) => ({
    title: exercise.title.trim(),
    instructions: exercise.instructions.trim(),
    type: exercise.type,
    options: exercise.options.map((option) => option.trim()),
    correctOptionIndex: exercise.correctOptionIndex,
    answerGuidance: exercise.answerGuidance?.trim() || null,
  }));
}

export async function generatePracticeExercises(input: {
  courseTitle: string;
  courseGoal: string;
  level: string | null;
  courseLanguage: string;
  moduleTitle: string;
  moduleDescription: string | null;
  lessonTitle: string;
  lessonDescription: string | null;
  lessonContent: string | null;
  count: number;
  existingExerciseTitles: string[];
}): Promise<GeneratedPracticeExercise[]> {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  try {
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
            name: 'practice_exercises',
            strict: true,
            schema: generatedPracticeExercisesJsonSchema,
          },
        },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(getErrorMessage(payload) ?? 'OpenAI request failed.');
    }

    const parsedPayload = extractParsedOutput(payload);

    if (parsedPayload) {
      return normalizeExercises(generatedPracticeExercisesSchema.parse(parsedPayload));
    }

    const outputText = extractTextFromOutput(payload);

    if (!outputText) {
      throw new Error('OpenAI did not return structured practice exercises.');
    }

    const parsedJson = JSON.parse(outputText) as unknown;

    return normalizeExercises(generatedPracticeExercisesSchema.parse(parsedJson));
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new Error('Practice exercise generation timed out. Please try again.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unable to generate practice exercises right now.');
  }
}

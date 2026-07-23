import { z } from 'zod';

import { env } from '@/env';
import { lessonContentBlocksToMarkdown } from '@/lib/lesson-content-blocks';
import type { LessonContentBlock } from '@/lib/lesson-content-blocks';
import { getCourseLanguagePromptLabel } from '@/modules/courses/lib/course-language';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const REQUEST_TIMEOUT_MS = 90_000;
const MAX_OUTPUT_TOKENS = 6_000;

const lessonBlockTypes = [
  'objective',
  'context',
  'concept',
  'example',
  'code',
  'insight',
  'mistake',
  'checkpoint',
  'process',
  'summary',
] as const;

const generatedLessonContentJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['blocks'],
  properties: {
    blocks: {
      type: 'array',
      minItems: 8,
      maxItems: 18,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'type',
          'title',
          'content',
          'items',
          'language',
          'question',
          'answer',
          'correction',
        ],
        properties: {
          type: {
            type: 'string',
            enum: lessonBlockTypes,
          },
          title: {
            type: ['string', 'null'],
            maxLength: 140,
          },
          content: {
            type: ['string', 'null'],
            maxLength: 7000,
          },
          items: {
            type: 'array',
            maxItems: 8,
            items: {
              type: 'string',
              maxLength: 500,
            },
          },
          language: {
            type: ['string', 'null'],
            maxLength: 40,
          },
          question: {
            type: ['string', 'null'],
            maxLength: 800,
          },
          answer: {
            type: ['string', 'null'],
            maxLength: 1600,
          },
          correction: {
            type: ['string', 'null'],
            maxLength: 1600,
          },
        },
      },
    },
  },
} as const;

const generatedLessonBlockSchema = z.object({
  type: z.enum(lessonBlockTypes),
  title: z.string().trim().nullable(),
  content: z.string().trim().nullable(),
  items: z.array(z.string().trim()).max(8),
  language: z.string().trim().nullable(),
  question: z.string().trim().nullable(),
  answer: z.string().trim().nullable(),
  correction: z.string().trim().nullable(),
});

const generatedLessonSchema = z.object({
  blocks: z.array(generatedLessonBlockSchema).min(8).max(18),
});

type GeneratedLessonBlock = z.infer<typeof generatedLessonBlockSchema>;

function buildSystemPrompt() {
  return [
    'You are an expert teacher, instructional designer, and technical writer.',
    'Create a complete self-study lesson, not an outline, cheat sheet, or list of definitions.',
    'The learner must understand why the subject matters, how its ideas connect, and how to apply it.',
    'Teach progressively from familiar context to new concepts.',
    'Use one coherent real-world scenario across the lesson whenever possible.',
    'Explain reasoning, causal relationships, decisions, and trade-offs.',
    'Definitions alone are insufficient: every important concept needs explanation and application.',
    'Use Markdown inside content fields when useful, but do not place headings in content fields.',
    'Do not include external links, recommended materials, formal quizzes, or a list of practice exercises.',
    'A checkpoint is a brief reflection question inside the explanation, with a concise answer.',
    'Use code blocks only when code materially improves understanding.',
    'Use a process block when a sequence, workflow, or relationship benefits from a visual step-by-step representation.',
    'All learner-facing text must use the requested language.',
  ].join(' ');
}

function getDepthGuidance(estimatedMinutes: number | null) {
  if (!estimatedMinutes) {
    return 'Aim for a substantial lesson of roughly 900 to 1,300 words.';
  }

  if (estimatedMinutes <= 20) {
    return 'Aim for roughly 600 to 850 words, while still teaching the subject fully.';
  }

  if (estimatedMinutes <= 45) {
    return 'Aim for roughly 850 to 1,150 words.';
  }

  return 'Aim for roughly 1,000 to 1,400 words, using the available depth for explanation and application.';
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
  estimatedMinutes: number | null;
}) {
  const promptLanguage = getCourseLanguagePromptLabel(input.courseLanguage);

  return [
    `Course title: ${input.courseTitle}`,
    `Course goal: ${input.courseGoal}`,
    `Learner level: ${input.level ?? 'Not specified'}`,
    `Lesson language: ${promptLanguage}`,
    `Module title: ${input.moduleTitle}`,
    `Module description: ${input.moduleDescription ?? 'Not specified'}`,
    `Lesson title: ${input.lessonTitle}`,
    `Lesson description: ${input.lessonDescription ?? 'Not specified'}`,
    `Estimated lesson duration: ${input.estimatedMinutes ?? 'Not specified'} minutes`,
    getDepthGuidance(input.estimatedMinutes),
    'Build the blocks in this pedagogical order:',
    '1. One objective block with 2 to 4 concrete, observable outcomes.',
    '2. One context block that motivates the topic with a real situation and connects it to the course goal.',
    '3. At least two concept blocks. Explain each concept in depth and connect it to what came before.',
    '4. Include one process block when a sequence or relationship can clarify the subject.',
    '5. One or more example blocks forming a guided, end-to-end example. Show the reasoning at each step.',
    '6. Add code blocks next to the relevant example when appropriate.',
    '7. At least one insight block explaining an important decision, “why”, or trade-off.',
    '8. At least one mistake block that shows a plausible mistake, its consequence, and a concrete correction.',
    '9. At least one checkpoint block that makes the learner think before revealing the answer.',
    '10. One summary block with 3 to 6 actionable takeaways and content explaining what this enables next.',
    'Prefer 8 to 11 blocks total unless the lesson genuinely needs more.',
    'Keep each block focused and concise. Avoid repetition across blocks.',
    'Do not use generic filler. Make every block specific to this exact lesson and learner level.',
    'Titles should be descriptive and natural, rather than labels such as “Concept 1”.',
    'Unused fields must be null or an empty array.',
  ].join('\n');
}

function extractTextFromOutput(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const outputText = Reflect.get(payload, 'output_text');

  if (typeof outputText === 'string' && outputText.trim().length > 0) {
    return outputText.trim();
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
        textParts.push(text.trim());
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

function normalizeBlock(block: GeneratedLessonBlock, position: number): LessonContentBlock | null {
  const items = block.items.filter(Boolean);

  switch (block.type) {
    case 'objective':
      if (!block.title || items.length === 0) {
        return null;
      }
      return {
        type: block.type,
        title: block.title,
        items,
        position,
      };
    case 'context':
    case 'concept':
    case 'example':
    case 'insight':
      if (!block.title || !block.content) {
        return null;
      }
      return {
        type: block.type,
        title: block.title,
        content: block.content,
        position,
      };
    case 'code':
      if (!block.content) {
        return null;
      }
      return {
        type: block.type,
        content: block.content,
        language: block.language,
        position,
      };
    case 'mistake':
      if (!block.title || !block.content || !block.correction) {
        return null;
      }
      return {
        type: block.type,
        title: block.title,
        content: block.content,
        correction: block.correction,
        position,
      };
    case 'checkpoint':
      if (!block.title || !block.question || !block.answer) {
        return null;
      }
      return {
        type: block.type,
        title: block.title,
        question: block.question,
        answer: block.answer,
        position,
      };
    case 'process':
      if (!block.title || items.length < 2) {
        return null;
      }
      return {
        type: block.type,
        title: block.title,
        items,
        position,
      };
    case 'summary':
      if (!block.title || items.length === 0) {
        return null;
      }
      return {
        type: block.type,
        title: block.title,
        items,
        content: block.content ?? '',
        position,
      };
  }
}

function normalizeLesson(payload: unknown) {
  const generated = generatedLessonSchema.parse(payload);
  const normalizedBlocks = generated.blocks
    .map((block, index) => normalizeBlock(block, index + 1))
    .filter((block): block is LessonContentBlock => block !== null);
  const blocks = normalizedBlocks.map((block, index) => ({
    ...block,
    position: index + 1,
  }));
  const content = lessonContentBlocksToMarkdown(blocks);

  if (blocks.length < 5 || content.length < 300) {
    throw new Error('Generated lesson content was incomplete. Please try again.');
  }

  return {
    content,
    blocks,
  };
}

export async function generateLessonContent(input: {
  courseTitle: string;
  courseGoal: string;
  level: string | null;
  courseLanguage: string;
  moduleTitle: string;
  moduleDescription: string | null;
  lessonTitle: string;
  lessonDescription: string | null;
  estimatedMinutes: number | null;
}) {
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
            name: 'lesson_content',
            schema: generatedLessonContentJsonSchema,
            strict: true,
          },
        },
        max_output_tokens: MAX_OUTPUT_TOKENS,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(getErrorMessage(payload) ?? 'OpenAI request failed.');
    }

    const parsedPayload = extractParsedOutput(payload);

    if (parsedPayload) {
      return normalizeLesson(parsedPayload);
    }

    const outputText = extractTextFromOutput(payload);

    if (!outputText) {
      throw new Error('OpenAI returned empty lesson content.');
    }

    return normalizeLesson(JSON.parse(outputText));
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new Error('Lesson generation timed out. Please try again.');
    }

    if (error instanceof z.ZodError) {
      throw new Error('Generated lesson content had an invalid format. Please try again.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unable to generate lesson content right now.');
  }
}

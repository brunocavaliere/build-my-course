import { env } from '@/env';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const OPENAI_MODEL = 'gpt-4o-mini';
const REQUEST_TIMEOUT_MS = 45_000;

function buildSystemPrompt() {
  return [
    'You are an Instructional Designer, Teacher, and Technical Writer.',
    'Generate concise, useful lesson content in Markdown.',
    'Teach progressively.',
    'Do not assume advanced knowledge.',
    'Use practical examples.',
    'Avoid unnecessary jargon.',
    'Do not include links, videos, references, quizzes, flashcards, or external resources.',
    'Output valid Markdown only.',
    'Follow exactly this structure:',
    '# Lesson Title',
    '## Overview',
    '## Key Concepts',
    '## Examples',
    '## Common Mistakes',
    '## Practice Exercises',
    '1. ...',
    '2. ...',
    '3. ...',
    '## Summary',
  ].join(' ');
}

function buildUserPrompt(input: {
  courseTitle: string;
  courseGoal: string;
  level: string | null;
  moduleTitle: string;
  moduleDescription: string | null;
  lessonTitle: string;
  lessonDescription: string | null;
}) {
  return [
    `Course title: ${input.courseTitle}`,
    `Course goal: ${input.courseGoal}`,
    `Course level: ${input.level ?? 'Not specified'}`,
    `Module title: ${input.moduleTitle}`,
    `Module description: ${input.moduleDescription ?? 'Not specified'}`,
    `Lesson title: ${input.lessonTitle}`,
    `Lesson description: ${input.lessonDescription ?? 'Not specified'}`,
    'Write lesson content that matches this context.',
    'Keep content focused and not excessively long.',
    'Practice exercises must be simple and actionable.',
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

  return textParts.length ? textParts.join('\n\n') : null;
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

function validateMarkdownContent(markdown: string, lessonTitle: string) {
  const requiredSections = [
    '## Overview',
    '## Key Concepts',
    '## Examples',
    '## Common Mistakes',
    '## Practice Exercises',
    '## Summary',
  ];

  if (!markdown.startsWith('# ')) {
    throw new Error('Generated lesson content came back incomplete.');
  }

  if (!markdown.toLowerCase().includes(lessonTitle.toLowerCase())) {
    throw new Error('Generated lesson content did not match requested lesson.');
  }

  for (const section of requiredSections) {
    if (!markdown.includes(section)) {
      throw new Error('Generated lesson content came back incomplete.');
    }
  }

  return markdown.trim();
}

export async function generateLessonContent(input: {
  courseTitle: string;
  courseGoal: string;
  level: string | null;
  moduleTitle: string;
  moduleDescription: string | null;
  lessonTitle: string;
  lessonDescription: string | null;
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
        model: OPENAI_MODEL,
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
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(getErrorMessage(payload) ?? 'OpenAI request failed.');
    }

    const outputText = extractTextFromOutput(payload);

    if (!outputText) {
      throw new Error('OpenAI returned empty lesson content.');
    }

    return validateMarkdownContent(outputText, input.lessonTitle);
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new Error('Lesson generation timed out. Please try again.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unable to generate lesson content right now.');
  }
}

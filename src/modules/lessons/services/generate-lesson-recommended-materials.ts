import { env } from '@/env';
import { getCourseLanguagePromptLabel } from '@/modules/courses/lib/course-language';
import type { GeneratedLessonRecommendedMaterial } from '@/modules/courses/types';
import {
  lessonRecommendedMaterialsSchema,
  type LessonRecommendedMaterial,
} from '@/modules/lessons/lib/recommended-materials';
import { getYoutubeEmbedUrl } from '@/modules/lessons/lib/youtube';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const REQUEST_TIMEOUT_MS = 45_000;
const YOUTUBE_VALIDATION_TIMEOUT_MS = 5_000;

const generatedLessonRecommendedMaterialsJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['materials'],
  properties: {
    materials: {
      type: 'array',
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['type', 'title', 'description', 'url', 'author', 'sourceName'],
        properties: {
          type: {
            type: 'string',
            enum: ['video', 'article', 'book'],
          },
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 160,
          },
          description: {
            type: 'string',
            minLength: 1,
            maxLength: 400,
          },
          url: {
            type: ['string', 'null'],
            maxLength: 500,
          },
          author: {
            type: ['string', 'null'],
            maxLength: 120,
          },
          sourceName: {
            type: ['string', 'null'],
            maxLength: 120,
          },
        },
      },
    },
  },
} as const;

function buildSystemPrompt() {
  return [
    'You are an instructional designer curating recommended materials for a lesson.',
    'Return only high-signal recommendations that clearly deepen the learner understanding.',
    'Prefer a small set of useful materials over filler.',
    'You may return zero materials if nothing is clearly worthwhile.',
    'Videos must be YouTube links only.',
    'Books may omit the URL when you are not confident about a stable canonical link.',
    'Articles should include a direct canonical URL when possible.',
    'Do not invent explanations disconnected from the lesson.',
    'Do not include markdown formatting.',
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
  lessonContent: string;
}) {
  const promptLanguage = getCourseLanguagePromptLabel(input.courseLanguage);

  return [
    `Course title: ${input.courseTitle}`,
    `Course goal: ${input.courseGoal}`,
    `Course level: ${input.level ?? 'Not specified'}`,
    `Write all learner-facing text in: ${promptLanguage}`,
    `Module title: ${input.moduleTitle}`,
    `Module description: ${input.moduleDescription ?? 'Not specified'}`,
    `Lesson title: ${input.lessonTitle}`,
    `Lesson description: ${input.lessonDescription ?? 'Not specified'}`,
    `Lesson content: ${input.lessonContent}`,
    'Return up to 6 recommended materials total.',
    'Aim for a balanced mix across videos, articles, and books when that is genuinely useful.',
    'When useful, include 1 or 2 YouTube videos.',
    'If you recommend a video, it must be a YouTube URL suitable for embedding and should point to a specific video page.',
    'Every description must explain why the material is useful for this lesson specifically.',
    'All learner-facing text must stay in the requested language.',
    'Avoid generic references that would fit any lesson.',
  ].join('\n');
}

function buildVideoReplacementPrompt(input: {
  courseTitle: string;
  courseGoal: string;
  level: string | null;
  courseLanguage: string;
  moduleTitle: string;
  moduleDescription: string | null;
  lessonTitle: string;
  lessonDescription: string | null;
  lessonContent: string;
  invalidVideoUrls: string[];
  count: number;
}) {
  const promptLanguage = getCourseLanguagePromptLabel(input.courseLanguage);

  return [
    `Course title: ${input.courseTitle}`,
    `Course goal: ${input.courseGoal}`,
    `Course level: ${input.level ?? 'Not specified'}`,
    `Write all learner-facing text in: ${promptLanguage}`,
    `Module title: ${input.moduleTitle}`,
    `Module description: ${input.moduleDescription ?? 'Not specified'}`,
    `Lesson title: ${input.lessonTitle}`,
    `Lesson description: ${input.lessonDescription ?? 'Not specified'}`,
    `Lesson content: ${input.lessonContent}`,
    `Invalid video URLs to avoid: ${input.invalidVideoUrls.join(' | ')}`,
    `Return exactly ${input.count} replacement video recommendations.`,
    'Return only items with type "video".',
    'Each item must be a specific YouTube video page suitable for embedding.',
    'Do not return any of the invalid URLs again.',
    'Each description must explain why the video is useful for this lesson specifically.',
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

async function fetchStructuredMaterials(prompt: string) {
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
              text: prompt,
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'lesson_recommended_materials',
          schema: generatedLessonRecommendedMaterialsJsonSchema,
          strict: true,
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
    return lessonRecommendedMaterialsSchema.parse(parsedPayload).materials;
  }

  const outputText = extractTextFromOutput(payload);

  if (!outputText) {
    throw new Error('OpenAI did not return structured recommended materials.');
  }

  return lessonRecommendedMaterialsSchema.parse(JSON.parse(outputText)).materials;
}

async function validateYoutubeVideo(url: string) {
  if (!getYoutubeEmbedUrl(url)) {
    return false;
  }

  try {
    const validationUrl = new URL('https://www.youtube.com/oembed');
    validationUrl.searchParams.set('url', url);
    validationUrl.searchParams.set('format', 'json');

    const response = await fetch(validationUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(YOUTUBE_VALIDATION_TIMEOUT_MS),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function splitMaterialsByVideoValidity(materials: GeneratedLessonRecommendedMaterial[]) {
  const validMaterials: GeneratedLessonRecommendedMaterial[] = [];
  const invalidVideoUrls: string[] = [];

  for (const material of materials) {
    const url = material.url?.trim() || null;

    if (material.type !== 'video') {
      validMaterials.push(material);
      continue;
    }

    if (!url || !getYoutubeEmbedUrl(url)) {
      invalidVideoUrls.push(url ?? '(missing)');
      continue;
    }

    if (await validateYoutubeVideo(url)) {
      validMaterials.push(material);
      continue;
    }

    invalidVideoUrls.push(url);
  }

  return {
    validMaterials,
    invalidVideoUrls,
  };
}

function normalizeMaterials(input: { materials: GeneratedLessonRecommendedMaterial[] }) {
  return input.materials
    .map<LessonRecommendedMaterial | null>((material) => {
      const url = material.url?.trim() || null;

      if (material.type === 'video' && (!url || !getYoutubeEmbedUrl(url))) {
        return null;
      }

      return {
        type: material.type,
        title: material.title.trim(),
        description: material.description.trim(),
        url,
        author: material.author?.trim() || null,
        sourceName: material.sourceName?.trim() || null,
      };
    })
    .filter((material): material is LessonRecommendedMaterial => Boolean(material));
}

export async function generateLessonRecommendedMaterials(input: {
  courseTitle: string;
  courseGoal: string;
  level: string | null;
  courseLanguage: string;
  moduleTitle: string;
  moduleDescription: string | null;
  lessonTitle: string;
  lessonDescription: string | null;
  lessonContent: string;
}) {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  try {
    const initialMaterials = await fetchStructuredMaterials(buildUserPrompt(input));
    const { validMaterials, invalidVideoUrls } =
      await splitMaterialsByVideoValidity(initialMaterials);

    if (invalidVideoUrls.length === 0) {
      return normalizeMaterials({ materials: validMaterials });
    }

    const replacementVideos = await fetchStructuredMaterials(
      buildVideoReplacementPrompt({
        ...input,
        invalidVideoUrls,
        count: invalidVideoUrls.length,
      })
    );

    const replacementVideoItems = replacementVideos.filter((item) => item.type === 'video');
    const { validMaterials: validReplacementVideos } =
      await splitMaterialsByVideoValidity(replacementVideoItems);

    return normalizeMaterials({
      materials: [...validMaterials, ...validReplacementVideos],
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new Error('Recommended materials generation timed out. Please try again.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unable to generate recommended materials right now.');
  }
}

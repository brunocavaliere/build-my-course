import { z } from 'zod';

export const lessonRecommendedMaterialTypeValues = ['video', 'article', 'book'] as const;

export const lessonRecommendedMaterialSchema = z.object({
  type: z.enum(lessonRecommendedMaterialTypeValues),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(400),
  url: z.string().trim().url().nullable(),
  author: z.string().trim().max(120).nullable(),
  sourceName: z.string().trim().max(120).nullable(),
});

export const lessonRecommendedMaterialsSchema = z.object({
  materials: z.array(lessonRecommendedMaterialSchema).max(6),
});

export type LessonRecommendedMaterial = z.infer<typeof lessonRecommendedMaterialSchema>;

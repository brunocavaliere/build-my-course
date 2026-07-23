'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth } from '@/auth';
import {
  createCourse,
  createGeneratedCourseForUser,
  createNextCourseLesson,
  createNextLessonPracticeExercisesForUser,
  createNextCourseModule,
  deleteLessonPracticeExercisesByLessonIdForUser,
  deleteCourseByIdForUser,
  deleteCourseLessonByIdForUser,
  deleteCourseModuleByIdForUser,
  setUserLessonProgress,
  updateCourseLessonContentByIdForUser,
  updateCourseLessonRecommendedMaterialsByIdForUser,
  updateCourseLessonByIdForUser,
  updateCourseMetadata,
  updateCourseModuleByIdForUser,
} from '@/modules/courses/services';
import { generateCourseBlueprint } from '@/modules/courses/services/generate-course-blueprint';
import { getLessonDetailByIdsForUser } from '@/modules/courses/queries';
import { generateLessonContent } from '@/modules/lessons/services/generate-lesson-content';
import { generateLessonRecommendedMaterials } from '@/modules/lessons/services/generate-lesson-recommended-materials';
import { generatePracticeExercises } from '@/modules/lessons/services/generate-practice-exercises';
import { courseLanguageValues, defaultCourseLanguage } from '@/modules/courses/lib/course-language';

const DEFAULT_PRACTICE_EXERCISE_COUNT = 3;
const DEFAULT_INITIAL_PRACTICE_EXERCISE_COUNT = 5;

const courseMetadataSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  goal: z.string().trim().min(1, 'Goal is required.'),
  description: z.string().trim().optional(),
  level: z.string().trim().optional(),
  courseLanguage: z.enum(courseLanguageValues, {
    message: 'Course language is invalid.',
  }),
  estimatedWeeks: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) {
        return null;
      }

      const parsed = Number(value);

      return Number.isNaN(parsed) ? value : parsed;
    })
    .pipe(z.union([z.number().int().positive(), z.null()])),
});

const optionalPositiveIntegerField = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) {
      return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? value : parsed;
  })
  .pipe(z.union([z.number().int().positive(), z.null()]));

const moduleSchema = z.object({
  title: z.string().trim().min(1, 'Module title is required.'),
  description: z.string().trim().optional(),
  estimatedMinutes: optionalPositiveIntegerField,
});

const lessonSchema = z.object({
  title: z.string().trim().min(1, 'Lesson title is required.'),
  description: z.string().trim().optional(),
  content: z.string().trim().optional(),
  estimatedMinutes: optionalPositiveIntegerField,
});

const generateCourseSchema = z.object({
  goal: z
    .string()
    .trim()
    .min(1, 'Learning goal is required.')
    .max(2000, 'Learning goal is too long.'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    message: 'Level must be Beginner, Intermediate, or Advanced.',
  }),
  courseLanguage: z.enum(courseLanguageValues, {
    message: 'Course language is invalid.',
  }),
  estimatedWeeks: z
    .string()
    .trim()
    .transform((value) => {
      const parsed = Number(value);

      return Number.isNaN(parsed) ? value : parsed;
    })
    .pipe(z.number().int().positive().max(52, 'Estimated weeks must be between 1 and 52.')),
});

function buildErrorRedirect(pathname: string, errorMessage: string, errorParam = 'error') {
  const url = new URL(pathname, 'http://localhost');

  url.searchParams.set(errorParam, errorMessage);

  return `${url.pathname}${url.search}`;
}

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session.user.id;
}

export async function createCourseAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = courseMetadataSchema.safeParse({
    title: formData.get('title'),
    goal: formData.get('goal'),
    description: formData.get('description'),
    level: formData.get('level'),
    courseLanguage: formData.get('courseLanguage'),
    estimatedWeeks: formData.get('estimatedWeeks'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect('/app/new', parsed.error.issues[0]?.message ?? 'Invalid course data.')
    );
  }

  const course = await createCourse({
    userId,
    title: parsed.data.title,
    goal: parsed.data.goal,
    description: parsed.data.description || null,
    level: parsed.data.level || null,
    courseLanguage: parsed.data.courseLanguage,
    estimatedWeeks: parsed.data.estimatedWeeks,
  });

  redirect(`/app/${course.id}`);
}

export async function generateCourseAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = generateCourseSchema.safeParse({
    goal: formData.get('goal'),
    level: formData.get('level'),
    courseLanguage: formData.get('courseLanguage'),
    estimatedWeeks: formData.get('estimatedWeeks'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect(
        '/app/new',
        parsed.error.issues[0]?.message ?? 'Invalid course generation data.',
        'generateError'
      )
    );
  }

  try {
    const blueprint = await generateCourseBlueprint({
      goal: parsed.data.goal,
      level: parsed.data.level,
      courseLanguage: parsed.data.courseLanguage,
      estimatedWeeks: parsed.data.estimatedWeeks,
    });

    const course = await createGeneratedCourseForUser({
      userId,
      goal: parsed.data.goal,
      level: parsed.data.level,
      courseLanguage: parsed.data.courseLanguage,
      estimatedWeeks: parsed.data.estimatedWeeks,
      blueprint,
    });

    redirect(`/app/${course.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unable to generate course right now.';

    redirect(buildErrorRedirect('/app/new', message, 'generateError'));
  }
}

export async function updateCourseAction(courseId: string, formData: FormData) {
  const userId = await requireUserId();
  const parsed = courseMetadataSchema.safeParse({
    title: formData.get('title'),
    goal: formData.get('goal'),
    description: formData.get('description'),
    level: formData.get('level'),
    courseLanguage: formData.get('courseLanguage'),
    estimatedWeeks: formData.get('estimatedWeeks'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect(
        `/app/${courseId}/edit`,
        parsed.error.issues[0]?.message ?? 'Invalid course data.'
      )
    );
  }

  const updated = await updateCourseMetadata(courseId, userId, {
    title: parsed.data.title,
    goal: parsed.data.goal,
    description: parsed.data.description || null,
    level: parsed.data.level || null,
    courseLanguage: parsed.data.courseLanguage,
    estimatedWeeks: parsed.data.estimatedWeeks,
  });

  if (!updated) {
    redirect('/app');
  }

  redirect(`/app/${courseId}`);
}

export async function deleteCourseAction(courseId: string) {
  const userId = await requireUserId();

  await deleteCourseByIdForUser(courseId, userId);

  redirect('/app');
}

export async function createModuleAction(courseId: string, formData: FormData) {
  const userId = await requireUserId();
  const parsed = moduleSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    estimatedMinutes: formData.get('estimatedMinutes'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect(
        `/app/${courseId}`,
        parsed.error.issues[0]?.message ?? 'Invalid module data.'
      )
    );
  }

  await createNextCourseModule({
    courseId,
    userId,
    title: parsed.data.title,
    description: parsed.data.description || null,
    estimatedMinutes: parsed.data.estimatedMinutes,
  });

  redirect(`/app/${courseId}`);
}

export async function updateModuleAction(courseId: string, moduleId: string, formData: FormData) {
  const userId = await requireUserId();
  const parsed = moduleSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    estimatedMinutes: formData.get('estimatedMinutes'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect(
        `/app/${courseId}?editModule=${moduleId}`,
        parsed.error.issues[0]?.message ?? 'Invalid module data.'
      )
    );
  }

  await updateCourseModuleByIdForUser({
    moduleId,
    userId,
    title: parsed.data.title,
    description: parsed.data.description || null,
    estimatedMinutes: parsed.data.estimatedMinutes,
  });

  redirect(`/app/${courseId}`);
}

export async function deleteModuleAction(courseId: string, moduleId: string) {
  const userId = await requireUserId();

  await deleteCourseModuleByIdForUser(moduleId, userId);

  redirect(`/app/${courseId}`);
}

export async function createLessonAction(courseId: string, moduleId: string, formData: FormData) {
  const userId = await requireUserId();
  const parsed = lessonSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    content: formData.get('content'),
    estimatedMinutes: formData.get('estimatedMinutes'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect(
        `/app/${courseId}?createLessonFor=${moduleId}`,
        parsed.error.issues[0]?.message ?? 'Invalid lesson data.'
      )
    );
  }

  await createNextCourseLesson({
    moduleId,
    userId,
    title: parsed.data.title,
    description: parsed.data.description || null,
    content: parsed.data.content || null,
    estimatedMinutes: parsed.data.estimatedMinutes,
  });

  redirect(`/app/${courseId}`);
}

export async function updateLessonAction(courseId: string, lessonId: string, formData: FormData) {
  const userId = await requireUserId();
  const parsed = lessonSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    content: formData.get('content'),
    estimatedMinutes: formData.get('estimatedMinutes'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect(
        `/app/${courseId}?editLesson=${lessonId}`,
        parsed.error.issues[0]?.message ?? 'Invalid lesson data.'
      )
    );
  }

  await updateCourseLessonByIdForUser({
    lessonId,
    userId,
    title: parsed.data.title,
    description: parsed.data.description || null,
    content: parsed.data.content || null,
    estimatedMinutes: parsed.data.estimatedMinutes,
  });

  redirect(`/app/${courseId}`);
}

export async function deleteLessonAction(courseId: string, lessonId: string) {
  const userId = await requireUserId();

  await deleteCourseLessonByIdForUser(lessonId, userId);

  redirect(`/app/${courseId}`);
}

export async function toggleLessonProgressAction(
  courseId: string,
  lessonId: string,
  completed: boolean
) {
  const userId = await requireUserId();

  await setUserLessonProgress({
    userId,
    lessonId,
    completed,
  });

  redirect(`/app/${courseId}`);
}

export async function toggleLessonProgressFromLessonPageAction(
  courseId: string,
  lessonId: string,
  completed: boolean
) {
  const userId = await requireUserId();

  await setUserLessonProgress({
    userId,
    lessonId,
    completed,
  });

  redirect(`/app/${courseId}/lessons/${lessonId}`);
}

export type LessonContentActionState = {
  error: string | null;
};

export async function generateLessonContentAction(
  courseId: string,
  lessonId: string,
  previousState: LessonContentActionState,
  formData: FormData
): Promise<LessonContentActionState> {
  void previousState;
  void formData;

  const userId = await requireUserId();
  const lessonDetail = await getLessonDetailByIdsForUser(courseId, lessonId, userId);

  if (!lessonDetail) {
    redirect('/app');
  }

  try {
    const shouldGenerateRecommendedMaterials =
      (lessonDetail.lesson.recommendedMaterials?.length ?? 0) === 0;

    const generatedLesson = await generateLessonContent({
      courseTitle: lessonDetail.lesson.module.course.title,
      courseGoal: lessonDetail.lesson.module.course.goal,
      level: lessonDetail.lesson.module.course.level,
      courseLanguage: lessonDetail.lesson.module.course.courseLanguage ?? defaultCourseLanguage,
      moduleTitle: lessonDetail.lesson.module.title,
      moduleDescription: lessonDetail.lesson.module.description,
      lessonTitle: lessonDetail.lesson.title,
      lessonDescription: lessonDetail.lesson.description,
      estimatedMinutes: lessonDetail.lesson.estimatedMinutes,
    });

    const updatedLesson = await updateCourseLessonContentByIdForUser({
      lessonId,
      userId,
      content: generatedLesson.content,
      contentBlocks: generatedLesson.blocks,
    });

    if (!updatedLesson) {
      redirect('/app');
    }

    const exercises = await generatePracticeExercises({
      courseTitle: lessonDetail.lesson.module.course.title,
      courseGoal: lessonDetail.lesson.module.course.goal,
      level: lessonDetail.lesson.module.course.level,
      courseLanguage: lessonDetail.lesson.module.course.courseLanguage ?? defaultCourseLanguage,
      moduleTitle: lessonDetail.lesson.module.title,
      moduleDescription: lessonDetail.lesson.module.description,
      lessonTitle: lessonDetail.lesson.title,
      lessonDescription: lessonDetail.lesson.description,
      lessonContent: generatedLesson.content,
      count: DEFAULT_INITIAL_PRACTICE_EXERCISE_COUNT,
      existingExerciseTitles: [],
    });

    await deleteLessonPracticeExercisesByLessonIdForUser(lessonId, userId);

    await createNextLessonPracticeExercisesForUser({
      lessonId,
      userId,
      exercises,
    });

    if (shouldGenerateRecommendedMaterials) {
      const recommendedMaterials = await generateLessonRecommendedMaterials({
        courseTitle: lessonDetail.lesson.module.course.title,
        courseGoal: lessonDetail.lesson.module.course.goal,
        level: lessonDetail.lesson.module.course.level,
        courseLanguage: lessonDetail.lesson.module.course.courseLanguage ?? defaultCourseLanguage,
        moduleTitle: lessonDetail.lesson.module.title,
        moduleDescription: lessonDetail.lesson.module.description,
        lessonTitle: lessonDetail.lesson.title,
        lessonDescription: lessonDetail.lesson.description,
        lessonContent: generatedLesson.content,
      });

      await updateCourseLessonRecommendedMaterialsByIdForUser({
        lessonId,
        userId,
        recommendedMaterials,
      });
    }

    redirect(`/app/${courseId}/lessons/${lessonId}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : 'Unable to generate lesson content right now.';

    return { error: message };
  }
}

export async function generateLessonRecommendedMaterialsAction(courseId: string, lessonId: string) {
  const userId = await requireUserId();
  const lessonDetail = await getLessonDetailByIdsForUser(courseId, lessonId, userId);

  if (!lessonDetail) {
    redirect('/app');
  }

  if (!lessonDetail.lesson.content?.trim()) {
    redirect(
      buildErrorRedirect(
        `/app/${courseId}/lessons/${lessonId}?tab=materials`,
        'Generate lesson content before generating recommended materials.',
        'materialsError'
      )
    );
  }

  try {
    const recommendedMaterials = await generateLessonRecommendedMaterials({
      courseTitle: lessonDetail.lesson.module.course.title,
      courseGoal: lessonDetail.lesson.module.course.goal,
      level: lessonDetail.lesson.module.course.level,
      courseLanguage: lessonDetail.lesson.module.course.courseLanguage ?? defaultCourseLanguage,
      moduleTitle: lessonDetail.lesson.module.title,
      moduleDescription: lessonDetail.lesson.module.description,
      lessonTitle: lessonDetail.lesson.title,
      lessonDescription: lessonDetail.lesson.description,
      lessonContent: lessonDetail.lesson.content.trim(),
    });

    const updatedLesson = await updateCourseLessonRecommendedMaterialsByIdForUser({
      lessonId,
      userId,
      recommendedMaterials,
    });

    if (!updatedLesson) {
      redirect('/app');
    }

    redirect(`/app/${courseId}/lessons/${lessonId}?tab=materials`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to generate recommended materials right now.';

    redirect(
      buildErrorRedirect(
        `/app/${courseId}/lessons/${lessonId}?tab=materials`,
        message,
        'materialsError'
      )
    );
  }
}

export async function generatePracticeExercisesAction(courseId: string, lessonId: string) {
  const userId = await requireUserId();
  const lessonDetail = await getLessonDetailByIdsForUser(courseId, lessonId, userId);

  if (!lessonDetail) {
    redirect('/app');
  }

  try {
    const exercises = await generatePracticeExercises({
      courseTitle: lessonDetail.lesson.module.course.title,
      courseGoal: lessonDetail.lesson.module.course.goal,
      level: lessonDetail.lesson.module.course.level,
      courseLanguage: lessonDetail.lesson.module.course.courseLanguage ?? defaultCourseLanguage,
      moduleTitle: lessonDetail.lesson.module.title,
      moduleDescription: lessonDetail.lesson.module.description,
      lessonTitle: lessonDetail.lesson.title,
      lessonDescription: lessonDetail.lesson.description,
      lessonContent: lessonDetail.lesson.content,
      count: DEFAULT_PRACTICE_EXERCISE_COUNT,
      existingExerciseTitles:
        lessonDetail.lesson.practiceExercises?.map((item) => item.title) ?? [],
    });

    const createdExercises = await createNextLessonPracticeExercisesForUser({
      lessonId,
      userId,
      exercises,
    });

    if (!createdExercises) {
      redirect('/app');
    }

    redirect(`/app/${courseId}/lessons/${lessonId}?tab=practice`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : 'Unable to generate practice exercises right now.';

    redirect(
      buildErrorRedirect(
        `/app/${courseId}/lessons/${lessonId}?tab=practice`,
        message,
        'practiceError'
      )
    );
  }
}

'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth } from '@/auth';
import {
  createCourse,
  createGeneratedCourseForUser,
  createNextCourseLesson,
  createNextCourseModule,
  deleteCourseByIdForUser,
  deleteCourseLessonByIdForUser,
  deleteCourseModuleByIdForUser,
  setUserLessonProgress,
  updateCourseLessonContentByIdForUser,
  updateCourseLessonByIdForUser,
  updateCourseMetadata,
  updateCourseModuleByIdForUser,
} from '@/modules/courses/services';
import { generateCourseBlueprint } from '@/modules/courses/services/generate-course-blueprint';
import { getLessonDetailByIdsForUser } from '@/modules/courses/queries';
import { generateLessonContent } from '@/modules/lessons/services/generate-lesson-content';

const courseMetadataSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  goal: z.string().trim().min(1, 'Goal is required.'),
  description: z.string().trim().optional(),
  level: z.string().trim().optional(),
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
  const params = new URLSearchParams({
    [errorParam]: errorMessage,
  });

  return `${pathname}?${params.toString()}`;
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
    estimatedWeeks: formData.get('estimatedWeeks'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect(
        '/app/courses/new',
        parsed.error.issues[0]?.message ?? 'Invalid course data.'
      )
    );
  }

  const course = await createCourse({
    userId,
    title: parsed.data.title,
    goal: parsed.data.goal,
    description: parsed.data.description || null,
    level: parsed.data.level || null,
    estimatedWeeks: parsed.data.estimatedWeeks,
  });

  redirect(`/app/courses/${course.id}`);
}

export async function generateCourseAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = generateCourseSchema.safeParse({
    goal: formData.get('goal'),
    level: formData.get('level'),
    estimatedWeeks: formData.get('estimatedWeeks'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect(
        '/app/courses/new',
        parsed.error.issues[0]?.message ?? 'Invalid course generation data.',
        'generateError'
      )
    );
  }

  try {
    const blueprint = await generateCourseBlueprint({
      goal: parsed.data.goal,
      level: parsed.data.level,
      estimatedWeeks: parsed.data.estimatedWeeks,
    });

    const course = await createGeneratedCourseForUser({
      userId,
      goal: parsed.data.goal,
      level: parsed.data.level,
      estimatedWeeks: parsed.data.estimatedWeeks,
      blueprint,
    });

    redirect(`/app/courses/${course.id}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate course right now.';

    redirect(buildErrorRedirect('/app/courses/new', message, 'generateError'));
  }
}

export async function updateCourseAction(courseId: string, formData: FormData) {
  const userId = await requireUserId();
  const parsed = courseMetadataSchema.safeParse({
    title: formData.get('title'),
    goal: formData.get('goal'),
    description: formData.get('description'),
    level: formData.get('level'),
    estimatedWeeks: formData.get('estimatedWeeks'),
  });

  if (!parsed.success) {
    redirect(
      buildErrorRedirect(
        `/app/courses/${courseId}/edit`,
        parsed.error.issues[0]?.message ?? 'Invalid course data.'
      )
    );
  }

  const updated = await updateCourseMetadata(courseId, userId, {
    title: parsed.data.title,
    goal: parsed.data.goal,
    description: parsed.data.description || null,
    level: parsed.data.level || null,
    estimatedWeeks: parsed.data.estimatedWeeks,
  });

  if (!updated) {
    redirect('/app/courses');
  }

  redirect(`/app/courses/${courseId}`);
}

export async function deleteCourseAction(courseId: string) {
  const userId = await requireUserId();

  await deleteCourseByIdForUser(courseId, userId);

  redirect('/app/courses');
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
        `/app/courses/${courseId}`,
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

  redirect(`/app/courses/${courseId}`);
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
        `/app/courses/${courseId}?editModule=${moduleId}`,
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

  redirect(`/app/courses/${courseId}`);
}

export async function deleteModuleAction(courseId: string, moduleId: string) {
  const userId = await requireUserId();

  await deleteCourseModuleByIdForUser(moduleId, userId);

  redirect(`/app/courses/${courseId}`);
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
        `/app/courses/${courseId}?createLessonFor=${moduleId}`,
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

  redirect(`/app/courses/${courseId}`);
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
        `/app/courses/${courseId}?editLesson=${lessonId}`,
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

  redirect(`/app/courses/${courseId}`);
}

export async function deleteLessonAction(courseId: string, lessonId: string) {
  const userId = await requireUserId();

  await deleteCourseLessonByIdForUser(lessonId, userId);

  redirect(`/app/courses/${courseId}`);
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

  redirect(`/app/courses/${courseId}`);
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

  redirect(`/app/courses/${courseId}/lessons/${lessonId}`);
}

export async function generateLessonContentAction(courseId: string, lessonId: string) {
  const userId = await requireUserId();
  const lessonDetail = await getLessonDetailByIdsForUser(courseId, lessonId, userId);

  if (!lessonDetail) {
    redirect('/app/courses');
  }

  try {
    const content = await generateLessonContent({
      courseTitle: lessonDetail.lesson.module.course.title,
      courseGoal: lessonDetail.lesson.module.course.goal,
      level: lessonDetail.lesson.module.course.level,
      moduleTitle: lessonDetail.lesson.module.title,
      moduleDescription: lessonDetail.lesson.module.description,
      lessonTitle: lessonDetail.lesson.title,
      lessonDescription: lessonDetail.lesson.description,
    });

    const updatedLesson = await updateCourseLessonContentByIdForUser({
      lessonId,
      userId,
      content,
    });

    if (!updatedLesson) {
      redirect('/app/courses');
    }

    redirect(`/app/courses/${courseId}/lessons/${lessonId}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to generate lesson content right now.';

    redirect(
      buildErrorRedirect(`/app/courses/${courseId}/lessons/${lessonId}`, message, 'aiError')
    );
  }
}

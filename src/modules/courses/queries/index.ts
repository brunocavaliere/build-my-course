import { and, asc, eq } from 'drizzle-orm';

import { db } from '@/db';
import {
  courseLessons,
  courseModules,
  courses,
  lessonPracticeExercises,
  userLessonProgress,
} from '@/db/schema';
import type { CourseWithModulesAndLessons, LessonWithModuleCourse } from '@/modules/courses/types';

export async function listCoursesByUserId(userId: string) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  return db.query.courses.findMany({
    where: eq(courses.userId, userId),
    orderBy: [asc(courses.createdAt)],
  });
}

export async function getCourseByIdForUser(courseId: string, userId: string) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  return db.query.courses.findFirst({
    where: and(eq(courses.id, courseId), eq(courses.userId, userId)),
  });
}

export async function getCourseWithContentByIdForUser(
  courseId: string,
  userId: string
): Promise<CourseWithModulesAndLessons | null> {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const course = await db.query.courses.findFirst({
    where: and(eq(courses.id, courseId), eq(courses.userId, userId)),
    with: {
      modules: {
        orderBy: [asc(courseModules.position)],
        with: {
          lessons: {
            orderBy: [asc(courseLessons.position)],
          },
        },
      },
    },
  });

  return course ?? null;
}

export async function listLessonProgressByUserId(userId: string) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  return db.query.userLessonProgress.findMany({
    where: eq(userLessonProgress.userId, userId),
    orderBy: [asc(userLessonProgress.createdAt)],
  });
}

export async function getLessonDetailByIdsForUser(
  courseId: string,
  lessonId: string,
  userId: string
): Promise<{
  lesson: LessonWithModuleCourse;
  progress: {
    completed: boolean;
    completedAt: Date | null;
  } | null;
} | null> {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const lesson = await db.query.courseLessons.findFirst({
    where: eq(courseLessons.id, lessonId),
    with: {
      module: {
        with: {
          course: true,
        },
      },
      practiceExercises: {
        orderBy: [asc(lessonPracticeExercises.position)],
      },
    },
  });

  if (!lesson) {
    return null;
  }

  if (lesson.module.course.id !== courseId || lesson.module.course.userId !== userId) {
    return null;
  }

  const progress = await db.query.userLessonProgress.findFirst({
    where: and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.lessonId, lessonId)),
  });

  return {
    lesson,
    progress: progress
      ? {
          completed: progress.completed,
          completedAt: progress.completedAt,
        }
      : null,
  };
}

import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { courseLessons, courseModules, courses, userLessonProgress } from '@/db/schema';
import type {
  Course,
  CourseLesson,
  CourseModule,
  GeneratedCourseBlueprint,
  NewCourse,
  NewCourseLesson,
  NewCourseModule,
  UserLessonProgress,
} from '@/modules/courses/types';

function now() {
  return new Date();
}

export async function createCourse(data: {
  userId: string;
  title: string;
  goal: string;
  description?: string | null;
  level?: string | null;
  estimatedWeeks?: number | null;
}): Promise<Course> {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const payload: NewCourse = {
    userId: data.userId,
    title: data.title,
    goal: data.goal,
    description: data.description ?? null,
    level: data.level ?? null,
    estimatedWeeks: data.estimatedWeeks ?? null,
    createdAt: now(),
    updatedAt: now(),
  };

  const [course] = await db.insert(courses).values(payload).returning();

  return course;
}

export async function createGeneratedCourseForUser(data: {
  userId: string;
  goal: string;
  level: string;
  estimatedWeeks: number;
  blueprint: GeneratedCourseBlueprint;
}): Promise<Course> {
  const course = await createCourse({
    userId: data.userId,
    title: data.blueprint.title,
    goal: data.goal,
    description: data.blueprint.description,
    level: data.level,
    estimatedWeeks: data.estimatedWeeks,
  });

  try {
    for (const [moduleIndex, module] of data.blueprint.modules.entries()) {
      const createdModule = await createCourseModule({
        courseId: course.id,
        title: module.title,
        description: module.description,
        estimatedMinutes: module.estimatedMinutes,
        position: moduleIndex + 1,
      });

      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        await createCourseLesson({
          moduleId: createdModule.id,
          title: lesson.title,
          description: lesson.description,
          estimatedMinutes: lesson.estimatedMinutes,
          position: lessonIndex + 1,
        });
      }
    }

    return course;
  } catch (error) {
    await deleteCourseByIdForUser(course.id, data.userId).catch(() => null);
    throw error;
  }
}

export async function updateCourseMetadata(
  courseId: string,
  userId: string,
  data: Partial<Pick<Course, 'title' | 'description' | 'goal' | 'level' | 'estimatedWeeks'>>
) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [course] = await db
    .update(courses)
    .set({
      ...data,
      updatedAt: now(),
    })
    .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
    .returning();

  return course ?? null;
}

export async function createCourseModule(data: {
  courseId: string;
  title: string;
  position: number;
  description?: string | null;
  estimatedMinutes?: number | null;
}): Promise<CourseModule> {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const payload: NewCourseModule = {
    courseId: data.courseId,
    title: data.title,
    position: data.position,
    description: data.description ?? null,
    estimatedMinutes: data.estimatedMinutes ?? null,
    createdAt: now(),
    updatedAt: now(),
  };

  const [module] = await db.insert(courseModules).values(payload).returning();

  return module;
}

export async function createNextCourseModule(data: {
  courseId: string;
  userId: string;
  title: string;
  description?: string | null;
  estimatedMinutes?: number | null;
}): Promise<CourseModule | null> {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [course] = await db
    .select()
    .from(courses)
    .where(and(eq(courses.id, data.courseId), eq(courses.userId, data.userId)));

  if (!course) {
    return null;
  }

  const [positionRow] = await db
    .select({
      value: sql<number>`coalesce(max(${courseModules.position}), 0)`,
    })
    .from(courseModules)
    .where(eq(courseModules.courseId, data.courseId));

  return createCourseModule({
    courseId: data.courseId,
    title: data.title,
    description: data.description,
    estimatedMinutes: data.estimatedMinutes,
    position: (positionRow?.value ?? 0) + 1,
  });
}

export async function updateCourseModuleByIdForUser(data: {
  moduleId: string;
  userId: string;
  title: string;
  description?: string | null;
  estimatedMinutes?: number | null;
}) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [module] = await db
    .update(courseModules)
    .set({
      title: data.title,
      description: data.description ?? null,
      estimatedMinutes: data.estimatedMinutes ?? null,
      updatedAt: now(),
    })
    .where(
      and(
        eq(courseModules.id, data.moduleId),
        sql`exists (
          select 1
          from ${courses}
          where ${courses.id} = ${courseModules.courseId}
            and ${courses.userId} = ${data.userId}
        )`
      )
    )
    .returning();

  return module ?? null;
}

export async function deleteCourseModuleByIdForUser(moduleId: string, userId: string) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [module] = await db
    .delete(courseModules)
    .where(
      and(
        eq(courseModules.id, moduleId),
        sql`exists (
          select 1
          from ${courses}
          where ${courses.id} = ${courseModules.courseId}
            and ${courses.userId} = ${userId}
        )`
      )
    )
    .returning();

  return module ?? null;
}

export async function createCourseLesson(data: {
  moduleId: string;
  title: string;
  position: number;
  description?: string | null;
  content?: string | null;
  estimatedMinutes?: number | null;
}): Promise<CourseLesson> {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const payload: NewCourseLesson = {
    moduleId: data.moduleId,
    title: data.title,
    position: data.position,
    description: data.description ?? null,
    content: data.content ?? null,
    estimatedMinutes: data.estimatedMinutes ?? null,
    createdAt: now(),
    updatedAt: now(),
  };

  const [lesson] = await db.insert(courseLessons).values(payload).returning();

  return lesson;
}

export async function createNextCourseLesson(data: {
  moduleId: string;
  userId: string;
  title: string;
  description?: string | null;
  content?: string | null;
  estimatedMinutes?: number | null;
}): Promise<CourseLesson | null> {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [module] = await db
    .select({
      id: courseModules.id,
    })
    .from(courseModules)
    .innerJoin(courses, eq(courses.id, courseModules.courseId))
    .where(and(eq(courseModules.id, data.moduleId), eq(courses.userId, data.userId)));

  if (!module) {
    return null;
  }

  const [positionRow] = await db
    .select({
      value: sql<number>`coalesce(max(${courseLessons.position}), 0)`,
    })
    .from(courseLessons)
    .where(eq(courseLessons.moduleId, data.moduleId));

  return createCourseLesson({
    moduleId: data.moduleId,
    title: data.title,
    description: data.description,
    content: data.content,
    estimatedMinutes: data.estimatedMinutes,
    position: (positionRow?.value ?? 0) + 1,
  });
}

export async function updateCourseLessonByIdForUser(data: {
  lessonId: string;
  userId: string;
  title: string;
  description?: string | null;
  content?: string | null;
  estimatedMinutes?: number | null;
}) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [lesson] = await db
    .update(courseLessons)
    .set({
      title: data.title,
      description: data.description ?? null,
      content: data.content ?? null,
      estimatedMinutes: data.estimatedMinutes ?? null,
      updatedAt: now(),
    })
    .where(
      and(
        eq(courseLessons.id, data.lessonId),
        sql`exists (
          select 1
          from ${courseModules}
          inner join ${courses} on ${courses.id} = ${courseModules.courseId}
          where ${courseModules.id} = ${courseLessons.moduleId}
            and ${courses.userId} = ${data.userId}
        )`
      )
    )
    .returning();

  return lesson ?? null;
}

export async function updateCourseLessonContentByIdForUser(data: {
  lessonId: string;
  userId: string;
  content: string;
}) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [lesson] = await db
    .update(courseLessons)
    .set({
      content: data.content,
      updatedAt: now(),
    })
    .where(
      and(
        eq(courseLessons.id, data.lessonId),
        sql`exists (
          select 1
          from ${courseModules}
          inner join ${courses} on ${courses.id} = ${courseModules.courseId}
          where ${courseModules.id} = ${courseLessons.moduleId}
            and ${courses.userId} = ${data.userId}
        )`
      )
    )
    .returning();

  return lesson ?? null;
}

export async function deleteCourseLessonByIdForUser(lessonId: string, userId: string) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [lesson] = await db
    .delete(courseLessons)
    .where(
      and(
        eq(courseLessons.id, lessonId),
        sql`exists (
          select 1
          from ${courseModules}
          inner join ${courses} on ${courses.id} = ${courseModules.courseId}
          where ${courseModules.id} = ${courseLessons.moduleId}
            and ${courses.userId} = ${userId}
        )`
      )
    )
    .returning();

  return lesson ?? null;
}

export async function setUserLessonProgress(data: {
  userId: string;
  lessonId: string;
  completed: boolean;
}): Promise<UserLessonProgress> {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [progress] = await db
    .insert(userLessonProgress)
    .values({
      userId: data.userId,
      lessonId: data.lessonId,
      completed: data.completed,
      completedAt: data.completed ? now() : null,
      createdAt: now(),
      updatedAt: now(),
    })
    .onConflictDoUpdate({
      target: [userLessonProgress.userId, userLessonProgress.lessonId],
      set: {
        completed: data.completed,
        completedAt: data.completed ? now() : null,
        updatedAt: now(),
      },
    })
    .returning();

  return progress;
}

export async function getLatestProgressForCourseUser(courseId: string, userId: string) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  return db.query.userLessonProgress
    .findMany({
      where: eq(userLessonProgress.userId, userId),
      orderBy: [desc(userLessonProgress.updatedAt)],
      with: {
        lesson: {
          with: {
            module: true,
          },
        },
      },
    })
    .then((progressRows) =>
      progressRows.filter((item) => item.lesson.module.courseId === courseId)
    );
}

export async function deleteCourseByIdForUser(courseId: string, userId: string) {
  if (!db) {
    throw new Error('Database is not configured.');
  }

  const [course] = await db
    .delete(courses)
    .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
    .returning();

  return course ?? null;
}

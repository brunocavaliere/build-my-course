import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import type { LessonContentBlock } from '@/lib/lesson-content-blocks';
import type { LessonRecommendedMaterial } from '@/modules/lessons/lib/recommended-materials';

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compositePk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const courses = pgTable(
  'courses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    goal: text('goal').notNull(),
    level: text('level'),
    courseLanguage: text('course_language').default('pt-BR').notNull(),
    estimatedWeeks: integer('estimated_weeks'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('courses_user_id_idx').on(table.userId),
  })
);

export const courseModules = pgTable(
  'course_modules',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    position: integer('position').notNull(),
    estimatedMinutes: integer('estimated_minutes'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    courseIdIdx: index('course_modules_course_id_idx').on(table.courseId),
  })
);

export const courseLessons = pgTable(
  'course_lessons',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    moduleId: uuid('module_id')
      .notNull()
      .references(() => courseModules.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    content: text('content'),
    contentBlocks: jsonb('content_blocks').$type<LessonContentBlock[] | null>(),
    recommendedMaterials: jsonb('recommended_materials').$type<
      LessonRecommendedMaterial[] | null
    >(),
    position: integer('position').notNull(),
    estimatedMinutes: integer('estimated_minutes'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    moduleIdIdx: index('course_lessons_module_id_idx').on(table.moduleId),
  })
);

export const lessonPracticeExercises = pgTable(
  'lesson_practice_exercises',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => courseLessons.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    instructions: text('instructions').notNull(),
    type: text('type').notNull(),
    options: jsonb('options').$type<string[] | null>(),
    correctOptionIndex: integer('correct_option_index'),
    answerGuidance: text('answer_guidance'),
    position: integer('position').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    lessonIdIdx: index('lesson_practice_exercises_lesson_id_idx').on(table.lessonId),
    lessonPositionUniqueIdx: uniqueIndex('lesson_practice_exercises_lesson_position_idx').on(
      table.lessonId,
      table.position
    ),
  })
);

export const userLessonProgress = pgTable(
  'user_lesson_progress',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => courseLessons.id, { onDelete: 'cascade' }),
    completed: boolean('completed').default(false).notNull(),
    completedAt: timestamp('completed_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_lesson_progress_user_id_idx').on(table.userId),
    lessonIdIdx: index('user_lesson_progress_lesson_id_idx').on(table.lessonId),
    userLessonUniqueIdx: uniqueIndex('user_lesson_progress_user_lesson_idx').on(
      table.userId,
      table.lessonId
    ),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  lessonProgress: many(userLessonProgress),
}));

export const coursesRelations = relations(courses, ({ many, one }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  modules: many(courseModules),
}));

export const courseModulesRelations = relations(courseModules, ({ many, one }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
  lessons: many(courseLessons),
}));

export const courseLessonsRelations = relations(courseLessons, ({ many, one }) => ({
  module: one(courseModules, {
    fields: [courseLessons.moduleId],
    references: [courseModules.id],
  }),
  practiceExercises: many(lessonPracticeExercises),
  progress: many(userLessonProgress),
}));

export const lessonPracticeExercisesRelations = relations(lessonPracticeExercises, ({ one }) => ({
  lesson: one(courseLessons, {
    fields: [lessonPracticeExercises.lessonId],
    references: [courseLessons.id],
  }),
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [userLessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(courseLessons, {
    fields: [userLessonProgress.lessonId],
    references: [courseLessons.id],
  }),
}));

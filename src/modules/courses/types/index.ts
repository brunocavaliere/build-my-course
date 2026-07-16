import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  courseLessons,
  courseModules,
  courses,
  lessonPracticeExercises,
  userLessonProgress,
} from '@/db/schema';

export type Course = InferSelectModel<typeof courses>;
export type NewCourse = InferInsertModel<typeof courses>;

export type CourseModule = InferSelectModel<typeof courseModules>;
export type NewCourseModule = InferInsertModel<typeof courseModules>;

export type CourseLesson = InferSelectModel<typeof courseLessons>;
export type NewCourseLesson = InferInsertModel<typeof courseLessons>;

export type LessonPracticeExercise = InferSelectModel<typeof lessonPracticeExercises>;
export type NewLessonPracticeExercise = InferInsertModel<typeof lessonPracticeExercises>;

export type UserLessonProgress = InferSelectModel<typeof userLessonProgress>;
export type NewUserLessonProgress = InferInsertModel<typeof userLessonProgress>;

export type CourseWithModulesAndLessons = Course & {
  modules: Array<
    CourseModule & {
      lessons: CourseLesson[];
    }
  >;
};

export type LessonWithModuleCourse = CourseLesson & {
  module: CourseModule & {
    course: Course;
  };
  practiceExercises?: LessonPracticeExercise[];
};

export type LessonProgressMap = Record<
  string,
  {
    completed: boolean;
    completedAt: Date | null;
  }
>;

export type GeneratedCourseLesson = {
  title: string;
  description: string | null;
  estimatedMinutes: number | null;
};

export type GeneratedCourseModule = {
  title: string;
  description: string | null;
  estimatedMinutes: number | null;
  lessons: GeneratedCourseLesson[];
};

export type GeneratedCourseBlueprint = {
  title: string;
  description: string | null;
  modules: GeneratedCourseModule[];
};

export type PracticeExerciseType =
  | 'multiple_choice'
  | 'short_answer'
  | 'applied_task'
  | 'reflection';

export type GeneratedPracticeExercise = {
  title: string;
  instructions: string;
  type: PracticeExerciseType;
  options: string[] | null;
  correctOptionIndex: number | null;
  answerGuidance: string | null;
};

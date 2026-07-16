import {
  accounts,
  courseLessons,
  courseModules,
  courses,
  lessonPracticeExercises,
  userLessonProgress,
  users,
} from '@/db/schema';

describe('db schema', () => {
  it('defines the main tables and columns', () => {
    expect(users).toBeDefined();
    expect(accounts).toBeDefined();
    expect(courses).toBeDefined();
    expect(courseModules).toBeDefined();
    expect(courseLessons).toBeDefined();
    expect(lessonPracticeExercises).toBeDefined();
    expect(userLessonProgress).toBeDefined();

    expect(courses.id.name).toBe('id');
    expect(courses.userId.name).toBe('user_id');
    expect(courseModules.courseId.name).toBe('course_id');
    expect(courseLessons.moduleId.name).toBe('module_id');
    expect(lessonPracticeExercises.lessonId.name).toBe('lesson_id');
    expect(userLessonProgress.completed.name).toBe('completed');
  });
});

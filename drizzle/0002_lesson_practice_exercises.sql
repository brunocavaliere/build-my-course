CREATE TABLE "lesson_practice_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"title" text NOT NULL,
	"instructions" text NOT NULL,
	"type" text NOT NULL,
	"answer_guidance" text,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lesson_practice_exercises" ADD CONSTRAINT "lesson_practice_exercises_lesson_id_course_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."course_lessons"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "lesson_practice_exercises_lesson_id_idx" ON "lesson_practice_exercises" USING btree ("lesson_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_practice_exercises_lesson_position_idx" ON "lesson_practice_exercises" USING btree ("lesson_id","position");

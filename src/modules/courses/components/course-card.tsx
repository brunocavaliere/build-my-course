import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';

import type { Course } from '@/modules/courses/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type CourseCardProps = {
  course: Course;
};

function formatCreatedAt(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(value);
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="border-border/70 rounded-3xl shadow-none">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <CardDescription className="text-sm leading-6">{course.goal}</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href={`/app/courses/${course.id}`}>
              Open
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {course.description ? (
          <p className="text-muted-foreground text-sm leading-6">{course.description}</p>
        ) : null}

        <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
          {course.level ? <span>Level: {course.level}</span> : null}
          {course.estimatedWeeks ? <span>{course.estimatedWeeks} weeks</span> : null}
          <span>Created {formatCreatedAt(course.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

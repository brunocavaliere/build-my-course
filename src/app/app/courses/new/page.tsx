import Link from 'next/link';

import { ArrowLeft, Sparkles } from 'lucide-react';

import { generateCourseAction } from '@/app/app/courses/actions';
import { GenerateCourseForm } from '@/modules/courses/components/generate-course-form';
import { PageContainer, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type NewCoursePageProps = {
  searchParams: Promise<{
    generateError?: string;
  }>;
};

export default async function NewCoursePage({ searchParams }: NewCoursePageProps) {
  const { generateError } = await searchParams;

  return (
    <PageContainer>
      <PageHeader
        title="What do you want to learn?"
        description="Describe your goal and BuildMyCourse will generate a personalized course with modules and lessons."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/app/courses">
              <ArrowLeft className="size-4" />
              Back to Courses
            </Link>
          </Button>
        }
      />

      <Card className="border-border/70 mx-auto w-full max-w-4xl rounded-[2rem] shadow-none">
        <CardHeader className="space-y-3">
          <div className="bg-muted flex size-12 items-center justify-center rounded-2xl">
            <Sparkles className="size-5" />
          </div>
          <div className="space-y-2">
            <CardTitle>Generate with AI</CardTitle>
            <CardDescription className="text-sm leading-6">
              Example: &quot;I want to learn React to get a frontend job.&quot;
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <GenerateCourseForm
            action={generateCourseAction}
            error={generateError}
            secondaryAction={
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/app/courses">Cancel</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}

import { LoaderCircle } from 'lucide-react';

import { PageContainer } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';

export default function LessonLoadingPage() {
  return (
    <PageContainer className="max-w-3xl">
      <Card className="border-border/70 rounded-[2rem] shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="bg-muted flex size-14 items-center justify-center rounded-full">
            <LoaderCircle className="size-6 animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Generating lesson content...</h1>
            <p className="text-muted-foreground text-sm leading-6">
              Please wait while we prepare your lesson.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

'use client';

import { useActionState, useEffect, useRef } from 'react';

import { LoaderCircle, Sparkles } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { SubmitButton } from '@/components/ui/submit-button';

type AutoGenerateLessonContentProps = {
  action: (
    previousState: { error: string | null },
    formData: FormData
  ) => Promise<{ error: string | null }>;
  labels?: {
    title?: string;
    description?: string;
    retry?: string;
  };
};

export function AutoGenerateLessonContent({ action, labels }: AutoGenerateLessonContentProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, { error: null });

  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

  return (
    <>
      <form ref={formRef} action={formAction} className="hidden" aria-hidden="true" />

      <Card className="border-border/70 rounded-[2rem] shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          {state.error ? (
            <>
              <div className="space-y-2">
                <p className="text-destructive text-sm" role="alert">
                  {state.error}
                </p>
              </div>
              <form action={formAction}>
                <SubmitButton
                  className="rounded-full"
                  idleIcon={<Sparkles className="size-4" />}
                  pendingLabel={labels?.title ?? 'Generating lesson content...'}
                >
                  {labels?.retry ?? 'Try again'}
                </SubmitButton>
              </form>
            </>
          ) : (
            <>
              <div className="bg-muted flex size-14 items-center justify-center rounded-full">
                <LoaderCircle className="size-6 animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {labels?.title ?? 'Generating lesson content...'}
                </h2>
                <p className="text-muted-foreground text-sm leading-6">
                  {labels?.description ?? 'Please wait while we prepare your lesson.'}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

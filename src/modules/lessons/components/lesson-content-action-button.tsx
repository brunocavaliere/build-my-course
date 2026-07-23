'use client';

import { useActionState } from 'react';

import { Sparkles } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';

type LessonContentActionButtonProps = {
  hasContent: boolean;
  labels?: {
    generate?: string;
    regenerate?: string;
    regenerating?: string;
  };
};

function LessonContentSubmitButton({ hasContent, labels }: LessonContentActionButtonProps) {
  return (
    <SubmitButton
      className="rounded-full"
      idleIcon={<Sparkles className="size-4" />}
      pendingLabel={labels?.regenerating ?? 'Generating lesson content...'}
    >
      {hasContent
        ? (labels?.regenerate ?? 'Regenerate content')
        : (labels?.generate ?? 'Generate lesson content')}
    </SubmitButton>
  );
}

type LessonContentActionFormProps = {
  action: (
    previousState: { error: string | null },
    formData: FormData
  ) => Promise<{ error: string | null }>;
  hasContent: boolean;
  labels?: {
    generate?: string;
    regenerate?: string;
    regenerating?: string;
    dialogTitle?: string;
    dialogDescription?: string;
    dialogHint?: string;
    cancel?: string;
  };
};

export function LessonContentActionForm({
  action,
  hasContent,
  labels,
}: LessonContentActionFormProps) {
  const [state, formAction] = useActionState(action, { error: null });

  if (!hasContent) {
    return (
      <div className="flex flex-col items-end gap-2">
        <form action={formAction}>
          <LessonContentSubmitButton hasContent={hasContent} labels={labels} />
        </form>
        {state.error ? (
          <p className="text-destructive max-w-sm text-right text-sm" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" className="rounded-full">
          <Sparkles className="size-4" />
          {labels?.regenerate ?? 'Regenerate content'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels?.dialogTitle ?? 'Regenerate lesson content?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {labels?.dialogDescription ?? 'Previous lesson content will be replaced.'}
          </AlertDialogDescription>
          {labels?.dialogHint ? (
            <p className="text-muted-foreground text-sm">{labels.dialogHint}</p>
          ) : null}
          {state.error ? (
            <p className="text-destructive text-sm" role="alert">
              {state.error}
            </p>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{labels?.cancel ?? 'Cancel'}</AlertDialogCancel>
          <form action={formAction}>
            <LessonContentSubmitButton hasContent={hasContent} labels={labels} />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

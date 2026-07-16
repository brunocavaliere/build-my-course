'use client';

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
  action: () => void | Promise<void>;
  hasContent: boolean;
  labels?: {
    generate?: string;
    regenerate?: string;
    regenerating?: string;
    dialogTitle?: string;
    dialogDescription?: string;
    cancel?: string;
  };
};

export function LessonContentActionForm({
  action,
  hasContent,
  labels,
}: LessonContentActionFormProps) {
  if (!hasContent) {
    return (
      <form action={action}>
        <LessonContentSubmitButton hasContent={hasContent} labels={labels} />
      </form>
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
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{labels?.cancel ?? 'Cancel'}</AlertDialogCancel>
          <form action={action}>
            <LessonContentSubmitButton hasContent={hasContent} labels={labels} />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

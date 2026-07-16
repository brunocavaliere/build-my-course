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
};

function LessonContentSubmitButton({ hasContent }: LessonContentActionButtonProps) {
  return (
    <SubmitButton
      className="rounded-full"
      idleIcon={<Sparkles className="size-4" />}
      pendingLabel="Generating lesson content..."
    >
      {hasContent ? 'Regenerate content' : 'Generate lesson content'}
    </SubmitButton>
  );
}

type LessonContentActionFormProps = {
  action: () => void | Promise<void>;
  hasContent: boolean;
};

export function LessonContentActionForm({ action, hasContent }: LessonContentActionFormProps) {
  if (!hasContent) {
    return (
      <form action={action}>
        <LessonContentSubmitButton hasContent={hasContent} />
      </form>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" className="rounded-full">
          <Sparkles className="size-4" />
          Regenerate content
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Regenerate lesson content?</AlertDialogTitle>
          <AlertDialogDescription>Previous lesson content will be replaced.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={action}>
            <LessonContentSubmitButton hasContent={hasContent} />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

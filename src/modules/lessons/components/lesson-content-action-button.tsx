'use client';

import { useFormStatus } from 'react-dom';

import { LoaderCircle, Sparkles } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type LessonContentActionButtonProps = {
  hasContent: boolean;
};

function SubmitButton({ hasContent }: LessonContentActionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="rounded-full" disabled={pending}>
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
      {pending
        ? 'Generating lesson content...'
        : hasContent
          ? 'Regenerate content'
          : 'Generate lesson content'}
    </Button>
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
        <SubmitButton hasContent={hasContent} />
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
            <AlertDialogAction asChild>
              <Button type="submit">Regenerate content</Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

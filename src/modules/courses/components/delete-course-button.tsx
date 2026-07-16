'use client';

import type { ReactNode } from 'react';

import { Trash2 } from 'lucide-react';

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

type DeleteCourseButtonProps = {
  action: () => void | Promise<void>;
  children?: ReactNode;
  labels?: {
    title?: string;
    description?: string;
    cancel?: string;
    confirm?: string;
    pending?: string;
  };
};

export function DeleteCourseButton({
  action,
  children = 'Delete course',
  labels,
}: DeleteCourseButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" className="rounded-full">
          <Trash2 className="size-4" />
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {labels?.title ?? 'Are you sure you want to delete this course?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {labels?.description ?? 'This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{labels?.cancel ?? 'Cancel'}</AlertDialogCancel>
          <form action={action}>
            <SubmitButton
              variant="destructive"
              idleIcon={<Trash2 className="size-4" />}
              pendingLabel={labels?.pending ?? 'Deleting course...'}
            >
              {labels?.confirm ?? 'Delete Course'}
            </SubmitButton>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

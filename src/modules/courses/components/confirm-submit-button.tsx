'use client';

import type { ReactNode } from 'react';

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

type ConfirmSubmitButtonProps = {
  action: () => void | Promise<void>;
  title?: string;
  description: string;
  children: ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmSubmitButton({
  action,
  children,
  className,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  description,
  title = 'Are you sure?',
  variant = 'outline',
}: ConfirmSubmitButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant={variant} className={className}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <form action={action}>
            <SubmitButton pendingLabel={`${confirmLabel}...`}>{confirmLabel}</SubmitButton>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';

import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  pendingLabel?: React.ReactNode;
  idleIcon?: React.ReactNode;
  pendingIcon?: React.ReactNode;
};

function SubmitButton({
  children,
  disabled,
  pendingLabel,
  idleIcon,
  pendingIcon = <LoaderCircle className="size-4 animate-spin" />,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} {...props}>
      {pending ? pendingIcon : idleIcon}
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}

export { SubmitButton };

import type { ReactNode } from 'react';

import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ModuleFormValues = {
  title?: string | null;
  description?: string | null;
  estimatedMinutes?: number | null;
};

type ModuleFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: ModuleFormValues;
  error?: string;
  submitLabel: string;
  secondaryAction?: ReactNode;
};

export function ModuleForm({
  action,
  defaultValues,
  error,
  secondaryAction,
  submitLabel,
}: ModuleFormProps) {
  return (
    <form action={action} className="space-y-6">
      {error ? (
        <div className="text-destructive bg-destructive/10 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="title">Module title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={defaultValues?.title ?? ''}
            placeholder="Core concepts"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={defaultValues?.description ?? ''}
            rows={3}
            placeholder="Optional overview for this module."
          />
        </div>

        <div className="grid gap-2 md:max-w-xs">
          <Label htmlFor="estimatedMinutes">Estimated minutes</Label>
          <Input
            id="estimatedMinutes"
            name="estimatedMinutes"
            type="number"
            min={1}
            defaultValue={defaultValues?.estimatedMinutes ?? ''}
            placeholder="90"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="rounded-full">
          {submitLabel}
        </Button>
        {secondaryAction}
      </div>
    </form>
  );
}

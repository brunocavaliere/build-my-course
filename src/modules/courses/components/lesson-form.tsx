import type { ReactNode } from 'react';

import { AlertCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/ui/submit-button';
import { Textarea } from '@/components/ui/textarea';

type LessonFormValues = {
  title?: string | null;
  description?: string | null;
  content?: string | null;
  estimatedMinutes?: number | null;
};

type LessonFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: LessonFormValues;
  error?: string;
  submitLabel: string;
  secondaryAction?: ReactNode;
};

export function LessonForm({
  action,
  defaultValues,
  error,
  secondaryAction,
  submitLabel,
}: LessonFormProps) {
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
          <Label htmlFor="title">Lesson title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={defaultValues?.title ?? ''}
            placeholder="JSX and components"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={defaultValues?.description ?? ''}
            rows={3}
            placeholder="Optional summary of this lesson."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={defaultValues?.content ?? ''}
            rows={6}
            placeholder="Lesson content can stay empty for now."
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
            placeholder="25"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton className="rounded-full" pendingLabel={`${submitLabel}...`}>
          {submitLabel}
        </SubmitButton>
        {secondaryAction}
      </div>
    </form>
  );
}

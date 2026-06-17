import type { ReactNode } from 'react';

import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type CourseFormValues = {
  title?: string | null;
  goal?: string | null;
  description?: string | null;
  level?: string | null;
  estimatedWeeks?: number | null;
};

type CourseFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: CourseFormValues;
  error?: string;
  submitLabel: string;
  secondaryAction?: ReactNode;
};

export function CourseForm({
  action,
  defaultValues,
  error,
  secondaryAction,
  submitLabel,
}: CourseFormProps) {
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
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={defaultValues?.title ?? ''}
            placeholder="React fundamentals roadmap"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="goal">Goal</Label>
          <Textarea
            id="goal"
            name="goal"
            required
            defaultValue={defaultValues?.goal ?? ''}
            placeholder="Learn React well enough to apply for frontend roles."
            rows={4}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={defaultValues?.description ?? ''}
            placeholder="Optional summary for this course."
            rows={4}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="level">Level</Label>
            <Input
              id="level"
              name="level"
              defaultValue={defaultValues?.level ?? ''}
              placeholder="Beginner"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="estimatedWeeks">Estimated weeks</Label>
            <Input
              id="estimatedWeeks"
              name="estimatedWeeks"
              type="number"
              min={1}
              defaultValue={defaultValues?.estimatedWeeks ?? ''}
              placeholder="6"
            />
          </div>
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

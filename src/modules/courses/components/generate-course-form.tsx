'use client';

import { useFormStatus } from 'react-dom';
import type { ReactNode } from 'react';

import { AlertCircle, LoaderCircle, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type GenerateCourseFormValues = {
  goal?: string | null;
  level?: string | null;
  estimatedWeeks?: number | null;
};

type GenerateCourseFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: GenerateCourseFormValues;
  error?: string;
  secondaryAction?: ReactNode;
};

const levelOptions = [
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
] as const;

function GenerateCourseSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="cursor-pointer rounded-full disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
      {pending ? 'Creating your learning path...' : 'Generate course'}
    </Button>
  );
}

export function GenerateCourseForm({
  action,
  defaultValues,
  error,
  secondaryAction,
}: GenerateCourseFormProps) {
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
          <Label htmlFor="goal">Learning goal</Label>
          <Textarea
            id="goal"
            name="goal"
            required
            defaultValue={defaultValues?.goal ?? ''}
            placeholder="I want to learn React well enough to get a frontend job."
            rows={5}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="level">Level</Label>
            <select
              id="level"
              name="level"
              required
              defaultValue={defaultValues?.level ?? 'Beginner'}
              className="border-input bg-background ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
            >
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="estimatedWeeks">Estimated weeks</Label>
            <Input
              id="estimatedWeeks"
              name="estimatedWeeks"
              type="number"
              min={1}
              max={52}
              required
              defaultValue={defaultValues?.estimatedWeeks ?? 6}
              placeholder="6"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <GenerateCourseSubmitButton />
        {secondaryAction}
      </div>
    </form>
  );
}

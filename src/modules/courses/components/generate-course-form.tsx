'use client';

import type { ReactNode } from 'react';

import { AlertCircle, Sparkles } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubmitButton } from '@/components/ui/submit-button';
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
  labels?: {
    goalLabel?: string;
    goalPlaceholder?: string;
    levelBeginner?: string;
    levelIntermediate?: string;
    levelAdvanced?: string;
    levelLabel?: string;
    levelPlaceholder?: string;
    submit?: string;
    submitting?: string;
    weeksLabel?: string;
    weeksPlaceholder?: string;
  };
  secondaryAction?: ReactNode;
};

export function GenerateCourseForm({
  action,
  defaultValues,
  error,
  labels,
  secondaryAction,
}: GenerateCourseFormProps) {
  const levelOptions = [
    { label: labels?.levelBeginner ?? 'Beginner', value: 'Beginner' },
    { label: labels?.levelIntermediate ?? 'Intermediate', value: 'Intermediate' },
    { label: labels?.levelAdvanced ?? 'Advanced', value: 'Advanced' },
  ] as const;

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
          <Label htmlFor="goal">{labels?.goalLabel ?? 'Learning goal'}</Label>
          <Textarea
            id="goal"
            name="goal"
            required
            defaultValue={defaultValues?.goal ?? ''}
            placeholder={
              labels?.goalPlaceholder ?? 'I want to learn React well enough to get a frontend job.'
            }
            rows={5}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="level">{labels?.levelLabel ?? 'Level'}</Label>
            <Select name="level" required defaultValue={defaultValues?.level ?? 'Beginner'}>
              <SelectTrigger id="level" className="h-10 w-full rounded-md">
                <SelectValue placeholder={labels?.levelPlaceholder ?? 'Select a level'} />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="estimatedWeeks">{labels?.weeksLabel ?? 'Estimated weeks'}</Label>
            <Input
              id="estimatedWeeks"
              name="estimatedWeeks"
              type="number"
              min={1}
              max={52}
              required
              defaultValue={defaultValues?.estimatedWeeks ?? 6}
              placeholder={labels?.weeksPlaceholder ?? '6'}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton
          className="cursor-pointer rounded-full disabled:cursor-not-allowed"
          idleIcon={<Sparkles className="size-4" />}
          pendingLabel={labels?.submitting ?? 'Creating your learning path...'}
        >
          {labels?.submit ?? 'Generate course'}
        </SubmitButton>
        {secondaryAction}
      </div>
    </form>
  );
}

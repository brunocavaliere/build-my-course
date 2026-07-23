import type { ReactNode } from 'react';

import { AlertCircle } from 'lucide-react';

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
import {
  courseLanguageOptions,
  defaultCourseLanguage,
} from '@/modules/courses/lib/course-language';

type CourseFormValues = {
  title?: string | null;
  goal?: string | null;
  description?: string | null;
  level?: string | null;
  courseLanguage?: string | null;
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
  const levelOptions = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
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
            <Select name="level" defaultValue={defaultValues?.level ?? 'Beginner'}>
              <SelectTrigger id="level" className="h-10 w-full rounded-md">
                <SelectValue placeholder="Select a level" />
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
            <Label htmlFor="courseLanguage">Course language</Label>
            <Select
              name="courseLanguage"
              required
              defaultValue={defaultValues?.courseLanguage ?? defaultCourseLanguage}
            >
              <SelectTrigger id="courseLanguage" className="h-10 w-full rounded-md">
                <SelectValue placeholder="Select the course language" />
              </SelectTrigger>
              <SelectContent>
                {courseLanguageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2 md:max-w-sm">
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

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton className="rounded-full" pendingLabel={`${submitLabel}...`}>
          {submitLabel}
        </SubmitButton>
        {secondaryAction}
      </div>
    </form>
  );
}

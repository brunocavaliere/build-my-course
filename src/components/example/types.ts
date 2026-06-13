import type { z } from 'zod';

import { exampleFormGenreSchema, exampleFormSchema } from '@/components/example/schemas';

export type ExampleMetric = {
  label: string;
  value: string;
  hint: string;
};

export type ExampleFormGenre = z.infer<typeof exampleFormGenreSchema>;

export type ExampleFormValues = z.infer<typeof exampleFormSchema>;

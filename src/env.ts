import { z } from 'zod';

export const serverEnvSchema = z.object({});

const optionalClientEnvString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, z.string().min(1).optional());

const optionalClientEnvUrl = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, z.url('NEXT_PUBLIC_SUPABASE_URL deve ser uma URL valida.').optional());

export const clientEnvSchema = z
  .object({
    NEXT_PUBLIC_APP_NAME: z
      .string()
      .min(1, 'NEXT_PUBLIC_APP_NAME e obrigatoria e nao pode ser vazia.'),
    NEXT_PUBLIC_APP_URL: z.url('NEXT_PUBLIC_APP_URL deve ser uma URL valida.'),
    NEXT_PUBLIC_SUPABASE_URL: optionalClientEnvUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalClientEnvString,
  })
  .superRefine((value, context) => {
    const hasSupabaseUrl = Boolean(value.NEXT_PUBLIC_SUPABASE_URL);
    const hasSupabaseAnonKey = Boolean(value.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    if (hasSupabaseUrl === hasSupabaseAnonKey) {
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devem ser definidas juntas quando o projeto usar Supabase.',
      path: ['NEXT_PUBLIC_SUPABASE_URL'],
    });

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devem ser definidas juntas quando o projeto usar Supabase.',
      path: ['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    });
  });

function formatEnvErrors(envName: string, errors: z.ZodIssue[]) {
  const formattedErrors = errors
    .map((issue) => {
      const path = issue.path.join('.') || 'valor-desconhecido';
      return `- ${path}: ${issue.message}`;
    })
    .join('\n');

  return `Invalid ${envName} environment variables:\n${formattedErrors}`;
}

function parseEnv<TSchema extends z.ZodTypeAny>(
  envName: string,
  schema: TSchema,
  runtimeEnv: Record<string, string | undefined>
) {
  const parsedEnv = schema.safeParse(runtimeEnv);

  if (!parsedEnv.success) {
    throw new Error(formatEnvErrors(envName, parsedEnv.error.issues));
  }

  return parsedEnv.data;
}

const clientRuntimeEnv = {
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const serverRuntimeEnv = {};

const clientEnv = parseEnv('client', clientEnvSchema, clientRuntimeEnv);
const serverEnv =
  typeof window === 'undefined' ? parseEnv('server', serverEnvSchema, serverRuntimeEnv) : {};

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const env = {
  ...serverEnv,
  ...clientEnv,
  NODE_ENV: nodeEnv,
  isDevelopment: nodeEnv === 'development',
  isSupabaseEnabled: Boolean(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL && clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
} as const;

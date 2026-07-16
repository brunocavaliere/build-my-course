import { z } from 'zod';

import { brand } from '@/lib/brand';

const optionalEnvString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, z.string().min(1).optional());

const requiredEnvString = (message: string) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return value;
      }

      return value.trim();
    },
    z.string().min(1, message)
  );

const optionalEnvUrl = (message: string) =>
  z.preprocess((value) => {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmedValue = value.trim();

    return trimmedValue.length > 0 ? trimmedValue : undefined;
  }, z.url(message).optional());

export const serverEnvSchema = z
  .object({
    DATABASE_URL: optionalEnvString,
    DATABASE_DIRECT_URL: optionalEnvString,
    AUTH_SECRET: requiredEnvString('AUTH_SECRET e obrigatoria e nao pode ser vazia.'),
    AUTH_URL: optionalEnvUrl('AUTH_URL deve ser uma URL valida.'),
    AUTH_GITHUB_ID: optionalEnvString,
    AUTH_GITHUB_SECRET: optionalEnvString,
    AUTH_GOOGLE_ID: optionalEnvString,
    AUTH_GOOGLE_SECRET: optionalEnvString,
    OPENAI_API_KEY: optionalEnvString,
    OPENAI_MODEL: optionalEnvString,
  })
  .superRefine((value, context) => {
    const hasGitHubId = Boolean(value.AUTH_GITHUB_ID);
    const hasGitHubSecret = Boolean(value.AUTH_GITHUB_SECRET);
    const hasGoogleId = Boolean(value.AUTH_GOOGLE_ID);
    const hasGoogleSecret = Boolean(value.AUTH_GOOGLE_SECRET);

    if (hasGitHubId === hasGitHubSecret) {
      // continue
    } else {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'AUTH_GITHUB_ID e AUTH_GITHUB_SECRET devem ser definidas juntas quando o projeto usar GitHub OAuth.',
        path: ['AUTH_GITHUB_ID'],
      });

      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'AUTH_GITHUB_ID e AUTH_GITHUB_SECRET devem ser definidas juntas quando o projeto usar GitHub OAuth.',
        path: ['AUTH_GITHUB_SECRET'],
      });
    }

    if (hasGoogleId === hasGoogleSecret) {
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET devem ser definidas juntas quando o projeto usar Google OAuth.',
      path: ['AUTH_GOOGLE_ID'],
    });

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET devem ser definidas juntas quando o projeto usar Google OAuth.',
      path: ['AUTH_GOOGLE_SECRET'],
    });
  });

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .min(1, 'NEXT_PUBLIC_APP_NAME e obrigatoria e nao pode ser vazia.'),
  NEXT_PUBLIC_APP_URL: z.url('NEXT_PUBLIC_APP_URL deve ser uma URL valida.'),
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
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? brand.name,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
};

const serverRuntimeEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_DIRECT_URL: process.env.DATABASE_DIRECT_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
};

const clientEnv = parseEnv('client', clientEnvSchema, clientRuntimeEnv);
const serverEnv =
  typeof window === 'undefined'
    ? parseEnv('server', serverEnvSchema, serverRuntimeEnv)
    : ({} as z.infer<typeof serverEnvSchema>);

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const env = {
  ...serverEnv,
  ...clientEnv,
  NODE_ENV: nodeEnv,
  isDevelopment: nodeEnv === 'development',
  isDatabaseConfigured: Boolean(serverEnv.DATABASE_URL),
  isMigrationDatabaseConfigured: Boolean(serverEnv.DATABASE_DIRECT_URL || serverEnv.DATABASE_URL),
  isGitHubAuthConfigured: Boolean(serverEnv.AUTH_GITHUB_ID && serverEnv.AUTH_GITHUB_SECRET),
  isGoogleAuthConfigured: Boolean(serverEnv.AUTH_GOOGLE_ID && serverEnv.AUTH_GOOGLE_SECRET),
  isOpenAiConfigured: Boolean(serverEnv.OPENAI_API_KEY),
  openAiModel: serverEnv.OPENAI_MODEL ?? 'gpt-4o-mini',
} as const;

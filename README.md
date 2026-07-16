# BuildMyCourse

BuildMyCourse transforma objetivos de aprendizado em cursos personalizados.

## Produto

- Nome: `BuildMyCourse`
- Tagline: `Turn any learning goal into a personalized course.`
- Descricao: `Create structured learning paths with lessons, exercises, quizzes and curated resources powered by AI.`

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- next-themes
- TanStack Query
- Neon Postgres
- Drizzle ORM + Drizzle Kit
- Auth.js
- Vitest + Testing Library

## Rodando local

```bash
yarn install
yarn dev
```

## Variaveis de ambiente

Adicione em `.env.local`:

```bash
NEXT_PUBLIC_APP_NAME=BuildMyCourse
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=
DATABASE_DIRECT_URL=
AUTH_SECRET=
AUTH_URL=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_API_KEY` habilita geracao automatica de cursos em `/app/courses/new`.

## Scripts

```bash
yarn dev
yarn build
yarn start
yarn lint
yarn lint:fix
yarn format
yarn format:check
yarn typecheck
yarn db:generate
yarn db:migrate
yarn db:studio
yarn auth:secret
yarn test
yarn test:watch
yarn test:coverage
```

## Estrutura atual

```text
src/
  app/          rotas App Router
  components/
    shared/     blocos visuais reutilizaveis do produto
    ui/         primitives do shadcn/ui
  lib/          branding, env, helpers, integracoes base
  providers/    providers globais
  styles/       estilos globais
  tests/        helpers de teste
```

## Escopo atual

- Landing page do produto
- Shell interna em `/app`
- Dashboard inicial
- Rotas placeholder de cursos
- Tema, providers e base de autenticacao/dados preparados para evoluir

## Banco e autenticacao

Fluxo de banco escolhido: Neon + Drizzle. Autenticacao: Auth.js com GitHub e Google.

- Schema em `src/db/schema.ts`
- Client em `src/db/index.ts`
- Migrations em `drizzle/`
- Auth em `src/auth.ts`
- Guia completo em `docs/database-auth.md`

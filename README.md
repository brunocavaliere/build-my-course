# next-saas-starter

Modern boilerplate for new SaaS products built with Next.js App Router, TypeScript,
`shadcn/ui`, testing, automated quality checks, and a domain-driven frontend structure.

## Overview

This repository is prepared to be used as a GitHub Template Repository. The goal is to
reduce the time between "create the repo" and "start building the product" without adding
premature complexity.

The current base includes:

- Next.js App Router with `src/`
- TypeScript with `@/*` alias
- Tailwind CSS v4
- `shadcn/ui` with `new-york`, `neutral`, and CSS variables
- dark/light mode with `next-themes`
- TanStack Query ready for server state
- forms with React Hook Form + Zod
- tests with Vitest + Testing Library
- toasts with Sonner
- typed and validated environment variables with Zod
- module generator
- Git hooks with Husky + lint-staged
- simple CI with GitHub Actions
- optional Supabase base without auth

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- ESLint
- Prettier
- Vitest
- React Testing Library
- TanStack Query
- React Hook Form
- Zod
- Sonner
- next-themes
- Supabase JS

## Using This Template

1. Mark this repository as a `Template repository` on GitHub.
2. Create a new repository using `Use this template`.
3. Clone the new project.
4. Install dependencies.
5. Create `.env.local`.
6. Update the app name, URL, and starter examples.

## Installation

```bash
yarn install
```

## Run Locally

```bash
yarn dev
```

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
yarn test
yarn test:watch
yarn test:coverage
yarn generate:module <module-name>
```

## Folder Structure

```text
src/
  app/          App Router routes, layouts, and route states
  components/
    ui/         shadcn/ui primitives
    shared/     reusable application-level components
    example/    example module with view, hook, schema, and service
  hooks/        shared global hooks
  lib/          helpers, env, query keys, toasts, errors, and base integrations
  modules/      reserved for larger future domains
  providers/    global provider composition
  services/     shared integrations
  styles/       global styles
  tests/        test setup and helpers
  types/        global types
```

## Component Conventions

- Use functional components.
- Use named exports for regular components.
- Use `default export` only in files required by Next.js, such as `page.tsx`,
  `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx`.
- Use `@/*` alias imports for internal code when it improves consistency.
- `components/ui` is the primitives layer.
- `components/shared` composes reusable shared components for the application.
- `components/[module-name]` contains UI and logic for a specific domain.

## Module and Domain Conventions

Each new domain should start in `src/components/<module-name>/`.

Expected structure:

```text
src/components/books/
  books-card.tsx
  hooks/
    use-books.ts
    index.ts
  services/
    books-service.ts
    index.ts
  constants.ts
  types.ts
  utils.ts
  index.ts
```

Rules:

- domain components live at the top level of the module
- domain hooks live in `hooks/`
- domain services live in `services/`
- local contracts and utilities stay at the module root
- the module `index.ts` should export only the useful public surface

## Hook Conventions

- Shared cross-domain hooks belong in `src/hooks`.
- Hooks that are tightly coupled to a domain belong inside that module.
- Hooks should orchestrate state, services, queries, and helpers.
- Visual components should consume hooks, not services directly.

## Service Conventions

- `services/` contains external calls, mocks, adapters, and integrations.
- Services should not know about UI.
- Services return data; hooks and components decide how to present or combine that data.

## Form Conventions

Current pattern:

- `schemas.ts` for Zod validation
- `types.ts` for inferred types
- `hooks/use-<module>-form.ts` for `useForm`, defaults, and submit handling
- `<module>-form.tsx` for visual composition with shadcn/ui

Rules:

- do not spread validation logic across the visual component
- keep the schema outside the view
- prefer error messages defined in Zod

## Test Conventions

- Use `component-name.test.tsx` for components.
- Use `use-hook-name.test.ts` for hooks.
- Use `service-name.test.ts` for services and utilities when appropriate.
- Prefer colocated tests when that improves navigation.
- Test visible behavior and business rules, not implementation details.
- Reuse `src/tests/render.tsx` and `src/tests/render-with-providers.tsx` when a component
  depends on providers.

## Environment Variable Conventions

Environment variables are centralized in `src/env.ts`.

Recommended usage:

```ts
import { env } from '@/env';
```

Rules:

- do not spread `process.env` across the application
- validate new environment variables with Zod
- use `NEXT_PUBLIC_` only for values that must be available in the browser

Required base environment variables:

```bash
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_URL=
```

Optional Supabase environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

If the project does not use Supabase, leave both empty.

## React Query

TanStack Query is already configured in the global provider layer.

Pattern:

- query keys are centralized in `src/lib/query-keys.ts`
- services handle data fetching
- domain hooks use `useQuery`
- components consume hooks

Use React Query for:

- server state
- cache
- refetch
- async loading and error state

Use local state for:

- modals
- toggles
- ephemeral interactions
- local-only forms with no external data source

## Optional Supabase

The project includes an optional base in `src/lib/supabase/`:

- `browser.ts`
- `server.ts`
- `types.ts`
- `index.ts`

Usage:

```ts
import { createSupabaseBrowserClient, createSupabaseServerClient } from '@/lib/supabase';
```

Current scope:

- includes only base clients
- does not include auth
- does not include middleware
- does not include protected routes
- does not include policies, migrations, or CLI

## Git Hooks and CI

### Pre-commit

`pre-commit` uses Husky + lint-staged and runs on staged files:

- `prettier --write`
- `eslint --fix`

Files:

- `.husky/pre-commit`
- `package.json` under `lint-staged`

### CI

CI lives in `.github/workflows/ci.yml` and runs on:

- `pull_request`
- `push` to `main`

Pipeline steps:

- checkout
- setup Node.js 24
- install
- lint
- typecheck
- test
- build

Node 24 was kept because it appears as an `LTS` line in the official Node.js release
documentation as of May 17, 2026:
https://nodejs.org/en/about/previous-releases

## Creating a New Module with the Generator

```bash
yarn generate:module books
```

The generator:

- validates the module name
- converts to `kebab-case` when needed
- prevents overwriting existing modules
- creates the component, hooks, services, types, constants, utils, and `index.ts`

After generating a module:

1. update `types.ts`
2. replace the mock service data with real data or real integrations
3. evolve the hooks
4. add schemas, forms, and tests when appropriate

## Starting a New Project

Recommended checklist:

- create the new repository from this template
- clone the repository
- run `yarn install`
- create `.env.local`
- update `NEXT_PUBLIC_APP_NAME`
- update `NEXT_PUBLIC_APP_URL`
- configure optional environment variables if the project uses Supabase
- remove or adapt the `example` module
- review `README.md`, `CONVENTIONS.md`, and `ROADMAP.md`
- run `yarn lint`
- run `yarn typecheck`
- run `yarn test`
- run `yarn build`
- create the first commit

## Reference Files

- `README.md`: onboarding and overall structure
- `CONVENTIONS.md`: implementation rules and patterns
- `ROADMAP.md`: optional future improvements

## License

MIT. See [`LICENSE`](/Users/bruno/Desktop/projects/next-saas-starter/LICENSE).

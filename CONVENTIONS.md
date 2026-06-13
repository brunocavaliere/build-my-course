# CONVENTIONS

## Componentes

- Use componentes funcionais.
- Use named exports em componentes comuns.
- Use `default export` apenas nos entrypoints obrigatorios do Next.js.
- Prefira componentes server por padrao. Use `use client` apenas quando necessario.

## Estrutura

- `src/components/ui`: primitives do shadcn/ui.
- `src/components/shared`: composicoes reutilizaveis da aplicacao.
- `src/components/[module-name]`: componentes e logica de dominio.
- `src/hooks`: hooks globais.
- `src/services`: integracoes compartilhadas.
- `src/lib`: helpers puros, envs, query keys, toasts, erros e integracoes base.

## Hooks

- Hooks globais ficam em `src/hooks`.
- Hooks de modulo ficam em `src/components/[module-name]/hooks`.
- Hooks devem compor services, queries, estado local e helpers.
- Componentes nao devem falar direto com services quando o hook for a melhor fronteira.

## Services

- Services nao conhecem UI.
- Services podem encapsular mocks, fetches, adapters e transformacoes de integracao.
- Services do dominio ficam dentro do modulo.
- Services compartilhados ficam em `src/services`.

## Schemas e Tipos

- `schemas.ts` guarda validacao com Zod.
- `types.ts` guarda contratos do dominio e tipos inferidos.
- Tipos globais ficam em `src/types`.

## Forms

- Use React Hook Form + Zod.
- Mantenha schema fora do componente visual.
- Mantenha `useForm` e submit no hook do formulario.
- Use componentes do shadcn/ui em vez de recriar campos.

## Testes

- Teste comportamento visivel e regras de negocio.
- Evite testar implementacao interna.
- Coloque testes proximos do arquivo testado quando isso ajudar navegacao.
- Reaproveite `src/tests/setup.ts`, `src/tests/render.tsx` e
  `src/tests/render-with-providers.tsx`.

## Envs

- Use `import { env } from '@/env'`.
- Nao use `process.env` espalhado pela aplicacao.
- Toda nova env deve ser validada em `src/env.ts`.
- Use `NEXT_PUBLIC_` apenas para valores que precisam ir ao client.

## Toasts

- Use helpers de `src/lib/toast.ts`.
- Evite espalhar chamadas cruas de `toast(...)`.
- Use toast para feedback curto de sucesso, erro, info ou loading.

## Error Handling

- Use `loading.tsx`, `error.tsx` e `not-found.tsx` onde fizer sentido no App Router.
- Use `LoadingState`, `ErrorState` e `EmptyState` para padronizar UX.
- Trate erros previsiveis perto do modulo; deixe `error.tsx` para falhas inesperadas.

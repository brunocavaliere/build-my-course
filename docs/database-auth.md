# Neon, Drizzle e Auth.js

BuildMyCourse usa:

- Neon Postgres
- Drizzle ORM + Drizzle Kit
- Auth.js com provider GitHub
- sessoes JWT

Neste step, apenas tabelas de autenticacao foram preparadas. Nenhuma tabela de dominio do produto foi criada.

## Variaveis de ambiente

```env
DATABASE_URL=
DATABASE_DIRECT_URL=
AUTH_SECRET=
AUTH_URL=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

Notas:

- `DATABASE_URL`: connection string usada pelo runtime da aplicacao
- `DATABASE_DIRECT_URL`: connection string direta usada por migrations e ferramentas CLI
- `AUTH_SECRET`: gere com `npx auth secret`
- `AUTH_URL`: URL publica da aplicacao, ex. `http://localhost:3000`
- `AUTH_GITHUB_ID` e `AUTH_GITHUB_SECRET`: credenciais do OAuth App no GitHub

## Comandos

```bash
yarn db:generate
yarn db:migrate
yarn db:studio
yarn auth:secret
```

## Criar migration

1. Edite `src/db/schema.ts`
2. Gere migration:

```bash
yarn db:generate
```

O Drizzle vai criar SQL versionado em `drizzle/`.

## Aplicar migrations localmente

Com `DATABASE_DIRECT_URL` apontando para banco local ou direct connection do Neon:

```bash
yarn db:migrate
```

## Aplicar migrations em producao

No ambiente de deploy, defina `DATABASE_DIRECT_URL` do Neon de producao e rode:

```bash
yarn db:migrate
```

Como o projeto usa migrations versionadas do Drizzle, o mesmo comando aplica pendencias no alvo configurado por `DATABASE_DIRECT_URL` ou, na falta dela, `DATABASE_URL`.

## Gerar secret do Auth.js

```bash
yarn auth:secret
```

Ou:

```bash
npx auth secret
```

## Login

- rota publica: `/login`
- rotas privadas: `/app` e filhas
- usuario sem sessao e redirecionado para `/login`
- logout encerra sessao e volta para `/`

## Estado atual

- provider inicial: GitHub
- sessao: JWT
- persistencia: usuarios e contas OAuth no Postgres via Drizzle adapter
- sem tabelas de cursos, lessons, quizzes ou progresso

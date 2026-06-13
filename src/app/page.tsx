import { ArrowUpRight, BookOpenText, Plus } from 'lucide-react';

import { ExampleCard, ExampleForm } from '@/components/example';
import {
  AppHeader,
  AppShell,
  AppSidebar,
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { env } from '@/env';
import { DEFAULT_ERROR_MESSAGES } from '@/lib/errors';

export default function Home() {
  return (
    <AppShell
      sidebar={<AppSidebar />}
      header={
        <AppHeader
          actions={
            <Button asChild variant="outline" className="rounded-full">
              <a href="https://nextjs.org/docs/app" target="_blank" rel="noreferrer">
                Docs
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          }
        />
      }
    >
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Uma base visual reutilizavel para produtos SaaS modernos, com shell de aplicacao, layout consistente e componentes compartilhados preparados para crescer."
          actions={
            <Button className="rounded-full">
              <Plus className="size-4" />
              New workspace
            </Button>
          }
        />

        <section id="dashboard" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Projects',
              value: '12',
              hint: 'Espaços ativos na base de exemplo',
            },
            {
              label: 'Query Cache',
              value: 'Warm',
              hint: 'React Query pronto para server state',
            },
            {
              label: 'Theme',
              value: 'Adaptive',
              hint: 'Dark e light mode com tokens semânticos',
            },
            {
              label: 'Testing',
              value: 'Ready',
              hint: 'Vitest e Testing Library configurados',
            },
          ].map((item) => (
            <Card
              key={item.label}
              className="bg-card/80 border-border/70 rounded-3xl backdrop-blur"
            >
              <CardHeader className="gap-2">
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="text-2xl">{item.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-6">{item.hint}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <ExampleCard />

          <div className="space-y-6">
            <ExampleForm />
            <LoadingState
              title="Sincronizando visao geral da equipe"
              description="Use este estado enquanto widgets, listas ou analytics ainda estao em andamento."
            />
          </div>
        </section>

        <section
          id="patterns"
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]"
        >
          <Card className="bg-card/80 border-border/70 rounded-3xl backdrop-blur">
            <CardHeader>
              <CardTitle>Shared components prontos</CardTitle>
              <CardDescription>
                App Shell, Header, Sidebar, Empty State e Loading State ficam em `shared/` porque
                servem para varios dominios sem depender de regra de negocio.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground grid gap-3 text-sm">
              <p>Use `ui/` para primitives e componentes do shadcn/ui.</p>
              <p>Use `shared/` para estrutura visual reaproveitavel entre telas.</p>
              <p>Use `src/components/[module-name]/` para componentes e logica de dominio.</p>
              <p>Use `hooks/` e `schemas.ts` do modulo para formularios tipados e reutilizaveis.</p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card
              id="settings"
              className="from-card via-card to-muted/40 border-border/70 rounded-3xl bg-linear-to-br backdrop-blur"
            >
              <CardHeader>
                <CardTitle>Base preparada para futuras evolucoes</CardTitle>
                <CardDescription>
                  A shell atual foi pensada para receber autenticacao, navegacao real, tabelas,
                  settings e recursos colaborativos sem refazer a estrutura visual da aplicacao.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="rounded-full">
                  <a href="https://ui.shadcn.com/docs" target="_blank" rel="noreferrer">
                    Explorar shadcn/ui
                  </a>
                </Button>
                <Button asChild variant="ghost" className="rounded-full">
                  <a href="https://tanstack.com/query/latest" target="_blank" rel="noreferrer">
                    Explorar React Query
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border/70 rounded-3xl backdrop-blur">
              <CardHeader>
                <CardTitle>Supabase opcional e preparado</CardTitle>
                <CardDescription>
                  Importe o client de browser ou server a partir de `@/lib/supabase` quando o
                  projeto realmente precisar dessa integracao.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3 text-sm">
                <p>Status atual: {env.isSupabaseEnabled ? 'configurado' : 'nao configurado'}.</p>
                <p>Browser: `createSupabaseBrowserClient()` para Client Components e hooks.</p>
                <p>
                  Server: `createSupabaseServerClient()` para Server Components, actions e route
                  handlers.
                </p>
              </CardContent>
            </Card>

            <EmptyState
              title="Nenhum recurso conectado"
              description="Use este estado vazio como base para listas, tabelas ou dashboards enquanto o dominio ainda nao possui dados reais."
              icon={<BookOpenText className="size-5" />}
              action={
                <Button variant="outline" className="rounded-full">
                  Criar primeiro recurso
                </Button>
              }
            />

            <ErrorState
              title="Falha controlada de exemplo"
              description={DEFAULT_ERROR_MESSAGES.queryDescription}
              action={
                <Button variant="outline" className="rounded-full">
                  Tentar novamente
                </Button>
              }
            />
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}

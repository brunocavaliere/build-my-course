import {
  AppHeader,
  AppShell,
  AppSidebar,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/shared';

export default function Loading() {
  return (
    <AppShell sidebar={<AppSidebar />} header={<AppHeader />}>
      <PageContainer>
        <PageHeader
          title="Carregando workspace"
          description="Preparando a aplicacao, os modulos e os dados principais da tela."
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <LoadingState
            title="Montando dashboard"
            description="Carregando indicadores, areas principais e composicao da interface."
            lines={4}
          />
          <LoadingState
            title="Sincronizando painel lateral"
            description="Atualizando contexto visual e dados secundarios desta experiencia."
            lines={3}
          />
        </section>
      </PageContainer>
    </AppShell>
  );
}

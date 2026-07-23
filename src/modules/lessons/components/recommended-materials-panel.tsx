import { BookOpen, ExternalLink, RefreshCcw, Video } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { SubmitButton } from '@/components/ui/submit-button';
import type { LessonRecommendedMaterial } from '@/modules/lessons/lib/recommended-materials';
import { getYoutubeEmbedUrl } from '@/modules/lessons/lib/youtube';

type RecommendedMaterialsPanelProps = {
  action: () => void | Promise<void>;
  materials: LessonRecommendedMaterial[];
  error?: string | null;
  labels?: {
    tab?: string;
    sectionVideo?: string;
    sectionArticle?: string;
    sectionBook?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    generate?: string;
    regenerate?: string;
    generating?: string;
    open?: string;
    refreshTitle?: string;
    refreshDescription?: string;
  };
};

export function RecommendedMaterialsPanel({
  action,
  materials,
  error,
  labels,
}: RecommendedMaterialsPanelProps) {
  const videos = materials.filter((material) => material.type === 'video');
  const articles = materials.filter((material) => material.type === 'article');
  const books = materials.filter((material) => material.type === 'book');

  return (
    <div className="space-y-6">
      {error ? (
        <div className="text-destructive bg-destructive/10 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      {materials.length ? (
        <>
          {videos.length ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Video className="text-muted-foreground size-4" />
                <h2 className="text-base font-semibold">
                  {labels?.sectionVideo ?? 'Recommended videos'}
                </h2>
              </div>

              <div className="grid gap-6">
                {videos.map((material) => {
                  const embedUrl = getYoutubeEmbedUrl(material.url);

                  return (
                    <Card key={`${material.type}-${material.title}`} className="rounded-[2rem]">
                      <CardContent className="space-y-4 py-6">
                        {embedUrl ? (
                          <div className="overflow-hidden rounded-2xl border">
                            <div className="relative aspect-video">
                              <iframe
                                src={embedUrl}
                                title={material.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 h-full w-full border-0"
                              />
                            </div>
                          </div>
                        ) : null}

                        <div className="space-y-2">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{material.title}</h3>
                            {material.sourceName || material.author ? (
                              <p className="text-muted-foreground text-sm">
                                {[material.sourceName, material.author].filter(Boolean).join(' • ')}
                              </p>
                            ) : null}
                          </div>

                          <p className="text-muted-foreground text-sm leading-6">
                            {material.description}
                          </p>
                        </div>

                        {material.url ? (
                          <a
                            href={material.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium underline underline-offset-4"
                          >
                            {labels?.open ?? 'Open material'}
                          </a>
                        ) : null}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ) : null}

          {articles.length ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <ExternalLink className="text-muted-foreground size-4" />
                <h2 className="text-base font-semibold">
                  {labels?.sectionArticle ?? 'Recommended readings'}
                </h2>
              </div>

              <div className="grid gap-4">
                {articles.map((material) => (
                  <Card key={`${material.type}-${material.title}`} className="rounded-[2rem]">
                    <CardContent className="space-y-3 py-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{material.title}</h3>
                        {material.sourceName || material.author ? (
                          <p className="text-muted-foreground text-sm">
                            {[material.sourceName, material.author].filter(Boolean).join(' • ')}
                          </p>
                        ) : null}
                      </div>

                      <p className="text-muted-foreground text-sm leading-6">
                        {material.description}
                      </p>

                      {material.url ? (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium underline underline-offset-4"
                        >
                          {labels?.open ?? 'Open material'}
                        </a>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          {books.length ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="text-muted-foreground size-4" />
                <h2 className="text-base font-semibold">
                  {labels?.sectionBook ?? 'Recommended books'}
                </h2>
              </div>

              <div className="grid gap-4">
                {books.map((material) => (
                  <Card key={`${material.type}-${material.title}`} className="rounded-[2rem]">
                    <CardContent className="space-y-3 py-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{material.title}</h3>
                        {material.sourceName || material.author ? (
                          <p className="text-muted-foreground text-sm">
                            {[material.sourceName, material.author].filter(Boolean).join(' • ')}
                          </p>
                        ) : null}
                      </div>

                      <p className="text-muted-foreground text-sm leading-6">
                        {material.description}
                      </p>

                      {material.url ? (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium underline underline-offset-4"
                        >
                          {labels?.open ?? 'Open material'}
                        </a>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          <Card className="border-border/70 rounded-[2rem] shadow-none">
            <CardContent className="space-y-4 py-6">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {labels?.refreshTitle ?? 'Refresh recommended materials'}
                </p>
                <p className="text-muted-foreground text-sm">
                  {labels?.refreshDescription ??
                    'Generate a fresh set of videos, readings, and books for this lesson.'}
                </p>
              </div>

              <form action={action}>
                <SubmitButton
                  className="rounded-full"
                  idleIcon={<RefreshCcw className="size-4" />}
                  pendingLabel={labels?.generating ?? 'Generating recommended materials...'}
                >
                  {labels?.regenerate ?? 'Refresh materials'}
                </SubmitButton>
              </form>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-border/70 rounded-[2rem] shadow-none">
          <CardContent className="py-16">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {labels?.emptyTitle ?? 'No recommended materials yet'}
                </h2>
                <p className="text-muted-foreground text-base leading-7">
                  {labels?.emptyDescription ??
                    'Generate recommended videos, readings, and books for this lesson.'}
                </p>
              </div>

              <div className="flex justify-center">
                <form action={action}>
                  <SubmitButton
                    className="rounded-full"
                    idleIcon={<RefreshCcw className="size-4" />}
                    pendingLabel={labels?.generating ?? 'Generating recommended materials...'}
                  >
                    {labels?.generate ?? 'Generate recommended materials'}
                  </SubmitButton>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Compass,
  Flag,
  Lightbulb,
  Route,
  Sparkles,
  Target,
} from 'lucide-react';

import { MarkdownContent } from '@/components/shared/markdown-content';
import { cn } from '@/lib/utils';
import type { LessonContentBlock } from '@/lib/lesson-content-blocks';
import { CodeBlockCard } from '@/modules/lessons/components/code-block-card';

type LessonContentBlocksProps = {
  blocks: LessonContentBlock[];
  className?: string;
  labels?: {
    objectives: string;
    guidedExample: string;
    keyInsight: string;
    commonMistake: string;
    correction: string;
    checkpoint: string;
    revealAnswer: string;
    process: string;
    summary: string;
  };
};

const defaultLabels = {
  objectives: 'Learning objectives',
  guidedExample: 'Guided example',
  keyInsight: 'Key insight',
  commonMistake: 'Common mistake',
  correction: 'How to correct it',
  checkpoint: 'Check your understanding',
  revealAnswer: 'Reveal explanation',
  process: 'Step by step',
  summary: 'What to take away',
};

function ReadingMarkdown({ content }: { content: string }) {
  return (
    <MarkdownContent
      content={content}
      className="space-y-6 [&_li]:!text-base [&_li]:!leading-8 [&_p]:!text-base [&_p]:!leading-8"
    />
  );
}

export function LessonContentBlocks({
  blocks,
  className,
  labels = defaultLabels,
}: LessonContentBlocksProps) {
  return (
    <article className={cn('mx-auto space-y-12 py-4', className)}>
      {blocks.map((block) => {
        switch (block.type) {
          case 'code':
            return (
              <div key={block.position} className="my-8">
                <CodeBlockCard content={block.content} language={block.language} />
              </div>
            );

          case 'objective':
            return (
              <section
                key={block.position}
                className="border-border/70 bg-card rounded-3xl border p-7 sm:p-8"
              >
                <h2 className="mb-6 text-2xl font-semibold tracking-tight">{block.title}</h2>
                <ul className="grid gap-4 md:grid-cols-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="text-primary mt-2 size-5 shrink-0" />
                      <span className="text-foreground/90 text-base leading-8">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );

          case 'context':
            return (
              <section key={block.position} className="space-y-5">
                <div className="flex items-center gap-3">
                  <Compass className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold tracking-tight">{block.title}</h2>
                </div>
                <div className="text-foreground/90 border-l-primary border-l-2 pl-5 sm:pl-7">
                  <ReadingMarkdown content={block.content} />
                </div>
              </section>
            );

          case 'concept':
            return (
              <section key={block.position} className="space-y-5">
                <h2 className="text-2xl font-semibold tracking-tight">{block.title}</h2>
                <ReadingMarkdown content={block.content} />
              </section>
            );

          case 'example':
            return (
              <section
                key={block.position}
                className="bg-muted/30 border-border/70 rounded-3xl border p-7 sm:p-9"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div>
                    <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                      {labels.guidedExample}
                    </span>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight">{block.title}</h2>
                  </div>
                </div>
                <ReadingMarkdown content={block.content} />
              </section>
            );

          case 'insight':
            return (
              <aside
                key={block.position}
                className="border-primary/25 bg-primary/8 rounded-3xl border p-7 sm:p-8"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Lightbulb className="text-primary size-5" />
                  <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                    {labels.keyInsight}
                  </span>
                </div>
                <h2 className="mb-4 text-xl font-semibold tracking-tight">{block.title}</h2>
                <ReadingMarkdown content={block.content} />
              </aside>
            );

          case 'mistake':
            return (
              <aside
                key={block.position}
                className="border-destructive/25 bg-destructive/5 overflow-hidden rounded-3xl border"
              >
                <div className="p-7 sm:p-8">
                  <div className="text-destructive mb-4 flex items-center gap-2">
                    <AlertTriangle className="size-5" />
                    <span className="text-xs font-semibold tracking-wider uppercase">
                      {labels.commonMistake}
                    </span>
                  </div>
                  <h2 className="mb-4 text-xl font-semibold tracking-tight">{block.title}</h2>
                  <ReadingMarkdown content={block.content} />
                </div>
                <div className="border-destructive/15 bg-background/60 border-t p-7 sm:px-8">
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    {labels.correction}
                  </div>
                  <ReadingMarkdown content={block.correction} />
                </div>
              </aside>
            );

          case 'checkpoint':
            return (
              <section
                key={block.position}
                className="border-border/70 bg-card rounded-3xl border p-7 sm:p-9"
              >
                <div className="text-primary mb-4 flex items-center gap-2">
                  <CircleHelp className="size-5" />
                  <span className="text-xs font-semibold tracking-wider uppercase">
                    {labels.checkpoint}
                  </span>
                </div>
                <h2 className="mb-4 text-xl font-semibold tracking-tight">{block.title}</h2>
                <p className="text-base leading-8">{block.question}</p>
                <details className="group border-border/70 mt-5 rounded-2xl border px-4 py-3">
                  <summary className="cursor-pointer font-medium">{labels.revealAnswer}</summary>
                  <div className="text-muted-foreground mt-4 border-t pt-4">
                    <ReadingMarkdown content={block.answer} />
                  </div>
                </details>
              </section>
            );

          case 'process':
            return (
              <section key={block.position} className="space-y-6">
                <div className="flex items-start gap-3">
                  <div>
                    <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                      {labels.process}
                    </span>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight">{block.title}</h2>
                  </div>
                </div>
                <ol className="grid gap-3">
                  {block.items.map((item, index) => (
                    <li
                      key={item}
                      className="bg-muted/25 border-border/60 flex gap-4 rounded-2xl border p-5"
                    >
                      <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-base leading-7">{item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            );

          case 'summary':
            return (
              <section
                key={block.position}
                className="border-border/70 bg-card rounded-3xl border p-7 sm:p-8"
              >
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Flag className="text-primary size-4" />
                    <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                      {labels.summary}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">{block.title}</h2>
                </div>
                <ul className="mb-6 space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500" />
                      <span className="text-foreground/90 text-base leading-7">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-border/50 border-t pt-5">
                  <ReadingMarkdown content={block.content} />
                </div>
              </section>
            );

          case 'markdown':
            return (
              <MarkdownContent
                key={block.position}
                content={block.content}
                className="space-y-5 px-1 [&_li]:!text-base [&_li]:!leading-8 [&_p]:!text-base [&_p]:!leading-8"
              />
            );
        }
      })}
    </article>
  );
}

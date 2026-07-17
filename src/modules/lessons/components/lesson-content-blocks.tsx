import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MarkdownContent } from '@/components/shared/markdown-content';
import type { LessonContentBlock } from '@/lib/lesson-content-blocks';

type LessonContentBlocksProps = {
  blocks: LessonContentBlock[];
  className?: string;
};

export function LessonContentBlocks({ blocks, className }: LessonContentBlocksProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {blocks.map((block) => {
        if (block.type === 'code') {
          return (
            <Card key={block.position} className="border-border/70 overflow-hidden rounded-2xl">
              <CardContent className="space-y-3 p-0">
                <div className="bg-muted/60 text-muted-foreground flex items-center justify-between border-b px-4 py-2 text-xs font-medium tracking-[0.12em] uppercase">
                  <span>Code</span>
                  <span>{block.language ?? 'plain text'}</span>
                </div>
                <pre className="overflow-x-auto px-4 py-4 text-sm leading-6">
                  <code className={block.language ? `language-${block.language}` : undefined}>
                    {block.content}
                  </code>
                </pre>
              </CardContent>
            </Card>
          );
        }

        return (
          <Card key={block.position} className="border-border/70 rounded-2xl shadow-none">
            <CardContent className="py-6">
              <MarkdownContent content={block.content} className="space-y-4" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type CodeBlockCardProps = {
  content: string;
  language: string | null;
};

export function CodeBlockCard({ content, language }: CodeBlockCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast.success('Code copied');
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('Could not copy code');
    }
  }

  return (
    <Card className="border-border/70 gap-0 overflow-hidden rounded-2xl py-0">
      <CardContent className="p-0">
        <div className="bg-muted/60 text-muted-foreground flex items-center justify-between border-b px-4 py-2 text-xs font-medium tracking-[0.12em] uppercase">
          <div className="flex items-center gap-2">
            <span>Code</span>
            <span>{language ?? 'plain text'}</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground h-6 px-2"
            aria-label="Copy code"
          >
            {isCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {isCopied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <pre className="overflow-x-auto px-4 py-4 text-sm leading-6">
          <code className={language ? `language-${language}` : undefined}>{content}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

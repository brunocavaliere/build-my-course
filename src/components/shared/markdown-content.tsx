import type { ReactNode } from 'react';
import { Fragment } from 'react';

import { cn } from '@/lib/utils';

type MarkdownContentProps = {
  content: string;
  className?: string;
};

type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'code'; language: string | null; content: string };

function renderInlineMarkdown(content: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = content;
  let segmentIndex = 0;

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/`([^`]+)`/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const italicMatch = remaining.match(/\*([^*]+)\*/);

    const matches = [codeMatch, boldMatch, italicMatch]
      .filter((match): match is NonNullable<typeof match> => Boolean(match))
      .map((match) => ({
        match,
        index: match.index ?? 0,
      }))
      .sort((left, right) => left.index - right.index);

    const nextMatch = matches[0];

    if (!nextMatch) {
      nodes.push(<Fragment key={`${keyPrefix}-text-${segmentIndex}`}>{remaining}</Fragment>);
      break;
    }

    const [fullMatch, innerText] = nextMatch.match;
    const matchIndex = nextMatch.index;

    if (matchIndex > 0) {
      nodes.push(
        <Fragment key={`${keyPrefix}-text-${segmentIndex}`}>
          {remaining.slice(0, matchIndex)}
        </Fragment>
      );
      segmentIndex += 1;
    }

    const nodeKey = `${keyPrefix}-token-${segmentIndex}`;

    if (fullMatch.startsWith('`')) {
      nodes.push(
        <code key={nodeKey} className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.95em]">
          {innerText}
        </code>
      );
    } else if (fullMatch.startsWith('**')) {
      nodes.push(
        <strong key={nodeKey} className="font-semibold">
          {innerText}
        </strong>
      );
    } else {
      nodes.push(
        <em key={nodeKey} className="italic">
          {innerText}
        </em>
      );
    }

    remaining = remaining.slice(matchIndex + fullMatch.length);
    segmentIndex += 1;
  }

  return nodes;
}

function parseMarkdown(content: string): MarkdownBlock[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];

  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trimEnd() ?? '';
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim() || null;
      index += 1;
      const codeLines: string[] = [];

      while (index < lines.length && !lines[index]?.trim().startsWith('```')) {
        codeLines.push(lines[index] ?? '');
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push({
        type: 'code',
        language,
        content: codeLines.join('\n'),
      });
      continue;
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({
        type: 'heading',
        level: 1,
        content: trimmed.slice(2).trim(),
      });
      index += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push({
        type: 'heading',
        level: 2,
        content: trimmed.slice(3).trim(),
      });
      index += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push({
        type: 'heading',
        level: 3,
        content: trimmed.slice(4).trim(),
      });
      index += 1;
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index]?.trim() ?? '';

        if (!/^\d+\.\s+/.test(current)) {
          break;
        }

        items.push(current.replace(/^\d+\.\s+/, '').trim());
        index += 1;
      }

      blocks.push({
        type: 'ordered-list',
        items,
      });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index]?.trim() ?? '';

        if (!/^[-*]\s+/.test(current)) {
          break;
        }

        items.push(current.replace(/^[-*]\s+/, '').trim());
        index += 1;
      }

      blocks.push({
        type: 'unordered-list',
        items,
      });
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const current = lines[index]?.trim() ?? '';

      if (
        !current ||
        current.startsWith('#') ||
        current.startsWith('```') ||
        /^\d+\.\s+/.test(current) ||
        /^[-*]\s+/.test(current)
      ) {
        break;
      }

      paragraphLines.push(current);
      index += 1;
    }

    blocks.push({
      type: 'paragraph',
      content: paragraphLines.join(' '),
    });
  }

  return blocks;
}

function renderBlock(block: MarkdownBlock, index: number): ReactNode {
  switch (block.type) {
    case 'heading':
      if (block.level === 1) {
        return (
          <h1 key={index} className="text-3xl font-semibold tracking-tight">
            {renderInlineMarkdown(block.content, `heading-1-${index}`)}
          </h1>
        );
      }

      if (block.level === 2) {
        return (
          <h2 key={index} className="text-xl font-semibold tracking-tight">
            {renderInlineMarkdown(block.content, `heading-2-${index}`)}
          </h2>
        );
      }

      return (
        <h3 key={index} className="text-lg font-semibold tracking-tight">
          {renderInlineMarkdown(block.content, `heading-3-${index}`)}
        </h3>
      );

    case 'ordered-list':
      return (
        <ol key={index} className="list-inside list-decimal space-y-2 pl-1 text-sm leading-7">
          {block.items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`}>
              {renderInlineMarkdown(item, `ordered-${index}-${itemIndex}`)}
            </li>
          ))}
        </ol>
      );

    case 'unordered-list':
      return (
        <ul key={index} className="list-inside list-disc space-y-2 pl-1 text-sm leading-7">
          {block.items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`}>
              {renderInlineMarkdown(item, `unordered-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>
      );

    case 'code':
      return (
        <pre
          key={index}
          className="bg-muted overflow-x-auto rounded-2xl border p-4 text-sm leading-6"
        >
          <code className={block.language ? `language-${block.language}` : undefined}>
            {block.content}
          </code>
        </pre>
      );

    case 'paragraph':
      return (
        <p key={index} className="text-sm leading-7">
          {renderInlineMarkdown(block.content, `paragraph-${index}`)}
        </p>
      );
  }
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const blocks = parseMarkdown(content);

  return <div className={cn('space-y-4', className)}>{blocks.map(renderBlock)}</div>;
}

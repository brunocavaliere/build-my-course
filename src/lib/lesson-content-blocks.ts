export type LessonMarkdownBlock = {
  type: 'markdown';
  content: string;
  position: number;
};

export type LessonCodeBlock = {
  type: 'code';
  content: string;
  position: number;
  language: string | null;
};

export type LessonObjectiveBlock = {
  type: 'objective';
  title: string;
  items: string[];
  position: number;
};

export type LessonContextBlock = {
  type: 'context';
  title: string;
  content: string;
  position: number;
};

export type LessonConceptBlock = {
  type: 'concept';
  title: string;
  content: string;
  position: number;
};

export type LessonExampleBlock = {
  type: 'example';
  title: string;
  content: string;
  position: number;
};

export type LessonInsightBlock = {
  type: 'insight';
  title: string;
  content: string;
  position: number;
};

export type LessonMistakeBlock = {
  type: 'mistake';
  title: string;
  content: string;
  correction: string;
  position: number;
};

export type LessonCheckpointBlock = {
  type: 'checkpoint';
  title: string;
  question: string;
  answer: string;
  position: number;
};

export type LessonProcessBlock = {
  type: 'process';
  title: string;
  items: string[];
  position: number;
};

export type LessonSummaryBlock = {
  type: 'summary';
  title: string;
  items: string[];
  content: string;
  position: number;
};

export type LessonContentBlock =
  | LessonMarkdownBlock
  | LessonCodeBlock
  | LessonObjectiveBlock
  | LessonContextBlock
  | LessonConceptBlock
  | LessonExampleBlock
  | LessonInsightBlock
  | LessonMistakeBlock
  | LessonCheckpointBlock
  | LessonProcessBlock
  | LessonSummaryBlock;

export function lessonContentBlocksToMarkdown(blocks: LessonContentBlock[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'markdown':
          return block.content;
        case 'code':
          return `\`\`\`${block.language ?? ''}\n${block.content}\n\`\`\``;
        case 'objective':
        case 'process':
          return `## ${block.title}\n${block.items.map((item) => `- ${item}`).join('\n')}`;
        case 'context':
        case 'concept':
        case 'example':
        case 'insight':
          return `## ${block.title}\n${block.content}`;
        case 'mistake':
          return `## ${block.title}\n${block.content}\n\n${block.correction}`;
        case 'checkpoint':
          return `## ${block.title}\n**${block.question}**\n\n${block.answer}`;
        case 'summary':
          return [
            `## ${block.title}`,
            block.items.map((item) => `- ${item}`).join('\n'),
            block.content,
          ]
            .filter(Boolean)
            .join('\n\n');
      }
    })
    .join('\n\n')
    .trim();
}

export function splitLessonContentIntoBlocks(content: string): LessonContentBlock[] {
  const normalized = content.replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return [];
  }

  const lines = normalized.split('\n');
  const blocks: LessonContentBlock[] = [];
  let markdownBuffer: string[] = [];
  let position = 1;
  let index = 0;

  function flushMarkdownBuffer() {
    const markdown = markdownBuffer.join('\n').trim();

    if (!markdown) {
      markdownBuffer = [];
      return;
    }

    blocks.push({
      type: 'markdown',
      content: markdown,
      position,
    });
    position += 1;
    markdownBuffer = [];
  }

  while (index < lines.length) {
    const currentLine = lines[index] ?? '';
    const trimmed = currentLine.trim();

    if (!trimmed.startsWith('```')) {
      markdownBuffer.push(currentLine);
      index += 1;
      continue;
    }

    flushMarkdownBuffer();

    const language = trimmed.slice(3).trim() || null;
    const codeLines: string[] = [];
    index += 1;

    while (index < lines.length && !(lines[index] ?? '').trim().startsWith('```')) {
      codeLines.push(lines[index] ?? '');
      index += 1;
    }

    if (index < lines.length) {
      index += 1;
    }

    blocks.push({
      type: 'code',
      content: codeLines.join('\n').trimEnd(),
      language,
      position,
    });
    position += 1;
  }

  flushMarkdownBuffer();

  return blocks;
}

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

export type LessonContentBlock = LessonMarkdownBlock | LessonCodeBlock;

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

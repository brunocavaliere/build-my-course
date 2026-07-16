import { render, screen } from '@testing-library/react';

import { MarkdownContent } from '@/components/shared/markdown-content';

describe('MarkdownContent', () => {
  it('renders headings, inline formatting, lists, and code blocks', () => {
    render(
      <MarkdownContent
        content={`# Lesson Title

## Overview
This is **bold**, *italic*, and \`inline code\`.

### Steps
1. First item
2. Second item

- Bullet one
- Bullet two

\`\`\`ts
const value = 1;
\`\`\``}
      />
    );

    expect(screen.getByRole('heading', { name: 'Lesson Title', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Overview', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Steps', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('italic').tagName).toBe('EM');
    expect(screen.getByText('inline code').tagName).toBe('CODE');
    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Bullet one')).toBeInTheDocument();
    expect(screen.getByText(/const value = 1;/)).toBeInTheDocument();
  });
});

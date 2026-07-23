import { render, screen } from '@testing-library/react';

import { RecommendedMaterialsPanel } from '@/modules/lessons/components/recommended-materials-panel';
import type { LessonRecommendedMaterial } from '@/modules/lessons/lib/recommended-materials';

const materials: LessonRecommendedMaterial[] = [
  {
    type: 'video',
    title: 'SQL Intro Video',
    description: 'Helpful introduction.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Teacher',
    sourceName: 'YouTube',
  },
  {
    type: 'article',
    title: 'SQL Reading',
    description: 'Clear reference article.',
    url: 'https://example.com/sql-reading',
    author: null,
    sourceName: 'Example Docs',
  },
];

describe('RecommendedMaterialsPanel', () => {
  it('renders the empty state when there are no materials', () => {
    render(<RecommendedMaterialsPanel action={async () => undefined} materials={[]} />);

    expect(screen.getByText('No recommended materials yet')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /generate recommended materials/i })
    ).toBeInTheDocument();
  });

  it('renders grouped materials and refresh action', () => {
    render(
      <RecommendedMaterialsPanel
        action={async () => undefined}
        materials={materials}
        error="Temporary issue"
      />
    );

    expect(screen.getByText('Temporary issue')).toBeInTheDocument();
    expect(screen.getByText('Recommended videos')).toBeInTheDocument();
    expect(screen.getByText('Recommended readings')).toBeInTheDocument();
    expect(screen.getByTitle('SQL Intro Video')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh materials/i })).toBeInTheDocument();
  });
});

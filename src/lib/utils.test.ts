import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names and resolves tailwind conflicts', () => {
    expect(cn('px-2 py-2', 'px-4', false && 'hidden', undefined, 'text-sm')).toBe(
      'py-2 px-4 text-sm'
    );
  });
});

import Link from 'next/link';

import { cn } from '@/lib/utils';

type BrandWordmarkProps = {
  className?: string;
  href?: string | null;
};

export function BrandWordmark({ className, href = '/app' }: BrandWordmarkProps) {
  const content = (
    <span
      aria-label="Build My Course"
      className={cn(
        'inline-flex items-center gap-1 text-lg font-semibold tracking-tight text-white',
        className
      )}
    >
      <span className="text-white">Build</span>
      <span className="text-white/70">My Course</span>
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} aria-label="Build My Course" className="inline-flex items-center">
      {content}
    </Link>
  );
}

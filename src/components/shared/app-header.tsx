'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowLeft, BookOpenText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { brand } from '@/lib/brand';
import { cn } from '@/lib/utils';

type AppHeaderProps = {
  actions?: ReactNode;
  className?: string;
};

export function AppHeader({ actions, className }: AppHeaderProps) {
  const pathname = usePathname();
  const isCoursePage = /^\/app\/courses\/[^/]+$/.test(pathname);

  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      {isCoursePage ? (
        <Button
          asChild
          variant="ghost"
          className="hidden rounded-full pl-0 hover:bg-transparent md:inline-flex"
        >
          <Link href="/app/courses">
            <ArrowLeft className="size-4" />
            Back to Courses
          </Link>
        </Button>
      ) : (
        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <div className="bg-foreground text-background flex size-10 items-center justify-center rounded-2xl">
            <BookOpenText className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{brand.name}</p>
            <p className="text-muted-foreground text-xs">{brand.tagline}</p>
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </div>
  );
}

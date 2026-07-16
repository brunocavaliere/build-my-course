'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { BrandWordmark } from '@/components/shared/brand-wordmark';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AppHeaderProps = {
  actions?: ReactNode;
  className?: string;
  labels?: {
    backToCourse?: string;
    backToCourses?: string;
  };
  userMenu?: ReactNode;
};

export function AppHeader({ actions, className, labels, userMenu }: AppHeaderProps) {
  const pathname = usePathname();
  const isCoursesListPage = pathname === '/app';
  const isCourseNewPage = pathname === '/app/new';
  const isCoursePage = /^\/app\/[^/]+$/.test(pathname) && pathname !== '/app/new';
  const editMatch = pathname.match(/^\/app\/([^/]+)\/edit$/);
  const lessonMatch = pathname.match(/^\/app\/([^/]+)\/lessons\/[^/]+$/);
  const courseIdFromEdit = editMatch?.[1] ?? null;
  const courseIdFromLesson = lessonMatch?.[1] ?? null;

  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      {courseIdFromLesson ? (
        <Button asChild variant="ghost" className="rounded-full pl-0 hover:bg-transparent">
          <Link href={`/app/${courseIdFromLesson}`}>
            <ArrowLeft className="size-4" />
            {labels?.backToCourse ?? 'Back to Course'}
          </Link>
        </Button>
      ) : courseIdFromEdit ? (
        <Button asChild variant="ghost" className="rounded-full pl-0 hover:bg-transparent">
          <Link href={`/app/${courseIdFromEdit}`}>
            <ArrowLeft className="size-4" />
            {labels?.backToCourse ?? 'Back to Course'}
          </Link>
        </Button>
      ) : isCourseNewPage ? (
        <Button asChild variant="ghost" className="rounded-full pl-0 hover:bg-transparent">
          <Link href="/app">
            <ArrowLeft className="size-4" />
            {labels?.backToCourses ?? 'Back to Courses'}
          </Link>
        </Button>
      ) : isCoursePage ? (
        <Button asChild variant="ghost" className="rounded-full pl-0 hover:bg-transparent">
          <Link href="/app">
            <ArrowLeft className="size-4" />
            {labels?.backToCourses ?? 'Back to Courses'}
          </Link>
        </Button>
      ) : isCoursesListPage ? (
        <BrandWordmark />
      ) : (
        <BrandWordmark />
      )}

      <div className="ml-auto flex items-center gap-2">
        {actions}
        {userMenu}
      </div>
    </div>
  );
}

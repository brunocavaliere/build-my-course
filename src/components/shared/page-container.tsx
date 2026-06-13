import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type PageContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-1 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8 xl:px-10',
        className
      )}
    >
      {children}
    </div>
  );
}

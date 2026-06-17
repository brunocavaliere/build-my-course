import Link from 'next/link';

import { Compass } from 'lucide-react';

import { EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6">
      <EmptyState
        title="Page not found"
        description="This route does not exist in BuildMyCourse yet."
        icon={<Compass className="size-5" />}
        className="w-full"
        action={
          <Button asChild className="rounded-full">
            <Link href="/">Back to landing page</Link>
          </Button>
        }
      />
    </main>
  );
}

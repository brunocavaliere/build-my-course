'use client';

import { ErrorState } from '@/components/shared';
import { DEFAULT_ERROR_MESSAGES, getErrorMessage } from '@/lib/errors';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6">
      <ErrorState
        className="w-full"
        title={DEFAULT_ERROR_MESSAGES.genericTitle}
        description={getErrorMessage(error, DEFAULT_ERROR_MESSAGES.genericDescription)}
        onRetry={reset}
      />
    </main>
  );
}

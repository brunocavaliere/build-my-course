import { LoadingState } from '@/components/shared';

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6">
      <LoadingState
        className="w-full"
        title="Loading Build My Course"
        description="Preparing landing page or app workspace."
        lines={4}
      />
    </main>
  );
}

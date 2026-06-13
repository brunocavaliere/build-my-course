'use client';

import { useQuery } from '@tanstack/react-query';

import { EXAMPLE_FEATURES } from '@/components/example/constants';
import { getExampleMetrics } from '@/components/example/services/example-service';
import { queryKeys } from '@/lib/query-keys';

export function useExample() {
  const query = useQuery({
    queryKey: queryKeys.example.metrics(),
    queryFn: getExampleMetrics,
  });

  return {
    features: EXAMPLE_FEATURES,
    isLoading: query.isPending,
    isError: query.isError,
    metrics: query.data ?? [],
  };
}

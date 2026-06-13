import type { ExampleMetric } from '@/components/example/types';

export function getMetricLabel(metric: ExampleMetric) {
  return `${metric.label}: ${metric.value}`;
}

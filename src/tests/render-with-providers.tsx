import type { PropsWithChildren, ReactElement } from 'react';

import { render as rtlRender, type RenderOptions } from '@testing-library/react';

import { AppProviders } from '@/providers';

function TestProviders({ children }: PropsWithChildren) {
  return <AppProviders>{children}</AppProviders>;
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, {
    wrapper: TestProviders,
    ...options,
  });
}

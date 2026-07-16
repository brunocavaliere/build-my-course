import { render, screen } from '@testing-library/react';

import { ModuleForm } from '@/modules/courses/components/module-form';

describe('ModuleForm', () => {
  it('renders module fields and values', () => {
    render(
      <ModuleForm
        action={async () => undefined}
        submitLabel="Save module"
        defaultValues={{
          title: 'Core concepts',
          description: 'Module summary',
          estimatedMinutes: 90,
        }}
      />
    );

    expect(screen.getByDisplayValue('Core concepts')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Module summary')).toBeInTheDocument();
    expect(screen.getByDisplayValue('90')).toBeInTheDocument();
  });
});

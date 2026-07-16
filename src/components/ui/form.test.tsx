import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

function FormHarness() {
  const form = useForm<{ name: string }>({
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input aria-label="Name input" {...field} />
            </FormControl>
            <FormDescription>Tell us your name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <button
        type="button"
        onClick={() => {
          void form.trigger('name');
        }}
      >
        Validate
      </button>
    </Form>
  );
}

describe('form helpers', () => {
  it('renders description and validation message', async () => {
    render(<FormHarness />);

    expect(screen.getByText('Tell us your name.')).toBeInTheDocument();
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();

    screen.getByRole('button', { name: 'Validate' }).click();

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

describe('Tabs', () => {
  it('switches visible content between triggers', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="lesson">
        <TabsList>
          <TabsTrigger value="lesson">Lesson</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>
        <TabsContent value="lesson">Lesson body</TabsContent>
        <TabsContent value="practice">Practice body</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Lesson body')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Practice' }));
    expect(screen.getByText('Practice body')).toBeInTheDocument();
  });
});

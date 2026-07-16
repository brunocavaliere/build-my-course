import { render, screen } from '@testing-library/react';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar';

describe('avatar components', () => {
  it('renders avatar primitives and helpers', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage alt="Bruno" src="/avatar.png" />
          <AvatarFallback>BC</AvatarFallback>
          <AvatarBadge>•</AvatarBadge>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    );

    expect(screen.getByText('BC')).toBeInTheDocument();
    expect(screen.getByText('•')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-group"]')).toBeInTheDocument();
  });
});

import type { ReactNode } from 'react';

import { Search } from 'lucide-react';

import { ProjectBadge } from '@/components/shared/project-badge';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type AppHeaderProps = {
  actions?: ReactNode;
  className?: string;
  searchPlaceholder?: string;
};

export function AppHeader({
  actions,
  className,
  searchPlaceholder = 'Buscar modulos, notas ou configuracoes',
}: AppHeaderProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <ProjectBadge />

      <div className="relative hidden max-w-xl flex-1 md:block">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          readOnly
          value={searchPlaceholder}
          aria-label="Busca indisponivel no exemplo"
          className="bg-muted/50 border-border/70 h-11 rounded-2xl pr-4 pl-10 shadow-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {actions}
        <Separator orientation="vertical" className="hidden h-6 md:block" />
        <Avatar className="hidden md:flex">
          <AvatarFallback>DX</AvatarFallback>
        </Avatar>
        <ThemeToggle />
      </div>
    </div>
  );
}

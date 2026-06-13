import type { ComponentType } from 'react';

import { ArrowUpRight, BookOpenText, LayoutDashboard, Settings2 } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { env } from '@/env';
import { cn } from '@/lib/utils';

type AppSidebarItem = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  isActive?: boolean;
};

type AppSidebarProps = {
  items?: AppSidebarItem[];
};

const DEFAULT_ITEMS: AppSidebarItem[] = [
  {
    label: 'Dashboard',
    href: '#dashboard',
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    label: 'Patterns',
    href: '#patterns',
    icon: BookOpenText,
  },
  {
    label: 'Settings',
    href: '#settings',
    icon: Settings2,
  },
];

export function AppSidebar({ items = DEFAULT_ITEMS }: AppSidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <Avatar size="lg" className="from-foreground/95 to-foreground/70 bg-linear-to-br">
          <AvatarFallback className="text-background bg-transparent font-semibold">
            {env.NEXT_PUBLIC_APP_NAME.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{env.NEXT_PUBLIC_APP_NAME}</p>
          <p className="text-muted-foreground text-xs">Starter para produtos SaaS</p>
        </div>

        <Badge variant="outline" className="ml-auto rounded-full">
          Beta
        </Badge>
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.label}>
                <Button
                  asChild
                  variant={item.isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-sm',
                    item.isActive && 'shadow-xs'
                  )}
                >
                  <a href={item.href}>
                    {Icon ? <Icon className="size-4" /> : null}
                    <span>{item.label}</span>
                  </a>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      <div className="px-4 py-4">
        <Card className="bg-muted/40 border-border/70 rounded-2xl py-0 shadow-none">
          <CardContent className="p-0">
            <a
              href={env.NEXT_PUBLIC_APP_URL}
              className="hover:bg-accent flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-colors"
            >
              <div>
                <p className="font-medium">Base pronta para evoluir</p>
                <p className="text-muted-foreground text-xs">Shell, modulos e providers prontos</p>
              </div>
              <ArrowUpRight className="text-muted-foreground size-4" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

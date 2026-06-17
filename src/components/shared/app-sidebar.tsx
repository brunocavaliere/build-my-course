'use client';

import type { ComponentType } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BookOpenText } from 'lucide-react';

import { SidebarUserMenu } from '@/components/shared/sidebar-user-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { brand } from '@/lib/brand';
import { cn } from '@/lib/utils';

type AppSidebarItem = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
};

type AppSidebarProps = {
  items?: AppSidebarItem[];
  userLabel?: string | null;
  userEmail?: string | null;
  signOutAction: () => void | Promise<void>;
};

const DEFAULT_ITEMS: AppSidebarItem[] = [
  {
    label: 'Courses',
    href: '/app/courses',
    icon: BookOpenText,
  },
];

export function AppSidebar({
  items = DEFAULT_ITEMS,
  signOutAction,
  userEmail,
  userLabel,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <Avatar size="lg" className="bg-foreground">
          <AvatarFallback className="text-background bg-transparent font-semibold">
            BM
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{brand.name}</p>
          <p className="text-muted-foreground text-xs">Personalized course builder</p>
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
            const isActive = pathname.startsWith(item.href);

            return (
              <li key={item.label}>
                <Button
                  asChild
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-sm',
                    isActive && 'shadow-xs'
                  )}
                >
                  <Link href={item.href}>
                    {Icon ? <Icon className="size-4" /> : null}
                    <span>{item.label}</span>
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      <div className="px-4 py-4">
        {userLabel || userEmail ? (
          <SidebarUserMenu
            userLabel={userLabel}
            userEmail={userEmail}
            signOutAction={signOutAction}
          />
        ) : null}
      </div>
    </div>
  );
}

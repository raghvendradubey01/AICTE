'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  Users,
  Compass,
  Rocket,
  Archive,
  MessageSquare,
  CalendarDays,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Pulse', icon: Flame },
    { href: '/directory', label: 'Students', icon: Users },
    { href: '/bridge', label: 'Bridge', icon: Compass },
    { href: '/teams', label: 'Teams', icon: Rocket },
    { href: '/vault', label: 'Vault', icon: Archive },
    { href: '/clubs', label: 'Clubs', icon: CalendarDays },
    { href: '/messages', label: 'Chat', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className={`h-4 w-4 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Compass,
  Briefcase,
  Archive,
  MessageSquare,
  CalendarDays,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/directory', label: 'Network', icon: Users },
    { href: '/bridge', label: 'Bridge', icon: Compass },
    { href: '/teams', label: 'Teams', icon: Briefcase },
    { href: '/vault', label: 'Vault', icon: Archive },
    { href: '/messages', label: 'Chat', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-card px-2 py-1 flex items-center justify-around shadow-md">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] transition-colors ${
              isActive
                ? 'text-[#0a66c2] dark:text-[#70b5f9] font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

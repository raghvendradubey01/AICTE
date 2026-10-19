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
  CalendarDays,
  MessageSquare,
  ShieldCheck,
  Award,
  Sparkles,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';

export const LeftSidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser } = useCampus();

  const navItems = [
    {
      href: '/',
      label: 'Campus Pulse',
      subtitle: 'Live Campus Feed',
      icon: Flame,
      badge: 'Live',
      badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    },
    {
      href: '/directory',
      label: 'Student Directory',
      subtitle: '1st–4th Year Network',
      icon: Users,
    },
    {
      href: '/bridge',
      label: 'Senior-Junior Bridge',
      subtitle: 'Mentorship & Placement',
      icon: Compass,
      badge: 'Hot',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    },
    {
      href: '/teams',
      label: 'Team & Hackathons',
      subtitle: 'Build Together Board',
      icon: Rocket,
    },
    {
      href: '/vault',
      label: 'Academic & Gear Vault',
      subtitle: 'PYQs, Notes & Books',
      icon: Archive,
    },
    {
      href: '/clubs',
      label: 'Clubs & Events',
      subtitle: 'Societies & Lost/Found',
      icon: CalendarDays,
    },
    {
      href: '/messages',
      label: 'Batch Channels',
      subtitle: 'Real-Time Year Chat',
      icon: MessageSquare,
      badge: 'Active',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-20 space-y-4">
        
        {/* Navigation List */}
        <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Campus Hub
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                      }`}
                    />
                    <div>
                      <div className={`leading-none ${isActive ? 'text-white font-semibold' : 'text-foreground'}`}>
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 leading-none ${
                          isActive ? 'text-indigo-100' : 'text-muted-foreground'
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {item.badge && !isActive && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Current Student Profile Snapshot Card */}
        <div className="rounded-2xl border border-border bg-gradient-to-b from-card to-muted/20 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>

            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-foreground truncate">{currentUser.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{currentUser.headline}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-muted/60 p-2">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Batch</div>
              <div className="text-xs font-bold text-foreground mt-0.5">{currentUser.year}</div>
            </div>
            <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2">
              <div className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
                <Award className="h-2.5 w-2.5" />
                <span>Karma</span>
              </div>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {currentUser.karmaPoints} pts
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Institutional ID</span>
            </span>
            <span className="font-semibold text-foreground">{currentUser.branch}</span>
          </div>
        </div>

      </div>
    </aside>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bookmark,
  Users,
  Award,
  ShieldCheck,
  Hash,
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { COLLEGE_CONFIG } from '@/lib/supabase';

export const LeftSidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, setActiveChannel } = useCampus();

  const recentRooms = [
    { id: '3rd-year-internships', label: '3rd-year-internships' },
    { id: '1st-year-freshers', label: '1st-year-freshers' },
    { id: 'competitive-programming', label: 'competitive-programming' },
    { id: '2nd-year-hub', label: '2nd-year-hub' },
  ];

  return (
    <aside className="w-56 lg:w-60 flex-shrink-0 hidden md:block space-y-2.5">
      
      {/* 1. LinkedIn-style Profile Card */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs text-center">
        
        {/* Banner Cover */}
        <div className="h-14 bg-gradient-to-r from-[#0a66c2]/80 via-indigo-600 to-[#004182] relative" />

        {/* Circular Avatar with -mt overlap */}
        <div className="relative -mt-9 flex justify-center">
          <Link href={`/directory?student=${currentUser.id}`}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-card shadow-sm hover:opacity-95 transition-opacity"
            />
          </Link>
        </div>

        {/* Name & Headline */}
        <div className="p-3 pt-2">
          <Link
            href={`/directory?student=${currentUser.id}`}
            className="font-bold text-sm text-foreground hover:underline block leading-tight"
          >
            {currentUser.name}
          </Link>
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {currentUser.headline}
          </p>
          <div className="mt-1 text-[11px] font-semibold text-[#0a66c2] dark:text-[#70b5f9]">
            {currentUser.year} • {currentUser.branch}
          </div>
        </div>

        {/* LinkedIn-style Analytics / Stats Rows */}
        <div className="border-t border-border py-2 text-left text-xs">
          <Link
            href="/directory"
            className="flex items-center justify-between px-3 py-1.5 hover:bg-muted/50 transition-colors"
          >
            <span className="text-[11px] text-muted-foreground">Batch Reach</span>
            <span className="font-bold text-foreground text-xs">340</span>
          </Link>

          <Link
            href="/bridge"
            className="flex items-center justify-between px-3 py-1.5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-muted-foreground">Campus Karma</span>
            </div>
            <span className="font-bold text-[#0a66c2] dark:text-[#70b5f9] text-xs">
              {currentUser.karmaPoints} pts
            </span>
          </Link>

          <div className="flex items-center justify-between px-3 py-1.5 text-muted-foreground">
            <span className="text-[11px]">Institutional ID</span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">
              Verified
            </span>
          </div>
        </div>

        {/* My Saved Items Row */}
        <div className="border-t border-border p-2.5 text-left">
          <Link
            href="/vault"
            className="flex items-center gap-2 text-xs font-semibold text-foreground hover:text-[#0a66c2] transition-colors"
          >
            <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px]">My Saved PYQs & Notes</span>
          </Link>
        </div>

      </div>

      {/* 2. LinkedIn-style "Recent & Groups" Sticky Card */}
      <div className="sticky top-16 rounded-lg border border-border bg-card p-3 shadow-xs space-y-3 text-left">
        
        {/* Recent Batch Channels */}
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">Recent</div>
          <div className="space-y-1">
            {recentRooms.map((room) => (
              <Link
                key={room.id}
                href="/messages"
                onClick={() => setActiveChannel(room.id)}
                className="flex items-center gap-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors group truncate"
              >
                <Hash className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                <span className="truncate text-[11px]">{room.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Groups & Societies */}
        <div className="pt-2 border-t border-border">
          <Link
            href="/clubs"
            className="text-[11px] font-bold text-[#0a66c2] dark:text-[#70b5f9] hover:underline flex items-center justify-between"
          >
            <span>Campus Societies</span>
            <span className="text-muted-foreground text-[10px] font-normal">4</span>
          </Link>
          <div className="mt-1 space-y-1 text-xs text-muted-foreground">
            <Link href="/clubs" className="block text-[11px] hover:text-foreground truncate py-0.5">
              • Turing Coding Club
            </Link>
            <Link href="/clubs" className="block text-[11px] hover:text-foreground truncate py-0.5">
              • Robocrafters Society
            </Link>
            <Link href="/clubs" className="block text-[11px] hover:text-foreground truncate py-0.5">
              • E-Cell Entrepreneurship
            </Link>
          </div>
        </div>

        {/* Discover More Footer Button */}
        <div className="pt-2 border-t border-border text-center">
          <Link
            href="/directory"
            className="text-[11px] font-bold text-muted-foreground hover:text-[#0a66c2] transition-colors block py-0.5"
          >
            Discover More Peers →
          </Link>
        </div>

      </div>

    </aside>
  );
};

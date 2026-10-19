'use client';

import React from 'react';
import Link from 'next/link';
import {
  Info,
  ChevronDown,
  Plus,
  ArrowRight,
  Flame,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { StudentYear } from '@/types';
import { COLLEGE_CONFIG } from '@/lib/supabase';

export const RightSidebar: React.FC = () => {
  const { students, teams, showToast } = useCampus();

  const campusNews = [
    { title: 'Microsoft Summer Intern Drive Open', time: '4h ago', readers: '382 readers' },
    { title: 'Smart India Hackathon Squads Forming', time: '1d ago', readers: '540 readers' },
    { title: 'Casio 991EX & Drafter in Gear Vault', time: '2d ago', readers: '142 readers' },
    { title: 'Google SWE-1 Interview Debrief Live', time: '2d ago', readers: '610 readers' },
    { title: 'Turing Club Speed Coding Sprint', time: '3d ago', readers: '280 readers' },
  ];

  // Top Senior Mentors
  const topMentors = students
    .filter((s) => s.isMentor && (s.year === '3rd Year' || s.year === '4th Year'))
    .slice(0, 3);

  const batches: StudentYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  return (
    <aside className="w-72 lg:w-80 flex-shrink-0 hidden xl:block space-y-2.5">
      
      {/* 1. LinkedIn News Style Card */}
      <div className="rounded-lg border border-border bg-card p-3.5 shadow-xs text-left">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-foreground">Campus News</h3>
          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">Top campus updates & placement buzz</p>

        <div className="space-y-3">
          {campusNews.map((news, idx) => (
            <Link
              key={idx}
              href="/bridge"
              className="group block hover:bg-muted/40 -mx-2 px-2 py-1 rounded transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-foreground font-black text-xs leading-tight">•</span>
                <div>
                  <h4 className="font-semibold text-xs text-foreground group-hover:text-[#0a66c2] transition-colors leading-snug">
                    {news.title}
                  </h4>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {news.time} • {news.readers}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. "Add to your network" / Senior Mentors Card */}
      <div className="rounded-lg border border-border bg-card p-3.5 shadow-xs text-left">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-foreground">Recommended Mentors</h3>
          <Link
            href="/bridge"
            className="text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="space-y-3.5">
          {topMentors.map((mentor) => (
            <div key={mentor.id} className="flex items-start gap-2.5">
              <Link href={`/directory?student=${mentor.id}`}>
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-border mt-0.5"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/directory?student=${mentor.id}`}
                  className="font-bold text-xs text-foreground hover:underline truncate block"
                >
                  {mentor.name}
                </Link>
                <p className="text-[10px] text-muted-foreground truncate leading-tight">
                  {mentor.headline}
                </p>
                <div className="text-[10px] font-semibold text-[#0a66c2] dark:text-[#70b5f9] mt-0.5">
                  {mentor.year} • {mentor.branch}
                </div>

                <div className="mt-2">
                  <Link
                    href={`/directory?student=${mentor.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-foreground/60 dark:border-foreground/40 hover:border-foreground px-3 py-0.5 text-xs font-bold text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Connect</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Quick Batch Pills */}
      <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
        <div className="text-xs font-bold text-foreground mb-2">Explore Batches</div>
        <div className="grid grid-cols-2 gap-1.5">
          {batches.map((b) => (
            <Link
              key={b}
              href={`/directory?year=${encodeURIComponent(b)}`}
              className="text-center py-1 px-2 rounded-md bg-muted/50 hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
            >
              {b}
            </Link>
          ))}
        </div>
      </div>

      {/* 4. LinkedIn-style Footer Links */}
      <footer className="px-2 pt-2 text-center text-[11px] text-muted-foreground leading-relaxed">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <Link href="/directory" className="hover:underline">About</Link>
          <Link href="/bridge" className="hover:underline">Placement Guide</Link>
          <Link href="/vault" className="hover:underline">PYQs & Gear</Link>
          <Link href="/clubs" className="hover:underline">Campus Clubs</Link>
          <Link href="/messages" className="hover:underline">Channels</Link>
        </div>
        <div className="mt-2 font-semibold text-foreground flex items-center justify-center gap-1 text-[11px]">
          <span className="font-extrabold text-[#0a66c2]">CampusConnect</span>
          <span>© 2026 {COLLEGE_CONFIG.code}</span>
        </div>
      </footer>

    </aside>
  );
};

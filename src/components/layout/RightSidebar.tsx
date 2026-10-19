'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Rocket,
  Trophy,
  Users,
  ArrowRight,
  ExternalLink,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { StudentYear } from '@/types';

export const RightSidebar: React.FC = () => {
  const { students, teams, clubs } = useCampus();

  // Top Senior Contributors ranked by karma
  const topSeniors = [...students]
    .filter((s) => s.year === '3rd Year' || s.year === '4th Year')
    .sort((a, b) => b.karmaPoints - a.karmaPoints)
    .slice(0, 3);

  // Trending Hackathon Teams (open teams)
  const trendingTeams = teams.filter((t) => t.status === 'Open').slice(0, 2);

  const yearPills: StudentYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  return (
    <aside className="w-80 flex-shrink-0 hidden xl:block">
      <div className="sticky top-20 space-y-4">
        
        {/* Quick Batch Year Filter Widget */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-indigo-500" />
              <span>Explore by Batch</span>
            </h3>
            <Link
              href="/directory"
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              All (4)
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {yearPills.map((yr) => (
              <Link
                key={yr}
                href={`/directory?year=${encodeURIComponent(yr)}`}
                className="flex items-center justify-between p-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-500/30 transition-all text-xs group"
              >
                <span className="font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {yr}
                </span>
                <span className="text-[10px] text-muted-foreground bg-card px-1.5 py-0.5 rounded-full border border-border">
                  {students.filter((s) => s.year === yr).length}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Senior Contributors Leaderboard */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Senior Leaderboard
                </h3>
                <p className="text-[11px] text-muted-foreground">Mentorship & Peer Karma</p>
              </div>
            </div>
            <Link
              href="/bridge"
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Bridge
            </Link>
          </div>

          <div className="space-y-2.5">
            {topSeniors.map((senior, idx) => (
              <div
                key={senior.id}
                className="flex items-center justify-between p-2 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={senior.avatar}
                      alt={senior.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                    />
                    <span
                      className={`absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white ${
                        idx === 0 ? 'bg-amber-500 ring-2 ring-background' : idx === 1 ? 'bg-slate-400' : 'bg-amber-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-foreground flex items-center gap-1">
                      <span>{senior.name}</span>
                      <CheckCircle2 className="h-3 w-3 text-indigo-500" />
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {senior.year} • {senior.branch}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    <Flame className="h-3 w-3 text-amber-500" />
                    {senior.karmaPoints}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Hackathon Teams */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Rocket className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Trending Teams
              </h3>
            </div>
            <Link
              href="/teams"
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {trendingTeams.map((team) => (
              <div
                key={team.id}
                className="p-3 rounded-xl border border-border/70 bg-muted/20 hover:border-indigo-500/40 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-foreground line-clamp-1">
                    {team.title}
                  </h4>
                  <span className="shrink-0 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                    {team.filledSlots}/{team.totalSlots} Slots
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {team.eventName} • {team.eventType}
                </p>

                <div className="flex flex-wrap gap-1">
                  {team.rolesNeeded.slice(0, 2).map((role, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-border text-foreground"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Campus Events */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Calendar className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Upcoming Events
              </h3>
            </div>
            <Link
              href="/clubs"
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clubs
            </Link>
          </div>

          <div className="space-y-2.5">
            {clubs.slice(0, 2).map((club) => (
              <div
                key={club.id}
                className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground truncate pr-2">
                    {club.upcomingEvent.title}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                    {club.upcomingEvent.type}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>{club.upcomingEvent.date}</span>
                  <span>{club.upcomingEvent.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShieldCheck,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  GraduationCap,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Users2,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { COLLEGE_CONFIG } from '@/lib/supabase';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const {
    currentUser,
    students,
    switchUserById,
    theme,
    toggleTheme,
    notifications,
    markNotificationAsRead,
    unreadNotificationsCount,
    globalSearchQuery,
    setGlobalSearchQuery,
    isMockMode,
  } = useCampus();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchQuery.trim()) {
      router.push(`/directory?q=${encodeURIComponent(globalSearchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Left: Brand & College Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-foreground">
                  Campus<span className="text-indigo-600 dark:text-indigo-400">Connect</span>
                </span>
                <span className="rounded bg-indigo-100 dark:bg-indigo-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                  v1.0
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-muted-foreground font-medium">
                The Harvard-Style Intra-Campus Network
              </p>
            </div>
          </Link>

          {/* Institutional Verification Badge */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">{COLLEGE_CONFIG.name}</span>
            <span className="text-emerald-500/60">•</span>
            <span className="text-[11px] opacity-90">.ac.in Verified</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              placeholder="Search students, skills, PYQs, hackathons..."
              className="w-full rounded-full border border-border bg-muted/40 py-2 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-medium text-muted-foreground border border-border/80 rounded px-1.5 py-0.5">
              <span>↵</span>
            </div>
          </div>
        </form>

        {/* Right: Actions, Theme, Notifs & User Pill */}
        <div className="flex items-center gap-2.5">
          {/* Contributor Mock Mode Indicator */}
          {isMockMode && (
            <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-300" title="Running in Contributor Mock Mode. Zero external DB setup needed!">
              <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
              <span>Mock Contributor Mode</span>
            </div>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted/70 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted/70 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-semibold text-foreground">Campus Alerts</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{notifications.length} updates</span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        notif.read ? 'bg-muted/30 hover:bg-muted/50' : 'bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{notif.title}</span>
                        <span className="text-[10px] text-muted-foreground">{notif.timestamp}</span>
                      </div>
                      <p className="mt-1 text-muted-foreground leading-relaxed">{notif.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Perspective Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 hover:bg-muted/50 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
              />
              <div className="hidden sm:block text-left text-xs leading-none">
                <div className="font-semibold text-foreground">{currentUser.name}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">
                  {currentUser.year} • {currentUser.branch}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {/* Profile & Switcher Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-border">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{currentUser.name}</h4>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                      <span>🏆 {currentUser.karmaPoints} Campus Karma</span>
                    </div>
                  </div>
                </div>

                {/* Perspective Switcher */}
                <div className="mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Users2 className="h-3 w-3" />
                    <span>Switch Test Perspective</span>
                  </p>
                  <div className="space-y-1">
                    {students.slice(0, 4).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          switchUserById(s.id);
                          setIsProfileOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                          s.id === currentUser.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={s.avatar} alt={s.name} className="h-5 w-5 rounded-full object-cover" />
                          <span>{s.name}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{s.year} • {s.branch}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <Link
                    href={`/directory?student=${currentUser.id}`}
                    onClick={() => setIsProfileOpen(false)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <User className="h-3 w-3" />
                    <span>View My Public Card</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Home,
  Users,
  Compass,
  Briefcase,
  Archive,
  MessageSquare,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Users2,
  User,
  GraduationCap,
  CalendarDays,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { COLLEGE_CONFIG } from '@/lib/supabase';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
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

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/directory', label: 'My Network', icon: Users },
    { href: '/bridge', label: 'Bridge', icon: Compass },
    { href: '/teams', label: 'Teams', icon: Briefcase },
    { href: '/vault', label: 'Vault', icon: Archive },
    { href: '/clubs', label: 'Clubs', icon: CalendarDays },
    { href: '/messages', label: 'Messaging', icon: MessageSquare, badge: 'Active' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card shadow-xs">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
        
        {/* Left: LinkedIn-style CC Logo & Global Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
            {/* LinkedIn-styled Blue App Icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0a66c2] text-white shadow-xs font-black text-xl tracking-tighter group-hover:bg-[#004182] transition-colors">
              <span className="font-sans">in</span>
            </div>
            <div className="hidden lg:block leading-none">
              <span className="font-extrabold text-sm tracking-tight text-foreground">
                Campus<span className="text-[#0a66c2] dark:text-[#70b5f9]">Connect</span>
              </span>
            </div>
          </Link>

          {/* Search Bar - LinkedIn Styled with #edf3f8 pill input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              placeholder="Search students, skills, PYQs..."
              className="w-full rounded-md border-0 bg-muted/70 dark:bg-muted py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-1 focus:ring-foreground focus:outline-none transition-all"
            />
          </form>
        </div>

        {/* Center / Right: LinkedIn-style 2-line Navigation Icons */}
        <nav className="flex items-center h-full">
          <div className="hidden md:flex items-center h-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center min-w-[64px] sm:min-w-[72px] h-full px-1 text-center transition-colors group ${
                    isActive
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />
                    )}
                  </div>
                  <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>

                  {/* LinkedIn Signature Bottom Active Indicator Line */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                  )}
                </Link>
              );
            })}

            {/* Notifications Item */}
            <div className="relative flex items-center h-full">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative flex flex-col items-center justify-center min-w-[64px] h-full px-1 text-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Notifications"
              >
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-card">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-tight mt-0.5">Notifications</span>
              </button>

              {/* Notifications Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 top-14 w-80 sm:w-96 rounded-lg border border-border bg-card p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                    <span className="text-xs font-bold text-foreground">Campus Notifications</span>
                    <span className="text-[10px] text-muted-foreground">{notifications.length} recent</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1.5">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-2 rounded-md text-xs cursor-pointer transition-colors ${
                          notif.read ? 'hover:bg-muted/40' : 'bg-muted/60 font-semibold'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">{notif.title}</span>
                          <span className="text-[10px] text-muted-foreground">{notif.timestamp}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground font-normal leading-relaxed">
                          {notif.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* LinkedIn-style "Me" Avatar Trigger */}
            <div className="relative flex items-center h-full border-l border-border/80 pl-2">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex flex-col items-center justify-center min-w-[58px] h-full px-1 text-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-border"
                />
                <span className="text-[11px] leading-tight mt-0.5 flex items-center gap-0.5">
                  <span>Me</span>
                  <ChevronDown className="h-2.5 w-2.5" />
                </span>
              </button>

              {/* "Me" Profile Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-14 w-64 rounded-lg border border-border bg-card p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-start gap-2.5 pb-2.5 border-b border-border">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-foreground truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{currentUser.headline}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {currentUser.year} • {currentUser.branch}
                      </div>
                    </div>
                  </div>

                  <div className="py-2 border-b border-border">
                    <Link
                      href={`/directory?student=${currentUser.id}`}
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full block text-center rounded-full border border-[#0a66c2] text-[#0a66c2] dark:text-[#70b5f9] py-1 text-xs font-bold hover:bg-[#0a66c2]/10 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>

                  {/* Perspective Switcher */}
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Users2 className="h-3 w-3" />
                      <span>Switch Perspective</span>
                    </div>
                    <div className="space-y-1">
                      {students.slice(0, 4).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            switchUserById(s.id);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors text-left ${
                            s.id === currentUser.id
                              ? 'bg-muted text-foreground font-bold'
                              : 'hover:bg-muted/50 text-muted-foreground'
                          }`}
                        >
                          <span className="truncate">{s.name}</span>
                          <span className="text-[10px] shrink-0 text-muted-foreground">{s.year}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Right Utilities (Theme & Verification) */}
          <div className="flex items-center gap-1.5 pl-2">
            {/* Institutional Badge */}
            <div className="hidden xl:flex items-center gap-1 rounded bg-muted/60 px-2 py-1 text-[11px] font-semibold text-foreground" title="Institutional Domain Verified">
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate max-w-[130px]">{COLLEGE_CONFIG.code} Verified</span>
            </div>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>
          </div>
        </nav>

      </div>
    </header>
  );
};

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Menu,
  ChevronDown,
  Check,
  CheckCheck,
  UserCheck,
  Building,
  GraduationCap,
  ShieldCheck,
  Award,
  Sparkles,
  Mail,
} from 'lucide-react';
import { useAicte } from '@/context/AicteContext';
import { UserRole } from '@/types/aicte';
import { DemoClock } from '@/components/layout/DemoClock';
import { ROLE_CONFIGS } from '@/data/mockAicteData';

const ROLES: {
  role: UserRole;
  title: string;
  tagline: string;
  badge: string;
  icon: React.ElementType;
}[] = [
  {
    role: 'Institution',
    title: 'Institution',
    tagline: 'Colleges & polytechnics submitting approval applications',
    badge: 'Applicant',
    icon: GraduationCap,
  },
  {
    role: 'Regional Officer',
    title: 'Regional Officer (RO)',
    tagline: 'Regional AICTE office verifying compliance & scrutiny',
    badge: 'Scrutiny',
    icon: Building,
  },
  {
    role: 'Bureau Officer',
    title: 'Bureau Officer (HQ)',
    tagline: 'AICTE headquarters granting final EoA and approvals',
    badge: 'Authority',
    icon: Award,
  },
  {
    role: 'EVC/SAC Committee',
    title: 'EVC / SAC Committee',
    tagline: 'Expert Visiting & Standing Appeals Committee inspections',
    badge: 'Inspection',
    icon: ShieldCheck,
  },
];

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard Overview',
  '/applications': 'Applications',
  '/evc-queue': 'EVC Queue',
  '/documents': 'Undertakings and Documents',
  '/reports': 'Reports & Analytics',
  '/audit-log': 'Audit Log',
  '/settings': 'System Settings',
};

export function TopBar() {
  const pathname = usePathname();
  const {
    currentRole,
    setRole,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleSidebar,
  } = useAicte();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const pageTitle = ROUTE_TITLES[pathname] || 'AICTE Approval Monitor';
  const activeRoleConfig = ROLE_CONFIGS[currentRole];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Toggle & Page Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs font-medium uppercase tracking-wider text-slate-400">
            Portal
          </span>
          <span className="hidden sm:inline-block text-slate-300">/</span>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right Controls: Demo Clock, Role Switcher & Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo Clock with +1d, +7d, +30d and Reset */}
        <DemoClock />

        {/* ROLE SWITCHER DROPDOWN */}
        <div className="relative" ref={roleMenuRef}>
          <button
            type="button"
            onClick={() => {
              setRoleMenuOpen((prev) => !prev);
              setNotificationsOpen(false);
            }}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              roleMenuOpen
                ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
            aria-expanded={roleMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
              {activeRoleConfig.shortCode.slice(0, 2)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                Role
              </span>
              <span className="font-semibold text-slate-800 leading-tight block">
                {currentRole}
              </span>
            </div>
            <span className="sm:hidden font-semibold">{currentRole}</span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                roleMenuOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </button>

          {/* Role Dropdown Menu */}
          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Switch Active Role
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                    <UserCheck className="h-3 w-3" />
                    Instant Preview
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Change your view to test features as different stakeholders.
                </p>
              </div>

              <div className="space-y-1">
                {ROLES.map((r) => {
                  const isSelected = currentRole === r.role;
                  const Icon = r.icon;

                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        setRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition-colors ${
                        isSelected
                          ? 'bg-blue-50/80 border border-blue-200'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-semibold ${
                              isSelected ? 'text-blue-900' : 'text-slate-800'
                            }`}
                          >
                            {r.title}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-blue-200/60 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {r.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                          {r.tagline}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="mt-1 text-blue-600">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Stored in browser (localStorage)</span>
                <span className="text-blue-600 font-medium">No backend</span>
              </div>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS BELL */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setRoleMenuOpen(false);
            }}
            className={`relative rounded-xl border p-2 text-slate-600 transition-all ${
              notificationsOpen
                ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Notifications
                  </h3>
                  {unreadNotificationsCount > 0 && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>

                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                    <Bell className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">No notifications</p>
                  <p className="text-xs text-slate-400">You are all caught up!</p>
                </div>
              ) : (
                <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`group relative flex items-start gap-3 rounded-xl p-3 transition-colors ${
                        notif.read
                          ? 'bg-slate-50/70 text-slate-600 border border-slate-100'
                          : 'bg-blue-50/70 text-slate-900 border border-blue-200 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          notif.read
                            ? 'bg-slate-200 text-slate-500'
                            : notif.title.includes('Escalat')
                            ? 'bg-rose-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {notif.type === 'alert' && <Sparkles className="h-3.5 w-3.5" />}
                        {notif.type === 'action' && <ShieldCheck className="h-3.5 w-3.5" />}
                        {notif.type === 'update' && <Check className="h-3.5 w-3.5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {notif.caseId && (
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                                {notif.caseId}
                              </span>
                            )}
                            <p
                              className={`text-xs ${
                                notif.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'
                              }`}
                            >
                              {notif.title}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>

                        {/* Plain English notification message */}
                        <p className="text-xs text-slate-600 leading-snug">
                          {notif.message}
                        </p>

                        {/* Footer row: Email sent (simulated) label + Mark as read button */}
                        <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                          <span className="inline-flex items-center gap-1 font-medium text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60 text-[10px]">
                            <Mail className="h-3 w-3 text-blue-600" />
                            Email sent (simulated)
                          </span>

                          {!notif.read ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationAsRead(notif.id);
                              }}
                              className="font-bold text-blue-600 hover:text-blue-800 text-[11px] underline"
                            >
                              Mark as read
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400">
                  Real-time alerts for AICTE approval milestones
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

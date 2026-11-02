'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  CalendarCheck2,
  FolderCheck,
  BarChart3,
  ShieldAlert,
  Settings,
  Building2,
  HardDrive,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAicte } from '@/context/AicteContext';
import { ROLE_CONFIGS } from '@/data/mockAicteData';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview & key metrics',
  },
  {
    name: 'Applications',
    href: '/applications',
    icon: FileText,
    badge: '5',
    description: 'Track institution approvals',
  },
  {
    name: 'EVC Queue',
    href: '/evc-queue',
    icon: CalendarCheck2,
    badge: '2',
    description: 'Expert Visiting Committee inspections',
  },
  {
    name: 'Undertakings and Documents',
    href: '/documents',
    icon: FolderCheck,
    description: 'Affidavits & compliance files',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    description: 'Approval analytics & charts',
  },
  {
    name: 'Audit Log',
    href: '/audit-log',
    icon: ShieldAlert,
    description: 'Chronological activity history',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App preferences & storage',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole, sidebarOpen, setSidebarOpen, applications } = useAicte();
  const currentRoleInfo = ROLE_CONFIGS[currentRole];

  // Dynamic counts
  const totalAppsCount = applications.length;

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                AICTE Approval Monitor
              </span>
              <span className="text-xs font-medium text-slate-500">
                Approval Portal • AY 2026-27
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-700 lg:hidden rounded-lg hover:bg-slate-100"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        isActive
                          ? 'text-blue-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.href === '/applications' ? totalAppsCount : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status & Role Card */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                Active Session
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-200 shadow-2xs">
                {currentRoleInfo.shortCode}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {currentRole}
            </div>
            <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
              {currentRoleInfo.description}
            </p>

            <div className="mt-3 pt-2.5 border-t border-blue-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <HardDrive className="h-3 w-3 text-emerald-600" />
                Browser Storage (Offline)
              </span>
              <span className="text-emerald-700 font-medium">Ready</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

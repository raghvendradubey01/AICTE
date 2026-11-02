'use client';

import React from 'react';
import { useAicte } from '@/context/AicteContext';
import { ROLE_CONFIGS } from '@/data/mockAicteData';
import { UserCheck } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, badge, action }: PageHeaderProps) {
  const { currentRole } = useAicte();
  const roleConfig = ROLE_CONFIGS[currentRole];

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
          {badge && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs">
          <UserCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>Role View:</span>
          <span className="font-semibold text-blue-700">{roleConfig.label}</span>
        </div>

        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

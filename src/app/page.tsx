'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useAicte } from '@/context/AicteContext';
import { ROLE_CONFIGS } from '@/data/mockAicteData';
import { RegionalOfficerDashboard } from '@/components/dashboard/RegionalOfficerDashboard';
import { BureauOfficerDashboard } from '@/components/dashboard/BureauOfficerDashboard';
import { EvcCommitteeDashboard } from '@/components/dashboard/EvcCommitteeDashboard';
import { InstitutionDashboard } from '@/components/dashboard/InstitutionDashboard';
import { ApplicationDetailDrawer } from '@/components/applications/ApplicationDetailDrawer';

export default function DashboardPage() {
  const { currentRole, setRole, applications } = useAicte();
  const roleConfig = ROLE_CONFIGS[currentRole];

  // Drawer state for reviewing applications directly from any dashboard
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const selectedApp = applications.find((a) => a.id === selectedAppId) || null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${currentRole} Dashboard`}
        description={
          currentRole === 'Regional Officer'
            ? 'Regional scrutiny desk: review open applications, inspect stage distribution, and act on pending cases.'
            : currentRole === 'Bureau Officer'
            ? 'AICTE Headquarters Bureau: national caseload overview, regional overdue analytics, and supervisory escalations.'
            : currentRole === 'EVC/SAC Committee'
            ? 'Expert Visiting Committee & Standing Appeals Committee: scheduled campus inspection queue and hearings.'
            : 'Institution portal: real-time application workflow tracker, progress meter, and next required actions.'
        }
      />

      {/* Role Notice & Quick Persona Switcher Strip */}
      <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Viewing Portal As:
              </span>
              <strong className="text-sm text-slate-900">{currentRole}</strong>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                {roleConfig.shortCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {roleConfig.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Quick switch:</span>
          {(['Institution', 'Regional Officer', 'Bureau Officer', 'EVC/SAC Committee'] as const).map(
            (r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  currentRole === r
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r === 'EVC/SAC Committee' ? 'EVC' : r}
              </button>
            )
          )}
        </div>
      </div>

      {/* ROLE-SPECIFIC DASHBOARD VIEWS */}
      {currentRole === 'Regional Officer' && (
        <RegionalOfficerDashboard
          onSelectApplication={(id) => setSelectedAppId(id)}
        />
      )}

      {currentRole === 'Bureau Officer' && (
        <BureauOfficerDashboard
          onSelectApplication={(id) => setSelectedAppId(id)}
        />
      )}

      {currentRole === 'EVC/SAC Committee' && (
        <EvcCommitteeDashboard
          onSelectApplication={(id) => setSelectedAppId(id)}
        />
      )}

      {currentRole === 'Institution' && (
        <InstitutionDashboard
          onSelectApplication={(id) => setSelectedAppId(id)}
        />
      )}

      {/* Application Detail Drawer (opens from any dashboard row) */}
      <ApplicationDetailDrawer
        application={selectedApp}
        onClose={() => setSelectedAppId(null)}
      />
    </div>
  );
}

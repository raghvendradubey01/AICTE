'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  AlertTriangle,
  CalendarCheck2,
  Calendar,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { ApplicationItem, Region } from '@/types/aicte';
import { useAicte } from '@/context/AicteContext';
import { getRouteStages } from '@/data/rules';
import { calculateDeadline, formatDateDisplay } from '@/lib/deadlineEngine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface RegionalOfficerDashboardProps {
  onSelectApplication: (appId: string) => void;
}

export function RegionalOfficerDashboard({ onSelectApplication }: RegionalOfficerDashboardProps) {
  const { applications, demoDate } = useAicte();
  const [selectedRegion, setSelectedRegion] = useState<Region>('North');

  // Filter applications by the regional officer's region
  const regionalApps = applications.filter((app) => app.region === selectedRegion);

  // 1. Open cases in their region
  const openCases = regionalApps.filter((app) => app.currentStage !== 'Completed');

  // Calculate deadline metrics using the demo clock
  let dueSoonCount = 0;
  let overdueCount = 0;

  openCases.forEach((app) => {
    const stages = getRouteStages(app.route);
    const stageRule = stages.find((s) => s.name === app.currentStage);
    const slaDays = stageRule ? stageRule.slaDays : 15;
    const dl = calculateDeadline(app.stageStartDate, slaDays, demoDate);
    if (dl.isOverdue) overdueCount++;
    else if (dl.isDueSoon) dueSoonCount++;
  });

  // 4. EVC pending in their region
  const evcPending = regionalApps.filter(
    (app) => app.currentStage === 'EVC' || app.currentStage === 'SAC/SHC'
  ).length;

  // Bar chart of cases per stage in this region
  const stageCounts = [
    {
      stage: 'Scrutiny',
      count: regionalApps.filter((a) => a.currentStage === 'Scrutiny').length,
    },
    {
      stage: 'EVC',
      count: regionalApps.filter((a) => a.currentStage === 'EVC').length,
    },
    {
      stage: 'SAC/SHC',
      count: regionalApps.filter((a) => a.currentStage === 'SAC/SHC').length,
    },
    {
      stage: 'Completed',
      count: regionalApps.filter((a) => a.currentStage === 'Completed' || a.status === 'Completed').length,
    },
  ];

  // "Cases needing action" table: Open cases that are at Scrutiny or Due soon / Overdue / Returned
  const casesNeedingAction = openCases.filter(
    (app) => app.currentStage === 'Scrutiny' || app.status === 'Returned'
  );

  return (
    <div className="space-y-6">
      {/* Region Selector Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Regional Office Scrutiny Desk
            </h3>
            <p className="text-xs text-slate-500">
              Showing jurisdictional caseload for {selectedRegion} Region
            </p>
          </div>
        </div>

        {/* Region Switcher Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1">Switch Region:</span>
          {(['North', 'South', 'East', 'West', 'Central'] as Region[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRegion(r)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                selectedRegion === r
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Cards: Open cases, Due soon, Overdue, EVC pending */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Open cases */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Open Cases
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{openCases.length}</span>
            <span className="text-xs font-medium text-slate-500">
              of {regionalApps.length} in {selectedRegion}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Under active regional review</p>
        </div>

        {/* Due soon */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Due Soon (≤ 7 Days)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-900">{dueSoonCount}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Approaching SLA
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Demo Date: {formatDateDisplay(demoDate)}</p>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overdue Cases
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-900">{overdueCount}</span>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {overdueCount > 0 ? 'Breached SLA' : 'Zero Breaches'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Requires urgent action</p>
        </div>

        {/* EVC pending */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              EVC Pending
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <CalendarCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-900">{evcPending}</span>
            <span className="text-xs font-medium text-indigo-600">Inspection queue</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Awaiting committee visits</p>
        </div>
      </div>

      {/* Bar Chart of Cases Per Stage */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Cases Per Workflow Stage ({selectedRegion} Region)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Live distribution of regional applications across processing pipeline
            </p>
          </div>
          <span className="rounded-lg bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-semibold border border-blue-200">
            {selectedRegion} Caseload
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  borderColor: '#e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" name="Applications" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* "Cases Needing Action" Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Cases Needing Action ({casesNeedingAction.length})
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Applications requiring Regional Officer scrutiny approval, deficiency checks, or return decisions
            </p>
          </div>
          <Link
            href="/applications"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>All Applications</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-4">Due Date & Days Left</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Decision Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {casesNeedingAction.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-1" />
                    <p className="font-semibold text-slate-700">No pending scrutiny actions in {selectedRegion} Region!</p>
                    <p className="text-xs text-slate-400">All cases in this region are up to date.</p>
                  </td>
                </tr>
              ) : (
                casesNeedingAction.map((app) => {
                  const stages = getRouteStages(app.route);
                  const stageRule = stages.find((s) => s.name === app.currentStage);
                  const slaDays = stageRule ? stageRule.slaDays : 15;
                  const dl = calculateDeadline(app.stageStartDate, slaDays, demoDate);

                  return (
                    <tr
                      key={app.id}
                      onClick={() => onSelectApplication(app.id)}
                      className="group cursor-pointer hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {app.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{app.institutionName}</span>
                        <span className="text-[11px] text-slate-500">{app.program} • {app.state}</span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {app.currentStage}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-semibold text-slate-900">
                          <Calendar className="h-3 w-3 text-blue-600" />
                          <span>{dl.dueDateFormatted}</span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs mt-0.5 ${dl.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${dl.dotColor}`} />
                          <span>{dl.status}</span>
                          <span>({dl.displayText})</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            app.status === 'Returned'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectApplication(app.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-colors"
                        >
                          <span>Review & Decide</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

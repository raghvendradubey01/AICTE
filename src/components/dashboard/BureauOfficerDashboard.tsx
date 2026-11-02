'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  AlertTriangle,
  CalendarCheck2,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Award,
  AlertCircle,
  Building,
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
  Legend,
} from 'recharts';

interface BureauOfficerDashboardProps {
  onSelectApplication: (appId: string) => void;
}

export function BureauOfficerDashboard({ onSelectApplication }: BureauOfficerDashboardProps) {
  const { applications, demoDate, escalatedCases } = useAicte();

  // Cards for all regions nationwide
  const openCases = applications.filter((app) => app.currentStage !== 'Completed');

  let dueSoonCount = 0;
  let overdueCount = 0;

  // Region breakdown for overdue cases
  const regionOverdueMap: Record<Region, number> = {
    North: 0,
    South: 0,
    East: 0,
    West: 0,
    Central: 0,
  };

  openCases.forEach((app) => {
    const stages = getRouteStages(app.route);
    const stageRule = stages.find((s) => s.name === app.currentStage);
    const slaDays = stageRule ? stageRule.slaDays : 15;
    const dl = calculateDeadline(app.stageStartDate, slaDays, demoDate);

    if (dl.isOverdue) {
      overdueCount++;
      if (regionOverdueMap[app.region] !== undefined) {
        regionOverdueMap[app.region]++;
      }
    } else if (dl.isDueSoon) {
      dueSoonCount++;
    }
  });

  const evcPending = applications.filter(
    (app) => app.currentStage === 'EVC' || app.currentStage === 'SAC/SHC'
  ).length;

  // Region-wise overdue chart data
  const regionOverdueChartData = (['North', 'South', 'East', 'West', 'Central'] as Region[]).map(
    (region) => ({
      region,
      overdue: regionOverdueMap[region],
      openTotal: openCases.filter((a) => a.region === region).length,
    })
  );

  return (
    <div className="space-y-6">
      {/* Escalation Banner */}
      {escalatedCases.length > 0 ? (
        <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/90 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <ShieldAlert className="h-5 w-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-rose-950">
                    {escalatedCases.length} {escalatedCases.length === 1 ? 'case' : 'cases'} escalated since yesterday
                  </h3>
                  <span className="rounded-full bg-rose-600 text-white px-2 py-0.5 text-[10px] font-bold">
                    Urgent Bureau Oversight
                  </span>
                </div>
                <p className="text-xs text-rose-700 mt-0.5">
                  These applications exceeded the 3-day statutory grace period past their SLA deadlines and were automatically escalated from Regional Officers to AICTE HQ.
                </p>
              </div>
            </div>

            <a
              href="#escalated-cases-section"
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs self-start sm:self-center"
            >
              <span>Review Escalations</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-emerald-600" />
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                0 cases escalated since yesterday
              </h4>
              <p className="text-xs text-emerald-700">
                No active applications currently exceed the 3-day statutory overdue escalation limit under simulated date {formatDateDisplay(demoDate)}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4 Cards for all regions nationwide */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Open cases */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Open Cases (Nationwide)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{openCases.length}</span>
            <span className="text-xs font-medium text-slate-500">across 5 regions</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Total active processing pipeline</p>
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
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Critical Watch
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Simulated Date: {formatDateDisplay(demoDate)}</p>
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
              SLA Breached
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Exceeded statutory timeline</p>
        </div>

        {/* EVC pending */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              EVC & SAC Pending
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <CalendarCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-900">{evcPending}</span>
            <span className="text-xs font-medium text-indigo-600">Committee queue</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">National inspection pool</p>
        </div>
      </div>

      {/* Region-wise Overdue Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Region-Wise Overdue Breakdown
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison of overdue cases vs total open caseload across AICTE Regional Offices
            </p>
          </div>
          <span className="rounded-lg bg-slate-100 text-slate-600 px-2.5 py-1 text-xs font-semibold">
            All 5 Regions
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionOverdueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="region" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  borderColor: '#e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="openTotal" name="Total Open Cases" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="overdue" name="Overdue Cases" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* List of Cases Escalated to Bureau Officer */}
      <div id="escalated-cases-section" className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <span>Cases Escalated to Bureau Officer ({escalatedCases.length})</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Applications overdue by &gt; 3 days transferred to AICTE Headquarters Bureau for supervisory intervention
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {escalatedCases.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Award className="h-10 w-10 mx-auto text-emerald-500 mb-2" />
              <p className="font-bold text-slate-800 text-sm">No cases currently escalated</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Advance the Demo Clock (+7d or +30d) in the top bar to test statutory escalation!
              </p>
            </div>
          ) : (
            escalatedCases.map((app) => {
              const stages = getRouteStages(app.route);
              const stageRule = stages.find((s) => s.name === app.currentStage);
              const slaDays = stageRule ? stageRule.slaDays : 15;
              const dl = calculateDeadline(app.stageStartDate, slaDays, demoDate);

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app.id)}
                  className="p-5 hover:bg-rose-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-bold text-xs">
                      ESC
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {app.id}
                        </span>
                        <h5 className="text-sm font-bold text-slate-900">{app.institutionName}</h5>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {app.region} Region
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>Current Stage: <strong className="text-slate-800">{app.currentStage}</strong></span>
                        <span>•</span>
                        <span>Due Date: <strong>{dl.dueDateFormatted}</strong></span>
                        <span>•</span>
                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {Math.abs(dl.daysLeft)} days overdue
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectApplication(app.id);
                      }}
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Intervene / Resolve</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

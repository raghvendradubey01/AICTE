'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  DownloadCloud,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building,
  Calendar,
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  FileSpreadsheet,
  HelpCircle,
  Eye,
  Info,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useAicte } from '@/context/AicteContext';
import { ApplicationItem, Region } from '@/types/aicte';
import { getRouteStages } from '@/data/rules';
import { calculateDeadline, formatDateDisplay } from '@/lib/deadlineEngine';
import { ApplicationDetailDrawer } from '@/components/applications/ApplicationDetailDrawer';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
} from 'recharts';

export default function ReportsPage() {
  const { applications, demoDate, slaConfig } = useAicte();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'top10' | 'allPending'>('top10');

  const selectedApp = applications.find((a) => a.id === selectedAppId) || null;

  // Helper to calculate age in days relative to current demoDate
  const getCaseAgeDays = (stageStartDate: string): number => {
    const start = new Date(stageStartDate + 'T00:00:00');
    const current = new Date(demoDate + 'T00:00:00');
    const diff = current.getTime() - start.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  // Helper to get deadline info for an application
  const getAppDeadline = (app: ApplicationItem) => {
    const stages = getRouteStages(app.route, slaConfig);
    const stageRule = stages.find((s) => s.name === app.currentStage);
    const slaDays = stageRule ? stageRule.slaDays : 15;
    return {
      deadline: calculateDeadline(app.stageStartDate, slaDays, demoDate),
      slaDays,
      role: stageRule?.role || 'Regional Officer',
    };
  };

  // 1. Pending applications (status is not Completed or Approved)
  const pendingApplications = useMemo(() => {
    return applications
      .filter((app) => app.currentStage !== 'Completed' && app.status !== 'Completed' && app.status !== 'Approved')
      .map((app) => {
        const { deadline, slaDays, role } = getAppDeadline(app);
        const ageDays = getCaseAgeDays(app.stageStartDate);
        return {
          ...app,
          ageDays,
          deadline,
          slaDays,
          responsibleRole: role,
        };
      })
      .sort((a, b) => b.ageDays - a.ageDays); // sorted descending by age
  }, [applications, demoDate, slaConfig]);

  // Top 10 oldest pending cases
  const oldest10Pending = useMemo(() => {
    return pendingApplications.slice(0, 10);
  }, [pendingApplications]);

  const displayCases = viewMode === 'top10' ? oldest10Pending : pendingApplications;

  // 2. Region-wise pendency and ageing metrics
  const REGIONS: Region[] = ['North', 'South', 'East', 'West', 'Central'];

  const regionWiseData = useMemo(() => {
    return REGIONS.map((region) => {
      const regionApps = applications.filter((app) => app.region === region);
      const regionPending = regionApps.filter(
        (app) => app.currentStage !== 'Completed' && app.status !== 'Completed' && app.status !== 'Approved'
      );
      const regionCompleted = regionApps.filter(
        (app) => app.currentStage === 'Completed' || app.status === 'Completed' || app.status === 'Approved'
      );

      // Calculate average age in days of pending cases
      let totalAge = 0;
      let overdueCount = 0;

      regionPending.forEach((app) => {
        const age = getCaseAgeDays(app.stageStartDate);
        totalAge += age;
        const { deadline } = getAppDeadline(app);
        if (deadline.isOverdue) {
          overdueCount++;
        }
      });

      const avgAge = regionPending.length > 0 ? Math.round((totalAge / regionPending.length) * 10) / 10 : 0;

      return {
        region,
        pending: regionPending.length,
        completed: regionCompleted.length,
        total: regionApps.length,
        avgAge, // Average days pending
        overdue: overdueCount,
      };
    });
  }, [applications, demoDate, slaConfig]);

  // 3. Stage-wise bottleneck metrics
  const STAGES = ['Scrutiny', 'EVC', 'SAC/SHC'];

  const stageBottleneckData = useMemo(() => {
    return STAGES.map((stageName) => {
      const stageCases = applications.filter(
        (app) => app.currentStage === stageName && app.status !== 'Completed'
      );

      let totalAge = 0;
      let overdueCount = 0;
      let dueSoonCount = 0;

      stageCases.forEach((app) => {
        const age = getCaseAgeDays(app.stageStartDate);
        totalAge += age;
        const { deadline } = getAppDeadline(app);
        if (deadline.isOverdue) overdueCount++;
        else if (deadline.isDueSoon) dueSoonCount++;
      });

      const avgAge = stageCases.length > 0 ? Math.round((totalAge / stageCases.length) * 10) / 10 : 0;
      const configuredSla = slaConfig[stageName as keyof typeof slaConfig] || 15;

      return {
        stage: stageName,
        activeCases: stageCases.length,
        avgDaysInStage: avgAge,
        slaLimit: configuredSla,
        overdueCases: overdueCount,
        dueSoonCases: dueSoonCount,
        // Utilization ratio (% of SLA target consumed on average)
        slaUtilization: configuredSla > 0 ? Math.round((avgAge / configuredSla) * 100) : 0,
      };
    });
  }, [applications, demoDate, slaConfig]);

  // Identify worst bottleneck stage
  const highestBottleneck = useMemo(() => {
    return [...stageBottleneckData].sort((a, b) => b.avgDaysInStage - a.avgDaysInStage)[0];
  }, [stageBottleneckData]);

  // Overall KPI statistics
  const totalAppsCount = applications.length;
  const totalPendingCount = pendingApplications.length;
  const totalCompletedCount = applications.filter(
    (a) => a.currentStage === 'Completed' || a.status === 'Completed' || a.status === 'Approved'
  ).length;
  const totalOverdueCount = pendingApplications.filter((a) => a.deadline.isOverdue).length;
  const overallAvgAge =
    totalPendingCount > 0
      ? Math.round((pendingApplications.reduce((acc, curr) => acc + curr.ageDays, 0) / totalPendingCount) * 10) / 10
      : 0;

  // 4. Download CSV Handler
  const handleDownloadCsv = () => {
    // Generate CSV for oldest pending cases (or all pending if user chose)
    const casesToExport = displayCases;
    const headers = [
      'Case ID',
      'Institution Name',
      'Region',
      'Route',
      'Current Stage',
      'Stage Start Date',
      'Age (Days)',
      'Statutory SLA Target (Days)',
      'Due Date',
      'Days Left',
      'SLA Status',
      'Responsible Role',
    ];

    const rows = casesToExport.map((item) => {
      return [
        `"${item.id}"`,
        `"${item.institutionName.replace(/"/g, '""')}"`,
        `"${item.region}"`,
        `"${item.route}"`,
        `"${item.currentStage}"`,
        `"${item.stageStartDate}"`,
        item.ageDays,
        item.slaDays,
        `"${item.deadline.dueDate}"`,
        item.deadline.daysLeft,
        `"${item.deadline.status}"`,
        `"${item.responsibleRole}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aicte-oldest-pending-cases-${demoDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Region-wise pendency and ageing analysis, stage-wise bottleneck tracking, and regulatory SLA compliance reports."
        action={
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-all active:scale-95"
          >
            <DownloadCloud className="h-4 w-4" />
            Download CSV ({displayCases.length} cases)
          </button>
        }
      />

      {/* Download Success Notification */}
      {downloadSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm font-medium text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>
              <strong>CSV exported successfully!</strong> Downloaded {displayCases.length} oldest pending cases calculated as of simulated date ({formatDateDisplay(demoDate)}).
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadSuccess(false)}
            className="text-xs text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Applications
            </span>
            <Building className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalAppsCount}</div>
          <span className="mt-1 text-xs text-slate-500 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">{totalCompletedCount} approved</span>
            <span>•</span>
            <span className="font-semibold text-blue-600">{totalPendingCount} pending</span>
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average Pendency Age
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{overallAvgAge} Days</div>
          <span className="mt-1 text-xs text-slate-500">
            Average days cases have spent in current stage
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overdue Applications
            </span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">{totalOverdueCount}</div>
          <span className="mt-1 text-xs text-rose-600/90 font-medium">
            Breached statutory SLA target dates
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Primary Bottleneck Stage
            </span>
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {highestBottleneck ? highestBottleneck.stage : 'None'}
          </div>
          <span className="mt-1 text-xs text-slate-500">
            {highestBottleneck
              ? `Avg ${highestBottleneck.avgDaysInStage}d per case (SLA: ${highestBottleneck.slaLimit}d)`
              : 'All stages clear'}
          </span>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Region-wise Pendency & Ageing */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Region-Wise Pendency and Ageing
                </h3>
                <p className="text-xs text-slate-500">
                  Active pending case counts compared with average age in days across all AICTE regions
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                Live Demo Date: {formatDateDisplay(demoDate)}
              </span>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={regionWiseData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="region"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: 'Cases (Count)',
                      angle: -90,
                      position: 'insideLeft',
                      fontSize: 11,
                      fill: '#94a3b8',
                      dy: 40,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: 'Average Age (Days)',
                      angle: 90,
                      position: 'insideRight',
                      fontSize: 11,
                      fill: '#94a3b8',
                      dy: 50,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Average Age') return [`${value} days`, name];
                      return [`${value} cases`, name];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="pending"
                    name="Pending Cases"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="completed"
                    name="Completed Cases"
                    fill="#cbd5e1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgAge"
                    name="Average Age"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Region Quick Breakdown Strip */}
          <div className="grid grid-cols-5 gap-2 pt-4 border-t border-slate-100 mt-2 text-center">
            {regionWiseData.map((r) => (
              <div key={r.region} className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 block">{r.region}</span>
                <span className="text-xs text-blue-600 font-bold">{r.pending} pending</span>
                <span className="text-[10px] text-slate-500 block">Avg {r.avgAge}d</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Stage-wise Bottleneck Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Stage-Wise Bottleneck Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Average days spent at each stage versus configured statutory SLA limit days
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                SLA Config Active
              </span>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stageBottleneckData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="stage"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: 'Days / Count',
                      angle: -90,
                      position: 'insideLeft',
                      fontSize: 11,
                      fill: '#94a3b8',
                      dy: 30,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Avg Days Spent') return [`${value} days`, name];
                      if (name === 'Configured SLA Target') return [`${value} days limit`, name];
                      if (name === 'Active Cases') return [`${value} cases`, name];
                      return [value, name];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="activeCases"
                    name="Active Cases"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="avgDaysInStage"
                    name="Avg Days Spent"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="slaLimit"
                    name="Configured SLA Target"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stage Bottleneck Diagnosis Banner */}
          <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 mt-2 flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">Bottleneck Diagnosis: </span>
              {highestBottleneck ? (
                <span>
                  The <strong>{highestBottleneck.stage}</strong> stage has {highestBottleneck.activeCases} active applications with an average turnaround of{' '}
                  <strong>{highestBottleneck.avgDaysInStage} days</strong> (configured SLA limit: {highestBottleneck.slaLimit} days,{' '}
                  <span className={highestBottleneck.overdueCases > 0 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                    {highestBottleneck.overdueCases} overdue
                  </span>
                  ). Changes in Settings &gt; SLA Days dynamically update this chart.
                </span>
              ) : (
                'Zero bottleneck delays detected across workflow routes.'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE: 10 OLDEST PENDING CASES */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                10 Oldest Pending Cases
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Applications ranked strictly by age (days elapsed in current stage) requiring priority regulatory attention
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="inline-flex rounded-xl bg-slate-200/70 p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('top10')}
                className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                  viewMode === 'top10'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Top 10 Oldest
              </button>
              <button
                type="button"
                onClick={() => setViewMode('allPending')}
                className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                  viewMode === 'allPending'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Pending ({pendingApplications.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <DownloadCloud className="h-3.5 w-3.5 text-blue-600" />
              Download CSV
            </button>
          </div>
        </div>

        {/* Table Content */}
        {displayCases.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              No Pending Cases Found
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All applications across all regions have received final determinations or have been completed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Rank & Case ID</th>
                  <th className="py-3 px-4">Institution Name</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4 text-center">Age (Days)</th>
                  <th className="py-3 px-4">Statutory Due Date</th>
                  <th className="py-3 px-4 text-center">SLA Status</th>
                  <th className="py-3 px-4">Officer in Charge</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayCases.map((app, index) => {
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedAppId(app.id)}
                    >
                      {/* Rank & Case ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                            #{index + 1}
                          </span>
                          <span className="text-blue-600 hover:underline">{app.id}</span>
                        </div>
                      </td>

                      {/* Institution Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                          {app.institutionName}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Route: {app.route}
                        </span>
                      </td>

                      {/* Region */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {app.region}
                        </span>
                      </td>

                      {/* Current Stage */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {app.currentStage}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Since {formatDateDisplay(app.stageStartDate)}
                        </span>
                      </td>

                      {/* Age in Days */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                          <Clock className="h-3 w-3 text-amber-600" />
                          {app.ageDays} days
                        </span>
                      </td>

                      {/* Statutory Due Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">
                          {app.deadline.dueDateFormatted}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          SLA Allowance: {app.slaDays} days
                        </span>
                      </td>

                      {/* SLA Status Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${app.deadline.pillClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${app.deadline.dotColor}`} />
                          {app.deadline.status} ({app.deadline.displayText})
                        </span>
                      </td>

                      {/* Officer in Charge */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                        {app.responsibleRole}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppId(app.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Displaying {displayCases.length} of {pendingApplications.length} pending cases. Data automatically synchronizes with the simulated Demo Clock.
          </span>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
          >
            <DownloadCloud className="h-3.5 w-3.5" />
            Export table to CSV
          </button>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      <ApplicationDetailDrawer
        application={selectedApp}
        onClose={() => setSelectedAppId(null)}
      />
    </div>
  );
}
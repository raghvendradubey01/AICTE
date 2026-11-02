'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Flame,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useAicte } from '@/context/AicteContext';
import { ApplicationItem, Region, ApplicationStatus } from '@/types/aicte';
import { ApplicationDetailDrawer } from '@/components/applications/ApplicationDetailDrawer';
import { getRouteStages } from '@/data/rules';
import { calculateDeadline, formatDateDisplay, DeadlineStatus } from '@/lib/deadlineEngine';

export default function ApplicationsPage() {
  const { currentRole, applications, demoDate } = useAicte();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deadlineFilter, setDeadlineFilter] = useState<string>('All');

  // Selected application for detail panel slide-over
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Active selected application instance
  const selectedApplication =
    applications.find((app) => app.id === selectedAppId) || null;

  // Filter logic
  const filteredApplications = applications.filter((app) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      app.id.toLowerCase().includes(term) ||
      app.institutionName.toLowerCase().includes(term) ||
      (app.state && app.state.toLowerCase().includes(term));

    const matchesRegion =
      regionFilter === 'All' || app.region === regionFilter;

    const matchesStage =
      stageFilter === 'All' || app.currentStage === stageFilter;

    const matchesStatus =
      statusFilter === 'All' || app.status === statusFilter;

    // Deadline engine filter based on demoDate
    let matchesDeadline = true;
    if (deadlineFilter !== 'All') {
      if (app.currentStage === 'Completed') {
        matchesDeadline = deadlineFilter === 'Completed';
      } else {
        const stages = getRouteStages(app.route);
        const stageRule = stages.find((s) => s.name === app.currentStage);
        const slaDays = stageRule ? stageRule.slaDays : 15;
        const dl = calculateDeadline(app.stageStartDate, slaDays, demoDate);
        matchesDeadline = dl.status === deadlineFilter;
      }
    }

    return matchesSearch && matchesRegion && matchesStage && matchesStatus && matchesDeadline;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Completed':
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Returned':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'In Progress':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getRegionBadge = (region: Region) => {
    switch (region) {
      case 'North':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'South':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'East':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'West':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Central':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Search, filter, and track technical approval applications across regional offices, workflows, and inspection stages."
        badge={`${applications.length} Total Registered`}
      />

      {/* SEARCH AND FILTERS BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        {/* Top row: search + quick reset */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID (e.g. AP-1001), College Name, or State..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2 text-xs sm:text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center text-xs text-slate-500">
            <span>
              Showing <strong>{filteredApplications.length}</strong> of{' '}
              {applications.length} applications
            </span>
            {(searchTerm ||
              regionFilter !== 'All' ||
              stageFilter !== 'All' ||
              statusFilter !== 'All' ||
              deadlineFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setRegionFilter('All');
                  setStageFilter('All');
                  setStatusFilter('All');
                  setDeadlineFilter('All');
                }}
                className="ml-2 font-bold text-blue-600 hover:text-blue-800 underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns / Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Region Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter by Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 font-medium focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Regions (5)</option>
              <option value="North">North Region</option>
              <option value="South">South Region</option>
              <option value="East">East Region</option>
              <option value="West">West Region</option>
              <option value="Central">Central Region</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter by Stage
            </label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 font-medium focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Stages</option>
              <option value="Scrutiny">Scrutiny (SLA 15d)</option>
              <option value="EVC">EVC (SLA 10d)</option>
              <option value="SAC/SHC">SAC/SHC (SLA 7d)</option>
              <option value="Completed">Completed / Approved</option>
            </select>
          </div>

          {/* Deadline Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Deadline SLA Status
            </label>
            <select
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 font-medium focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Deadlines</option>
              <option value="On track">🟢 On track (&gt; 7 days left)</option>
              <option value="Due soon">🟡 Due soon (≤ 7 days left)</option>
              <option value="Overdue">🔴 Overdue (&lt; 0 days)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Processing Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 font-medium focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Returned">Returned with Reason</option>
              <option value="Completed">Completed / Approved</option>
            </select>
          </div>
        </div>
      </div>

      {/* SEARCHABLE APPLICATIONS TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Institution Name</th>
                <th className="py-3.5 px-3">Region</th>
                <th className="py-3.5 px-4">Workflow Route</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4">Due Date & Days Left</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No applications match your criteria</p>
                    <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const stages = getRouteStages(app.route);
                  const currentStageRule = stages.find((s) => s.name === app.currentStage);
                  const slaDays = currentStageRule ? currentStageRule.slaDays : 15;

                  // Universal Deadline Engine calculation using demoDate
                  const deadline =
                    app.currentStage !== 'Completed'
                      ? calculateDeadline(app.stageStartDate, slaDays, demoDate)
                      : null;

                  return (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className="group cursor-pointer hover:bg-blue-50/40 transition-colors"
                    >
                      {/* 1. ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        <span className="rounded-md bg-blue-50 px-2 py-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {app.id}
                        </span>
                      </td>

                      {/* 2. Institution Name */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-slate-900 line-clamp-1 block">
                          {app.institutionName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {app.program} • {app.state}
                        </span>
                      </td>

                      {/* 3. Region */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-[11px] font-semibold ${getRegionBadge(
                            app.region
                          )}`}
                        >
                          {app.region}
                        </span>
                      </td>

                      {/* 4. Route */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          {app.route}
                        </span>
                      </td>

                      {/* 5. Current Stage */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              app.currentStage === 'Completed'
                                ? 'text-emerald-700'
                                : 'text-slate-900'
                            }`}
                          >
                            {app.currentStage}
                          </span>
                          {currentStageRule && (
                            <span className="text-[10px] text-slate-400">
                              ({currentStageRule.role.split(' ')[0]})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6. Due Date & Days Left with colour badges (green, amber, red) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {app.currentStage === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        ) : deadline ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <Calendar className="h-3.5 w-3.5 text-blue-600" />
                              <span>{deadline.dueDateFormatted}</span>
                            </div>

                            {/* Color badge: Green (On track), Amber (Due soon), Red (Overdue) */}
                            <div>
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${deadline.badgeClass}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${deadline.dotColor}`} />
                                <span>{deadline.status}</span>
                                <span className="font-medium">({deadline.displayText})</span>
                              </span>
                            </div>
                          </div>
                        ) : null}
                      </td>

                      {/* 7. Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status === 'Completed' && <CheckCircle2 className="h-3 w-3" />}
                          {app.status === 'Returned' && <AlertTriangle className="h-3 w-3" />}
                          {app.status === 'In Progress' && <Clock className="h-3 w-3" />}
                          {app.status}
                        </span>
                      </td>

                      {/* 8. Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppId(app.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          <span>Review</span>
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

      {/* DETAIL PANEL SLIDE-OVER */}
      <ApplicationDetailDrawer
        application={selectedApplication}
        onClose={() => setSelectedAppId(null)}
      />
    </div>
  );
}

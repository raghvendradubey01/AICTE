'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarCheck2,
  Calendar,
  Building,
  MapPin,
  Clock,
  ShieldCheck,
  Video,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { ApplicationItem } from '@/types/aicte';
import { useAicte } from '@/context/AicteContext';
import { getRouteStages } from '@/data/rules';
import { calculateDeadline, formatDateDisplay } from '@/lib/deadlineEngine';

interface EvcCommitteeDashboardProps {
  onSelectApplication: (appId: string) => void;
}

export function EvcCommitteeDashboard({ onSelectApplication }: EvcCommitteeDashboardProps) {
  const { applications, demoDate } = useAicte();

  // EVC / SAC Committee only views the EVC and SAC/SHC inspection queue
  const evcQueue = applications.filter(
    (app) => app.currentStage === 'EVC' || app.currentStage === 'SAC/SHC'
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  EVC & SAC Inspection Queue
                </h3>
                <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[11px] font-bold">
                  {evcQueue.length} Active Inspections
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical campus verification visits and virtual hearings under simulated date: {formatDateDisplay(demoDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The EVC Queue Table with Due Dates */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900">
            Pending Inspection Hearings ({evcQueue.length})
          </h4>
          <span className="text-xs text-slate-400 font-medium">
            Due dates calculated via universal SLA deadline engine
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {evcQueue.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-500 mb-2" />
              <p className="font-bold text-slate-800 text-sm">No inspections currently in queue</p>
              <p className="text-xs text-slate-500 mt-0.5">
                When applications are approved through scrutiny, they will appear here.
              </p>
            </div>
          ) : (
            evcQueue.map((app) => {
              const stages = getRouteStages(app.route);
              const stageRule = stages.find((s) => s.name === app.currentStage);
              const slaDays = stageRule ? stageRule.slaDays : 10;
              const dl = calculateDeadline(app.stageStartDate, slaDays, demoDate);

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app.id)}
                  className="p-5 hover:bg-blue-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {app.id}
                        </span>
                        <h5 className="text-sm font-bold text-slate-900">{app.institutionName}</h5>
                        <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                          {app.currentStage} Stage
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {app.region} Region ({app.state})
                        </span>
                        <span>•</span>
                        <span>Program: {app.program}</span>
                        <span>•</span>
                        <span>Mode: Physical On-site Visit</span>
                      </div>
                    </div>
                  </div>

                  {/* Due date & Days left */}
                  <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-600">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>Inspection Due:</span>
                        <strong className="text-slate-900">{dl.dueDateFormatted}</strong>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs mt-1 ${dl.badgeClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${dl.dotColor}`} />
                        <span>{dl.status}</span>
                        <span className="font-medium">({dl.displayText})</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectApplication(app.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-colors self-end"
                    >
                      <span>Review & Inspect</span>
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

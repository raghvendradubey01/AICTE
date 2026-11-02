'use client';

import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, UserCheck, Calendar } from 'lucide-react';
import { ApplicationItem } from '@/types/aicte';
import { getRouteStages } from '@/data/rules';
import { useAicte } from '@/context/AicteContext';
import { calculateDeadline, formatDateDisplay } from '@/lib/deadlineEngine';

interface StageTimelineProps {
  application: ApplicationItem;
}

export function StageTimeline({ application }: StageTimelineProps) {
  const { demoDate } = useAicte();
  const stages = getRouteStages(application.route);
  const isCompleted = application.status === 'Completed' || application.currentStage === 'Completed';
  const isReturned = application.status === 'Returned';

  // Find index of current stage in route
  const currentStageIndex = stages.findIndex((s) => s.name === application.currentStage);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Assigned Workflow Route
          </span>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{application.route}</span>
            <span className="text-xs font-normal text-slate-500">
              ({stages.length} {stages.length === 1 ? 'Stage' : 'Stages'})
            </span>
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isReturned
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
            {isReturned && <AlertTriangle className="h-3.5 w-3.5" />}
            {!isCompleted && !isReturned && <Clock className="h-3.5 w-3.5" />}
            {application.status}
          </span>
        </div>
      </div>

      {/* Stage Progression Steps */}
      <div className="space-y-4">
        {stages.map((stage, idx) => {
          let stageStatus: 'done' | 'current' | 'upcoming' = 'upcoming';

          if (isCompleted) {
            stageStatus = 'done';
          } else if (idx < currentStageIndex) {
            stageStatus = 'done';
          } else if (idx === currentStageIndex) {
            stageStatus = 'current';
          } else {
            stageStatus = 'upcoming';
          }

          // Single deadline engine calculation for the active stage using demoDate
          const deadline =
            stageStatus === 'current'
              ? calculateDeadline(application.stageStartDate, stage.slaDays, demoDate)
              : null;

          return (
            <div
              key={stage.name}
              className={`relative rounded-xl border p-4 transition-all ${
                stageStatus === 'current'
                  ? isReturned
                    ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-200'
                    : deadline?.isOverdue
                    ? 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200'
                    : deadline?.isDueSoon
                    ? 'border-amber-300 bg-amber-50/40 ring-1 ring-amber-200'
                    : 'border-blue-400 bg-blue-50/50 shadow-xs ring-1 ring-blue-300'
                  : stageStatus === 'done'
                  ? 'border-slate-200 bg-slate-50/70 text-slate-700'
                  : 'border-dashed border-slate-200 bg-white text-slate-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Step status icon */}
                  <div className="mt-0.5 shrink-0">
                    {stageStatus === 'done' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}

                    {stageStatus === 'current' && !isReturned && (
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-white shadow-xs ${
                          deadline?.isOverdue
                            ? 'bg-rose-600'
                            : deadline?.isDueSoon
                            ? 'bg-amber-600'
                            : 'bg-blue-600'
                        }`}
                      >
                        <Clock className="h-4 w-4 animate-pulse" />
                      </div>
                    )}

                    {stageStatus === 'current' && isReturned && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    )}

                    {stageStatus === 'upcoming' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400 text-xs font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h5
                        className={`text-sm font-bold ${
                          stageStatus === 'current'
                            ? 'text-slate-900'
                            : stageStatus === 'done'
                            ? 'text-slate-800'
                            : 'text-slate-500'
                        }`}
                      >
                        Stage {idx + 1}: {stage.name}
                      </h5>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          stageStatus === 'done'
                            ? 'bg-emerald-100 text-emerald-800'
                            : stageStatus === 'current'
                            ? isReturned
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {stageStatus === 'done'
                          ? 'Completed'
                          : stageStatus === 'current'
                          ? isReturned
                            ? 'Returned for Rectification'
                            : 'Active Stage'
                          : 'Upcoming'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {stage.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                        Handled by: <strong className="text-slate-900">{stage.role}</strong>
                      </span>
                      <span>•</span>
                      <span className="font-medium text-slate-600">
                        SLA Allowance: {stage.slaDays} Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Due Date & Days Left with color badge */}
                {stageStatus === 'current' && deadline && (
                  <div className="sm:text-right shrink-0 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-600 mb-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      <span>Due Date:</span>
                      <strong className="text-slate-900">{deadline.dueDateFormatted}</strong>
                    </div>

                    {/* Color badge: Green (On track), Amber (Due soon), Red (Overdue) */}
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${deadline.badgeClass}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${deadline.dotColor}`} />
                        <span>{deadline.status}</span>
                        <span className="font-medium">({deadline.displayText})</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isCompleted && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-center">
          <span className="text-xs font-bold text-emerald-900">
            ✓ Approval Process Successfully Completed
          </span>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            All stages in the {application.route} route have been validated by authorized officers.
          </p>
        </div>
      )}
    </div>
  );
}

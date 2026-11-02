'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  Calendar,
  Building,
  UploadCloud,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';
import { ApplicationItem } from '@/types/aicte';
import { useAicte } from '@/context/AicteContext';
import { getRouteStages } from '@/data/rules';
import { calculateDeadline, formatDateDisplay } from '@/lib/deadlineEngine';

interface InstitutionDashboardProps {
  onSelectApplication: (appId: string) => void;
}

export function InstitutionDashboard({ onSelectApplication }: InstitutionDashboardProps) {
  const { applications, demoDate } = useAicte();

  // Selected institution ID (default to AP-1001 Delhi Institute of Engineering and Technology)
  const [selectedAppId, setSelectedAppId] = useState<string>('AP-1001');

  // Currently viewed application
  const myApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const stages = getRouteStages(myApp.route);
  const currentStageIndex = stages.findIndex((s) => s.name === myApp.currentStage);
  const isCompleted = myApp.status === 'Completed' || myApp.currentStage === 'Completed';
  const isReturned = myApp.status === 'Returned';

  // Calculate percentage for progress bar
  let progressPercent = 0;
  if (isCompleted) {
    progressPercent = 100;
  } else if (currentStageIndex >= 0) {
    progressPercent = Math.round(((currentStageIndex + 0.5) / stages.length) * 100);
  } else {
    progressPercent = 25;
  }

  // Calculate deadline using single deadline engine and demo clock
  const currentStageRule = stages.find((s) => s.name === myApp.currentStage);
  const slaDays = currentStageRule ? currentStageRule.slaDays : 15;
  const deadline = !isCompleted
    ? calculateDeadline(myApp.stageStartDate, slaDays, demoDate)
    : null;

  // Derive plain English "Next Required Action"
  const getNextActionInfo = () => {
    if (isReturned) {
      // Find latest return reason from history
      const latestReturn = myApp.history.find((h) => h.action.includes('Return'));
      return {
        title: 'Action Required: Address Deficiency & Resubmit',
        description:
          latestReturn?.reason ||
          'The reviewing officer flagged deficiencies in your submitted documents. Rectify and re-upload required proof.',
        badge: 'Immediate Action Required',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        cta: 'Upload Rectified Documents',
        urgent: true,
      };
    }

    if (isCompleted) {
      return {
        title: 'Approval Granted: No Action Needed',
        description:
          'Your institutional application has successfully cleared all AICTE review stages. Official Extension of Approval (EoA) letter is ready for download.',
        badge: 'Completed',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        cta: 'Download Approval Letter (PDF)',
        urgent: false,
      };
    }

    if (myApp.currentStage === 'Scrutiny') {
      return {
        title: 'Application Under Regional Scrutiny Review',
        description:
          'The AICTE Regional Officer is examining your uploaded affidavits, land revenue Khatoni extract, and faculty cadre lists. No action is required from the institution at this stage unless a deficiency is noted.',
        badge: 'Under Review',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        cta: 'View Uploaded Documents',
        urgent: false,
      };
    }

    if (myApp.currentStage === 'EVC') {
      return {
        title: 'Prepare Campus for Expert Visiting Committee (EVC) Inspection',
        description:
          'Your application was advanced to the physical inspection queue. Ensure instructional carpet area measurements, laboratory equipment setups, fire safety clearances, and Aadhaar biometric faculty logs are accessible on-site.',
        badge: 'Inspection Scheduled',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        cta: 'Inspection Readiness Checklist',
        urgent: false,
      };
    }

    if (myApp.currentStage === 'SAC/SHC') {
      return {
        title: 'Prepare for Standing Appeals / Hearing Committee',
        description:
          'Standing Appeals Committee hearing is scheduled. Keep all original certificates, chartered accountant audited statements, and land title deeds ready for the committee panel.',
        badge: 'Hearing Scheduled',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        cta: 'Check Hearing Schedule',
        urgent: false,
      };
    }

    return {
      title: 'Review in Progress',
      description: 'Your application is progressing through official statutory scrutiny.',
      badge: 'In Progress',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      cta: 'Track Details',
      urgent: false,
    };
  };

  const nextAction = getNextActionInfo();

  return (
    <div className="space-y-6">
      {/* College Switcher Bar (enables testing any of the 25 sample colleges as institution) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Institution Portal: {myApp.institutionName}
            </h3>
            <p className="text-xs text-slate-500">
              Showing single-institution approval tracker & next actions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 shrink-0">
            Switch Institution:
          </label>
          <select
            value={myApp.id}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-hidden max-w-xs"
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.id} - {app.institutionName.slice(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Application Progress Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {myApp.id}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {myApp.institutionName}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Program: <strong>{myApp.program}</strong> • Region: <strong>{myApp.region} ({myApp.state})</strong> • Type: {myApp.applicationType || 'EoA'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {deadline && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${deadline.badgeClass}`}
              >
                <span className={`h-2 w-2 rounded-full ${deadline.dotColor}`} />
                <span>Due: {deadline.dueDateFormatted}</span>
                <span className="font-medium">({deadline.displayText})</span>
              </span>
            )}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 uppercase tracking-wider text-[11px]">
              Approval Workflow Progress
            </span>
            <span className="text-blue-700 font-extrabold text-sm">
              {progressPercent}% Completed
            </span>
          </div>

          {/* Visual Progress Bar Track */}
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/80">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-500'
                  : isReturned
                  ? 'bg-rose-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stage steps labels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
            {stages.map((st, i) => {
              const isPast = isCompleted || i < currentStageIndex;
              const isCurrent = !isCompleted && i === currentStageIndex;

              return (
                <div
                  key={st.name}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? isReturned
                        ? 'border-rose-300 bg-rose-50 text-rose-900 font-bold'
                        : 'border-blue-300 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-200'
                      : isPast
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-slate-100 bg-slate-50/60 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] uppercase font-semibold text-slate-400">
                    Step {i + 1}
                  </div>
                  <div>{st.name}</div>
                  <div className="text-[9px] font-normal text-slate-500">
                    {isPast ? '✓ Done' : isCurrent ? 'Active' : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEXT REQUIRED ACTION BOX */}
        <div
          className={`rounded-2xl border p-5 transition-all ${
            nextAction.urgent
              ? 'border-rose-300 bg-rose-50/70'
              : isCompleted
              ? 'border-emerald-200 bg-emerald-50/60'
              : 'border-blue-200 bg-blue-50/60'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              {nextAction.urgent ? (
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
              ) : isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-blue-600 shrink-0" />
              )}
              <h4 className="text-base font-bold text-slate-900">
                {nextAction.title}
              </h4>
            </div>

            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${nextAction.badgeClass}`}
            >
              {nextAction.badge}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed pl-7">
            {nextAction.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between pl-7">
            <span className="text-[11px] text-slate-500">
              Evaluated under simulated date: <strong>{formatDateDisplay(demoDate)}</strong>
            </span>

            <button
              type="button"
              onClick={() => onSelectApplication(myApp.id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors"
            >
              <span>{nextAction.cta}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

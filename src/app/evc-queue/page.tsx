'use client';

import React, { useState } from 'react';
import {
  CalendarCheck2,
  Calendar,
  Building,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  Video,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useAicte } from '@/context/AicteContext';
import { getRouteStages } from '@/data/rules';
import { calculateDeadline, formatDateDisplay } from '@/lib/deadlineEngine';
import { ApplicationDetailDrawer } from '@/components/applications/ApplicationDetailDrawer';

export default function EvcQueuePage() {
  const { currentRole, applications, demoDate, slaConfig } = useAicte();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // EVC and SAC/SHC specific applications from the 25 sample records
  const evcApps = applications.filter(
    (app) => app.currentStage === 'EVC' || app.currentStage === 'SAC/SHC'
  );

  const selectedApp = applications.find((a) => a.id === selectedAppId) || null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="EVC Queue"
        description="Expert Visiting Committee inspection schedule, committee assignment, physical campus verification, and virtual hearings."
        badge={`${evcApps.length} In Queue`}
      />

      {/* Role Notice Card */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              EVC & SAC Inspection Workflow
            </h3>
            <p className="text-xs text-slate-600">
              Committees evaluate land & built-up area, laboratory equipment, faculty cadre ratios, and library volumes within the statutory SLA turnaround window.
            </p>
          </div>
        </div>
      </div>

      {/* Active Inspections List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Scheduled Inspections ({evcApps.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Simulated Demo Date: {formatDateDisplay(demoDate)}
          </span>
        </div>

        {evcApps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No pending inspections in queue</h4>
            <p className="mt-1 text-xs text-slate-500">
              When Regional Officers recommend institutions for physical or virtual inspection, they appear here.
            </p>
          </div>
        ) : (
          evcApps.map((item) => {
            const stages = getRouteStages(item.route, slaConfig);
            const stageRule = stages.find((s) => s.name === item.currentStage);
            const slaDays = stageRule ? stageRule.slaDays : 10;
            const dl = calculateDeadline(item.stageStartDate, slaDays, demoDate);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedAppId(item.id)}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.id}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.institutionName}
                        </h4>
                        <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                          {item.currentStage} Stage
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {item.region} {item.state ? `(${item.state})` : ''}
                        </span>
                        <span>•</span>
                        <span>Route: {item.route}</span>
                        {item.program && (
                          <>
                            <span>•</span>
                            <span>Program: {item.program}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      <span>Due Date:</span>
                      <span className="text-blue-700 font-bold">{dl.dueDateFormatted}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${dl.pillClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${dl.dotColor}`} />
                      {dl.status} ({dl.displayText})
                    </span>
                  </div>
                </div>

                {/* Committee Panel Details Card */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600 flex-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>Convener: Prof. R. Verma (IIT Roorkee)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-emerald-600" />
                      <span>Geo-tagged Video Streaming: Mandatory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span>Report Submission Window: 24 hrs</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAppId(item.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs self-end sm:self-auto"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Review Application
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Guidelines Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-2">
          AICTE Inspection Protocol Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
            <span className="font-bold text-slate-800 block mb-1">
              1. Infrastructure Verification
            </span>
            Physical measurement of instructional area, administrative area, amenities, barrier-free access, and fire safety clearances.
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
            <span className="font-bold text-slate-800 block mb-1">
              2. Faculty & Biometrics
            </span>
            Verification of original certificates, AICTE salary scale bank proofs, PF statements, and Aadhaar-enabled biometric attendance records.
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
            <span className="font-bold text-slate-800 block mb-1">
              3. Laboratory Equipment
            </span>
            Physical inspection of operational equipment as per prescribed curriculum model syllabus and software licenses.
          </div>
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
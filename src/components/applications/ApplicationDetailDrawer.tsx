'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  FileText,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ApplicationItem, UserRole } from '@/types/aicte';
import { useAicte } from '@/context/AicteContext';
import { StageTimeline } from '@/components/applications/StageTimeline';
import { getNextStage, getRouteStages } from '@/data/rules';
import { calculateDeadline, formatDateDisplay } from '@/lib/deadlineEngine';

interface ApplicationDetailDrawerProps {
  application: ApplicationItem | null;
  onClose: () => void;
}

const COMMON_RETURN_REASONS = [
  'Deficiency in Land Ownership Deed / Khatoni extract revenue certification.',
  'Fire Safety Certificate NOC expired; renewed state NOC mandatory.',
  'Aadhaar-enabled Biometric Attendance for teaching faculty below prescribed threshold.',
  'Computer lab machines count insufficient for proposed student intake quota.',
  'Barrier-free access / ramp for differently-abled students missing on ground floor.',
  'Audited annual financial statements missing Chartered Accountant UDIN number.',
];

export function ApplicationDetailDrawer({
  application,
  onClose,
}: ApplicationDetailDrawerProps) {
  const { currentRole, setRole, approveAndAdvance, returnWithReason, demoDate } = useAicte();

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnReasonError, setReturnReasonError] = useState('');

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('');

  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!application) return null;

  const stages = getRouteStages(application.route);
  const currentStageRule = stages.find((s) => s.name === application.currentStage);
  const nextStage = getNextStage(application.route, application.currentStage);
  const isFinalStage = !nextStage && application.currentStage !== 'Completed';
  const isCompleted = application.status === 'Completed' || application.currentStage === 'Completed';

  // Single deadline engine calculation based on demo clock
  const slaDays = currentStageRule ? currentStageRule.slaDays : 15;
  const deadline = !isCompleted
    ? calculateDeadline(application.stageStartDate, slaDays, demoDate)
    : null;

  // Role permissions check
  // An officer can approve or return if their role matches the stage role or if they are Bureau Officer
  const requiredRole = currentStageRule?.role || 'Officer';
  const canAct =
    currentRole === requiredRole ||
    currentRole === 'Bureau Officer';

  const handleApprove = async () => {
    const res = await approveAndAdvance(application.id, approvalRemarks.trim() || undefined);
    if (res.success) {
      setActionFeedback({ type: 'success', text: res.message });
      setApproveModalOpen(false);
      setApprovalRemarks('');
      setTimeout(() => setActionFeedback(null), 5000);
    } else {
      setActionFeedback({ type: 'error', text: res.message });
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason.trim()) {
      setReturnReasonError('Return reason is required. Please state the specific deficiency.');
      return;
    }

    const res = await returnWithReason(application.id, returnReason.trim());
    if (res.success) {
      setActionFeedback({ type: 'success', text: res.message });
      setReturnModalOpen(false);
      setReturnReason('');
      setReturnReasonError('');
      setTimeout(() => setActionFeedback(null), 5000);
    } else {
      setActionFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-slate-50 shadow-2xl transition-all duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-mono font-bold text-sm shadow-xs">
              AP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900">
                  {application.id}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {application.region} Region
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {application.program || 'Technical Education'} • {application.state}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Action Feedback Banner */}
          {actionFeedback && (
            <div
              className={`rounded-xl p-4 text-xs font-semibold flex items-center justify-between ${
                actionFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <span>{actionFeedback.text}</span>
              <button
                type="button"
                onClick={() => setActionFeedback(null)}
                className="text-slate-400 hover:text-slate-600 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Institution Summary Card with Due Date & Days Left */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {application.institutionName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {application.program} • {application.state} • {application.applicationType || 'Extension of Approval (EoA)'}
                </p>
              </div>

              {deadline && (
                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${deadline.badgeClass}`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${deadline.dotColor}`} />
                    <span>{deadline.status}:</span>
                    <span className="font-semibold">{deadline.displayText}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Current Stage:</span>
                <span className="font-bold text-blue-700">
                  {application.currentStage}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Stage Start Date:</span>
                <span className="font-semibold text-slate-800">
                  {formatDateDisplay(application.stageStartDate)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Stage Due Date:</span>
                <span className="font-bold text-slate-900">
                  {deadline ? deadline.dueDateFormatted : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Status:</span>
                <span
                  className={`inline-block font-bold ${
                    application.status === 'Completed'
                      ? 'text-emerald-700'
                      : application.status === 'Returned'
                      ? 'text-rose-700'
                      : 'text-blue-700'
                  }`}
                >
                  {application.status}
                </span>
              </div>
            </div>

            {/* Deadline status callout */}
            {deadline?.isOverdue && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Overdue Notice:</strong> This stage exceeded the statutory AICTE deadline of {slaDays} days by{' '}
                  <strong>{Math.abs(deadline.daysLeft)} days</strong> under current simulated date ({demoDate}).
                </span>
              </div>
            )}

            {deadline?.isDueSoon && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Urgent Attention:</strong> Due soon within{' '}
                  <strong>{deadline.daysLeft === 0 ? 'today' : `${deadline.daysLeft} days`}</strong> (Target Due Date: {deadline.dueDateFormatted}).
                </span>
              </div>
            )}
          </div>

          {/* STAGE TIMELINE: Done, Current, Upcoming */}
          <StageTimeline application={application} />

          {/* OFFICER DECISION BUTTONS & CONTROL SECTION */}
          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Officer Decision & Action Panel
              </h4>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              <strong>Human-in-the-loop:</strong> Decisions are always made by an authorized officer. The AICTE Approval Monitor routes and tracks stages according to the rule set.
            </p>

            {isCompleted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <h5 className="text-xs font-bold text-emerald-900">
                  Application Completed & Approved
                </h5>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  No further officer decisions required. Approval order is archived.
                </p>
              </div>
            ) : canAct ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                  <UserCheck className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>
                    Acting as <strong>{currentRole}</strong> (authorized for{' '}
                    <strong>{application.currentStage}</strong> stage).
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Button 1: Approve and move to next stage */}
                  <button
                    type="button"
                    onClick={() => setApproveModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {isFinalStage
                        ? 'Approve & Issue Final Order'
                        : 'Approve and move to next stage'}
                    </span>
                  </button>

                  {/* Button 2: Return with reason */}
                  <button
                    type="button"
                    onClick={() => setReturnModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Return with reason</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">
                      Officer Authorization Required
                    </p>
                    <p className="mt-0.5 leading-relaxed">
                      This stage ({application.currentStage}) requires decisions from{' '}
                      <strong>{requiredRole}</strong>. You are currently viewing as{' '}
                      <strong>{currentRole}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRole(requiredRole as UserRole)}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                    >
                      Switch role to {requiredRole}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RETURN WITH REASON MODAL / FORM */}
          {returnModalOpen && (
            <div className="rounded-2xl border-2 border-rose-300 bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  <h4 className="text-sm font-bold text-rose-900">
                    Return Application to Institution
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReturnModalOpen(false);
                    setReturnReasonError('');
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleReturnSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specific Return Reason / Deficiency (Required)*
                  </label>
                  <textarea
                    rows={3}
                    value={returnReason}
                    onChange={(e) => {
                      setReturnReason(e.target.value);
                      if (e.target.value.trim()) setReturnReasonError('');
                    }}
                    placeholder="Describe specific grounds for return (e.g. fire safety certificate expired, shortfall in faculty cadres, lab shortfall)..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                  />
                  {returnReasonError && (
                    <p className="text-[11px] font-semibold text-rose-600 mt-1">
                      {returnReasonError}
                    </p>
                  )}
                </div>

                {/* Quick Chips for Standard Deficiency Reasons */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">
                    Quick Insert Standard Deficiency:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_RETURN_REASONS.map((reasonText, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setReturnReason(reasonText);
                          setReturnReasonError('');
                        }}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-600 hover:bg-slate-100 text-left line-clamp-1"
                      >
                        {reasonText.slice(0, 35)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setReturnModalOpen(false);
                      setReturnReasonError('');
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!returnReason.trim()}
                    className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 transition-colors"
                  >
                    Confirm Return
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* APPROVAL REMARKS MODAL */}
          {approveModalOpen && (
            <div className="rounded-2xl border-2 border-blue-300 bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <h4 className="text-sm font-bold text-blue-900">
                    Confirm Stage Approval
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setApproveModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are approving stage <strong>{application.currentStage}</strong> for{' '}
                  <strong>{application.institutionName}</strong>.
                  {nextStage ? (
                    <span>
                      {' '}
                      This will advance the application to <strong>{nextStage.name}</strong> stage
                      (handled by {nextStage.role}).
                    </span>
                  ) : (
                    <span>
                      {' '}
                      This is the final stage. Approving will issue the final AICTE approval order.
                    </span>
                  )}
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Approval Remarks / Assessment Notes (Optional):
                  </label>
                  <input
                    type="text"
                    value={approvalRemarks}
                    onChange={(e) => setApprovalRemarks(e.target.value)}
                    placeholder="e.g. Scrutiny cleared; all land and biometric proofs verified."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setApproveModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                  >
                    Confirm & Move Forward
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* APPLICATION HISTORY LOG */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Transition & Decision History</span>
              <span className="text-xs font-normal text-slate-400">
                {application.history.length} events
              </span>
            </h4>

            <div className="space-y-3">
              {application.history.map((hist, idx) => (
                <div
                  key={hist.id || idx}
                  className={`rounded-xl p-3 border text-xs ${
                    hist.action.includes('Return')
                      ? 'border-rose-200 bg-rose-50/50'
                      : hist.action.includes('Approved') || hist.action.includes('Final')
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span
                      className={
                        hist.action.includes('Return')
                          ? 'text-rose-900'
                          : hist.action.includes('Approved')
                          ? 'text-emerald-900'
                          : 'text-slate-900'
                      }
                    >
                      {hist.action} ({hist.stage})
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {hist.timestamp}
                    </span>
                  </div>

                  {hist.remarks && (
                    <p className="mt-1 text-slate-600 leading-snug">
                      {hist.remarks}
                    </p>
                  )}

                  {hist.reason && (
                    <div className="mt-1.5 rounded-lg bg-white p-2 border border-rose-200 text-rose-800 font-medium">
                      <strong>Deficiency Reason:</strong> {hist.reason}
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                    <span>Officer:</span>
                    <span className="font-semibold text-slate-600">{hist.actor}</span>
                    <span>({hist.role})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

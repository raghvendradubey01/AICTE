'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  HardDrive,
  RotateCcw,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Trash2,
  Download,
  Clock,
  Sliders,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Calendar,
  Layers,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useAicte } from '@/context/AicteContext';
import { SlaConfig, UserRole } from '@/types/aicte';
import { formatDateDisplay } from '@/lib/deadlineEngine';

const DEFAULT_STATUTORY_SLA: SlaConfig = {
  Scrutiny: 15,
  EVC: 10,
  'SAC/SHC': 7,
};

export default function SettingsPage() {
  const {
    currentRole,
    setRole,
    slaConfig,
    updateSlaConfig,
    resetAllData,
    demoDate,
    applications,
    documents,
    auditLogs,
    notifications,
  } = useAicte();

  // Local state for SLA inputs
  const [localSla, setLocalSla] = useState<SlaConfig>(slaConfig);
  const [slaSaveSuccess, setSlaSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Synchronize local form state with context slaConfig
  useEffect(() => {
    setLocalSla(slaConfig);
  }, [slaConfig]);

  const handleSlaChange = (stage: keyof SlaConfig, val: string) => {
    const num = parseInt(val, 10);
    setLocalSla((prev) => ({
      ...prev,
      [stage]: isNaN(num) ? 0 : Math.max(1, Math.min(90, num)),
    }));
  };

  const handleSaveSla = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    for (const stage of Object.keys(localSla) as (keyof SlaConfig)[]) {
      if (localSla[stage] !== slaConfig[stage]) {
        await updateSlaConfig(stage, localSla[stage]);
      }
    }
    setSlaSaveSuccess(true);
    setTimeout(() => setSlaSaveSuccess(false), 3500);
  };

  const handleRestoreDefaultSla = async () => {
    for (const stage of Object.keys(DEFAULT_STATUTORY_SLA) as (keyof SlaConfig)[]) {
      await updateSlaConfig(stage, DEFAULT_STATUTORY_SLA[stage]);
    }
    setLocalSla(DEFAULT_STATUTORY_SLA);
    setSlaSaveSuccess(true);
    setTimeout(() => setSlaSaveSuccess(false), 3500);
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all demo data?\n\n' +
        'This will restore:\n' +
        '• 25 sample approval applications\n' +
        '• Statutory SLA limits (15, 10, 7 days)\n' +
        '• Simulated demo clock to Day 0 (2026-11-02)\n' +
        '• Document expiry registries & undertakings\n' +
        '• SHA-256 cryptographic audit log hash chain\n' +
        '• Notification alerts & milestone reminders'
    );

    if (confirmed) {
      setIsResetting(true);
      await resetAllData();
      setIsResetting(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    }
  };

  const handleExportJson = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      simulatedDemoDate: demoDate,
      activeRole: currentRole,
      slaConfig,
      applications,
      documents,
      auditLogs,
      notifications,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aicte-approval-monitor-backup-${demoDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isSlaModified =
    localSla.Scrutiny !== slaConfig.Scrutiny ||
    localSla.EVC !== slaConfig.EVC ||
    localSla['SAC/SHC'] !== slaConfig['SAC/SHC'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Configuration"
        description="Configure workflow SLA rules, manage role assignments, and administer browser-based demo data."
      />

      {/* Global Alerts */}
      {slaSaveSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm font-medium text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>
              <strong>SLA Configuration updated!</strong> Deadlines, overdue counts, dashboards, and reports have recalculated immediately.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSlaSaveSuccess(false)}
            className="text-xs text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {resetSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm font-medium text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>
              <strong>All demo data successfully reset!</strong> Applications, documents, SLA targets, clock, and cryptographic audit log restored to default state.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setResetSuccess(false)}
            className="text-xs text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. SLA CONFIGURATION CARD (RULES AS CONFIGURATION, NOT CODE) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Workflow SLA Days Configuration
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Statutory deadline limits per approval stage. Rules are pure configuration: updating days immediately shifts due dates and recalculates status badges across all dashboards.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRestoreDefaultSla}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-colors shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            Restore Defaults (15 / 10 / 7)
          </button>
        </div>

        <form onSubmit={handleSaveSla} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scrutiny Stage */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">1. Scrutiny Stage</span>
                <span className="rounded-md bg-blue-100/70 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                  Regional Officer
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Initial document scrutiny, land titles, and affidavit review at the regional office.
              </p>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  SLA Limit (Days):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={localSla.Scrutiny}
                    onChange={(e) => handleSlaChange('Scrutiny', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-xs font-medium text-slate-500">Days</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Statutory default: 15 days
                </span>
              </div>
            </div>

            {/* EVC Stage */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">2. EVC Stage</span>
                <span className="rounded-md bg-purple-100/70 text-purple-800 px-2 py-0.5 text-[10px] font-bold">
                  EVC/SAC Committee
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Expert Visiting Committee physical or virtual verification of labs, faculty, and campus.
              </p>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  SLA Limit (Days):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={localSla.EVC}
                    onChange={(e) => handleSlaChange('EVC', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-xs font-medium text-slate-500">Days</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Statutory default: 10 days
                </span>
              </div>
            </div>

            {/* SAC/SHC Stage */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">3. SAC / SHC Stage</span>
                <span className="rounded-md bg-amber-100/70 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                  EVC/SAC Committee
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Standing Hearing Committee and Standing Appellate Committee review of representations.
              </p>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  SLA Limit (Days):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={localSla['SAC/SHC']}
                    onChange={(e) => handleSlaChange('SAC/SHC', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-xs font-medium text-slate-500">Days</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Statutory default: 7 days
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                Current live configuration:{' '}
                <strong>
                  Scrutiny: {slaConfig.Scrutiny}d, EVC: {slaConfig.EVC}d, SAC/SHC: {slaConfig['SAC/SHC']}d
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isSlaModified && (
                <span className="text-xs font-semibold text-amber-600">
                  Unsaved changes
                </span>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-all active:scale-95"
              >
                <CheckCircle2 className="h-4 w-4" />
                Save SLA Configuration
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. RESET DEMO DATA CARD */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">
                Reset Demo Data
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Reset all application records, document compliance expiry registries, simulated demo clock offset, statutory SLA days, and unread notification alerts back to their initial default state.
            </p>

            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span>Restores 25 sample applications across 5 regions</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span>Resets Demo Clock to 02 Nov 2026</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span>Resets SLA to statutory defaults (15, 10, 7 days)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span>Rebuilds cryptographic SHA-256 audit log hash chain</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-rose-700 transition-all active:scale-95 shrink-0 disabled:opacity-50"
          >
            <RotateCcw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? 'Resetting Data...' : 'Reset Demo Data'}
          </button>
        </div>
      </div>

      {/* 3. ACTIVE ROLE PERSONA CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Active Role Persona
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Select which stakeholder role the portal acts as by default.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(
            [
              'Institution',
              'Regional Officer',
              'Bureau Officer',
              'EVC/SAC Committee',
            ] as UserRole[]
          ).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRole(role)}
              className={`rounded-xl border p-4 text-left transition-all ${
                currentRole === role
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{role}</span>
                {currentRole === role && (
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <span className="text-xs text-slate-500 block leading-snug">
                {role === 'Institution' && 'Track institutional applications, submit renewals & documents'}
                {role === 'Regional Officer' && 'Conduct regional scrutiny, document audit, approve or return'}
                {role === 'Bureau Officer' && 'Supervisory national overview, overdue escalations & policy'}
                {role === 'EVC/SAC Committee' && 'Inspect campus facilities, conduct EVC visits & SAC hearings'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. BROWSER LOCAL STORAGE CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Browser Local Storage (No Backend)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              All applications, inspection schedules, uploaded undertakings, cryptographic audit logs, and notifications are stored directly inside your web browser using HTML5 LocalStorage.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
            Storage Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Applications
            </span>
            <span className="text-lg font-bold text-slate-900">{applications.length} Records</span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Documents
            </span>
            <span className="text-lg font-bold text-slate-900">{documents.length} Records</span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Audit Logs (Hashed)
            </span>
            <span className="text-lg font-bold text-slate-900">{auditLogs.length} Entries</span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Simulated Date
            </span>
            <span className="text-sm font-bold text-blue-600">{formatDateDisplay(demoDate)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Download className="h-4 w-4 text-blue-600" />
            Export Storage Backup (JSON)
          </button>
        </div>
      </div>

      {/* 5. ABOUT SYSTEM CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          About AICTE Approval Monitor
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          This portal provides a unified dashboard for tracking institutional approval processes under the All India Council for Technical Education Approval Process Handbook (APH 2026-27). Designed with a clean, simple interface featuring white background, blue accents, rounded cards, plain English terminology, and zero backend dependencies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500 border-t border-slate-100 pt-4">
          <div>
            <span className="font-bold text-slate-700 block">Version:</span>
            <span>v1.0.0 (Approval Cycle AY 2026-27)</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block">Tech Stack:</span>
            <span>React 19, Next.js 15, Tailwind CSS v4, Recharts</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block">Security:</span>
            <span>Web Crypto SHA-256 Tamper-Evident Hash Chain</span>
          </div>
        </div>
      </div>
    </div>
  );
}
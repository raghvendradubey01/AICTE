'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Download,
  Clock,
  UserCheck,
  Activity,
  Hash,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useAicte } from '@/context/AicteContext';
import { VerificationResult, GENESIS_HASH } from '@/lib/cryptoLog';

export default function AuditLogPage() {
  const { auditLogs, verifyAuditLogIntegrity, tamperAuditLog, restoreAuditLog } = useAicte();

  const [searchTerm, setSearchTerm] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyAuditLogIntegrity();
      setVerificationResult(result);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTamperTest = () => {
    tamperAuditLog();
    setVerificationResult({
      isValid: false,
      message: 'Tamper test applied! Click "Verify log integrity" below to run cryptographic SHA-256 chain verification.',
    });
  };

  const handleRestore = async () => {
    await restoreAuditLog();
    const result = await verifyAuditLogIntegrity();
    setVerificationResult(result);
  };

  const handleCopy = (hashStr: string) => {
    navigator.clipboard.writeText(hashStr);
    setCopiedHash(hashStr);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Cryptographically secured, tamper-evident audit trail linking all institutional actions, officer decisions, document uploads, and role switches via a SHA-256 hash chain."
        badge={`${auditLogs.length} Sealed Entries`}
      />

      {/* Cryptographic Verification & Tamper Test Action Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                SHA-256 Cryptographic Hash Chain Engine
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Each action calculates a 256-bit hash combining the previous block&apos;s hash, timestamp, actor role, case ID, and details. Any modification instantly breaks the chain.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Verify Button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Verify log integrity'}</span>
            </button>

            {/* Tamper Test Button */}
            <button
              type="button"
              onClick={handleTamperTest}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
              title="Intentionally edits one old entry to demonstrate cryptographic detection"
            >
              <Unlock className="h-4 w-4" />
              <span>Tamper test</span>
            </button>

            {/* Restore Button */}
            <button
              type="button"
              onClick={handleRestore}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              title="Re-seals the cryptographic hash chain"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Re-seal Log</span>
            </button>
          </div>
        </div>

        {/* Verification Status Results Banner */}
        {verificationResult && (
          <div
            className={`rounded-xl p-4 text-xs font-semibold transition-all border ${
              verificationResult.isValid
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {verificationResult.isValid ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold">
                  {verificationResult.isValid ? 'Log is intact' : 'Cryptographic Integrity Violation!'}
                </p>
                <p className="mt-0.5 text-xs font-medium leading-relaxed">
                  {verificationResult.message}
                </p>
                {verificationResult.brokenEntryId && (
                  <div className="mt-2 font-mono text-[11px] p-2 bg-white/80 rounded border border-rose-200 text-rose-800">
                    <div>Broken Entry ID: <strong>{verificationResult.brokenEntryId}</strong> (Step #{verificationResult.brokenIndex})</div>
                    <div>Expected Hash: {verificationResult.expectedHash}</div>
                    <div>Recorded Hash: {verificationResult.actualHash}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by case ID, action, role, details or hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs sm:text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Genesis Hash: <code className="font-mono text-slate-600">{GENESIS_HASH.slice(0, 12)}...</code>
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4"># / Time</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-3">Case ID</th>
                <th className="py-3 px-5">Details</th>
                <th className="py-3 px-4 text-right">SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ShieldAlert className="h-8 w-8 mx-auto text-slate-300 mb-1" />
                    <p className="font-semibold text-slate-700">No matching log records found</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => {
                  const isTampered = log.tampered || log.details.includes('[UNAUTHORIZED_MODIFICATION_TAMPER]');

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isTampered ? 'bg-rose-50/60 ring-1 ring-rose-300' : ''
                      }`}
                    >
                      {/* 1. Sequence & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span className="text-slate-400 font-mono text-[11px]">
                            #{filteredLogs.length - index}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          {log.time}
                        </span>
                      </td>

                      {/* 2. Role */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {log.role}
                        </span>
                      </td>

                      {/* 3. Action */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {log.action}
                      </td>

                      {/* 4. Case ID */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {log.caseId}
                        </span>
                      </td>

                      {/* 5. Details */}
                      <td className="py-3.5 px-5 max-w-md">
                        <span className="text-slate-700 leading-snug block">
                          {log.details}
                        </span>
                        {isTampered && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded bg-rose-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                            ⚠️ Modifed (Tampered Entry)
                          </span>
                        )}
                      </td>

                      {/* 6. Hash Chain Link */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <code
                            className={`font-mono text-[10px] px-2 py-1 rounded border ${
                              isTampered
                                ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                            title={`Current: ${log.hash}\nPrevious: ${log.prevHash}`}
                          >
                            {log.hash.slice(0, 10)}...{log.hash.slice(-6)}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy(log.hash)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            title="Copy full SHA-256 hash"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        {copiedHash === log.hash && (
                          <span className="text-[9px] text-emerald-600 block">Copied!</span>
                        )}
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          prev: {log.prevHash.slice(0, 6)}...
                        </span>
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

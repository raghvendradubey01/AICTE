'use client';

import React, { useState, useRef } from 'react';
import {
  FolderCheck,
  FileCheck2,
  UploadCloud,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Building,
  Calendar,
  X,
  FileUp,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useAicte } from '@/context/AicteContext';
import { DocumentItem, DocumentType } from '@/types/aicte';
import { calculateDocumentExpiry, formatDateDisplay } from '@/lib/deadlineEngine';

export default function DocumentsPage() {
  const { currentRole, setRole, documents, demoDate, uploadDocumentRenewal, verifyDocument } = useAicte();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Modal state for uploading renewal
  const [uploadModalDoc, setUploadModalDoc] = useState<DocumentItem | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute live expiry statuses using demo clock
  const docsWithLiveStatus = documents.map((doc) => {
    const expiry = calculateDocumentExpiry(doc.expiryDate, demoDate);
    return {
      ...doc,
      liveExpiry: expiry,
    };
  });

  // Filter documents
  const filteredDocs = docsWithLiveStatus.filter((doc) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      doc.institutionName.toLowerCase().includes(term) ||
      doc.documentType.toLowerCase().includes(term) ||
      doc.caseId.toLowerCase().includes(term) ||
      doc.fileName.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Pending Verification'
        ? doc.verificationStatus === 'Pending Verification'
        : doc.liveExpiry.status === statusFilter);

    const matchesType = typeFilter === 'All' || doc.documentType.includes(typeFilter);

    return matchesSearch && matchesStatus && matchesType;
  });

  // Metric counts
  const validCount = docsWithLiveStatus.filter((d) => d.liveExpiry.status === 'Valid').length;
  const expiringCount = docsWithLiveStatus.filter((d) => d.liveExpiry.status === 'Expiring in 30 days').length;
  const expiredCount = docsWithLiveStatus.filter((d) => d.liveExpiry.status === 'Expired').length;
  const pendingVerifyCount = docsWithLiveStatus.filter((d) => d.verificationStatus === 'Pending Verification').length;

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModalDoc) return;
    const fileNameToSave = selectedFileName.trim() || `Renewed_${uploadModalDoc.documentType.replace(/\s+/g, '_')}_2026.pdf`;

    const res = await uploadDocumentRenewal(uploadModalDoc.id, fileNameToSave);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: res.message });
      setUploadModalDoc(null);
      setSelectedFileName('');
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  const handleVerifyClick = async (docId: string) => {
    const res = await verifyDocument(docId);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: res.message });
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  const isOfficer = currentRole === 'Regional Officer' || currentRole === 'Bureau Officer' || currentRole === 'EVC/SAC Committee';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Undertakings and Documents"
        description="Verify mandatory compliance affidavits, structural stability certificates, fire safety clearances, and land revenue declarations."
        badge={`${documents.length} Managed Files`}
      />

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`rounded-xl p-4 text-xs font-semibold flex items-center justify-between shadow-xs ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 4 Status KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Valid */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Valid Documents
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{validCount}</div>
          <span className="text-xs text-emerald-700 font-medium">&gt; 30 days validity</span>
        </div>

        {/* Expiring Soon */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Expiring in 30 Days
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900">{expiringCount}</div>
          <span className="text-xs text-amber-700 font-medium">Renewal alerts generated</span>
        </div>

        {/* Expired */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Expired Documents
            </span>
            <span className="h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-900">{expiredCount}</div>
          <span className="text-xs text-rose-700 font-medium">Action mandatory</span>
        </div>

        {/* Pending Verification */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Awaiting Verification
            </span>
            <Clock className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-900">{pendingVerifyCount}</div>
          <span className="text-xs text-blue-700 font-medium">Officer stamp pending</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by college, document type, file name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs sm:text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center text-xs text-slate-500">
            <span>
              Showing <strong>{filteredDocs.length}</strong> of {documents.length} records
            </span>
            {(searchTerm || statusFilter !== 'All' || typeFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setTypeFilter('All');
                }}
                className="ml-2 font-bold text-blue-600 underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Status:
          </span>
          {['All', 'Valid', 'Expiring in 30 days', 'Expired', 'Pending Verification'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1 font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const expiry = doc.liveExpiry;

          return (
            <div
              key={doc.id}
              className={`group rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                expiry.isExpired
                  ? 'border-rose-200 bg-white hover:border-rose-400'
                  : expiry.isExpiringSoon
                  ? 'border-amber-200 bg-white hover:border-amber-400'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div>
                {/* Header row: ID, institution, status badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        expiry.isExpired
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : expiry.isExpiringSoon
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-blue-50 text-blue-600 border-blue-200'
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {doc.id}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          ({doc.caseId})
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {doc.documentType}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {doc.institutionName}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${expiry.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${expiry.dotColor}`} />
                      <span>{expiry.status}</span>
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded-md ${
                        doc.verificationStatus === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {doc.verificationStatus === 'Verified' ? '✓ Verified' : '⏳ Verification Pending'}
                    </span>
                  </div>
                </div>

                {/* Expiry & File Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Expiry Date:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-blue-600" />
                      {formatDateDisplay(doc.expiryDate)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      ({expiry.displayText} under demo date)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">File Stored:</span>
                    <span className="font-mono text-slate-800 font-semibold line-clamp-1 block text-[11px]">
                      {doc.fileName}
                    </span>
                    <span className="text-[10px] text-slate-400">{doc.fileSize}</span>
                  </div>
                </div>

                {doc.verifiedBy && (
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    <span>Verified by: <strong>{doc.verifiedBy}</strong> on {doc.verifiedAt}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {/* Institution Upload Renewal Action */}
                <button
                  type="button"
                  onClick={() => {
                    setUploadModalDoc(doc);
                    setSelectedFileName('');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-3 py-1.5 text-xs font-bold transition-colors border border-blue-200"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Upload Renewal</span>
                </button>

                {/* Officer Verify Action */}
                {doc.verificationStatus === 'Pending Verification' ? (
                  isOfficer ? (
                    <button
                      type="button"
                      onClick={() => handleVerifyClick(doc.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Verify Document</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRole('Regional Officer')}
                      className="text-[11px] font-semibold text-slate-400 hover:text-blue-600 underline"
                      title="Switch to Officer persona to verify"
                    >
                      Switch to RO to verify
                    </button>
                  )
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* UPLOAD RENEWAL MODAL */}
      {uploadModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Upload Document Renewal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>
                <strong>Document:</strong> {uploadModalDoc.documentType} ({uploadModalDoc.id})
              </p>
              <p>
                <strong>Institution:</strong> {uploadModalDoc.institutionName}
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pick a File (or enter new document file name):
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFileName(e.target.files[0].name);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-bold file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  File Name to Store in Local Browser Storage:
                </label>
                <input
                  type="text"
                  value={selectedFileName}
                  onChange={(e) => setSelectedFileName(e.target.value)}
                  placeholder={`Renewed_${uploadModalDoc.documentType.replace(/\s+/g, '_')}_2026.pdf`}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                Uploading sets verification status to <strong>Pending Verification</strong> and appends a cryptographically chained entry to the audit log.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalDoc(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors"
                >
                  Save & Submit Renewal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ApplicationItem,
  AppNotification,
  AuditLogItem,
  DocumentItem,
  SlaConfig,
  UserRole,
} from '@/types/aicte';
import { SAMPLE_APPLICATIONS } from '@/data/sampleApplications';
import { SAMPLE_DOCUMENTS } from '@/data/sampleDocuments';
import { INITIAL_CHAINED_LOGS } from '@/data/initialChainedLogs';
import { getNextStage, getRouteStages, setGlobalSlaConfig } from '@/data/rules';
import { formatDateISO, calculateDeadline } from '@/lib/deadlineEngine';
import { syncNotificationsWithDemoDate } from '@/lib/notificationEngine';
import {
  computeEntryHash,
  GENESIS_HASH,
  rebuildHashChain,
  VerificationResult,
  verifyLogIntegrity,
} from '@/lib/cryptoLog';

interface AicteContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  applications: ApplicationItem[];
  documents: DocumentItem[];
  auditLogs: AuditLogItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  resetAllData: () => void;
  approveAndAdvance: (applicationId: string, remarks?: string) => Promise<{ success: boolean; message: string }>;
  returnWithReason: (applicationId: string, reason: string) => Promise<{ success: boolean; message: string }>;

  // Document management
  uploadDocumentRenewal: (docId: string, fileName: string) => Promise<{ success: boolean; message: string }>;
  verifyDocument: (docId: string) => Promise<{ success: boolean; message: string }>;

  // Demo Clock Engine
  demoDate: string; // YYYY-MM-DD
  baseDate: string; // YYYY-MM-DD
  advanceDemoDays: (days: number) => Promise<void>;
  resetDemoDate: () => Promise<void>;
  daysOffsetFromBase: number;

  // SLA Configuration (Configuration, not code)
  slaConfig: SlaConfig;
  updateSlaConfig: (stage: keyof SlaConfig, days: number) => Promise<void>;

  // Escalated cases (overdue by > 3 days)
  escalatedCases: ApplicationItem[];

  // Cryptographic Audit Log
  verifyAuditLogIntegrity: () => Promise<VerificationResult>;
  tamperAuditLog: () => void;
  restoreAuditLog: () => Promise<void>;
}

const BASE_DEMO_DATE = '2026-11-02';

const DEFAULT_SLA_CONFIG: SlaConfig = {
  Scrutiny: 15,
  EVC: 10,
  'SAC/SHC': 7,
};

const STORAGE_KEYS = {
  ROLE: 'aicte_active_role',
  NOTIFICATIONS: 'aicte_notifications_v4',
  APPLICATIONS: 'aicte_applications_v3',
  DOCUMENTS: 'aicte_documents_v3',
  AUDIT_LOGS: 'aicte_crypto_audit_logs_v3',
  DEMO_DATE: 'aicte_demo_date_v3',
  SLA_CONFIG: 'aicte_sla_config_v3',
};

const AicteContext = createContext<AicteContextType | undefined>(undefined);

export function AicteProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('Institution');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>(SAMPLE_APPLICATIONS);
  const [documents, setDocuments] = useState<DocumentItem[]>(SAMPLE_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_CHAINED_LOGS);
  const [demoDate, setDemoDate] = useState<string>(BASE_DEMO_DATE);
  const [slaConfig, setSlaConfig] = useState<SlaConfig>(DEFAULT_SLA_CONFIG);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Initialize and load from localStorage
  useEffect(() => {
    async function initializeState() {
      try {
        const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole | null;
        if (savedRole && ['Institution', 'Regional Officer', 'Bureau Officer', 'EVC/SAC Committee'].includes(savedRole)) {
          setCurrentRoleState(savedRole);
        }

        let loadedDemoDate = BASE_DEMO_DATE;
        const savedDemoDate = localStorage.getItem(STORAGE_KEYS.DEMO_DATE);
        if (savedDemoDate) {
          loadedDemoDate = savedDemoDate;
          setDemoDate(savedDemoDate);
        }

        let loadedSla = DEFAULT_SLA_CONFIG;
        const savedSla = localStorage.getItem(STORAGE_KEYS.SLA_CONFIG);
        if (savedSla) {
          try {
            loadedSla = JSON.parse(savedSla);
            setSlaConfig(loadedSla);
            setGlobalSlaConfig(loadedSla);
          } catch {
            loadedSla = DEFAULT_SLA_CONFIG;
            setGlobalSlaConfig(DEFAULT_SLA_CONFIG);
          }
        } else {
          setGlobalSlaConfig(DEFAULT_SLA_CONFIG);
        }

        let loadedApps = SAMPLE_APPLICATIONS;
        const savedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
        if (savedApps) {
          try {
            const parsed = JSON.parse(savedApps);
            if (Array.isArray(parsed) && parsed.length >= 25) {
              loadedApps = parsed;
              setApplications(parsed);
            }
          } catch {}
        }

        let loadedDocs = SAMPLE_DOCUMENTS;
        const savedDocs = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
        if (savedDocs) {
          try {
            const parsedDocs = JSON.parse(savedDocs);
            if (Array.isArray(parsedDocs) && parsedDocs.length > 0) {
              loadedDocs = parsedDocs;
              setDocuments(parsedDocs);
            }
          } catch {}
        }

        // Initialize Cryptographic Audit Log with valid hash chain
        const savedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
        if (savedLogs) {
          try {
            const parsedLogs = JSON.parse(savedLogs);
            if (Array.isArray(parsedLogs) && parsedLogs.length > 0) {
              setAuditLogs(parsedLogs);
            } else {
              const chained = await rebuildHashChain(INITIAL_CHAINED_LOGS);
              setAuditLogs(chained);
              localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(chained));
            }
          } catch {
            const chained = await rebuildHashChain(INITIAL_CHAINED_LOGS);
            setAuditLogs(chained);
          }
        } else {
          const chained = await rebuildHashChain(INITIAL_CHAINED_LOGS);
          setAuditLogs(chained);
          localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(chained));
        }

        // Initialize Notifications
        let initialNotifs: AppNotification[] = [];
        const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (savedNotifications) {
          try {
            initialNotifs = JSON.parse(savedNotifications);
          } catch {}
        }

        const { notifications: synced } = syncNotificationsWithDemoDate(
          loadedApps,
          loadedDemoDate,
          initialNotifs,
          loadedDocs
        );
        setNotifications(synced);
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(synced));
      } catch (err) {
        console.warn('Initialization error:', err);
      } finally {
        setIsHydrated(true);
      }
    }

    initializeState();
  }, []);

  // Synchronize notifications whenever demo clock moves, applications update, or documents update
  useEffect(() => {
    if (!isHydrated) return;
    const { notifications: synced, newCount } = syncNotificationsWithDemoDate(
      applications,
      demoDate,
      notifications,
      documents
    );

    if (newCount > 0) {
      setNotifications(synced);
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(synced));
      } catch (err) {
        console.warn('Error saving synced notifications:', err);
      }
    }
  }, [demoDate, applications, documents, isHydrated]);

  // Dynamically calculate escalated cases (overdue by more than 3 days)
  const escalatedCases = applications.filter((app) => {
    if (app.currentStage === 'Completed' || app.status === 'Completed') return false;
    const stages = getRouteStages(app.route, slaConfig);
    const stageRule = stages.find((s) => s.name === app.currentStage);
    const slaDays = stageRule ? stageRule.slaDays : 15;
    const dl = calculateDeadline(app.stageStartDate, slaDays, demoDate);
    return dl.daysLeft < -3; // overdue by more than 3 days
  });

  // Calculate days offset from initial base date
  const baseDateTime = new Date(BASE_DEMO_DATE + 'T00:00:00').getTime();
  const currentDateTime = new Date(demoDate + 'T00:00:00').getTime();
  const daysOffsetFromBase = Math.round((currentDateTime - baseDateTime) / (1000 * 60 * 60 * 24));

  /**
   * Cryptographic Hash Chain: Appends a tamper-evident audit log entry
   */
  const appendChainedAuditLog = async (
    action: string,
    caseId: string,
    details: string,
    actorRole: UserRole = currentRole
  ) => {
    const timeLabel = `${demoDate} (Simulated)`;
    const prevHash = auditLogs.length > 0 ? auditLogs[0].hash : GENESIS_HASH;

    const hash = await computeEntryHash(
      prevHash,
      timeLabel,
      actorRole,
      action,
      caseId,
      details
    );

    const newEntry: AuditLogItem = {
      id: `audit-${Date.now()}`,
      time: timeLabel,
      role: actorRole,
      action,
      caseId,
      details,
      prevHash,
      hash,
    };

    const updatedLogs = [newEntry, ...auditLogs];
    setAuditLogs(updatedLogs);
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updatedLogs));
    } catch (err) {
      console.warn('Error saving chained audit log:', err);
    }
  };

  /**
   * Advance the Demo Clock by +X days
   */
  const advanceDemoDays = async (days: number) => {
    const current = new Date(demoDate + 'T00:00:00');
    current.setDate(current.getDate() + days);
    const newDemoDateStr = formatDateISO(current);
    setDemoDate(newDemoDateStr);

    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_DATE, newDemoDateStr);
    } catch {}

    await appendChainedAuditLog(
      `Advanced Demo Clock +${days}d`,
      'SYSTEM-CLOCK',
      `Simulated date changed from ${demoDate} to ${newDemoDateStr} (+${days} days). Deadlines recalculated.`
    );
  };

  /**
   * Reset Demo Clock back to Base Date
   */
  const resetDemoDate = async () => {
    setDemoDate(BASE_DEMO_DATE);
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_DATE, BASE_DEMO_DATE);
    } catch {}

    await appendChainedAuditLog(
      'Reset Demo Clock',
      'SYSTEM-CLOCK',
      `Simulated date reset to initial anchor date (${BASE_DEMO_DATE}).`
    );
  };

  /**
   * Update SLA Days configuration (Rules as configuration, not code)
   */
  const updateSlaConfig = async (stage: keyof SlaConfig, days: number) => {
    const updated: SlaConfig = {
      ...slaConfig,
      [stage]: days,
    };
    setSlaConfig(updated);
    setGlobalSlaConfig(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.SLA_CONFIG, JSON.stringify(updated));
    } catch {}

    // Resync notifications with the new SLA immediately
    const { notifications: synced } = syncNotificationsWithDemoDate(
      applications,
      demoDate,
      notifications,
      documents
    );
    setNotifications(synced);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(synced));
    } catch {}

    await appendChainedAuditLog(
      'Configured Stage SLA Limit',
      `SLA-${stage}`,
      `Statutory SLA for stage "${stage}" updated to ${days} days. Rules recalculated across dashboard.`
    );
  };

  /**
   * Update active role with persistence and audit entry
   */
  const setRole = async (newRole: UserRole) => {
    setCurrentRoleState(newRole);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    } catch {}

    await appendChainedAuditLog(
      'Switched Active Role',
      'SESSION',
      `Active persona changed to ${newRole}. Portal permissions and dashboard views updated.`,
      newRole
    );
  };

  /**
   * Officer Decision: "Approve and move to next stage"
   */
  const approveAndAdvance = async (applicationId: string, remarks?: string) => {
    const targetIndex = applications.findIndex((app) => app.id === applicationId);
    if (targetIndex === -1) {
      return { success: false, message: 'Application not found.' };
    }

    const app = applications[targetIndex];
    if (app.status === 'Completed' || app.status === 'Approved') {
      return { success: false, message: 'Application is already approved and completed.' };
    }

    const nextStage = getNextStage(app.route, app.currentStage);
    const timeLabel = `${demoDate} (Simulated)`;

    let newCurrentStage: string;
    let newStatus: 'In Progress' | 'Approved' | 'Completed';
    let actionLabel: string;
    let remarksText: string;

    if (nextStage) {
      newCurrentStage = nextStage.name;
      newStatus = 'In Progress';
      actionLabel = 'Approved & Advanced';
      remarksText = remarks || `Approved at ${app.currentStage} stage by ${currentRole}. Moved to ${nextStage.name}.`;
    } else {
      newCurrentStage = 'Completed';
      newStatus = 'Completed';
      actionLabel = 'Final Approval Granted';
      remarksText = remarks || `All stages of route "${app.route}" completed. Final AICTE approval order generated.`;
    }

    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      stage: app.currentStage,
      action: actionLabel,
      actor: `${currentRole} Officer`,
      role: currentRole,
      timestamp: timeLabel,
      remarks: remarksText,
    };

    const updatedApp: ApplicationItem = {
      ...app,
      currentStage: newCurrentStage,
      stageStartDate: demoDate,
      status: newStatus,
      history: [newHistoryItem, ...app.history],
    };

    const updatedApplications = [...applications];
    updatedApplications[targetIndex] = updatedApp;
    setApplications(updatedApplications);

    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updatedApplications));
    } catch {}

    await appendChainedAuditLog(
      `Decision: ${actionLabel}`,
      app.id,
      `Application ${app.id} (${app.institutionName}): ${remarksText}`
    );

    return {
      success: true,
      message: nextStage
        ? `Application ${app.id} approved and moved to ${nextStage.name} stage.`
        : `Application ${app.id} completed all stages. Final approval granted.`,
    };
  };

  /**
   * Officer Decision: "Return with reason"
   */
  const returnWithReason = async (applicationId: string, reason: string) => {
    if (!reason || !reason.trim()) {
      return { success: false, message: 'A specific return reason is required.' };
    }

    const targetIndex = applications.findIndex((app) => app.id === applicationId);
    if (targetIndex === -1) {
      return { success: false, message: 'Application not found.' };
    }

    const app = applications[targetIndex];
    const timeLabel = `${demoDate} (Simulated)`;

    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      stage: app.currentStage,
      action: 'Returned with Reason',
      actor: `${currentRole} Officer`,
      role: currentRole,
      timestamp: timeLabel,
      reason: reason.trim(),
    };

    const updatedApp: ApplicationItem = {
      ...app,
      status: 'Returned',
      history: [newHistoryItem, ...app.history],
    };

    const updatedApplications = [...applications];
    updatedApplications[targetIndex] = updatedApp;
    setApplications(updatedApplications);

    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updatedApplications));
    } catch {}

    await appendChainedAuditLog(
      'Decision: Returned with Reason',
      app.id,
      `Application ${app.id} (${app.institutionName}) returned at stage "${app.currentStage}". Reason: ${reason.trim()}`
    );

    return {
      success: true,
      message: `Application ${app.id} returned to institution with specified deficiency reason.`,
    };
  };

  /**
   * Document Action: Institution uploads a renewal file
   */
  const uploadDocumentRenewal = async (docId: string, fileName: string) => {
    const docIdx = documents.findIndex((d) => d.id === docId);
    if (docIdx === -1) {
      return { success: false, message: 'Document record not found.' };
    }

    const targetDoc = documents[docIdx];
    const updatedDoc: DocumentItem = {
      ...targetDoc,
      fileName,
      verificationStatus: 'Pending Verification',
      uploadedBy: currentRole,
      uploadedAt: demoDate,
      // If document was expired, set renewed expiry date 1 year from demo date
      expiryDate: targetDoc.status === 'Expired'
        ? formatDateISO(new Date(new Date(demoDate + 'T00:00:00').setFullYear(new Date(demoDate + 'T00:00:00').getFullYear() + 1)))
        : targetDoc.expiryDate,
    };

    const updatedDocs = [...documents];
    updatedDocs[docIdx] = updatedDoc;
    setDocuments(updatedDocs);
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocs));
    } catch {}

    await appendChainedAuditLog(
      'Uploaded Document Renewal',
      targetDoc.caseId,
      `Institution uploaded renewed file "${fileName}" for ${targetDoc.documentType} (${targetDoc.id}).`
    );

    return {
      success: true,
      message: `Uploaded renewal "${fileName}". Submitted to Regional Office for verification.`,
    };
  };

  /**
   * Document Action: Officer verifies document
   */
  const verifyDocument = async (docId: string) => {
    const docIdx = documents.findIndex((d) => d.id === docId);
    if (docIdx === -1) {
      return { success: false, message: 'Document record not found.' };
    }

    const targetDoc = documents[docIdx];
    const updatedDoc: DocumentItem = {
      ...targetDoc,
      verificationStatus: 'Verified',
      verifiedBy: `${currentRole} Officer`,
      verifiedAt: demoDate,
    };

    const updatedDocs = [...documents];
    updatedDocs[docIdx] = updatedDoc;
    setDocuments(updatedDocs);
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocs));
    } catch {}

    await appendChainedAuditLog(
      'Verified Document Compliance',
      targetDoc.caseId,
      `Officer (${currentRole}) stamped and verified compliance for ${targetDoc.documentType} (${targetDoc.id}).`
    );

    return {
      success: true,
      message: `Document ${targetDoc.id} (${targetDoc.documentType}) successfully verified by ${currentRole}.`,
    };
  };

  /**
   * Cryptographic verification of the entire hash chain
   */
  const verifyAuditLogIntegrity = async (): Promise<VerificationResult> => {
    return verifyLogIntegrity(auditLogs);
  };

  /**
   * Tamper Test: Intentionally alters an old audit entry to test the cryptographic hash chain
   */
  const tamperAuditLog = () => {
    if (auditLogs.length < 2) return;
    const targetIndex = Math.min(2, auditLogs.length - 1);
    const tamperedLogs = [...auditLogs];
    tamperedLogs[targetIndex] = {
      ...tamperedLogs[targetIndex],
      details: tamperedLogs[targetIndex].details + ' [UNAUTHORIZED_MODIFICATION_TAMPER]',
      tampered: true,
    };
    setAuditLogs(tamperedLogs);
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(tamperedLogs));
    } catch {}
  };

  /**
   * Restore/Rebuild Audit Log Hash Chain
   */
  const restoreAuditLog = async () => {
    const rawClean = auditLogs.map((log) => ({
      ...log,
      details: log.details.replace(' [UNAUTHORIZED_MODIFICATION_TAMPER]', ''),
      tampered: false,
    }));
    // Re-chain in oldest-first order then reverse back to newest-first
    const oldestFirst = [...rawClean].reverse();
    const rebuilt = await rebuildHashChain(oldestFirst);
    const newestFirst = rebuilt.reverse();
    setAuditLogs(newestFirst);
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(newestFirst));
    } catch {}
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch {}
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch {}
  };

  const clearNotifications = () => {
    setNotifications([]);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    } catch {}
  };

  /**
   * Reset All Demo Data
   */
  const resetAllData = async () => {
    setCurrentRoleState('Institution');
    setDemoDate(BASE_DEMO_DATE);
    setSlaConfig(DEFAULT_SLA_CONFIG);
    setGlobalSlaConfig(DEFAULT_SLA_CONFIG);
    setApplications(SAMPLE_APPLICATIONS);
    setDocuments(SAMPLE_DOCUMENTS);

    const initialChained = await rebuildHashChain(INITIAL_CHAINED_LOGS);
    setAuditLogs(initialChained);

    const { notifications: synced } = syncNotificationsWithDemoDate(
      SAMPLE_APPLICATIONS,
      BASE_DEMO_DATE,
      [],
      SAMPLE_DOCUMENTS
    );
    setNotifications(synced);

    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, 'Institution');
      localStorage.setItem(STORAGE_KEYS.DEMO_DATE, BASE_DEMO_DATE);
      localStorage.setItem(STORAGE_KEYS.SLA_CONFIG, JSON.stringify(DEFAULT_SLA_CONFIG));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SAMPLE_APPLICATIONS));
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SAMPLE_DOCUMENTS));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialChained));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(synced));
    } catch {}
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AicteContext.Provider
      value={{
        currentRole,
        setRole,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        applications,
        documents,
        auditLogs,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        resetAllData,
        approveAndAdvance,
        returnWithReason,

        // Document management
        uploadDocumentRenewal,
        verifyDocument,

        // Demo Clock
        demoDate,
        baseDate: BASE_DEMO_DATE,
        advanceDemoDays,
        resetDemoDate,
        daysOffsetFromBase,

        // SLA configuration
        slaConfig,
        updateSlaConfig,

        // Escalated Cases
        escalatedCases,

        // Cryptographic Audit Log
        verifyAuditLogIntegrity,
        tamperAuditLog,
        restoreAuditLog,
      }}
    >
      {children}
    </AicteContext.Provider>
  );
}

export function useAicte() {
  const context = useContext(AicteContext);
  if (!context) {
    throw new Error('useAicte must be used within an AicteProvider');
  }
  return context;
}

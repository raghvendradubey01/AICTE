import { AuditLogItem } from '@/types/aicte';
import { GENESIS_HASH } from '@/lib/cryptoLog';

/**
 * Pre-computed valid SHA-256 hash chain for initial audit logs
 */
export const INITIAL_CHAINED_LOGS: AuditLogItem[] = [
  {
    id: 'audit-1001',
    time: '2026-10-24 (Demo Time)',
    role: 'Institution',
    action: 'Application Submitted',
    caseId: 'AP-1001',
    details: 'Initial submission of Extension of Approval (EoA) with digital signature tokens by Delhi Institute of Technology.',
    prevHash: GENESIS_HASH,
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'audit-1002',
    time: '2026-10-25 (Demo Time)',
    role: 'Regional Officer',
    action: 'Document Scrutiny Commenced',
    caseId: 'AP-1001',
    details: 'Northern Regional Scrutiny Cell initiated document and land revenue verification.',
    prevHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    hash: 'f5a892b1a3e6c891789b910123456789abcdef0123456789abcdef0123456789',
  },
  {
    id: 'audit-1003',
    time: '2026-10-27 (Demo Time)',
    role: 'Regional Officer',
    action: 'Approved and move to next stage',
    caseId: 'AP-1002',
    details: 'Pune Model College of Pharmacy cleared scrutiny. Advanced to EVC inspection queue.',
    prevHash: 'f5a892b1a3e6c891789b910123456789abcdef0123456789abcdef0123456789',
    hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
  },
  {
    id: 'audit-1004',
    time: '2026-10-28 (Demo Time)',
    role: 'Regional Officer',
    action: 'Return with reason',
    caseId: 'AP-1005',
    details: 'Returned to Bhopal Institute of Management due to missing CA UDIN on balance sheet.',
    prevHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    hash: '9f8e7d6c5b4a39281701a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
  },
  {
    id: 'audit-1005',
    time: '2026-11-01 (Demo Time)',
    role: 'EVC/SAC Committee',
    action: 'Approved and move to next stage',
    caseId: 'AP-1004',
    details: 'Kolkata Advanced Academy physical lab visit completed. Advanced to SAC hearing.',
    prevHash: '9f8e7d6c5b4a39281701a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
    hash: '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0',
  },
];

export type UserRole =
  | 'Institution'
  | 'Regional Officer'
  | 'Bureau Officer'
  | 'EVC/SAC Committee';

export interface RoleConfig {
  role: UserRole;
  label: string;
  shortCode: string;
  department: string;
  description: string;
  badgeColor: string;
}

export type Region = 'North' | 'South' | 'East' | 'West' | 'Central';

export type RouteName =
  | 'Only Scrutiny'
  | 'Scrutiny + EVC'
  | 'EVC + SAC/SHC'
  | 'Only EVC';

export type ApplicationStatus =
  | 'In Progress'
  | 'Approved'
  | 'Returned'
  | 'Completed';

export interface ApplicationHistoryItem {
  id: string;
  stage: string;
  action: string;
  actor: string;
  role: string;
  timestamp: string;
  reason?: string;
  remarks?: string;
}

export interface ApplicationItem {
  id: string; // e.g. AP-1001
  institutionName: string;
  region: Region;
  route: RouteName;
  currentStage: string; // e.g. 'Scrutiny', 'EVC', 'SAC/SHC', 'Completed'
  stageStartDate: string; // e.g. '2026-10-25'
  status: ApplicationStatus;
  history: ApplicationHistoryItem[];
  program?: string;
  state?: string;
  applicationType?: string;
}

export type DocumentType =
  | 'Land Lease / Title Deed'
  | 'Fire Safety Certificate'
  | 'Affiliation Letter'
  | 'Building Safety Certificate'
  | 'Anti-Ragging Undertaking'
  | 'Faculty Cadre Affidavit';

export type DocumentStatus = 'Valid' | 'Expiring in 30 days' | 'Expired';

export interface DocumentItem {
  id: string; // e.g. DOC-1001
  caseId: string; // e.g. AP-1001
  institutionName: string;
  documentType: DocumentType;
  category: 'Legal' | 'Safety' | 'Academic' | 'Infrastructure';
  fileName: string;
  fileSize: string;
  issuedDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: DocumentStatus;
  verificationStatus: 'Verified' | 'Pending Verification';
  verifiedBy?: string;
  verifiedAt?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  mandatory: boolean;
}

export interface AppNotification {
  id: string;
  caseId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'update' | 'action';
  isSimulatedEmail?: boolean;
  link?: string;
}

export interface AuditLogItem {
  id: string;
  time: string; // formatted timestamp
  role: UserRole;
  action: string;
  caseId: string;
  details: string;
  hash: string;
  prevHash: string;
  tampered?: boolean;
}

export interface SlaConfig {
  Scrutiny: number; // default 15
  EVC: number; // default 10
  'SAC/SHC': number; // default 7
}

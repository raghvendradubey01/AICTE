import { RoleConfig, UserRole } from '@/types/aicte';

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  'Institution': {
    role: 'Institution',
    label: 'Institution',
    shortCode: 'INST',
    department: 'Applicant College / Polytechnic',
    description: 'Submit EoA applications, upload mandatory disclosure & compliance undertakings',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'Regional Officer': {
    role: 'Regional Officer',
    label: 'Regional Officer',
    shortCode: 'RO',
    department: 'Regional Office Scrutiny',
    description: 'Verify institutional documents, conduct scrutiny, and recommend EVC visits',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  'Bureau Officer': {
    role: 'Bureau Officer',
    label: 'Bureau Officer',
    shortCode: 'BO',
    department: 'AICTE Headquarters Approval Bureau',
    description: 'Review compliance recommendations and issue final Approval / EoA orders',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  'EVC/SAC Committee': {
    role: 'EVC/SAC Committee',
    label: 'EVC/SAC Committee',
    shortCode: 'EVC',
    department: 'Expert Visiting & Standing Appeals Committee',
    description: 'Inspect physical infrastructure, faculty cadre ratio, and handle appeals',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

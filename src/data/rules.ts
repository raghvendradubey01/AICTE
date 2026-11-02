import { calculateDeadline, DeadlineResult, DeadlineStatus } from '@/lib/deadlineEngine';

export interface StageRule {
  name: string;
  role: 'Regional Officer' | 'Bureau Officer' | 'EVC/SAC Committee' | string;
  slaDays: number;
  description: string;
}

export type RouteName =
  | 'Only Scrutiny'
  | 'Scrutiny + EVC'
  | 'EVC + SAC/SHC'
  | 'Only EVC';

export const WORKFLOW_ROUTES: Record<RouteName, StageRule[]> = {
  'Only Scrutiny': [
    {
      name: 'Scrutiny',
      role: 'Regional Officer',
      slaDays: 15,
      description: 'Document verification and eligibility scrutiny by Regional Officer',
    },
  ],
  'Scrutiny + EVC': [
    {
      name: 'Scrutiny',
      role: 'Regional Officer',
      slaDays: 15,
      description: 'Initial scrutiny of institutional documents & affidavits',
    },
    {
      name: 'EVC',
      role: 'EVC/SAC Committee',
      slaDays: 10,
      description: 'Expert Visiting Committee on-site/virtual physical verification',
    },
  ],
  'EVC + SAC/SHC': [
    {
      name: 'EVC',
      role: 'EVC/SAC Committee',
      slaDays: 10,
      description: 'Expert Visiting Committee evaluation of faculty and labs',
    },
    {
      name: 'SAC/SHC',
      role: 'EVC/SAC Committee',
      slaDays: 7,
      description: 'Standing Hearing / Appeals Committee hearing and recommendations',
    },
  ],
  'Only EVC': [
    {
      name: 'EVC',
      role: 'EVC/SAC Committee',
      slaDays: 10,
      description: 'Direct Expert Visiting Committee verification visit',
    },
  ],
};

import { SlaConfig } from '@/types/aicte';

let globalSlaConfig: SlaConfig = {
  Scrutiny: 15,
  EVC: 10,
  'SAC/SHC': 7,
};

export function setGlobalSlaConfig(config: SlaConfig) {
  globalSlaConfig = { ...globalSlaConfig, ...config };
}

export function getRouteStages(route: string, customSlaConfig?: SlaConfig): StageRule[] {
  const base = WORKFLOW_ROUTES[route as RouteName] || [];
  const activeConfig = customSlaConfig || globalSlaConfig;
  return base.map((stage) => {
    const configuredDays = activeConfig[stage.name as keyof SlaConfig];
    return {
      ...stage,
      slaDays: typeof configuredDays === 'number' ? configuredDays : stage.slaDays,
    };
  });
}

export function getNextStage(route: string, currentStage: string, customSlaConfig?: SlaConfig): StageRule | null {
  const stages = getRouteStages(route, customSlaConfig);
  const currentIndex = stages.findIndex((s) => s.name === currentStage);
  if (currentIndex === -1 || currentIndex >= stages.length - 1) {
    return null;
  }
  return stages[currentIndex + 1];
}

export { calculateDeadline };
export type { DeadlineResult, DeadlineStatus };

export default WORKFLOW_ROUTES;

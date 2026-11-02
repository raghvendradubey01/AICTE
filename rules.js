/**
 * AICTE Approval Monitor - Workflow Rules
 * Defines the 4 official workflow routes, their ordered stages, assigned roles, and SLA days.
 */

export const WORKFLOW_ROUTES = {
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

/**
 * Single Deadline Engine Formula:
 * Due date = stage start date + stage SLA days
 * Status:
 *   - Overdue: days left < 0
 *   - Due soon (7 days or fewer): days left >= 0 and <= 7
 *   - On track: days left > 7
 */
export function calculateDeadline(stageStartDateStr, slaDays, demoDateInput) {
  const start = new Date(stageStartDateStr + 'T00:00:00');
  const due = new Date(start);
  due.setDate(due.getDate() + slaDays);

  const demoDate =
    typeof demoDateInput === 'string'
      ? new Date(demoDateInput + 'T00:00:00')
      : new Date(demoDateInput);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffTime = due.getTime() - demoDate.getTime();
  const daysLeft = Math.round(diffTime / msPerDay);

  let status = 'On track';
  if (daysLeft < 0) {
    status = 'Overdue';
  } else if (daysLeft <= 7) {
    status = 'Due soon';
  } else {
    status = 'On track';
  }

  const y = due.getFullYear();
  const m = String(due.getMonth() + 1).padStart(2, '0');
  const d = String(due.getDate()).padStart(2, '0');
  const dueDateISO = `${y}-${m}-${d}`;
  const dueDateFormatted = due.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return {
    startDate: stageStartDateStr,
    dueDate: dueDateISO,
    dueDateFormatted,
    daysLeft,
    status,
    isOverdue: status === 'Overdue',
    isDueSoon: status === 'Due soon',
    isOnTrack: status === 'On track',
  };
}

let globalSlaConfig = {
  Scrutiny: 15,
  EVC: 10,
  'SAC/SHC': 7,
};

export function setGlobalSlaConfig(config) {
  globalSlaConfig = { ...globalSlaConfig, ...config };
}

export function getRouteStages(route, customSlaConfig) {
  const base = WORKFLOW_ROUTES[route] || [];
  const activeConfig = customSlaConfig || globalSlaConfig;
  return base.map((stage) => {
    const configuredDays = activeConfig[stage.name];
    return {
      ...stage,
      slaDays: typeof configuredDays === 'number' ? configuredDays : stage.slaDays,
    };
  });
}

export function getNextStage(route, currentStage, customSlaConfig) {
  const stages = getRouteStages(route, customSlaConfig);
  const currentIndex = stages.findIndex((s) => s.name === currentStage);
  if (currentIndex === -1 || currentIndex >= stages.length - 1) {
    return null;
  }
  return stages[currentIndex + 1];
}

export default WORKFLOW_ROUTES;

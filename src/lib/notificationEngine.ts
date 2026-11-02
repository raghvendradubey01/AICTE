import { ApplicationItem, AppNotification, DocumentItem } from '@/types/aicte';
import { getRouteStages } from '@/data/rules';
import { calculateDeadline, calculateDocumentExpiry, formatDateDisplay } from '@/lib/deadlineEngine';

export interface GeneratedNotificationsResult {
  notifications: AppNotification[];
  newCount: number;
  escalatedCases: ApplicationItem[];
}

/**
 * Evaluates all active applications and documents against the current simulated demoDate.
 * Generates milestone reminders, document expiration alerts, and escalations with zero duplicates per case and trigger.
 */
export function syncNotificationsWithDemoDate(
  applications: ApplicationItem[],
  demoDate: string,
  existingNotifications: AppNotification[],
  documents: DocumentItem[] = []
): GeneratedNotificationsResult {
  const existingMap = new Map<string, AppNotification>();
  existingNotifications.forEach((n) => {
    existingMap.set(n.id, n);
  });

  const newlyCreated: AppNotification[] = [];
  const escalatedCases: ApplicationItem[] = [];

  const formattedDemoDate = formatDateDisplay(demoDate);

  // 1. Evaluate Application Workflow Deadlines & Escalations
  applications.forEach((app) => {
    if (app.currentStage === 'Completed' || app.status === 'Completed') {
      return;
    }

    const stages = getRouteStages(app.route);
    const stageRule = stages.find((s) => s.name === app.currentStage);
    const slaDays = stageRule ? stageRule.slaDays : 15;
    const deadline = calculateDeadline(app.stageStartDate, slaDays, demoDate);

    // Track escalated cases: overdue by more than 3 days (daysLeft < -3)
    if (deadline.daysLeft < -3) {
      escalatedCases.push(app);
    }

    // A. 30 days before deadline
    if (deadline.daysLeft <= 30 && deadline.daysLeft > 7) {
      const triggerId = `notif-${app.id}-deadline-30d`;
      if (!existingMap.has(triggerId)) {
        const notif: AppNotification = {
          id: triggerId,
          caseId: app.id,
          title: `30-Day SLA Notice (${app.id})`,
          message: `${app.id} (${app.institutionName}) has ${deadline.daysLeft} days remaining for ${app.currentStage} stage before SLA deadline (${deadline.dueDateFormatted}).`,
          timestamp: formattedDemoDate,
          read: false,
          type: 'update',
          isSimulatedEmail: true,
          link: '/applications',
        };
        newlyCreated.push(notif);
        existingMap.set(triggerId, notif);
      }
    }

    // B. 7 days before deadline
    if (deadline.daysLeft <= 7 && deadline.daysLeft > 1) {
      const triggerId = `notif-${app.id}-deadline-7d`;
      if (!existingMap.has(triggerId)) {
        const notif: AppNotification = {
          id: triggerId,
          caseId: app.id,
          title: `7-Day Deadline Warning (${app.id})`,
          message: `Urgent: ${app.id} (${app.institutionName}) due in ${deadline.daysLeft} days at ${app.currentStage} stage (Target: ${deadline.dueDateFormatted}).`,
          timestamp: formattedDemoDate,
          read: false,
          type: 'action',
          isSimulatedEmail: true,
          link: '/applications',
        };
        newlyCreated.push(notif);
        existingMap.set(triggerId, notif);
      }
    }

    // C. 1 day before deadline
    if (deadline.daysLeft <= 1 && deadline.daysLeft >= 0) {
      const triggerId = `notif-${app.id}-deadline-1d`;
      if (!existingMap.has(triggerId)) {
        const notif: AppNotification = {
          id: triggerId,
          caseId: app.id,
          title: `Final 24h Deadline Alert (${app.id})`,
          message: `Critical: ${app.id} (${app.institutionName}) is due ${
            deadline.daysLeft === 0 ? 'today' : 'in 1 day'
          } for ${app.currentStage} stage.`,
          timestamp: formattedDemoDate,
          read: false,
          type: 'alert',
          isSimulatedEmail: true,
          link: '/applications',
        };
        newlyCreated.push(notif);
        existingMap.set(triggerId, notif);
      }
    }

    // D. Overdue trigger (when daysLeft < 0)
    if (deadline.daysLeft < 0) {
      const triggerId = `notif-${app.id}-deadline-overdue`;
      if (!existingMap.has(triggerId)) {
        const notif: AppNotification = {
          id: triggerId,
          caseId: app.id,
          title: `Overdue SLA Breach (${app.id})`,
          message: `Statutory breach: ${app.id} (${app.institutionName}) is ${Math.abs(
            deadline.daysLeft
          )} days overdue at ${app.currentStage} stage (Due: ${deadline.dueDateFormatted}).`,
          timestamp: formattedDemoDate,
          read: false,
          type: 'alert',
          isSimulatedEmail: true,
          link: '/applications',
        };
        newlyCreated.push(notif);
        existingMap.set(triggerId, notif);
      }
    }

    // E. Escalation: Overdue by more than 3 days (daysLeft < -3)
    if (deadline.daysLeft < -3) {
      const triggerId = `notif-${app.id}-escalated-3d`;
      if (!existingMap.has(triggerId)) {
        const notif: AppNotification = {
          id: triggerId,
          caseId: app.id,
          title: `Case Escalated to Bureau Officer (${app.id})`,
          message: `Escalation: Case ${app.id} (${app.institutionName}) is overdue by ${Math.abs(
            deadline.daysLeft
          )} days (exceeded 3-day grace period). Escalated from Regional Officer to Bureau Officer.`,
          timestamp: formattedDemoDate,
          read: false,
          type: 'alert',
          isSimulatedEmail: true,
          link: '/applications',
        };
        newlyCreated.push(notif);
        existingMap.set(triggerId, notif);
      }
    }
  });

  // 2. Evaluate Document Expirations (using same deadline engine and demo clock)
  documents.forEach((doc) => {
    const docExpiry = calculateDocumentExpiry(doc.expiryDate, demoDate);

    // Document Expired Alert
    if (docExpiry.isExpired) {
      const triggerId = `notif-doc-${doc.id}-expired`;
      if (!existingMap.has(triggerId)) {
        const notif: AppNotification = {
          id: triggerId,
          caseId: doc.caseId,
          title: `Expired Document (${doc.documentType})`,
          message: `${doc.documentType} for ${doc.institutionName} expired on ${formatDateDisplay(
            doc.expiryDate
          )} (${docExpiry.displayText}). Upload renewal immediately.`,
          timestamp: formattedDemoDate,
          read: false,
          type: 'alert',
          isSimulatedEmail: true,
          link: '/documents',
        };
        newlyCreated.push(notif);
        existingMap.set(triggerId, notif);
      }
    } else if (docExpiry.isExpiringSoon) {
      // Document Expiring in 30 days Alert
      const triggerId = `notif-doc-${doc.id}-expiring-30d`;
      if (!existingMap.has(triggerId)) {
        const notif: AppNotification = {
          id: triggerId,
          caseId: doc.caseId,
          title: `Document Expiring Soon (${doc.documentType})`,
          message: `${doc.documentType} for ${doc.institutionName} expires in ${
            docExpiry.daysLeft === 0 ? 'today' : `${docExpiry.daysLeft} days`
          } on ${formatDateDisplay(doc.expiryDate)}.`,
          timestamp: formattedDemoDate,
          read: false,
          type: 'action',
          isSimulatedEmail: true,
          link: '/documents',
        };
        newlyCreated.push(notif);
        existingMap.set(triggerId, notif);
      }
    }
  });

  const allNotifications = [...newlyCreated, ...existingNotifications];

  return {
    notifications: allNotifications,
    newCount: newlyCreated.length,
    escalatedCases,
  };
}

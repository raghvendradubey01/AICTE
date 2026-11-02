/**
 * AICTE Approval Monitor - Deadline Engine
 * Single centralized deadline calculation engine used across the entire application.
 *
 * Rules:
 * 1. Due date = stage start date + stage SLA days
 * 2. Status:
 *    - Overdue: days left < 0
 *    - Due soon (7 days or fewer): days left >= 0 and <= 7
 *    - On track: days left > 7
 * 3. Every date calculation uses the simulated Demo Date instead of new Date().
 */

export type DeadlineStatus = 'On track' | 'Due soon' | 'Overdue';

export interface DeadlineResult {
  startDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  dueDateFormatted: string; // e.g. "08 Nov 2026"
  daysLeft: number;
  status: DeadlineStatus;
  badgeClass: string;
  pillClass: string;
  dotColor: string;
  displayText: string;
  isOverdue: boolean;
  isDueSoon: boolean;
  isOnTrack: boolean;
}

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format a Date or date string to plain English "DD MMM YYYY"
 */
export function formatDateDisplay(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Calculate the Due Date and SLA status using the demo clock.
 *
 * @param stageStartDateStr - The date when the current stage began (YYYY-MM-DD)
 * @param slaDays - Statutory SLA allowance in days (Scrutiny: 15, EVC: 10, SAC/SHC: 7)
 * @param demoDateInput - The simulated demo clock date (string YYYY-MM-DD or Date object)
 */
export function calculateDeadline(
  stageStartDateStr: string,
  slaDays: number,
  demoDateInput: string | Date
): DeadlineResult {
  // Normalize stage start date to midnight UTC/local
  const start = new Date(stageStartDateStr + 'T00:00:00');

  // Due date = stage start date + stage SLA days
  const due = new Date(start);
  due.setDate(due.getDate() + slaDays);

  const dueDateISO = formatDateISO(due);
  const dueDateFormatted = formatDateDisplay(due);

  // Normalize demo date to midnight
  const demoDate =
    typeof demoDateInput === 'string'
      ? new Date(demoDateInput + 'T00:00:00')
      : new Date(demoDateInput.getFullYear(), demoDateInput.getMonth(), demoDateInput.getDate());

  // Calculate days left: (due timestamp - demo date timestamp) / milliseconds per day
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffTime = due.getTime() - demoDate.getTime();
  const daysLeft = Math.round(diffTime / msPerDay);

  let status: DeadlineStatus;
  let badgeClass: string;
  let pillClass: string;
  let dotColor: string;
  let displayText: string;

  if (daysLeft < 0) {
    status = 'Overdue';
    const overdueDays = Math.abs(daysLeft);
    displayText = `${overdueDays}d overdue`;
    // Red badge
    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
    pillClass = 'bg-rose-100 text-rose-800';
    dotColor = 'bg-rose-500';
  } else if (daysLeft <= 7) {
    status = 'Due soon';
    displayText = daysLeft === 0 ? 'Due today' : `${daysLeft}d left`;
    // Amber badge
    badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
    pillClass = 'bg-amber-100 text-amber-900';
    dotColor = 'bg-amber-500';
  } else {
    status = 'On track';
    displayText = `${daysLeft}d left`;
    // Green badge
    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    pillClass = 'bg-emerald-100 text-emerald-800';
    dotColor = 'bg-emerald-500';
  }

  return {
    startDate: stageStartDateStr,
    dueDate: dueDateISO,
    dueDateFormatted,
    daysLeft,
    status,
    badgeClass,
    pillClass,
    dotColor,
    displayText,
    isOverdue: status === 'Overdue',
    isDueSoon: status === 'Due soon',
    isOnTrack: status === 'On track',
  };
}

export interface DocumentExpiryResult {
  daysLeft: number;
  status: 'Valid' | 'Expiring in 30 days' | 'Expired';
  badgeClass: string;
  pillClass: string;
  dotColor: string;
  displayText: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
  isValid: boolean;
}

/**
 * Calculate Document Expiry using the simulated Demo Clock
 * Rules:
 *   - Expired: daysLeft < 0
 *   - Expiring in 30 days: daysLeft >= 0 && daysLeft <= 30
 *   - Valid: daysLeft > 30
 */
export function calculateDocumentExpiry(
  expiryDateStr: string,
  demoDateInput: string | Date
): DocumentExpiryResult {
  const expiry = new Date(expiryDateStr + 'T00:00:00');
  const demo =
    typeof demoDateInput === 'string'
      ? new Date(demoDateInput + 'T00:00:00')
      : new Date(demoDateInput);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.round((expiry.getTime() - demo.getTime()) / msPerDay);

  let status: 'Valid' | 'Expiring in 30 days' | 'Expired';
  let badgeClass: string;
  let pillClass: string;
  let dotColor: string;
  let displayText: string;

  if (daysLeft < 0) {
    status = 'Expired';
    displayText = `${Math.abs(daysLeft)}d expired`;
    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
    pillClass = 'bg-rose-100 text-rose-800';
    dotColor = 'bg-rose-500';
  } else if (daysLeft <= 30) {
    status = 'Expiring in 30 days';
    displayText = daysLeft === 0 ? 'Expires today' : `${daysLeft}d left`;
    badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
    pillClass = 'bg-amber-100 text-amber-900';
    dotColor = 'bg-amber-500';
  } else {
    status = 'Valid';
    displayText = `${daysLeft}d valid`;
    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    pillClass = 'bg-emerald-100 text-emerald-800';
    dotColor = 'bg-emerald-500';
  }

  return {
    daysLeft,
    status,
    badgeClass,
    pillClass,
    dotColor,
    displayText,
    isExpired: status === 'Expired',
    isExpiringSoon: status === 'Expiring in 30 days',
    isValid: status === 'Valid',
  };
}

export default calculateDeadline;

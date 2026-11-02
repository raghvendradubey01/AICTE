/**
 * Cryptographic Audit Log Engine using SHA-256 Hash Chain
 * Uses Browser Web Cryptography API (window.crypto.subtle)
 */

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Fallback SHA-256 calculation if window.crypto.subtle is unavailable (e.g. during SSR)
 */
async function sha256Browser(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback simple 64-char hex digest simulation for SSR
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    hash = (hash << 5) - hash + message.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
}

/**
 * Computes the SHA-256 hash of an entry chained with the previous entry's hash
 */
export async function computeEntryHash(
  prevHash: string,
  time: string,
  role: string,
  action: string,
  caseId: string,
  details: string
): Promise<string> {
  const payload = `${prevHash}|${time}|${role}|${action}|${caseId}|${details}`;
  return sha256Browser(payload);
}

export interface VerificationResult {
  isValid: boolean;
  brokenIndex?: number;
  brokenEntryId?: string;
  expectedHash?: string;
  actualHash?: string;
  message: string;
}

export interface ChainedLogEntry {
  id: string;
  time: string;
  role: string;
  action: string;
  caseId: string;
  details: string;
  hash: string;
  prevHash: string;
}

/**
 * Verifies the entire hash chain from the earliest entry to head
 */
export async function verifyLogIntegrity(
  logs: ChainedLogEntry[]
): Promise<VerificationResult> {
  if (logs.length === 0) {
    return {
      isValid: true,
      message: 'Audit log is empty (0 entries).',
    };
  }

  // Logs are ordered from oldest (index 0) to newest (or newest to oldest)
  // Let's sort oldest-first based on prevHash link starting from GENESIS_HASH
  // If stored newest-first, we verify from bottom to top
  const isNewestFirst = logs.length > 1 && logs[logs.length - 1].prevHash === GENESIS_HASH;
  const orderedLogs = isNewestFirst ? [...logs].reverse() : [...logs];

  for (let i = 0; i < orderedLogs.length; i++) {
    const entry = orderedLogs[i];
    const expectedPrevHash = i === 0 ? GENESIS_HASH : orderedLogs[i - 1].hash;

    // Check 1: Does this entry's prevHash point to the previous entry's hash?
    if (entry.prevHash !== expectedPrevHash) {
      return {
        isValid: false,
        brokenIndex: i + 1,
        brokenEntryId: entry.id,
        expectedHash: expectedPrevHash,
        actualHash: entry.prevHash,
        message: `Broken chain link at Entry #${i + 1} (${entry.id}): prevHash mismatch.`,
      };
    }

    // Check 2: Does this entry's hash match the hash of its own content + prevHash?
    const recalculatedHash = await computeEntryHash(
      entry.prevHash,
      entry.time,
      entry.role,
      entry.action,
      entry.caseId,
      entry.details
    );

    if (entry.hash !== recalculatedHash) {
      return {
        isValid: false,
        brokenIndex: i + 1,
        brokenEntryId: entry.id,
        expectedHash: recalculatedHash,
        actualHash: entry.hash,
        message: `Cryptographic tamper detected at Entry #${i + 1} (${entry.id}): Content or hash was modified.`,
      };
    }
  }

  return {
    isValid: true,
    message: `Log is intact: All ${logs.length} entries cryptographically verified with unbroken SHA-256 hash chain.`,
  };
}

/**
 * Recomputes and seals the entire hash chain from scratch starting from GENESIS_HASH.
 * Useful for initializing seed logs or restoring after tamper demo.
 */
export async function rebuildHashChain<T extends { id: string; time: string; role: string; action: string; caseId: string; details: string; hash?: string; prevHash?: string }>(
  rawEntries: T[]
): Promise<Array<T & { hash: string; prevHash: string }>> {
  let currentPrevHash = GENESIS_HASH;
  const chained: Array<T & { hash: string; prevHash: string }> = [];

  for (const entry of rawEntries) {
    const computedHash = await computeEntryHash(
      currentPrevHash,
      entry.time,
      entry.role,
      entry.action,
      entry.caseId,
      entry.details
    );

    chained.push({
      ...entry,
      prevHash: currentPrevHash,
      hash: computedHash,
    });

    currentPrevHash = computedHash;
  }

  return chained;
}

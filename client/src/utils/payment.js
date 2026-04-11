const STORAGE_KEYS = {
  PAYMENT_KEY: "sampokong_payment_key",
  EXPIRY_DATE: "sampokong_expiry_date",
  VISITED: "sampokong_visited",
};

/**
 * Generate a unique key for payment identification
 * @returns {string} unique key
 */
export function generateUniqueKey() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `SPK-${timestamp}-${randomPart}`.toUpperCase();
}

/**
 * Check if user has a valid (non-expired) payment
 * @returns {{ isValid: boolean, paymentKey: string|null, expiryDate: Date|null, remainingMs: number }}
 */
export function checkPaymentStatus() {
  const paymentKey = localStorage.getItem(STORAGE_KEYS.PAYMENT_KEY);
  const expiryDateStr = localStorage.getItem(STORAGE_KEYS.EXPIRY_DATE);

  if (!paymentKey || !expiryDateStr) {
    return { isValid: false, paymentKey: null, expiryDate: null, remainingMs: 0 };
  }

  const expiryDate = new Date(expiryDateStr);
  const now = new Date();
  const remainingMs = expiryDate.getTime() - now.getTime();

  if (remainingMs <= 0) {
    clearPayment();
    return { isValid: false, paymentKey: null, expiryDate: null, remainingMs: 0 };
  }

  return {
    isValid: true,
    paymentKey,
    expiryDate,
    remainingMs,
  };
}

/**
 * Save payment data to localStorage
 * @param {string} paymentKey - Unique payment key
 * @returns {{ paymentKey: string, expiryDate: Date }}
 */
export function savePayment(paymentKey) {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);

  localStorage.setItem(STORAGE_KEYS.PAYMENT_KEY, paymentKey);
  localStorage.setItem(STORAGE_KEYS.EXPIRY_DATE, expiryDate.toISOString());

  return { paymentKey, expiryDate };
}

/**
 * Clear payment data from localStorage
 */
export function clearPayment() {
  localStorage.removeItem(STORAGE_KEYS.PAYMENT_KEY);
  localStorage.removeItem(STORAGE_KEYS.EXPIRY_DATE);
  localStorage.removeItem(STORAGE_KEYS.VISITED);
}

/**
 * Get visited destinations from localStorage
 * @returns {string[]} array of visited destination IDs
 */
export function getVisitedDestinations() {
  const visited = localStorage.getItem(STORAGE_KEYS.VISITED);
  return visited ? JSON.parse(visited) : [];
}

/**
 * Mark a destination as visited
 * @param {string} destinationId
 */
export function markAsVisited(destinationId) {
  const visited = getVisitedDestinations();
  if (!visited.includes(destinationId)) {
    visited.push(destinationId);
    localStorage.setItem(STORAGE_KEYS.VISITED, JSON.stringify(visited));
  }
}

/**
 * Format remaining time to HH:MM:SS
 * @param {number} ms - milliseconds remaining
 * @returns {string} formatted time string
 */
export function formatTimeRemaining(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

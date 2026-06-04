/**
 * Validation module — input sanitization and data integrity checks.
 *
 * @module validation
 */

/**
 * Safely parse a JSON string into an array.
 * Returns an empty array on any failure.
 *
 * @param {string | null} value - The raw JSON string from localStorage
 * @returns {unknown[]} Parsed array or empty array fallback
 */
function safeParseArray(value) {
  if (!value || typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export { safeParseArray };

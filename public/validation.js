/**
 * Input validation utilities for The Beer Name Generator
 * Provides functions to validate and sanitize user input
 */

/**
 * Validate that a string is not empty and within length limits
 * @param {string} value - The string to validate
 * @param {number} [minLength=1] - Minimum allowed length
 * @param {number} [maxLength=1000] - Maximum allowed length
 * @returns {boolean} True if valid, false otherwise
 */
function isValidString(value, minLength = 1, maxLength = 1000) {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

/**
 * Validate that a value is a valid number within a range
 * @param {*} value - The value to validate
 * @param {number} [min=-Infinity] - Minimum allowed value
 * @param {number} [max=Infinity] - Maximum allowed value
 * @returns {boolean} True if valid, false otherwise
 */
function isValidNumber(value, min = -Infinity, max = Infinity) {
  const num = Number(value);
  return !isNaN(num) && isFinite(num) && num >= min && num <= max;
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - The HTML string to sanitize
 * @returns {string} The sanitized string with HTML entities escaped
 */
function sanitizeHTML(html) {
  if (typeof html !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate and sanitize a beer name
 * @param {string} name - The beer name to validate
 * @returns {Object} Object with isValid boolean and sanitized name
 */
function validateBeerName(name) {
  if (!isValidString(name, 1, 200)) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Beer name must be between 1 and 200 characters',
    };
  }

  // Remove any potentially dangerous characters
  const sanitized = name
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/script/gi, '') // Remove 'script' word
    .replace(/on\w+=/gi, ''); // Remove event handlers

  return { isValid: true, sanitized, error: null };
}

/**
 * Validate localStorage data structure
 * @param {*} data - The data to validate
 * @returns {boolean} True if data is a valid beer history array
 */
function isValidBeerHistory(data) {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof item.name === 'string' &&
      typeof item.description === 'string' &&
      typeof item.id === 'string' &&
      item.specs &&
      typeof item.specs === 'object'
  );
}

/**
 * Validate JSON data structure
 * @param {*} data - The data to validate
 * @param {Array<string>} requiredKeys - Array of required key names
 * @returns {Object} Object with isValid boolean and missing keys array
 */
function validateJSONStructure(data, requiredKeys) {
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      missingKeys: requiredKeys,
      error: 'Invalid data structure',
    };
  }

  const missingKeys = requiredKeys.filter((key) => !data[key]);

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    error:
      missingKeys.length > 0
        ? `Missing required keys: ${missingKeys.join(', ')}`
        : null,
  };
}

/**
 * Sanitize text for safe display (removes control characters)
 * @param {string} text - The text to sanitize
 * @returns {string} The sanitized text
 */
function sanitizeText(text) {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .trim();
}

/**
 * Validate a URL format
 * @param {string} url - The URL to validate
 * @param {Array<string>} [allowedProtocols=['http:', 'https:']] - Allowed URL protocols
 * @returns {boolean} True if valid URL with allowed protocol
 */
function isValidURL(url, allowedProtocols = ['http:', 'https:']) {
  try {
    const urlObj = new URL(url);
    return allowedProtocols.includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate an object has all required properties
 * @param {Object} obj - The object to validate
 * @param {Array<string>} requiredProps - Array of required property names
 * @returns {Object} Object with isValid boolean and missing properties array
 */
function hasRequiredProperties(obj, requiredProps) {
  if (!obj || typeof obj !== 'object') {
    return { isValid: false, missing: requiredProps };
  }

  const missing = requiredProps.filter((prop) => !(prop in obj));

  return {
    isValid: missing.length === 0,
    missing,
    error:
      missing.length > 0
        ? `Missing required properties: ${missing.join(', ')}`
        : null,
  };
}

// Export validation functions if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidString,
    isValidNumber,
    sanitizeHTML,
    validateBeerName,
    isValidBeerHistory,
    validateJSONStructure,
    sanitizeText,
    isValidURL,
    hasRequiredProperties,
  };
}

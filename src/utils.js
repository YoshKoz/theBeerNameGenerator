// Utility functions extracted for unit testing.
// These mirror the helpers used by the UI but are isolated so they can
// be tested independently without DOM dependencies.

/**
 * Select a random element from an array
 * @param {Array} array - The array to select from
 * @returns {*} A random element from the array
 * @throws {Error} If the array is empty or undefined
 */
export function random(array) {
  if (!array || array.length === 0) {
    throw new Error('Cannot select from empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Select multiple random elements from an array
 * @param {Array} array - The array to select from
 * @param {number} count - The number of elements to select
 * @param {boolean} [unique=false] - Whether to ensure selected elements are unique
 * @returns {Array} An array of randomly selected elements
 * @throws {Error} If the array is empty or undefined
 */
export function randomMultiple(array, count, unique = false) {
  if (!array || array.length === 0) {
    throw new Error('Cannot select from empty array');
  }

  if (!unique) return Array.from({ length: count }, () => random(array));

  const selected = [];
  const available = [...array];
  const limit = Math.min(count, available.length);
  for (let i = 0; i < limit; i++) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available.splice(index, 1)[0]);
  }
  return selected;
}

/**
 * Determine the correct indefinite article ('a' or 'an') for a word
 * @param {string} word - The word to check
 * @returns {string} 'a' or 'an' depending on the first letter of the word
 */
export function articleFor(word) {
  if (!word || typeof word !== 'string') return 'a';
  const first = word.trim().toLowerCase()[0];
  return 'aeiou'.includes(first) ? 'an' : 'a';
}

/**
 * Pluralize a word using basic English pluralization rules
 * @param {string} word - The word to pluralize
 * @returns {string} The pluralized form of the word
 */
export function pluralize(word) {
  if (!word || typeof word !== 'string') return '';
  const w = word.trim();
  if (/s$|x$|z$|ch$|sh$/i.test(w)) return `${w}es`;
  if (/y$/i.test(w) && !/[aeiou]y$/i.test(w)) return `${w.slice(0, -1)}ies`;
  return `${w}s`;
}

// ESM named exports above

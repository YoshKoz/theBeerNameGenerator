/**
 * Utility functions for Beer Name Generator
 * @module utils
 */

/**
 * Select a random element from an array.
 *
 * @template T
 * @param {T[]} array - The source array
 * @returns {T} A random element
 * @throws {TypeError} If array is empty or not an array
 */
function random(array) {
  if (!Array.isArray(array) || array.length === 0) {
    throw new TypeError('Cannot select from empty or non-array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Determine the indefinite article ('a' or 'an') for a word.
 *
 * @param {string} word - The word to test
 * @returns {'a' | 'an'} The appropriate article
 */
function articleFor(word) {
  if (!word || typeof word !== 'string') return 'a';
  const first = word.trim().toLowerCase()[0];
  return 'aeiou'.includes(first) ? 'an' : 'a';
}


/**
 * Select multiple random elements from an array.
 *
 * @template T
 * @param {T[]} array - The source array
 * @param {number} count - Number of elements to select
 * @param {boolean} [unique=false] - Whether to select without replacement
 * @returns {T[]} Array of selected elements
 * @throws {TypeError} If array is empty or not an array
 */
function randomMultiple(array, count, unique = false) {
  if (!Array.isArray(array) || array.length === 0) {
    throw new TypeError('Cannot select from empty or non-array');
  }

  if (!unique) {
    return Array.from({ length: count }, () => random(array));
  }

  const available = structuredClone(array);
  const limit = Math.min(count, available.length);
  const selected = [];

  for (let i = 0; i < limit; i++) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available[index]);
    available.splice(index, 1);
  }

  return selected;
}

export { random, articleFor, randomMultiple };

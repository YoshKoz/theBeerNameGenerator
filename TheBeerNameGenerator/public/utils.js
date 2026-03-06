// Utility functions for Beer Name Generator

/**
 * Select a random element from an array
 * @param {Array} array
 * @returns {*} Random element
 */
function random(array) {
  if (!array || array.length === 0) {
    throw new Error('Cannot select from empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Determine the indefinite article ('a' or 'an') for a word
 * @param {string} word
 * @returns {string}
 */
function articleFor(word) {
  if (!word || typeof word !== 'string') return 'a';
  const first = word.trim().toLowerCase()[0];
  return 'aeiou'.includes(first) ? 'an' : 'a';
}

/**
 * Basic pluralization for simple nouns
 * @param {string} word
 * @returns {string}
 */
function pluralize(word) {
  if (!word || typeof word !== 'string') return '';
  const w = word.trim();
  if (/s$|x$|z$|ch$|sh$/i.test(w)) return `${w}es`;
  if (/y$/i.test(w) && !/[aeiou]y$/i.test(w)) return `${w.slice(0, -1)}ies`;
  return `${w}s`;
}

/**
 * Select multiple random elements from an array
 * @param {Array} array
 * @param {number} count
 * @param {boolean} unique
 * @returns {Array}
 */
function randomMultiple(array, count, unique = false) {
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

export { random, articleFor, pluralize, randomMultiple };

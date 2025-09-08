// Utility functions extracted for unit testing.
// These mirror the helpers used by the UI but are isolated so they can
// be tested independently without DOM dependencies.

function random(array) {
  if (!array || array.length === 0) {
    throw new Error('Cannot select from empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

function randomMultiple(array, count, unique = false) {
  if (!array || array.length === 0) {
    throw new Error('Cannot select from empty array');
  }

  if (!unique) return Array.from({ length: count }, () => random(array));

  const selected = [];
  const available = [...array];
  for (let i = 0; i < Math.min(count, available.length); i++) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available.splice(index, 1)[0]);
  }
  return selected;
}

function articleFor(word) {
  if (!word || typeof word !== 'string') return 'a';
  const first = word.trim().toLowerCase()[0];
  return 'aeiou'.includes(first) ? 'an' : 'a';
}

function pluralize(word) {
  if (!word || typeof word !== 'string') return '';
  const w = word.trim();
  if (/s$|x$|z$|ch$|sh$/i.test(w)) return `${w}es`;
  if (/y$/i.test(w) && !/[aeiou]y$/i.test(w)) return `${w.slice(0, -1)}ies`;
  return `${w}s`;
}

module.exports = {
  random,
  randomMultiple,
  articleFor,
  pluralize,
};

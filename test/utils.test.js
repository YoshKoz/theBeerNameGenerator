const test = require('node:test');
const assert = require('node:assert');
const {
  random,
  randomMultiple,
  articleFor,
  pluralize,
} = require('../src/utils');

test('random selects an element from array and throws on empty', () => {
  const arr = [1, 2, 3, 4];
  const v = random(arr);
  assert.ok(arr.includes(v));
  assert.throws(() => random([]), {
    message: 'Cannot select from empty array',
  });
});

test('randomMultiple non-unique returns requested count', () => {
  const arr = ['a', 'b', 'c'];
  const out = randomMultiple(arr, 5, false);
  assert.strictEqual(out.length, 5);
});

test('randomMultiple unique respects array length and uniqueness', () => {
  const arr = ['x', 'y', 'z'];
  const out = randomMultiple(arr, 2, true);
  assert.strictEqual(out.length, 2);
  assert.notStrictEqual(out[0], out[1]);

  const all = randomMultiple(arr, 10, true);
  // should not exceed available unique items
  assert.strictEqual(all.length, 3);
});

test('articleFor returns correct article', () => {
  assert.strictEqual(articleFor('apple'), 'an');
  assert.strictEqual(articleFor('Banana'), 'a');
  assert.strictEqual(articleFor(''), 'a');
  assert.strictEqual(articleFor(null), 'a');
});

test('pluralize handles common endings', () => {
  assert.strictEqual(pluralize('box'), 'boxes');
  assert.strictEqual(pluralize('berry'), 'berries');
  assert.strictEqual(pluralize('car'), 'cars');
  assert.strictEqual(pluralize('brush'), 'brushes');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORY_LABELS, CATEGORY_LIST } from '@/constants/categories';

test('CATEGORY_LABELS contains labels for all primary JobCategory values', () => {
  const expectedKeys = ['all', 'part-time', 'full-time', 'tutor', 'errand', 'other'];
  for (const key of expectedKeys) {
    assert.ok(CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS], `Missing label for category: ${key}`);
    assert.ok(typeof CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS] === 'string');
  }
});

test('CATEGORY_LIST contains valid key and label pairings', () => {
  assert.ok(CATEGORY_LIST.length >= 5);
  for (const item of CATEGORY_LIST) {
    assert.ok(item.key);
    assert.ok(item.label);
    assert.strictEqual(item.label, CATEGORY_LABELS[item.key]);
  }
});

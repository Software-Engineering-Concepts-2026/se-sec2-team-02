import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDistance } from '@/utils/format';

test('formatDistance formats meters correctly when distance < 1000m', () => {
  assert.strictEqual(formatDistance(0), '0 เมตร');
  assert.strictEqual(formatDistance(500), '500 เมตร');
  assert.strictEqual(formatDistance(800), '800 เมตร');
  assert.strictEqual(formatDistance(999), '999 เมตร');
});

test('formatDistance formats kilometers correctly when distance >= 1000m', () => {
  assert.strictEqual(formatDistance(1000), '1.0 กิโลเมตร');
  assert.strictEqual(formatDistance(1200), '1.2 กิโลเมตร');
  assert.strictEqual(formatDistance(2500), '2.5 กิโลเมตร');
  assert.strictEqual(formatDistance(5000), '5.0 กิโลเมตร');
});

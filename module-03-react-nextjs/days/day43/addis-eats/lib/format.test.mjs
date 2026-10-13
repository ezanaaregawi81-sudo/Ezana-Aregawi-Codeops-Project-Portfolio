// npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { etb, relative, when } from './format.js';

const NBSP = ' ';

test('etb: the number, then ETB', () => {
  assert.equal(etb(450), `450${NBSP}ETB`);
  assert.equal(etb(1235), `1,235${NBSP}ETB`);
  assert.equal(etb(36_900, { compact: true }), `36.9K${NBSP}ETB`);
  assert.equal(etb(undefined), `0${NBSP}ETB`);
});

test('when: Addis Ababa time whatever the machine’s zone', () => {
  // 11:05 UTC is 14:05 in Addis Ababa (UTC+3, no daylight saving).
  assert.equal(when('2026-10-13T11:05:00Z'), 'Tue 13 Oct, 14:05');
  assert.equal(when('2026-10-13T11:05:00Z', 'time'), '14:05');
  // 22:30 UTC on the 13th is already the 14th in Addis Ababa.
  assert.equal(when('2026-10-13T22:30:00Z', 'key'), '2026-10-14');
  assert.equal(when('2026-10-13T22:30:00Z', 'sheet'), '2026-10-14 01:30');
});

test('relative: past and future, from a given now', () => {
  const now = '2026-10-13T12:00:00Z';
  assert.equal(relative('2026-10-13T11:59:40Z', now), 'just now');
  assert.equal(relative('2026-10-13T12:00:30Z', now), 'any moment now');
  assert.equal(relative('2026-10-13T11:56:00Z', now), '4 minutes ago');
  assert.equal(relative('2026-10-13T12:02:00Z', now), 'in 2 minutes');
  assert.equal(relative('2026-10-13T10:00:00Z', now), '2 hours ago');
  assert.equal(relative('2026-10-12T12:00:00Z', now), 'yesterday');
});

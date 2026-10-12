// Run with: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { safeNext } from './safe-next.js';

test('keeps same-site paths', () => {
  assert.equal(safeNext('/checkout'), '/checkout');
  assert.equal(safeNext('/orders/AE-1?tab=items'), '/orders/AE-1?tab=items');
});

test('rejects crafted links that would leave the site', () => {
  for (const crafted of [
    'https://evil.example',
    'evil.example',
    '//evil.example',
    '/\\evil.example',
    '/\t/evil.example',
    'javascript:alert(1)',
    '',
    undefined,
  ]) {
    assert.equal(safeNext(crafted), '/orders', `should reject ${JSON.stringify(crafted)}`);
  }
});

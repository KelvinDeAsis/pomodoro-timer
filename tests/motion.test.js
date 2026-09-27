import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldFreezeArtwork } from '../src/utils/motion.js';

test('GIF artwork stays animated in every visual theme', () => {
  for (const theme of ['light', 'dark', 'mono']) assert.equal(shouldFreezeArtwork(theme, false), false);
});

test('reduced-motion preference freezes animated artwork', () => {
  assert.equal(shouldFreezeArtwork('light', true), true);
  assert.equal(shouldFreezeArtwork('mono', true), true);
});
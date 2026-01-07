const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeSections } = require('../lib/section-normalizer');

const section = { title: 'Common Expenses', items: [] };

test('normalizeSections maps analyzer keys to UI keys', () => {
  const normalized = normalizeSections({
    commonExpenses: section,
    reserveFund: section,
    specialAssessments: section,
    legalProceedings: section,
    rulesRestrictions: section,
    buildingNotes: section,
  });

  assert.ok(normalized.common_expenses);
  assert.ok(normalized.reserve_fund);
  assert.ok(normalized.special_assessments);
  assert.ok(normalized.legal_proceedings);
  assert.ok(normalized.rules);
  assert.ok(normalized.building_notes);
});

test('normalizeSections preserves existing UI keys', () => {
  const normalized = normalizeSections({
    common_expenses: { title: 'Common Expenses', items: [] },
    reserve_fund: { title: 'Reserve Fund', items: [] },
  });

  assert.deepEqual(Object.keys(normalized).sort(), ['common_expenses', 'reserve_fund']);
});

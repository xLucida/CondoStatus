const SECTION_KEY_MAP = {
  commonExpenses: 'common_expenses',
  reserveFund: 'reserve_fund',
  specialAssessments: 'special_assessments',
  legalProceedings: 'legal_proceedings',
  rulesRestrictions: 'rules',
  buildingNotes: 'building_notes',
};

function normalizeSections(sections) {
  const normalized = {};
  const entries = Object.entries(sections || {});

  for (const [key, section] of entries) {
    // If key is in the map, use the mapped key; otherwise use original key
    const mappedKey = SECTION_KEY_MAP[key] || key;
    
    // Only add if not already present (prefer mapped keys over original)
    if (!normalized[mappedKey]) {
      normalized[mappedKey] = section;
    }
  }

  return normalized;
}

module.exports = {
  SECTION_KEY_MAP,
  normalizeSections,
};

export const LIFE_PATH_RULES = {
  1: { direction: 'initiation and leadership', score: 2, trait: 'self-driven' },
  2: { direction: 'cooperation and emotional intelligence', score: 1, trait: 'diplomatic' },
  3: { direction: 'communication and creativity', score: 1, trait: 'expressive' },
  4: { direction: 'discipline and structure', score: 1, trait: 'methodical' },
  5: { direction: 'change and adaptability', score: 0, trait: 'freedom-seeking' },
  6: { direction: 'responsibility and relationships', score: 1, trait: 'nurturing' },
  7: { direction: 'inner wisdom and research', score: 0, trait: 'introspective' },
  8: { direction: 'material mastery and authority', score: 2, trait: 'ambitious' },
  9: { direction: 'service and compassion', score: 1, trait: 'humanitarian' },
  11: { direction: 'intuitive guidance', score: 1, trait: 'visionary' },
  22: { direction: 'legacy building', score: 2, trait: 'master planner' },
  33: { direction: 'teaching through service', score: 1, trait: 'spiritual mentor' }
};

export const MULANK_RULES = {
  1: { influence: 'solar confidence', score: 2, trait: 'assertive' },
  2: { influence: 'lunar sensitivity', score: 1, trait: 'empathetic' },
  3: { influence: 'jovian expansion', score: 1, trait: 'optimistic' },
  4: { influence: 'structured intensity', score: 0, trait: 'practical' },
  5: { influence: 'mercurial agility', score: 1, trait: 'quick-minded' },
  6: { influence: 'venusian harmony', score: 1, trait: 'relationship-centered' },
  7: { influence: 'mystic detachment', score: 0, trait: 'reflective' },
  8: { influence: 'saturnine discipline', score: 1, trait: 'resilient' },
  9: { influence: 'martian fire', score: 0, trait: 'intense' },
  11: { influence: 'high intuition', score: 1, trait: 'sensitive' },
  22: { influence: 'manifestation drive', score: 2, trait: 'builder' }
};

export function calculateLifePathNumber(dateOfBirth) {
  if (!dateOfBirth) return 0;

  const digits = dateOfBirth
    .replace(/-/g, '')
    .split('')
    .map(Number)
    .filter((digit) => Number.isFinite(digit));

  let sum = digits.reduce((acc, value) => acc + value, 0);

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((acc, value) => acc + value, 0);
  }

  return sum;
}

export function calculateMulank(dateOfBirth) {
  if (!dateOfBirth) return 0;

  const date = new Date(dateOfBirth);
  if (Number.isNaN(date.getTime())) return 0;

  const day = date.getDate();
  if (day === 11 || day === 22) return day;

  let sum = day;
  while (sum > 9) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((acc, value) => acc + value, 0);
  }

  return sum;
}

export function getLifePathRule(number) {
  return LIFE_PATH_RULES[number] || LIFE_PATH_RULES[1];
}

export function getMulankRule(number) {
  return MULANK_RULES[number] || MULANK_RULES[1];
}

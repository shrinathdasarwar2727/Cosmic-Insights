export const ZODIAC_RULES = {
  Aries: {
    style: 'bold and direct',
    strengths: ['initiative', 'courage', 'leadership'],
    caution: 'impatience',
    baseScore: 2,
    focus: { love: 1, career: 2, health: 1 }
  },
  Taurus: {
    style: 'steady and grounded',
    strengths: ['consistency', 'loyalty', 'practical thinking'],
    caution: 'stubbornness',
    baseScore: 1,
    focus: { love: 2, career: 1, health: 1 }
  },
  Gemini: {
    style: 'adaptable and communicative',
    strengths: ['curiosity', 'networking', 'quick learning'],
    caution: 'scattered focus',
    baseScore: 1,
    focus: { love: 1, career: 2, health: 0 }
  },
  Cancer: {
    style: 'protective and intuitive',
    strengths: ['empathy', 'emotional intelligence', 'caregiving'],
    caution: 'mood sensitivity',
    baseScore: 1,
    focus: { love: 2, career: 0, health: 1 }
  },
  Leo: {
    style: 'confident and expressive',
    strengths: ['visibility', 'charisma', 'leadership'],
    caution: 'ego friction',
    baseScore: 2,
    focus: { love: 1, career: 2, health: 0 }
  },
  Virgo: {
    style: 'precise and analytical',
    strengths: ['discipline', 'detail orientation', 'service'],
    caution: 'over-perfectionism',
    baseScore: 1,
    focus: { love: 0, career: 2, health: 1 }
  },
  Libra: {
    style: 'balanced and diplomatic',
    strengths: ['harmony', 'partnership', 'fair judgment'],
    caution: 'indecision',
    baseScore: 1,
    focus: { love: 2, career: 1, health: 0 }
  },
  Scorpio: {
    style: 'intense and strategic',
    strengths: ['focus', 'transformation', 'depth'],
    caution: 'control patterns',
    baseScore: 0,
    focus: { love: 1, career: 1, health: 1 }
  },
  Sagittarius: {
    style: 'optimistic and exploratory',
    strengths: ['vision', 'learning', 'honesty'],
    caution: 'over-promising',
    baseScore: 1,
    focus: { love: 0, career: 1, health: 1 }
  },
  Capricorn: {
    style: 'disciplined and responsible',
    strengths: ['persistence', 'planning', 'execution'],
    caution: 'work rigidity',
    baseScore: 1,
    focus: { love: 0, career: 2, health: 1 }
  },
  Aquarius: {
    style: 'innovative and independent',
    strengths: ['originality', 'systems thinking', 'future vision'],
    caution: 'emotional detachment',
    baseScore: 0,
    focus: { love: 0, career: 2, health: 0 }
  },
  Pisces: {
    style: 'emotional and intuitive',
    strengths: ['compassion', 'imagination', 'spiritual sensitivity'],
    caution: 'weak boundaries',
    baseScore: 0,
    focus: { love: 2, career: 0, health: 1 }
  }
};

export function getZodiacRule(sign) {
  return ZODIAC_RULES[sign] || ZODIAC_RULES.Aries;
}

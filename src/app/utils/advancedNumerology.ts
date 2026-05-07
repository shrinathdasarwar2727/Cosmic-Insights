import { calculateLifePathNumber } from './numerologyRules';

const LETTER_VALUES: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

const LUCKY_GUIDE: Record<number, { color: string; stone: string }> = {
  1: { color: 'Crimson Red', stone: 'Ruby' },
  2: { color: 'Pearl White', stone: 'Moonstone' },
  3: { color: 'Sunshine Yellow', stone: 'Yellow Sapphire' },
  4: { color: 'Electric Blue', stone: 'Hessonite' },
  5: { color: 'Emerald Green', stone: 'Emerald' },
  6: { color: 'Rose Pink', stone: 'Diamond' },
  7: { color: 'Sea Green', stone: 'Cat\'s Eye' },
  8: { color: 'Indigo', stone: 'Blue Sapphire' },
  9: { color: 'Scarlet', stone: 'Red Coral' },
  11: { color: 'Silver Violet', stone: 'Amethyst' },
  22: { color: 'Deep Blue', stone: 'Lapis Lazuli' },
  33: { color: 'Golden White', stone: 'Clear Quartz' }
};

function sanitizeLetters(value: string): string[] {
  return (value || '')
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '')
    .split('')
    .filter((char) => /[A-Z]/.test(char));
}

function reduceNumber(value: number): number {
  if (!value) return 0;

  let reduced = value;
  while (reduced > 9 && reduced !== 11 && reduced !== 22 && reduced !== 33) {
    reduced = reduced
      .toString()
      .split('')
      .map(Number)
      .reduce((sum, digit) => sum + digit, 0);
  }

  return reduced;
}

function sumLetters(name: string, mode: 'all' | 'vowels' | 'consonants'): number {
  const letters = sanitizeLetters(name);

  return letters.reduce((sum, char) => {
    const isVowel = VOWELS.has(char);
    if (mode === 'vowels' && !isVowel) return sum;
    if (mode === 'consonants' && isVowel) return sum;

    return sum + (LETTER_VALUES[char] || 0);
  }, 0);
}

export function calculateDestinyNumber(fullName: string): number {
  return reduceNumber(sumLetters(fullName, 'all'));
}

export function calculateSoulUrgeNumber(fullName: string): number {
  return reduceNumber(sumLetters(fullName, 'vowels'));
}

export function calculatePersonalityNumber(fullName: string): number {
  return reduceNumber(sumLetters(fullName, 'consonants'));
}

export function getLuckyColorAndStone(lifePathNumber: number): { color: string; stone: string } {
  return LUCKY_GUIDE[lifePathNumber] || { color: 'Cosmic Purple', stone: 'Amethyst' };
}

export function detectAngelNumbers(sourceValues: string[]): string[] {
  const source = sourceValues.join('').replace(/\D/g, '');
  if (!source) return [];

  const patterns = [
    '111', '222', '333', '444', '555', '666', '777', '888', '999',
    '11', '22', '33', '44', '55', '66', '77', '88', '99'
  ];

  const found = patterns.filter((pattern) => source.includes(pattern));
  return Array.from(new Set(found));
}

export function calculateCompatibility(personOneDob: string, personTwoDob: string): {
  score: number;
  band: string;
  summary: string;
} {
  const first = calculateLifePathNumber(personOneDob || '') || 0;
  const second = calculateLifePathNumber(personTwoDob || '') || 0;

  if (!first || !second) {
    return {
      score: 0,
      band: 'Pending',
      summary: 'Add both birth dates to calculate compatibility.'
    };
  }

  const a = first > 9 ? reduceNumber(first) : first;
  const b = second > 9 ? reduceNumber(second) : second;
  const distance = Math.abs(a - b);
  const normalizedDistance = Math.min(distance, 9 - distance);

  let score = 100 - normalizedDistance * 14;
  if (a === b) score += 8;
  if (first === second) score += 6;

  score = Math.max(52, Math.min(99, score));

  if (score >= 86) {
    return {
      score,
      band: 'Excellent',
      summary: 'Very strong energetic alignment with natural understanding and support.'
    };
  }

  if (score >= 72) {
    return {
      score,
      band: 'Good',
      summary: 'Healthy compatibility with room for growth through communication and patience.'
    };
  }

  return {
    score,
    band: 'Moderate',
    summary: 'Different temperaments can still work well through conscious effort and emotional clarity.'
  };
}

export function getPersonalityNarrative(lifePath: number, destiny: number, soulUrge: number, personality: number): {
  strengths: string;
  weaknesses: string;
  careerPath: string;
  loveCompatibility: string;
  spiritualMeaning: string;
  dailyMotivation: string;
} {
  const lp = lifePath || 1;
  const des = destiny || lp;
  const soul = soulUrge || lp;
  const per = personality || lp;

  return {
    strengths: `Life Path ${lp} with Destiny ${des} points to leadership through practical decisions and emotional intelligence.`,
    weaknesses: `Soul Urge ${soul} and Personality ${per} indicate overthinking under pressure; consistency and boundaries are your growth keys.`,
    careerPath: `You are best in roles that combine structure with creativity: analysis, strategy, product, teaching, consulting, or entrepreneurship.`,
    loveCompatibility: `Your relational pattern improves when you communicate needs early and choose partners who value both loyalty and growth.`,
    spiritualMeaning: `Your numbers suggest a karmic lesson around balancing inner truth with external responsibility and service.`,
    dailyMotivation: 'Small disciplined action today creates the energetic momentum for your next breakthrough.'
  };
}

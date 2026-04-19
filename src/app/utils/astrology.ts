export function getZodiacSign(dateOfBirth: string): string {
  if (!dateOfBirth) return 'Aries';

  const date = new Date(dateOfBirth);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';

  return 'Aries';
}

export function getVedicSunSign(dateOfBirth: string): string {
  if (!dateOfBirth) return 'Aries';

  const date = new Date(dateOfBirth);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Approx sidereal (Lahiri-style) sun sign windows used in many Vedic references.
  if ((month === 4 && day >= 14) || (month === 5 && day <= 14)) return 'Aries';
  if ((month === 5 && day >= 15) || (month === 6 && day <= 14)) return 'Taurus';
  if ((month === 6 && day >= 15) || (month === 7 && day <= 16)) return 'Gemini';
  if ((month === 7 && day >= 17) || (month === 8 && day <= 16)) return 'Cancer';
  if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) return 'Leo';
  if ((month === 9 && day >= 17) || (month === 10 && day <= 17)) return 'Virgo';
  if ((month === 10 && day >= 18) || (month === 11 && day <= 16)) return 'Libra';
  if ((month === 11 && day >= 17) || (month === 12 && day <= 15)) return 'Scorpio';
  if ((month === 12 && day >= 16) || (month === 1 && day <= 14)) return 'Sagittarius';
  if ((month === 1 && day >= 15) || (month === 2 && day <= 12)) return 'Capricorn';
  if ((month === 2 && day >= 13) || (month === 3 && day <= 14)) return 'Aquarius';
  if ((month === 3 && day >= 15) || (month === 4 && day <= 13)) return 'Pisces';

  return 'Aries';
}

export function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    Aries: '♈',
    Taurus: '♉',
    Gemini: '♊',
    Cancer: '♋',
    Leo: '♌',
    Virgo: '♍',
    Libra: '♎',
    Scorpio: '♏',
    Sagittarius: '♐',
    Capricorn: '♑',
    Aquarius: '♒',
    Pisces: '♓'
  };
  return symbols[sign] || '⭐';
}

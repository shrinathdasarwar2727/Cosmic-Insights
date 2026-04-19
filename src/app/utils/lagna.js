export const LAGNA_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
];

export function normalizeLagna(lagnaSign) {
  if (!lagnaSign || lagnaSign === 'AUTO') return null;
  return LAGNA_SIGNS.includes(lagnaSign) ? lagnaSign : null;
}

const IST_OFFSET_HOURS = 5.5;
const DEFAULT_LAGNA_SYSTEM = 'vedic-lahiri';

// Major Indian cities with approximate coordinates for offline Lagna estimation.
const INDIAN_CITY_COORDS = {
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  amritsar: { lat: 31.634, lon: 74.8723 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  bhopal: { lat: 23.2599, lon: 77.4126 },
  bhuvaneshwar: { lat: 20.2961, lon: 85.8245 },
  bhubaneswar: { lat: 20.2961, lon: 85.8245 },
  chandigarh: { lat: 30.7333, lon: 76.7794 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  coimbatore: { lat: 11.0168, lon: 76.9558 },
  dehradun: { lat: 30.3165, lon: 78.0322 },
  degloor: { lat: 18.5486, lon: 77.5761 },
  delhi: { lat: 28.6139, lon: 77.209 },
  faridabad: { lat: 28.4089, lon: 77.3178 },
  ghaziabad: { lat: 28.6692, lon: 77.4538 },
  gurgaon: { lat: 28.4595, lon: 77.0266 },
  gurugram: { lat: 28.4595, lon: 77.0266 },
  guwahati: { lat: 26.1445, lon: 91.7362 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  indore: { lat: 22.7196, lon: 75.8577 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  kanpur: { lat: 26.4499, lon: 80.3319 },
  kochi: { lat: 9.9312, lon: 76.2673 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
  kozhikode: { lat: 11.2588, lon: 75.7804 },
  lucknow: { lat: 26.8467, lon: 80.9462 },
  ludhiana: { lat: 30.9009, lon: 75.8573 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  mysuru: { lat: 12.2958, lon: 76.6394 },
  mysore: { lat: 12.2958, lon: 76.6394 },
  nagpur: { lat: 21.1458, lon: 79.0882 },
  nashik: { lat: 19.9975, lon: 73.7898 },
  nanded: { lat: 19.1383, lon: 77.321 },
  noida: { lat: 28.5355, lon: 77.391 },
  patna: { lat: 25.5941, lon: 85.1376 },
  pune: { lat: 18.5204, lon: 73.8567 },
  raipur: { lat: 21.2514, lon: 81.6296 },
  ranchi: { lat: 23.3441, lon: 85.3096 },
  surat: { lat: 21.1702, lon: 72.8311 },
  thane: { lat: 19.2183, lon: 72.9781 },
  trivandrum: { lat: 8.5241, lon: 76.9366 },
  thiruvananthapuram: { lat: 8.5241, lon: 76.9366 },
  udaipur: { lat: 24.5854, lon: 73.7125 },
  vadodara: { lat: 22.3072, lon: 73.1812 },
  varanasi: { lat: 25.3176, lon: 82.9739 },
  vijayawada: { lat: 16.5062, lon: 80.648 }
};

function normalizePlace(placeOfBirth) {
  if (!placeOfBirth) return '';
  return placeOfBirth
    .toLowerCase()
    .split(',')[0]
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveCoordinates(placeOfBirth) {
  const normalized = normalizePlace(placeOfBirth);
  if (!normalized) {
    // Geographical center-ish fallback for India.
    return { lat: 22.9734, lon: 78.6569 };
  }

  if (INDIAN_CITY_COORDS[normalized]) {
    return INDIAN_CITY_COORDS[normalized];
  }

  const match = Object.keys(INDIAN_CITY_COORDS).find(
    (city) => normalized.includes(city) || city.includes(normalized)
  );

  if (match) {
    return INDIAN_CITY_COORDS[match];
  }

  return { lat: 22.9734, lon: 78.6569 };
}

function normalizeDegrees(value) {
  const raw = value % 360;
  return raw < 0 ? raw + 360 : raw;
}

function getJulianDay(dateOfBirth, timeOfBirth) {
  const datePart = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth || '')
    ? dateOfBirth
    : new Date().toISOString().slice(0, 10);
  const timePart = /^\d{2}:\d{2}$/.test(timeOfBirth || '') ? timeOfBirth : '06:00';
  const [hours, minutes] = timePart.split(':').map(Number);

  // Inputs are interpreted in local India time (IST).
  const utcMillis = Date.UTC(
    Number(datePart.slice(0, 4)),
    Number(datePart.slice(5, 7)) - 1,
    Number(datePart.slice(8, 10)),
    (hours || 0) - IST_OFFSET_HOURS,
    minutes || 0,
    0,
    0
  );

  return utcMillis / 86400000 + 2440587.5;
}

function getGreenwichSiderealDegrees(julianDay) {
  const t = (julianDay - 2451545.0) / 36525;
  const theta =
    280.46061837 +
    360.98564736629 * (julianDay - 2451545.0) +
    0.000387933 * t * t -
    (t * t * t) / 38710000;
  return normalizeDegrees(theta);
}

function getAscendantLongitudeDegrees({ julianDay, latitude, longitude }) {
  const t = (julianDay - 2451545.0) / 36525;
  const epsilonDeg = 23.439291 - 0.0130042 * t;

  const epsilon = (epsilonDeg * Math.PI) / 180;
  const phi = (latitude * Math.PI) / 180;
  const lstDeg = normalizeDegrees(getGreenwichSiderealDegrees(julianDay) + longitude);
  const theta = (lstDeg * Math.PI) / 180;

  // Use ascendant formula orientation approved in the latest validation run.
  const y = Math.sin(theta) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon);
  const x = Math.cos(theta);
  const lambda = Math.atan2(y, x);

  return normalizeDegrees((lambda * 180) / Math.PI);
}

function getLahiriAyanamshaDegrees(julianDay) {
  // Lahiri ayanamsha referenced near J2000 with linear annual precession.
  const yearsSinceJ2000 = (julianDay - 2451545.0) / 365.2425;
  const baseAtJ2000 = 23.8530556;
  const annualRateDeg = 50.290966 / 3600;
  return baseAtJ2000 + annualRateDeg * yearsSinceJ2000;
}

function getSiderealAscendantDegrees(tropicalAscDeg, julianDay, system) {
  if (system !== 'vedic-lahiri') {
    return normalizeDegrees(tropicalAscDeg);
  }

  const ayanamsha = getLahiriAyanamshaDegrees(julianDay);
  return normalizeDegrees(tropicalAscDeg - ayanamsha);
}

export function estimateLagna({ dateOfBirth, timeOfBirth, placeOfBirth, system = DEFAULT_LAGNA_SYSTEM }) {
  const coords = resolveCoordinates(placeOfBirth);
  const julianDay = getJulianDay(dateOfBirth, timeOfBirth);
  const tropicalAscDeg = getAscendantLongitudeDegrees({
    julianDay,
    latitude: coords.lat,
    longitude: coords.lon
  });
  const ascDeg = getSiderealAscendantDegrees(tropicalAscDeg, julianDay, system);

  const signIndex = Math.floor(ascDeg / 30) % 12;
  return LAGNA_SIGNS[signIndex] || 'Aries';
}

export function getDefaultLagnaSystem() {
  return DEFAULT_LAGNA_SYSTEM;
}

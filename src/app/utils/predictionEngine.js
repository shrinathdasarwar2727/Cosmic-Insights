import {
  calculateLifePathNumber,
  calculateMulank,
  getLifePathRule,
  getMulankRule
} from './numerologyRules';
import { estimateLagna, getDefaultLagnaSystem, normalizeLagna } from './lagna';

const toneLabels = {
  Positive: 'Positive',
  Neutral: 'Neutral',
  Challenging: 'Challenging'
};

const dayThemes = [
  'alignment',
  'clarity',
  'communication',
  'discipline',
  'expansion',
  'patience',
  'healing'
];

const overallFrames = {
  Positive: [
    'Your energetic field is supportive today, especially when you act with intention instead of urgency.',
    'Momentum favors meaningful progress, and your decisions carry stronger than usual impact.'
  ],
  Neutral: [
    'The day is balanced, asking for measured action and emotional steadiness in each decision.',
    'Progress is available through consistency, not speed; practical follow-through is your advantage.'
  ],
  Challenging: [
    'The cosmic climate is testing your patience, and maturity in response will decide the quality of outcomes.',
    'Today is less about force and more about wise pacing, grounded communication, and selective priorities.'
  ]
};

const loveFrames = {
  Positive: [
    'Relationship energy is warm; vulnerability expressed with respect deepens trust quickly.',
    'Emotional reciprocity improves when you listen fully before offering solutions.'
  ],
  Neutral: [
    'Love matters require clarity over assumptions, especially in tone and timing.',
    'A simple check-in can prevent misunderstanding and restore emotional rhythm.'
  ],
  Challenging: [
    'Sensitivity is high, so avoid reactive statements and choose softer language under pressure.',
    'Short pauses before responding protect both connection and dignity.'
  ]
};

const careerFrames = {
  Positive: [
    'Professional momentum supports visibility, leadership, and decision quality.',
    'This is a strong day to close pending tasks and initiate one strategic move.'
  ],
  Neutral: [
    'Career progress favors process discipline and clear task sequencing.',
    'You gain most by completing existing commitments before opening new tracks.'
  ],
  Challenging: [
    'Work pressure may increase through interruptions; protect focus blocks and reduce context switching.',
    'Avoid over-promising and keep deliverables realistic to maintain credibility.'
  ]
};

const healthFrames = {
  Positive: [
    'Vitality is improved when body rhythm and sleep discipline are respected.',
    'Light movement and hydration amplify your emotional and cognitive stability.'
  ],
  Neutral: [
    'Your system asks for moderation; avoid extremes in food, routine, or workload.',
    'Sustainable habits matter more today than high-intensity bursts.'
  ],
  Challenging: [
    'Stress reactivity is elevated, so protect nervous system balance with slower pacing.',
    'Breathing practices and screen breaks are not optional if you want stable energy.'
  ]
};

function getDateParts(currentDate) {
  const value = currentDate ? new Date(currentDate) : new Date();
  const date = Number.isNaN(value.getTime()) ? new Date() : value;
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}

function buildSeed(parts, lifePathNumber, mulank) {
  return parts.year * 10000 + parts.month * 100 + parts.day + (lifePathNumber || 0) * 13 + (mulank || 0) * 17;
}

function pickBySeed(collection, seed, salt) {
  const index = Math.abs((seed + salt) % collection.length);
  return collection[index];
}

function resolveTone(score) {
  if (score >= 6) return toneLabels.Positive;
  if (score >= 3) return toneLabels.Neutral;
  return toneLabels.Challenging;
}

function buildMultiLineMessage(lines) {
  return lines.filter(Boolean).join('\n');
}

export function generatePrediction(userData) {
  const name = (userData?.name || 'Seeker').trim();
  const manualLagna = normalizeLagna(userData?.lagnaSign);
  const selectedSystem = userData?.lagnaSystem || getDefaultLagnaSystem();
  const lagnaSystem = manualLagna ? 'manual-selection' : selectedSystem;
  const lagnaSign = manualLagna || estimateLagna({
    dateOfBirth: userData?.dateOfBirth,
    timeOfBirth: userData?.timeOfBirth,
    placeOfBirth: userData?.placeOfBirth,
    system: selectedSystem
  });
  const lagnaSource = manualLagna ? 'manual' : 'auto-estimated';
  const lifePathNumber = userData?.lifePathNumber || calculateLifePathNumber(userData?.dateOfBirth || '');
  const mulank = userData?.mulank || calculateMulank(userData?.dateOfBirth || '');
  const dateParts = getDateParts(userData?.currentDate);

  const lifePathRule = getLifePathRule(lifePathNumber || 1);
  const mulankRule = getMulankRule(mulank || 1);

  const dateScore = (dateParts.day % 5) - 1;
  const score = (lifePathRule.score || 0) + (mulankRule.score || 0) + dateScore;
  const tone = resolveTone(score);
  const seed = buildSeed(dateParts, lifePathNumber || 1, mulank || 1);
  const dayTheme = pickBySeed(dayThemes, seed, 7);

  const overall = buildMultiLineMessage([
    `${name}, Life Path ${lifePathNumber || 1} (${lifePathRule.direction}) combines with Mulank ${mulank || 1} (${mulankRule.influence}) to shape today.`,
    pickBySeed(overallFrames[tone], seed, 11),
    `Theme of the day: ${dayTheme}. Focus on ${lifePathRule.trait || 'your core strengths'} while balancing ${mulankRule.trait || 'your inner rhythm'}.`
  ]);

  const love = buildMultiLineMessage([
    `${name}, emotional patterns today reflect Life Path ${lifePathNumber || 1} and Mulank ${mulank || 1}.`,
    pickBySeed(loveFrames[tone], seed, 19),
    `Relationship key: cultivate ${mulankRule.trait || 'emotional awareness'} and steady communication.`
  ]);

  const career = buildMultiLineMessage([
    `Your professional direction reflects Life Path ${lifePathNumber || 1}: ${lifePathRule.direction}.`,
    pickBySeed(careerFrames[tone], seed, 29),
    `Career key: apply ${lifePathRule.trait || 'your core strengths'} in focused, high-impact tasks.`
  ]);

  const health = buildMultiLineMessage([
    `Your vitality today links to routine and emotional balance more than intensity.`,
    pickBySeed(healthFrames[tone], seed, 37),
    `Health key: prioritize rhythm in sleep, hydration, and movement to support stamina.`
  ]);

  const doList = [
    `Prioritize 1 core goal aligned with ${dayTheme}.`,
    `Use ${lifePathRule.trait || 'your core strengths'} thinking and consistent execution in decisions, then communicate clearly.`,
    `Take one conscious pause before major reaction.`
  ];

  const dontList = [
    `Do not let reactivity decide your tone in important conversations.`,
    'Do not overfill your schedule to prove productivity.',
    'Do not ignore early stress signals from your body.'
  ];

  return {
    tone,
    overall,
    love,
    career,
    health,
    do: doList,
    dont: dontList,
    meta: {
      lagnaSign,
      lagnaSource,
      lagnaSystem,
      lifePathNumber: lifePathNumber || 1,
      mulank: mulank || 1,
      score,
      dayTheme
    }
  };
}

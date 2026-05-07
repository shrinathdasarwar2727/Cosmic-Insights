export interface AIMeaningsPayload {
  strengths: string;
  weaknesses: string;
  careerPath: string;
  loveCompatibility: string;
  spiritualMeaning: string;
  dailyMotivation: string;
}

interface AIRequestInput {
  name: string;
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  mulank: number;
}

type AIProvider = 'gemini' | 'openai';

function extractJsonObject(raw: string): string | null {
  const first = raw.indexOf('{');
  const last = raw.lastIndexOf('}');
  if (first === -1 || last === -1 || first >= last) return null;
  return raw.slice(first, last + 1);
}

function reduceNumber(value: number): number {
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

function buildFallbackMeaning(input: AIRequestInput): AIMeaningsPayload {
  const lifePath = input.lifePath || 1;
  const destiny = input.destiny || lifePath;
  const soulUrge = input.soulUrge || lifePath;
  const personality = input.personality || lifePath;
  const mulank = input.mulank || lifePath;

  return {
    strengths: `Your Life Path ${lifePath} and Destiny ${destiny} point to practical strength, leadership, and steady progress when you trust your own rhythm.`,
    weaknesses: `Soul Urge ${soulUrge} and Personality ${personality} can make you overthink or overextend, so clear boundaries are essential.`,
    careerPath: `You do best in roles that reward responsibility, communication, and visible results. Build a path where consistency becomes your advantage.`,
    loveCompatibility: `Your relationship energy improves with honest communication, emotional maturity, and partners who respect both loyalty and independence.`,
    spiritualMeaning: `Your number pattern suggests a lesson around balancing inner purpose with outer action, especially when Mulank ${mulank} is active.`,
    dailyMotivation: `Today favors one focused action that aligns your Life Path ${lifePath} with your natural Mulank ${mulank} drive.`
  };
}

function buildPrompt(input: AIRequestInput): string {
  return [
    'You are an expert numerology guide.',
    'Return only JSON with exactly these keys: strengths, weaknesses, careerPath, loveCompatibility, spiritualMeaning, dailyMotivation.',
    'Each value must be 1-2 concise sentences, practical and positive, no markdown.',
    `Name: ${input.name || 'Seeker'}`,
    `Life Path: ${input.lifePath}`,
    `Mulank: ${input.mulank}`,
    `Destiny: ${input.destiny}`,
    `Soul Urge: ${input.soulUrge}`,
    `Personality: ${input.personality}`
  ].join('\n');
}

async function requestOpenAI(input: AIRequestInput, apiKey: string, model: string, baseUrl: string): Promise<AIMeaningsPayload> {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: buildPrompt(input)
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const rawText = payload?.output_text || '';
  const jsonSnippet = extractJsonObject(rawText);
  if (!jsonSnippet) {
    throw new Error('OpenAI output did not include a JSON object.');
  }

  return JSON.parse(jsonSnippet) as AIMeaningsPayload;
}

async function requestGemini(input: AIRequestInput, apiKey: string, model: string): Promise<AIMeaningsPayload> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: buildPrompt(input) }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const rawText = payload?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('') || '';
  const jsonSnippet = extractJsonObject(rawText);
  if (!jsonSnippet) {
    throw new Error('Gemini output did not include a JSON object.');
  }

  return JSON.parse(jsonSnippet) as AIMeaningsPayload;
}

function validateMeaningPayload(parsed: Partial<AIMeaningsPayload>, input: AIRequestInput): AIMeaningsPayload | null {
  const requiredKeys: Array<keyof AIMeaningsPayload> = [
    'strengths',
    'weaknesses',
    'careerPath',
    'loveCompatibility',
    'spiritualMeaning',
    'dailyMotivation'
  ];

  for (const key of requiredKeys) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      return null;
    }
  }

  return parsed as AIMeaningsPayload;
}

export async function generateAIMeanings(input: AIRequestInput): Promise<AIMeaningsPayload> {
  const env = (import.meta as any).env as Record<string, string | undefined>;
  const provider = (env.VITE_AI_PROVIDER as AIProvider | undefined) || 'gemini';
  const geminiApiKey = env.VITE_GEMINI_API_KEY;
  const geminiModel = env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
  const openAiApiKey = env.VITE_OPENAI_API_KEY;
  const openAiModel = env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  const openAiBaseUrl = env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1/responses';

  try {
    if (provider === 'openai' && openAiApiKey) {
      const parsed = await requestOpenAI(input, openAiApiKey, openAiModel, openAiBaseUrl);
      const validated = validateMeaningPayload(parsed, input);
      if (validated) return validated;
    }

    if (provider === 'gemini' && geminiApiKey) {
      const parsed = await requestGemini(input, geminiApiKey, geminiModel);
      const validated = validateMeaningPayload(parsed, input);
      if (validated) return validated;
    }

    if (provider !== 'gemini' && geminiApiKey) {
      const parsed = await requestGemini(input, geminiApiKey, geminiModel);
      const validated = validateMeaningPayload(parsed, input);
      if (validated) return validated;
    }

    if (provider !== 'openai' && openAiApiKey) {
      const parsed = await requestOpenAI(input, openAiApiKey, openAiModel, openAiBaseUrl);
      const validated = validateMeaningPayload(parsed, input);
      if (validated) return validated;
    }
  } catch {
    return buildFallbackMeaning(input);
  }

  return buildFallbackMeaning(input);
}

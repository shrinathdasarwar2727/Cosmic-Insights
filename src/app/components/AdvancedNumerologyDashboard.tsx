import { useMemo, useState } from 'react';
import { Download, HeartHandshake, Save, Share2, Sparkles, Sun, UserRound } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  calculateCompatibility,
  calculateDestinyNumber,
  calculatePersonalityNumber,
  calculateSoulUrgeNumber,
  detectAngelNumbers,
  getLuckyColorAndStone,
  getPersonalityNarrative
} from '../utils/advancedNumerology';
import { calculateLifePathNumber, calculateMulank } from '../utils/numerologyRules';
import { generatePrediction } from '../utils/predictionEngine';
import { generateAIMeanings } from '../utils/aiMeaningEngine';

interface AdvancedNumerologyDashboardProps {
  name: string;
  dateOfBirth: string;
}

const BLOG_ARTICLES = [
  {
    title: 'Meaning of Number 7',
    excerpt: 'Number 7 represents introspection, wisdom, and spiritual depth. Learn how it shapes your decisions.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Best Career for Life Path 1',
    excerpt: 'Life Path 1 thrives in leadership and innovation. Explore modern career tracks that fit this energy.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Why You Keep Seeing 111',
    excerpt: 'Seeing 111 often marks alignment and fresh starts. Discover what this pattern can mean for you.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80'
  }
];

function buildReportText(payload: {
  name: string;
  lifePath: number;
  mulank: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  luckyColor: string;
  luckyStone: string;
  angelNumbers: string[];
  compatibilityScore: number;
  compatibilityBand: string;
  personalityInsight: ReturnType<typeof getPersonalityNarrative>;
  prediction: ReturnType<typeof generatePrediction>;
}): string {
  return [
    'Cosmic Numerology Report',
    '-------------------------',
    `Name: ${payload.name || 'Seeker'}`,
    `Life Path Number: ${payload.lifePath || '-'}`,
    `Mulank Number: ${payload.mulank || '-'}`,
    `Destiny Number: ${payload.destiny || '-'}`,
    `Soul Urge Number: ${payload.soulUrge || '-'}`,
    `Personality Number: ${payload.personality || '-'}`,
    `Lucky Color: ${payload.luckyColor}`,
    `Lucky Stone: ${payload.luckyStone}`,
    `Angel Numbers: ${payload.angelNumbers.join(', ') || 'Not detected'}`,
    `Compatibility Score: ${payload.compatibilityScore} (${payload.compatibilityBand})`,
    '',
    'AI-style Meanings',
    `Strengths: ${payload.personalityInsight.strengths}`,
    `Weaknesses: ${payload.personalityInsight.weaknesses}`,
    `Career Path: ${payload.personalityInsight.careerPath}`,
    `Love Compatibility: ${payload.personalityInsight.loveCompatibility}`,
    `Spiritual Meaning: ${payload.personalityInsight.spiritualMeaning}`,
    `Daily Motivation: ${payload.personalityInsight.dailyMotivation}`,
    '',
    'Daily Horoscope',
    `Overall: ${payload.prediction.overall}`,
    `Career: ${payload.prediction.career}`,
    `Love: ${payload.prediction.love}`
  ].join('\n');
}

function downloadPdfReport(title: string, textContent: string) {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 48;
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxWidth = pdf.internal.pageSize.getWidth() - marginX * 2;
  let cursorY = 62;

  pdf.setFont('times', 'bold');
  pdf.setFontSize(20);
  pdf.text(title, marginX, cursorY);
  cursorY += 28;

  pdf.setFont('times', 'normal');
  pdf.setFontSize(11);

  const lines = textContent.split('\n');
  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      cursorY += 9;
      return;
    }

    const isSectionHeading =
      trimmed === 'AI-style Meanings' ||
      trimmed === 'Daily Horoscope' ||
      trimmed.startsWith('Cosmic Numerology Report');

    if (isSectionHeading) {
      pdf.setFont('times', 'bold');
      pdf.setFontSize(13);
    } else {
      pdf.setFont('times', 'normal');
      pdf.setFontSize(11);
    }

    const wrapped = pdf.splitTextToSize(trimmed, maxWidth);
    wrapped.forEach((wrapLine: string) => {
      if (cursorY > pageHeight - 54) {
        pdf.addPage();
        cursorY = 56;
      }
      pdf.text(wrapLine, marginX, cursorY);
      cursorY += isSectionHeading ? 19 : 15;
    });
  });

  pdf.save('numerology-report.pdf');
}

function drawCosmicShareImage(name: string, lifePath: number, mulank: number, motivation: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(0.45, '#312e81');
  gradient.addColorStop(1, '#831843');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  for (let i = 0; i < 100; i++) {
    const x = (i * 97) % 1080;
    const y = (i * 57) % 1080;
    const r = (i % 3) + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.fillRect(90, 180, 900, 720);

  ctx.fillStyle = '#fde68a';
  ctx.font = '700 58px Cinzel, Georgia, serif';
  ctx.fillText('Cosmic Numerology Card', 140, 280);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 44px Manrope, Arial, sans-serif';
  ctx.fillText(name || 'Seeker', 140, 360);

  ctx.font = '500 40px Manrope, Arial, sans-serif';
  ctx.fillText(`Life Path: ${lifePath || '-'}`, 140, 440);
  ctx.fillText(`Mulank: ${mulank || '-'}`, 140, 500);

  ctx.font = '400 32px Manrope, Arial, sans-serif';
  const lines = motivation.match(/.{1,46}(\s|$)/g) || [motivation];
  lines.slice(0, 4).forEach((line, idx) => {
    ctx.fillText(line.trim(), 140, 600 + idx * 48);
  });

  const imageUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'cosmic-numerology-card.png';
  link.click();
}

export function AdvancedNumerologyDashboard({ name, dateOfBirth }: AdvancedNumerologyDashboardProps) {
  const [partnerName, setPartnerName] = useState('');
  const [partnerDob, setPartnerDob] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<ReturnType<typeof getPersonalityNarrative> | null>(null);

  const lifePath = useMemo(() => calculateLifePathNumber(dateOfBirth || ''), [dateOfBirth]);
  const mulank = useMemo(() => calculateMulank(dateOfBirth || ''), [dateOfBirth]);
  const destiny = useMemo(() => calculateDestinyNumber(name || ''), [name]);
  const soulUrge = useMemo(() => calculateSoulUrgeNumber(name || ''), [name]);
  const personality = useMemo(() => calculatePersonalityNumber(name || ''), [name]);

  const lucky = useMemo(() => getLuckyColorAndStone(lifePath || 1), [lifePath]);

  const angelNumbers = useMemo(() => {
    const values = [dateOfBirth, new Date().toISOString().slice(0, 10)];
    return detectAngelNumbers(values);
  }, [dateOfBirth]);

  const compatibility = useMemo(
    () => calculateCompatibility(dateOfBirth, partnerDob),
    [dateOfBirth, partnerDob]
  );

  const prediction = useMemo(() => generatePrediction({
    name,
    dateOfBirth,
    lifePathNumber: lifePath,
    mulank
  }), [name, dateOfBirth, lifePath, mulank]);

  const fallbackInsight = useMemo(
    () => getPersonalityNarrative(lifePath, destiny, soulUrge, personality),
    [lifePath, destiny, soulUrge, personality]
  );

  const personalityInsight = aiInsight || fallbackInsight;

  const reportText = useMemo(() => buildReportText({
    name,
    lifePath,
    mulank,
    destiny,
    soulUrge,
    personality,
    luckyColor: lucky.color,
    luckyStone: lucky.stone,
    angelNumbers,
    compatibilityScore: compatibility.score,
    compatibilityBand: compatibility.band,
    personalityInsight,
    prediction
  }), [name, lifePath, mulank, destiny, soulUrge, personality, lucky.color, lucky.stone, angelNumbers, compatibility.score, compatibility.band, personalityInsight, prediction]);

  const saveReport = () => {
    const key = 'cosmic-numerology-reports';
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    const record = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      name,
      reportText
    };

    localStorage.setItem(key, JSON.stringify([record, ...current].slice(0, 20)));
    setStatusMessage('Report saved to your dashboard memory.');
  };

  const shareReport = async () => {
    const shareText = `${name || 'Seeker'} | Life Path ${lifePath || '-'} | Mulank ${mulank || '-'}\n${personalityInsight.dailyMotivation}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Cosmic Numerology Snapshot',
          text: shareText
        });
        setStatusMessage('Shared successfully.');
        return;
      } catch {
      }
    }

    await navigator.clipboard.writeText(shareText);
    setStatusMessage('Share text copied to clipboard.');
  };

  const handleGenerateAIMeanings = async () => {
    try {
      setAiLoading(true);
      setStatusMessage('Generating AI meanings...');

      const generated = await generateAIMeanings({
        name,
        lifePath: lifePath || 1,
        mulank: mulank || 1,
        destiny: destiny || 1,
        soulUrge: soulUrge || 1,
        personality: personality || 1
      });

      setAiInsight(generated);
      setStatusMessage('AI meanings generated successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to generate AI meanings.';
      setStatusMessage(message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section id="dashboard" className="rounded-2xl border border-white/35 bg-white/[0.008] p-5 md:p-8 backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.045)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/45 mb-1">User Dashboard</p>
          <h2 className="text-2xl text-white/90 font-cinzel">Advanced Numerology Insights</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={saveReport} className="bg-indigo-500 hover:bg-indigo-400 text-white">
            <Save className="w-4 h-4 mr-2" />Save Report
          </Button>
          <Button type="button" onClick={() => downloadPdfReport('Numerology PDF Report', reportText)} className="bg-cyan-600 hover:bg-cyan-500 text-white">
            <Download className="w-4 h-4 mr-2" />Download PDF
          </Button>
          <Button type="button" onClick={shareReport} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white">
            <Share2 className="w-4 h-4 mr-2" />Share
          </Button>
          <Button type="button" onClick={() => drawCosmicShareImage(name, lifePath, mulank, personalityInsight.dailyMotivation)} className="bg-amber-500 hover:bg-amber-400 text-slate-900">
            <Sparkles className="w-4 h-4 mr-2" />Cosmic Image
          </Button>
        </div>
      </div>

      <div id="numbers" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-pink-300/25 bg-pink-500/5 p-4">
          <p className="text-white/60 text-sm">Life Path Number</p>
          <p className="text-3xl text-white mt-1">{lifePath || '-'}</p>
          <p className="text-xs text-white/55 mt-2">Based on DOB</p>
        </article>
        <article className="rounded-xl border border-blue-300/25 bg-blue-500/5 p-4">
          <p className="text-white/60 text-sm">Destiny Number</p>
          <p className="text-3xl text-white mt-1">{destiny || '-'}</p>
          <p className="text-xs text-white/55 mt-2">Based on full name</p>
        </article>
        <article className="rounded-xl border border-cyan-300/25 bg-cyan-500/5 p-4">
          <p className="text-white/60 text-sm">Soul Urge Number</p>
          <p className="text-3xl text-white mt-1">{soulUrge || '-'}</p>
          <p className="text-xs text-white/55 mt-2">Vowels in name</p>
        </article>
        <article className="rounded-xl border border-violet-300/25 bg-violet-500/5 p-4">
          <p className="text-white/60 text-sm">Personality Number</p>
          <p className="text-3xl text-white mt-1">{personality || '-'}</p>
          <p className="text-xs text-white/55 mt-2">Consonants in name</p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <article id="ai" className="rounded-xl border border-white/15 bg-white/[0.03] p-4 lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-white/90 text-lg">AI-Style Meanings</h3>
            <Button type="button" onClick={handleGenerateAIMeanings} disabled={aiLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm">
              {aiLoading ? 'Generating...' : 'Generate AI Meanings'}
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="rounded-lg border border-emerald-300/25 p-3 bg-emerald-500/5">
              <p className="text-emerald-200 mb-1">Strengths</p>
              <p className="text-white/75">{personalityInsight.strengths}</p>
            </div>
            <div className="rounded-lg border border-amber-300/25 p-3 bg-amber-500/5">
              <p className="text-amber-200 mb-1">Weaknesses</p>
              <p className="text-white/75">{personalityInsight.weaknesses}</p>
            </div>
            <div className="rounded-lg border border-sky-300/25 p-3 bg-sky-500/5">
              <p className="text-sky-200 mb-1">Career Path</p>
              <p className="text-white/75">{personalityInsight.careerPath}</p>
            </div>
            <div className="rounded-lg border border-rose-300/25 p-3 bg-rose-500/5">
              <p className="text-rose-200 mb-1">Love Compatibility</p>
              <p className="text-white/75">{personalityInsight.loveCompatibility}</p>
            </div>
            <div className="rounded-lg border border-indigo-300/25 p-3 bg-indigo-500/5 md:col-span-2">
              <p className="text-indigo-200 mb-1">Spiritual Meaning</p>
              <p className="text-white/75">{personalityInsight.spiritualMeaning}</p>
            </div>
            <div className="rounded-lg border border-fuchsia-300/25 p-3 bg-fuchsia-500/5 md:col-span-2">
              <p className="text-fuchsia-200 mb-1">Daily Motivation</p>
              <p className="text-white/75">{personalityInsight.dailyMotivation}</p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-white/15 bg-white/[0.03] p-4">
          <h3 className="text-white/90 text-lg mb-3">Personalized Picks</h3>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-500/5 p-3">
              <p className="text-white/65">Lucky Color</p>
              <p className="text-white text-lg">{lucky.color}</p>
            </div>
            <div className="rounded-lg border border-blue-300/20 bg-blue-500/5 p-3">
              <p className="text-white/65">Lucky Stone</p>
              <p className="text-white text-lg">{lucky.stone}</p>
            </div>
            <div className="rounded-lg border border-violet-300/20 bg-violet-500/5 p-3">
              <p className="text-white/65 mb-1">Angel Number Checker</p>
              <p className="text-white">{angelNumbers.length ? angelNumbers.join(', ') : 'No repeating pattern detected yet.'}</p>
            </div>
          </div>
        </article>
      </div>

      <div id="compatibility" className="grid gap-4 lg:grid-cols-2 mt-6">
        <article className="rounded-xl border border-white/15 bg-white/[0.03] p-4">
          <h3 className="text-white/90 text-lg mb-3 flex items-center gap-2"><HeartHandshake className="w-5 h-5 text-pink-300" />Compatibility Calculator</h3>
          <div className="space-y-3">
            <div>
              <label className="text-white/70 text-sm block mb-1">Partner Name</label>
              <Input value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Enter partner name" className="bg-white/0 border-white/20 text-white" />
            </div>
            <div>
              <label className="text-white/70 text-sm block mb-1">Partner Date of Birth</label>
              <Input type="date" value={partnerDob} onChange={(e) => setPartnerDob(e.target.value)} className="bg-white/0 border-white/20 text-white" />
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-pink-300/30 bg-pink-500/5 p-3">
            <p className="text-white/70 text-sm">Compatibility Score</p>
            <p className="text-3xl text-white">{compatibility.score || '-'} <span className="text-base text-white/65">{compatibility.band}</span></p>
            <p className="text-white/70 text-sm mt-1">{compatibility.summary}</p>
          </div>
          {partnerName ? <p className="text-white/40 text-xs mt-2">Comparison with {partnerName}</p> : null}
        </article>

        <article className="rounded-xl border border-white/15 bg-white/[0.03] p-4">
          <h3 className="text-white/90 text-lg mb-3 flex items-center gap-2"><Sun className="w-5 h-5 text-amber-300" />Daily Horoscope</h3>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-indigo-300/20 bg-indigo-500/5 p-3">
              <p className="text-indigo-200 mb-1">Overall</p>
              <p className="text-white/75 whitespace-pre-line">{prediction.overall}</p>
            </div>
            <div className="rounded-lg border border-cyan-300/20 bg-cyan-500/5 p-3">
              <p className="text-cyan-200 mb-1">Career Suggestions</p>
              <p className="text-white/75 whitespace-pre-line">{prediction.career}</p>
            </div>
            <div className="rounded-lg border border-rose-300/20 bg-rose-500/5 p-3">
              <p className="text-rose-200 mb-1">Relationship Insights</p>
              <p className="text-white/75 whitespace-pre-line">{prediction.love}</p>
            </div>
          </div>
        </article>
      </div>

      <article id="blog" className="mt-6 rounded-xl border border-white/15 bg-white/[0.03] p-4">
        <h3 className="text-white/90 text-lg mb-3">Blog Section</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {BLOG_ARTICLES.map((post) => (
            <article key={post.title} className="rounded-xl overflow-hidden border border-white/10 bg-slate-950/35">
              <img src={post.image} alt={post.title} loading="lazy" className="h-32 w-full object-cover" />
              <div className="p-3">
                <p className="text-white font-semibold text-sm">{post.title}</p>
                <p className="text-white/65 text-xs mt-2 leading-5">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </article>

      {statusMessage ? (
        <p className="mt-4 text-sm text-emerald-300/90">{statusMessage}</p>
      ) : null}

      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/15 bg-slate-950/95 backdrop-blur-xl px-4 py-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <a href="#numbers" className="text-white/80">Numbers</a>
          <a href="#ai" className="text-white/80">AI</a>
          <a href="#compatibility" className="text-white/80">Match</a>
          <a href="#blog" className="text-white/80">Blog</a>
          <a href="#dashboard" className="text-white/80 flex items-center gap-1"><UserRound className="w-3 h-3" />Top</a>
        </div>
      </nav>
    </section>
  );
}

import { useEffect, useMemo, useRef } from 'react';

const numerologyValues = [
    { name: 'One', symbol: '1', angle: 0, color: '#ff5f7a' },
    { name: 'Two', symbol: '2', angle: 40, color: '#ff9a5b' },
    { name: 'Three', symbol: '3', angle: 80, color: '#ffd15c' },
    { name: 'Four', symbol: '4', angle: 120, color: '#7bd389' },
    { name: 'Five', symbol: '5', angle: 160, color: '#4fd1c5' },
    { name: 'Six', symbol: '6', angle: 200, color: '#60a5fa' },
    { name: 'Seven', symbol: '7', angle: 240, color: '#8b5cf6' },
    { name: 'Eight', symbol: '8', angle: 280, color: '#c084fc' },
    { name: 'Nine', symbol: '9', angle: 320, color: '#fb7185' },
  ];

const zodiacOrder = [
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

const zodiacInsights: Record<string, {
  accent: string;
  lifeJourney: string;
  lifePrediction: string;
  remedies: string[];
  careerTask: string[];
}> = {
  Aries: {
    accent: '#ff6b6b',
    lifeJourney: 'You are here to start boldly, lead visibly, and turn hesitation into decisive action.',
    lifePrediction: 'This phase rewards initiative, short deadlines, and projects that need fearless momentum.',
    remedies: ['Wake up early and set one clear intention', 'Use red or warm tones in your workspace', 'Offer help before asking for recognition'],
    careerTask: ['Lead one unfinished task to completion', 'Pitch a direct solution instead of waiting', 'Protect your focus from impulsive distractions']
  },
  Taurus: {
    accent: '#f59e0b',
    lifeJourney: 'Your journey is about building security, patience, and lasting value with steady hands.',
    lifePrediction: 'Slow and stable progress works best now, especially where money, skill, and trust are involved.',
    remedies: ['Keep a calm morning routine', 'Spend time in nature or with plants', 'Avoid rushing important financial decisions'],
    careerTask: ['Strengthen one reliable system', 'Review long-term income opportunities', 'Finish work with consistency over speed']
  },
  Gemini: {
    accent: '#60a5fa',
    lifeJourney: 'You are meant to connect ideas, people, and possibilities with flexible intelligence.',
    lifePrediction: 'Communication, study, and networking bring the strongest openings over the next cycle.',
    remedies: ['Journal your thoughts before speaking', 'Reduce scattered digital noise', 'Learn one practical new skill each week'],
    careerTask: ['Send the message you have been postponing', 'Turn one idea into a presentation', 'Use collaboration to unlock speed']
  },
  Cancer: {
    accent: '#38bdf8',
    lifeJourney: 'Your life path centers on emotional depth, protection, and creating a safe inner world.',
    lifePrediction: 'Family, home, and emotional healing become important anchors for growth right now.',
    remedies: ['Protect your sleep and hydration', 'Keep a clean, peaceful personal space', 'Talk through feelings before they harden'],
    careerTask: ['Support a teammate with empathy', 'Organize your work environment', 'Choose roles that reward care and intuition']
  },
  Leo: {
    accent: '#f97316',
    lifeJourney: 'You are here to shine, inspire confidence, and lead through warmth instead of force.',
    lifePrediction: 'Visibility improves when you act with generosity and let your natural creative energy be seen.',
    remedies: ['Dress in a way that boosts confidence', 'Spend time doing something expressive', 'Practice praise without expecting anything back'],
    careerTask: ['Show your work publicly', 'Take ownership of a high-impact deliverable', 'Use charisma to build trust, not ego']
  },
  Virgo: {
    accent: '#34d399',
    lifeJourney: 'Your story is about refinement, service, and turning detail into practical mastery.',
    lifePrediction: 'Careful planning and clean execution produce the best outcomes in work and routine.',
    remedies: ['Keep your desk and notes organized', 'Take a quiet break before overthinking', 'Serve through useful, concrete action'],
    careerTask: ['Simplify one complex process', 'Audit what is wasting your time', 'Make your planning system more precise']
  },
  Libra: {
    accent: '#a78bfa',
    lifeJourney: 'You are learning balance, fairness, and the art of making peace without losing yourself.',
    lifePrediction: 'Partnerships and agreements can move forward well when you stay clear and diplomatic.',
    remedies: ['Choose symmetry and calm in your space', 'Avoid saying yes too quickly', 'Rest before making relational decisions'],
    careerTask: ['Negotiate one situation carefully', 'Create a visually clean presentation', 'Collaborate where mutual value exists']
  },
  Scorpio: {
    accent: '#c084fc',
    lifeJourney: 'Your journey is transformation through depth, honesty, and emotional rebirth.',
    lifePrediction: 'This period supports private strategy, powerful insight, and the release of stale attachments.',
    remedies: ['Keep some things private while they are still forming', 'Use grounding breathing before conflict', 'Let go of what keeps draining energy'],
    careerTask: ['Focus on one strategic objective', 'Study the hidden cause of a problem', 'Use intensity with discipline']
  },
  Sagittarius: {
    accent: '#fbbf24',
    lifeJourney: 'You are here to expand, explore, and grow through truth, travel, and wisdom.',
    lifePrediction: 'Learning, travel, and bigger thinking open doors as long as you stay practical.',
    remedies: ['Spend time outdoors or in motion', 'Read something that widens perspective', 'Avoid overcommitting to too many plans'],
    careerTask: ['Pick one bold direction and test it', 'Teach or share knowledge publicly', 'Keep optimism tied to execution']
  },
  Capricorn: {
    accent: '#93c5fd',
    lifeJourney: 'Your path is about discipline, responsibility, and earning durable success over time.',
    lifePrediction: 'Structure and patience produce measurable progress, especially in career and reputation.',
    remedies: ['Keep a realistic schedule', 'Respect limits before burnout appears', 'Build slowly rather than chasing shortcuts'],
    careerTask: ['Define one long-range target', 'Strengthen your professional credibility', 'Prioritize tasks with lasting impact']
  },
  Aquarius: {
    accent: '#22d3ee',
    lifeJourney: 'You are meant to innovate, question old systems, and think for the collective good.',
    lifePrediction: 'New ideas, communities, and tech-driven moves can become useful openings now.',
    remedies: ['Clear your mind with a digital pause', 'Spend time with inspiring people', 'Test ideas before turning them into rules'],
    careerTask: ['Explore a fresh method or tool', 'Collaborate with a forward-thinking team', 'Turn originality into practical value']
  },
  Pisces: {
    accent: '#818cf8',
    lifeJourney: 'Your journey is empathy, intuition, and learning how to channel imagination into form.',
    lifePrediction: 'Creative and spiritual work feels stronger when you keep clear boundaries and routines.',
    remedies: ['Protect quiet time every day', 'Use music or art to reset mood', 'Stay hydrated and avoid emotional overload'],
    careerTask: ['Turn intuition into a concrete deliverable', 'Avoid vague commitments', 'Create before you consume more input']
  }
};

export function ZodiacWheel({ activeSign }: { activeSign: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const safeSign = zodiacInsights[activeSign] ? activeSign : 'Aries';

  const insight = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const signIndex = Math.max(0, zodiacOrder.indexOf(safeSign));
    const luckyYear = currentYear + ((signIndex % 4) + 1);

    return {
      sign: safeSign,
      ...zodiacInsights.Aries,
      ...zodiacInsights[safeSign],
      luckyYear,
    };
  }, [safeSign]);

  const planetBackdrop = useMemo(() => {
    const accent = insight.accent;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="spaceGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.35" />
            <stop offset="55%" stop-color="#1d4ed8" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#020617" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="planetBody" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stop-color="#f8fafc" stop-opacity="0.96" />
            <stop offset="40%" stop-color="${accent}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="1" />
          </radialGradient>
          <linearGradient id="planetRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e2e8f0" stop-opacity="0.08" />
            <stop offset="50%" stop-color="#ffffff" stop-opacity="0.45" />
            <stop offset="100%" stop-color="${accent}" stop-opacity="0.15" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="#020617" />
        <circle cx="280" cy="180" r="220" fill="url(#spaceGlow)" />
        <circle cx="930" cy="220" r="180" fill="url(#spaceGlow)" />
        <circle cx="875" cy="465" r="148" fill="url(#planetBody)" />
        <ellipse cx="875" cy="500" rx="235" ry="72" fill="none" stroke="url(#planetRing)" stroke-width="18" />
        <ellipse cx="875" cy="500" rx="190" ry="54" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="4" />
        <circle cx="820" cy="430" r="24" fill="#ffffff" fill-opacity="0.18" />
        <circle cx="915" cy="390" r="10" fill="#ffffff" fill-opacity="0.25" />
        <circle cx="760" cy="540" r="12" fill="#ffffff" fill-opacity="0.2" />
        <g fill="#ffffff" fill-opacity="0.6">
          <circle cx="140" cy="115" r="2" />
          <circle cx="210" cy="220" r="1.5" />
          <circle cx="335" cy="145" r="1.8" />
          <circle cx="1010" cy="100" r="2" />
          <circle cx="1080" cy="250" r="1.5" />
          <circle cx="1015" cy="630" r="1.8" />
          <circle cx="150" cy="650" r="1.6" />
          <circle cx="230" cy="520" r="2.1" />
        </g>
      </svg>
    `;

    return `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}")`;
  }, [insight.accent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;

    let animationId: number;

    const drawStars = () => {
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
        ctx.fillRect(x, y, size, size);
      }
    };

    const drawParticles = (rotation: number) => {
      for (let i = 0; i < 50; i++) {
        const angle = (i * 360 / 50) + rotation * 0.2;
        const rad = (angle * Math.PI) / 180;
        const distance = radius + Math.sin(rotation * 0.1 + i) * 30;
        const x = centerX + Math.cos(rad) * distance;
        const y = centerY + Math.sin(rad) * distance;
        const size = Math.random() * 2 + 1;

        ctx.fillStyle = `rgba(139, 92, 246, ${Math.random() * 0.4 + 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width / 2);
      gradient.addColorStop(0, '#1a0a2e');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawStars();
      drawParticles(rotationRef.current);

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
      ctx.stroke();

      numerologyValues.forEach((number) => {
        const angle = number.angle + rotationRef.current;
        const rad = (angle * Math.PI) / 180;
        const x = centerX + Math.cos(rad) * radius;
        const y = centerY + Math.sin(rad) * radius;
        const isActive = number.name === activeSign;

        if (isActive) {
          const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
          glowGradient.addColorStop(0, `${number.color}88`);
          glowGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = number.color;
        ctx.shadowColor = number.color;
        ctx.shadowBlur = isActive ? 20 : 10;
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 12 : 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'white';
        ctx.font = isActive ? 'bold 24px serif' : '20px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(number.symbol, x, y);
      });

      rotationRef.current += 0.2;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [activeSign]);

  return (
    <section className="w-full rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_30px_120px_rgba(0,0,0,0.55)] overflow-hidden relative">
      <div className="absolute inset-0 opacity-100" style={{ backgroundImage: planetBackdrop, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.18),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.25),rgba(2,6,23,0.85))]" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[560px] rounded-[24px] overflow-hidden border border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_30%_70%,rgba(236,72,153,0.16),transparent_34%)]" />
          <canvas
            ref={canvasRef}
            width={600}
            height={500}
            className="relative z-10 w-full h-full"
          />
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/12 bg-slate-950/55 px-4 py-2 backdrop-blur-md">
            <p className="text-white/90 text-xs sm:text-sm whitespace-nowrap">
              Active Sign: <span className="font-semibold" style={{ color: insight.accent }}>{insight.sign}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

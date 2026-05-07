import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { UserForm } from './components/UserForm';
import { NumerologyCard } from './components/NumerologyCard';
import { AdvancedNumerologyDashboard } from './components/AdvancedNumerologyDashboard';
import { calculateLifePathNumber, calculateMulank } from './utils/numerologyRules';
import { gsap } from 'gsap';
import { Sparkles } from 'lucide-react';

interface UserData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  lagnaSign: string;
  lagnaSystem: string;
}

export default function App() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    lagnaSign: 'AUTO',
    lagnaSystem: 'vedic-lahiri'
  });

  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const starField = useMemo(
    () =>
      Array.from({ length: 180 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 53) % 100}%`,
        size: (index % 4) + 1,
        opacity: 0.2 + ((index % 7) * 0.1),
        duration: `${2 + (index % 5)}s`,
        delay: `${(index % 6) * 0.5}s`
      })),
    []
  );
  const numerologyNumbers = useMemo(
    () => [1, 2, 3, 4, 5, 6, 7, 8, 9],
    []
  );
  const planets = useMemo(
    () => [
      { name: 'Sun', symbol: '☉', color: '#FFD166', radius: 28, size: 18 },
      { name: 'Mercury', symbol: '☿', color: '#A3E635', radius: 36, size: 12 },
      { name: 'Venus', symbol: '♀', color: '#F472B6', radius: 46, size: 14 },
      { name: 'Mars', symbol: '♂', color: '#FB7185', radius: 56, size: 12 },
      { name: 'Jupiter', symbol: '♃', color: '#FBBF24', radius: 68, size: 16 },
      { name: 'Saturn', symbol: '♄', color: '#93C5FD', radius: 78, size: 14 },
      { name: 'Uranus', symbol: '♅', color: '#C084FC', radius: 92, size: 12 },
      { name: 'Neptune', symbol: '♆', color: '#60A5FA', radius: 104, size: 12 },
    ],
    []
  );
  const lifePathNumber = useMemo(() => {
    return userData.dateOfBirth ? calculateLifePathNumber(userData.dateOfBirth) : null;
  }, [userData.dateOfBirth]);
  const mulankNumber = useMemo(() => {
    return userData.dateOfBirth ? calculateMulank(userData.dateOfBirth) : null;
  }, [userData.dateOfBirth]);
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
    }
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  const handleDataChange = useCallback((data: UserData) => {
    setUserData(data);
  }, []);

  return (
    <div className="min-h-dvh w-full overflow-x-hidden relative bg-slate-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(88,28,135,0.45),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(14,116,144,0.4),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(30,64,175,0.38),transparent_45%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-indigo-950/5 to-black/40"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[28rem] h-[28rem] sm:w-[42rem] sm:h-[42rem] lg:w-[58rem] lg:h-[58rem] opacity-70">
            <div className="absolute inset-0 rounded-full border border-indigo-200/45 animate-spin" style={{ animationDuration: '120s' }}></div>
            <div className="absolute inset-[8%] rounded-full border border-cyan-100/35 animate-spin" style={{ animationDuration: '80s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-[16%] rounded-full border border-purple-100/30 animate-spin" style={{ animationDuration: '55s' }}></div>

            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '95s' }}>
              {numerologyNumbers.map((number, index) => {
                const angle = (index / numerologyNumbers.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 46;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);

                const isLifePathActive = lifePathNumber === number;
                const isMulankActive = mulankNumber === number;
                const isActive = isLifePathActive || isMulankActive;
                return (
                  <span
                    key={`${number}-${index}`}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 font-bold ${isActive ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-sm sm:text-base lg:text-xl'}`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      color: isActive ? '#fff' : 'rgba(148,163,184,0.85)',
                      textShadow: isLifePathActive && isMulankActive
                        ? '0 0 20px rgba(99,102,241,0.95), 0 0 28px rgba(236,72,153,0.85)'
                        : isLifePathActive
                        ? '0 0 18px rgba(99,102,241,0.9), 0 0 32px rgba(99,102,241,0.6)'
                        : isMulankActive
                        ? '0 0 18px rgba(236,72,153,0.9), 0 0 32px rgba(236,72,153,0.6)'
                        : undefined,
                      transition: 'transform 300ms ease, text-shadow 300ms ease',
                      transform: isLifePathActive && isMulankActive ? 'scale(1.35)' : isActive ? 'scale(1.25)' : undefined,
                      animation: isActive ? 'glowPulse 1.8s infinite ease-in-out' : undefined
                    }}
                  >
                    {number}
                  </span>
                );
              })}
              {planets.map((p, i) => {
                const angle = (i / planets.length) * Math.PI * 2 - Math.PI / 2;
                const radiusP = p.radius;
                const xP = 50 + radiusP * Math.cos(angle);
                const yP = 50 + radiusP * Math.sin(angle);
                return (
                  <div
                    key={p.name}
                    title={p.name}
                    aria-label={p.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
                    style={{
                      left: `${xP}%`,
                      top: `${yP}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background: p.color,
                      boxShadow: `0 0 10px ${p.color}66, 0 0 22px ${p.color}44`,
                      color: '#081026',
                      fontSize: Math.max(10, p.size - 4),
                      transition: 'transform 400ms ease',
                      animation: 'planetFloat 6s ease-in-out infinite'
                    }}
                  >
                    <span style={{ lineHeight: 1 }}>{p.symbol}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {starField.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: star.duration,
              animationDelay: star.delay
            }}
          />
        ))}

        <div className="absolute -top-20 left-[-12%] w-96 h-96 rounded-full bg-fuchsia-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-[-10%] w-[28rem] h-[28rem] rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div className="absolute bottom-[-18%] left-1/4 w-[30rem] h-[30rem] rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 md:py-12 pb-24 md:pb-12">
        <div ref={titleRef} className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 px-2">
            <Sparkles className="text-yellow-400 w-6 h-6 md:w-8 md:h-8 animate-pulse shrink-0" />
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent break-words">
              Numerology Insights
            </h1>
            <Sparkles className="text-yellow-400 w-6 h-6 md:w-8 md:h-8 animate-pulse shrink-0" />
          </div>
          <p className="text-white/60 text-base md:text-lg px-2">
            Discover your celestial blueprint through astrology and numerology
          </p>
        </div>

        <div ref={contentRef} className="grid gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="space-y-6 md:space-y-8 min-w-0">
            <UserForm onDataChange={handleDataChange} />
          </div>

          <div className="space-y-6 md:space-y-8 min-w-0">
            <NumerologyCard dateOfBirth={userData.dateOfBirth} />
          </div>

          <div className="space-y-6 md:space-y-8 min-w-0">
            <AdvancedNumerologyDashboard
              name={userData.name}
              dateOfBirth={userData.dateOfBirth}
            />
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm">
            Powered by cosmic wisdom and modern technology
          </p>
        </div>
      </div>
      <style>{`
        @keyframes glowPulse { 0% { filter: drop-shadow(0 0 6px rgba(99,102,241,0.6)); } 50% { filter: drop-shadow(0 0 18px rgba(99,102,241,0.95)); } 100% { filter: drop-shadow(0 0 6px rgba(99,102,241,0.6)); } }
        @keyframes planetFloat { 0% { transform: translateY(-2px); } 50% { transform: translateY(2px); } 100% { transform: translateY(-2px); } }
      `}</style>
    </div>
  );
}
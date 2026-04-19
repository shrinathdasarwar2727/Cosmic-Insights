import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { ZodiacWheel } from './components/ZodiacWheel';
import { UserForm } from './components/UserForm';
import { HoroscopePanel } from './components/HoroscopePanel';
import { NumerologyCard } from './components/NumerologyCard';
import { getZodiacSign, getZodiacSymbol } from './utils/astrology';
import { gsap } from 'gsap';
import { Sparkles } from 'lucide-react';

interface UserData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

export default function App() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: ''
  });

  const [zodiacSign, setZodiacSign] = useState('Aries');
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
  const zodiacBackgroundSymbols = useMemo(
    () => ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'],
    []
  );

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
    if (data.dateOfBirth) {
      const sign = getZodiacSign(data.dateOfBirth);
      setZodiacSign(sign);
    }
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
              {zodiacBackgroundSymbols.map((symbol, index) => {
                const angle = (index / zodiacBackgroundSymbols.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 46;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);

                return (
                  <span
                    key={`${symbol}-${index}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-sm sm:text-base lg:text-xl text-indigo-100/85"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {symbol}
                  </span>
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

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 md:py-12">
        <div ref={titleRef} className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 px-2">
            <Sparkles className="text-yellow-400 w-6 h-6 md:w-8 md:h-8 animate-pulse shrink-0" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent break-words">
              Cosmic Insights
            </h1>
            <Sparkles className="text-yellow-400 w-6 h-6 md:w-8 md:h-8 animate-pulse shrink-0" />
          </div>
          <p className="text-white/60 text-base md:text-lg px-2">
            Discover your celestial blueprint through astrology and numerology
          </p>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="space-y-6 md:space-y-8 min-w-0">
            <UserForm onDataChange={handleDataChange} />
            <div className="bg-white/[0.008] backdrop-blur-2xl rounded-2xl p-6 border border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.045)]">
              <ZodiacWheel activeSign={zodiacSign} />
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 min-w-0">
            <HoroscopePanel
              zodiacSign={zodiacSign}
              dateOfBirth={userData.dateOfBirth}
              timeOfBirth={userData.timeOfBirth}
              placeOfBirth={userData.placeOfBirth}
            />
            <NumerologyCard dateOfBirth={userData.dateOfBirth} />

            {userData.name && (
              <div className="bg-white/[0.008] backdrop-blur-2xl rounded-2xl p-5 md:p-8 border border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.045)]">
                <h2 className="text-xl md:text-2xl mb-4 text-white/90">Your Cosmic Summary</h2>
                <div className="space-y-3 text-white/70">
                  <p>
                    <span className="text-purple-300">Name:</span> {userData.name}
                  </p>
                  <p>
                    <span className="text-purple-300">Zodiac Sign:</span> {zodiacSign} {getZodiacSymbol(zodiacSign)}
                  </p>
                  {userData.placeOfBirth && (
                    <p>
                      <span className="text-purple-300">Birth Place:</span> {userData.placeOfBirth}
                    </p>
                  )}
                  <p className="text-sm text-white/50 pt-4 border-t border-white/10">
                    Your cosmic journey is unique. The stars and numbers reveal pathways to understanding your true potential.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm">
            Powered by cosmic wisdom and modern technology
          </p>
        </div>
      </div>
    </div>
  );
}
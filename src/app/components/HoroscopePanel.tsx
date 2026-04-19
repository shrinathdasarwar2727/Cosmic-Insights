import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Sparkles } from 'lucide-react';
import { ZodiacConstellation } from './ZodiacConstellation';
import { ZodiacAnimalBackground } from './ZodiacAnimalBackground';
import { generatePrediction } from '../utils/predictionEngine';
import { calculateLifePathNumber, calculateMulank } from '../utils/numerologyRules';

interface HoroscopePanelProps {
  name: string;
  zodiacSign: string;
  lagnaSign: string;
  lagnaSystem: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

export function HoroscopePanel({ name, zodiacSign, lagnaSign, lagnaSystem, dateOfBirth, timeOfBirth, placeOfBirth }: HoroscopePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (circleRef.current && textRef.current) {
      const timeline = gsap.timeline();

      timeline.fromTo(
        circleRef.current,
        { scale: 1, opacity: 1, rotation: 0, zIndex: 10 },
        {
          scale: 3,
          opacity: 0.1,
          rotation: 360,
          duration: 1.5,
          ease: 'power2.out',
          zIndex: 0
        }
      );

      timeline.fromTo(
        textRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.4)'
        },
        '-=0.8'
      );
    }
  }, [zodiacSign]);

  const prediction = useMemo(() => {
    const lifePathNumber = calculateLifePathNumber(dateOfBirth);
    const mulank = calculateMulank(dateOfBirth);

    return generatePrediction({
      name,
      zodiacSign,
      lagnaSign,
      lagnaSystem,
      lifePathNumber,
      mulank,
      currentDate: new Date(),
      dateOfBirth,
      timeOfBirth,
      placeOfBirth
    });
  }, [name, zodiacSign, lagnaSign, lagnaSystem, dateOfBirth, timeOfBirth, placeOfBirth]);

  const toneStyle = {
    Positive: 'border-emerald-300/40 text-emerald-200',
    Neutral: 'border-cyan-300/40 text-cyan-200',
    Challenging: 'border-amber-300/40 text-amber-200'
  };

  return (
    <div
      ref={containerRef}
      className="bg-white/[0.008] backdrop-blur-2xl rounded-2xl p-5 md:p-8 border border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.045)] relative overflow-hidden min-h-[320px] md:min-h-[400px] flex items-center justify-center"
    >
      <ZodiacAnimalBackground sign={zodiacSign} />

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
      </div>

      <ZodiacConstellation sign={zodiacSign} />

      <div
        ref={circleRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 blur-xl"></div>
        <div className="absolute w-32 h-32 rounded-full border-4 border-purple-400/60 animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute w-24 h-24 rounded-full border-4 border-blue-400/60 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-300/80 to-pink-300/80 shadow-lg shadow-purple-500/50"></div>
      </div>

      <div ref={textRef} className="relative z-10 w-full">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-yellow-400 w-6 h-6" />
          <h2 className="text-xl md:text-2xl text-white/90">Daily Horoscope</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg md:text-xl text-purple-300">{zodiacSign}</h3>
            <span className="text-xs md:text-sm text-white/50">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {prediction ? (
            <>
              <div className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2">
                <span className={`inline-flex rounded-full border px-2 py-1 text-xs ${toneStyle[prediction.tone as keyof typeof toneStyle]}`}>
                  Day Tone: {prediction.tone}
                </span>
              </div>

              <p className="text-white/75 leading-relaxed whitespace-pre-line">{prediction.overall}</p>
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="w-full rounded-lg border border-white/40 bg-white/[0.01] px-4 py-2 text-sm text-white/90 hover:bg-white/[0.04] transition-colors"
              >
                {showDetails ? 'Hide Detailed Horoscope' : 'Show Detailed Horoscope'}
              </button>

              {showDetails && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-emerald-300/30 bg-white/0 p-4">
                      <h4 className="text-emerald-200 text-sm mb-2">Love</h4>
                      <p className="text-white/70 text-sm whitespace-pre-line">{prediction.love}</p>
                    </div>
                    <div className="rounded-xl border border-amber-300/30 bg-white/0 p-4">
                      <h4 className="text-amber-200 text-sm mb-2">Career</h4>
                      <p className="text-white/70 text-sm whitespace-pre-line">{prediction.career}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-indigo-300/30 bg-white/0 p-4">
                    <h4 className="text-indigo-200 text-sm mb-2">Health</h4>
                    <p className="text-white/70 text-sm whitespace-pre-line">{prediction.health}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-cyan-300/30 bg-white/0 p-4">
                      <h4 className="text-cyan-200 text-sm mb-2">What To Do</h4>
                      <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                        {prediction.do.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-rose-300/30 bg-white/0 p-4">
                      <h4 className="text-rose-200 text-sm mb-2">What Not To Do</h4>
                      <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                        {prediction.dont.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/15 bg-white/0 p-4">
                    <h4 className="text-white/90 text-sm mb-2">How This Reading Uses Your Data</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      This prediction engine combines your zodiac sign, Lagna (ascendant), Life Path Number, Mulank, and current date tone. Auto Lagna now uses Vedic sidereal mode with Lahiri ayanamsha. The date creates deterministic daily variation, so predictions update each day without random noise.
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                      Input received: Name {name || 'not set'}, DOB {dateOfBirth || 'not set'}, Time {timeOfBirth || 'not set'}, Place {placeOfBirth || 'not set'}, Zodiac {zodiacSign}, Lagna {prediction.meta.lagnaSign} ({prediction.meta.lagnaSource}, {prediction.meta.lagnaSystem}), Life Path {prediction.meta.lifePathNumber}, Mulank {prediction.meta.mulank}.
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-white/70 leading-relaxed">Enter your birth details to reveal your cosmic guidance.</p>
          )}
        </div>
      </div>
    </div>
  );
}

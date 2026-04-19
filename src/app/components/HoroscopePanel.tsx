import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Sparkles } from 'lucide-react';
import { ZodiacConstellation } from './ZodiacConstellation';
import { ZodiacAnimalBackground } from './ZodiacAnimalBackground';

interface HoroscopeDetails {
  overview: string;
  strengths: string;
  cautions: string;
  doList: string[];
  avoidList: string[];
}

const horoscopeDetails: Record<string, HoroscopeDetails> = {
  Aries: {
    overview: 'High momentum supports leadership, initiative, and fast decisions. You perform best when you channel energy into one clear target.',
    strengths: 'Confidence, courage, and action-oriented thinking help you start things others postpone.',
    cautions: 'Impatience and reacting too quickly can create avoidable conflict.',
    doList: ['Start one important pending task', 'Speak directly but respectfully', 'Use physical activity to release extra stress'],
    avoidList: ['Rushing major decisions without review', 'Turning small disagreement into argument', 'Overcommitting in excitement']
  },
  Taurus: {
    overview: 'Steady, practical energy favors consistency, financial planning, and relationship stability.',
    strengths: 'Reliability and patience make you excellent at building long-term results.',
    cautions: 'Resistance to change can delay useful opportunities.',
    doList: ['Finish delayed practical work', 'Review spending and savings calmly', 'Take a slow, grounding break in nature'],
    avoidList: ['Ignoring new methods only due habit', 'Holding emotional stress silently', 'Stubbornly saying no without hearing details']
  },
  Gemini: {
    overview: 'Communication and learning are highlighted. Networking, writing, and idea-sharing are especially productive.',
    strengths: 'Quick thinking, adaptability, and curiosity help you solve problems creatively.',
    cautions: 'Scattered focus can reduce depth and follow-through.',
    doList: ['Prioritize top three tasks', 'Use your voice for collaboration', 'Capture new ideas in notes immediately'],
    avoidList: ['Multitasking every task at once', 'Spreading unverified information', 'Starting more than you can finish']
  },
  Cancer: {
    overview: 'Emotional awareness and home-related priorities come forward. Supportive bonds help you feel secure and productive.',
    strengths: 'Empathy, care, and intuition help you understand people deeply.',
    cautions: 'Overthinking emotions may create unnecessary mood swings.',
    doList: ['Set one healthy emotional boundary', 'Reconnect with trusted family or friend', 'Create a calm evening routine'],
    avoidList: ['Taking criticism too personally', 'Withdrawing without communication', 'Making decisions only from temporary mood']
  },
  Leo: {
    overview: 'Visibility and creative self-expression are strong. Recognition grows when confidence is paired with humility.',
    strengths: 'Charisma, leadership, and generosity inspire people around you.',
    cautions: 'Need for validation can lead to burnout or ego clashes.',
    doList: ['Lead one initiative with clarity', 'Encourage someone on your team', 'Use creativity in work or personal project'],
    avoidList: ['Dominating every conversation', 'Ignoring practical feedback', 'Equating attention with self-worth']
  },
  Virgo: {
    overview: 'Detail work, organization, and skill improvement are favored. This is a strong period for systems and routines.',
    strengths: 'Precision, analysis, and service mindset improve quality and reliability.',
    cautions: 'Perfectionism may delay completion and increase stress.',
    doList: ['Complete one task to 90% instead of 100%', 'Organize workspace and schedule', 'Track one habit consistently'],
    avoidList: ['Over-criticizing yourself or others', 'Getting stuck in minor details', 'Postponing launch for perfection']
  },
  Libra: {
    overview: 'Partnership, diplomacy, and social alignment are highlighted. Balance decisions with both logic and values.',
    strengths: 'Fairness, harmony, and negotiation skills improve collaboration.',
    cautions: 'People-pleasing can hide your real priorities.',
    doList: ['Clarify one personal boundary kindly', 'Resolve a pending misunderstanding', 'Choose quality over quantity in commitments'],
    avoidList: ['Delaying decisions too long', 'Agreeing just to avoid conflict', 'Ignoring your own needs']
  },
  Scorpio: {
    overview: 'Deep focus and transformation are active. You can make powerful progress by releasing old patterns.',
    strengths: 'Intensity, emotional depth, and strategic thinking support meaningful change.',
    cautions: 'Control issues or secrecy may strain trust.',
    doList: ['Do one honest self-review', 'Channel intensity into productive work', 'Let go of one draining attachment'],
    avoidList: ['Testing loyalty through emotional games', 'Holding grudges silently', 'Forcing outcomes through pressure']
  },
  Sagittarius: {
    overview: 'Expansion, learning, and broader perspective are strong. Good time for study, travel planning, and fresh goals.',
    strengths: 'Optimism and vision help you motivate yourself and others.',
    cautions: 'Over-promising can create avoidable disappointment.',
    doList: ['Study a new topic deeply', 'Set practical milestones for big goals', 'Share honest encouragement with others'],
    avoidList: ['Escaping routine responsibilities', 'Giving advice without listening first', 'Taking high-risk decisions impulsively']
  },
  Capricorn: {
    overview: 'Discipline and structure support long-term progress. Results come through persistence and focused execution.',
    strengths: 'Responsibility, resilience, and planning improve career and finances.',
    cautions: 'Work-first mindset may reduce emotional wellbeing.',
    doList: ['Prioritize one high-impact objective', 'Review long-term plan with realistic steps', 'Create rest time as non-negotiable'],
    avoidList: ['Ignoring personal relationships', 'Carrying all burden alone', 'Measuring success only by output']
  },
  Aquarius: {
    overview: 'Innovation and independent thought are favored. Your unique perspective can unlock new approaches.',
    strengths: 'Originality, vision, and social intelligence help in group ideas and systems thinking.',
    cautions: 'Emotional detachment may make communication feel distant.',
    doList: ['Test one unconventional idea', 'Collaborate with open-minded people', 'Explain your logic in simple language'],
    avoidList: ['Rejecting tradition without evaluation', 'Disconnecting emotionally from close people', 'Changing direction too frequently']
  },
  Pisces: {
    overview: 'Intuition, imagination, and healing energy are high. Creative and reflective work can be especially fulfilling.',
    strengths: 'Compassion, sensitivity, and artistic instinct help you connect deeply.',
    cautions: 'Boundary issues can lead to overwhelm and confusion.',
    doList: ['Use journaling or meditation for clarity', 'Protect your schedule with clear boundaries', 'Create through music, art, or writing'],
    avoidList: ['Absorbing everyone else emotional load', 'Escaping reality under stress', 'Saying yes when you mean no']
  }
};

interface HoroscopePanelProps {
  zodiacSign: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

export function HoroscopePanel({ zodiacSign, dateOfBirth, timeOfBirth, placeOfBirth }: HoroscopePanelProps) {
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

  const detail = horoscopeDetails[zodiacSign];

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
          {detail ? (
            <>
              <p className="text-white/75 leading-relaxed">{detail.overview}</p>
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
                      <h4 className="text-emerald-200 text-sm mb-2">Pros</h4>
                      <p className="text-white/70 text-sm">{detail.strengths}</p>
                    </div>
                    <div className="rounded-xl border border-amber-300/30 bg-white/0 p-4">
                      <h4 className="text-amber-200 text-sm mb-2">Cons</h4>
                      <p className="text-white/70 text-sm">{detail.cautions}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-cyan-300/30 bg-white/0 p-4">
                      <h4 className="text-cyan-200 text-sm mb-2">What To Do</h4>
                      <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                        {detail.doList.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-rose-300/30 bg-white/0 p-4">
                      <h4 className="text-rose-200 text-sm mb-2">What Not To Do</h4>
                      <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                        {detail.avoidList.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/15 bg-white/0 p-4">
                    <h4 className="text-white/90 text-sm mb-2">How This Reading Uses Your Data</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Zodiac sign is calculated from your date of birth only. Time and place of birth are currently collected for profile context and future advanced features, but they do not change this horoscope yet.
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                      Input received: DOB {dateOfBirth || 'not set'}, Time {timeOfBirth || 'not set'}, Place {placeOfBirth || 'not set'}.
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

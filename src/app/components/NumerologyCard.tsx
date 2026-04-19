import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Hash } from 'lucide-react';

interface NumerologyMeaning {
  title: string;
  description: string;
  pros: string;
  cons: string;
  doList: string[];
  avoidList: string[];
}

const lifePathMeanings: Record<number, NumerologyMeaning> = {
  1: {
    title: 'The Leader',
    description: 'Independent, pioneering, and ambitious. Natural leaders with strong willpower and determination to achieve their goals.',
    pros: 'Strong initiative, high confidence, and ability to influence direction.',
    cons: 'Can become impatient, controlling, or too self-focused under stress.',
    doList: ['Take ownership of one important goal', 'Lead with collaboration, not force', 'Practice active listening daily'],
    avoidList: ['Ignoring team input', 'Starting conflicts to prove a point', 'Overworking to control every detail']
  },
  2: {
    title: 'The Peacemaker',
    description: 'Diplomatic, sensitive, and cooperative. Excel at creating harmony and understanding different perspectives.',
    pros: 'Excellent mediation skills, emotional intelligence, and partnership strength.',
    cons: 'May suppress personal needs and avoid necessary confrontation.',
    doList: ['Communicate one honest need clearly', 'Use diplomacy in difficult talks', 'Build confidence through small decisions'],
    avoidList: ['People-pleasing at your expense', 'Avoiding conflict forever', 'Depending entirely on external validation']
  },
  3: {
    title: 'The Creative',
    description: 'Expressive, optimistic, and artistic. Natural communicators with a gift for inspiring and uplifting others.',
    pros: 'Creative expression, charisma, and social enthusiasm.',
    cons: 'Can lose focus and leave plans unfinished.',
    doList: ['Create daily without judging quality', 'Structure creative time with deadlines', 'Speak ideas with confidence'],
    avoidList: ['Overpromising due excitement', 'Escaping tasks through distraction', 'Seeking attention over substance']
  },
  4: {
    title: 'The Builder',
    description: 'Practical, organized, and hardworking. Create solid foundations and excel at bringing structure to chaos.',
    pros: 'Dependable systems, discipline, and stable growth mindset.',
    cons: 'May become rigid, resistant, or overly cautious.',
    doList: ['Build routines that support long-term goals', 'Break big goals into clear steps', 'Allow controlled experimentation'],
    avoidList: ['Rejecting change by default', 'Micromanaging every process', 'Working without rest cycles']
  },
  5: {
    title: 'The Explorer',
    description: 'Adventurous, versatile, and freedom-loving. Thrive on change and new experiences, embracing life fully.',
    pros: 'Adaptability, communication range, and fast recovery from setbacks.',
    cons: 'Impulsiveness and inconsistency can weaken long-term plans.',
    doList: ['Channel curiosity into structured learning', 'Pause before big decisions', 'Maintain one stable daily anchor habit'],
    avoidList: ['Chasing every new option', 'Breaking commitments casually', 'Using risk for thrill alone']
  },
  6: {
    title: 'The Nurturer',
    description: 'Caring, responsible, and community-oriented. Natural healers who create harmony in their environment.',
    pros: 'Supportive leadership, loyalty, and responsibility in relationships.',
    cons: 'Can become overprotective, controlling, or emotionally burdened.',
    doList: ['Set healthy helping boundaries', 'Prioritize your own wellbeing too', 'Offer support without over-fixing'],
    avoidList: ['Carrying everyone problems', 'Expecting appreciation as obligation', 'Neglecting personal goals']
  },
  7: {
    title: 'The Seeker',
    description: 'Analytical, spiritual, and introspective. Deep thinkers who seek truth and understanding of life mysteries.',
    pros: 'Strong insight, research ability, and spiritual depth.',
    cons: 'Isolation and over-analysis may reduce practical progress.',
    doList: ['Schedule focused learning time', 'Share insights with trusted people', 'Balance reflection with action'],
    avoidList: ['Withdrawing from all social contact', 'Overthinking simple choices', 'Distrusting everyone automatically']
  },
  8: {
    title: 'The Achiever',
    description: 'Ambitious, authoritative, and success-driven. Natural ability to manifest abundance and material success.',
    pros: 'Strategic vision, execution power, and resilience in pressure.',
    cons: 'Can become work-dominant or overly status-focused.',
    doList: ['Define success beyond money alone', 'Lead ethically with accountability', 'Protect personal time and health'],
    avoidList: ['Using control over collaboration', 'Ignoring emotional needs', 'Taking shortcuts for quick gains']
  },
  9: {
    title: 'The Humanitarian',
    description: 'Compassionate, idealistic, and selfless. Dedicated to making the world a better place for all.',
    pros: 'Compassion, wisdom, and broad social awareness.',
    cons: 'Emotional overload and difficulty with boundaries.',
    doList: ['Serve causes with sustainable effort', 'Keep clear personal boundaries', 'Transform pain into meaningful contribution'],
    avoidList: ['Trying to save everyone', 'Ignoring practical needs', 'Holding guilt for things beyond control']
  },
  11: {
    title: 'Master Intuitive',
    description: 'Heightened intuition, sensitivity, and visionary communication. You can inspire others through insight and purpose.',
    pros: 'Strong intuition, inspiring presence, and spiritual leadership potential.',
    cons: 'Nervous tension, emotional overwhelm, and self-doubt spikes.',
    doList: ['Ground intuition with daily routine', 'Journal insights before acting', 'Share vision in practical steps'],
    avoidList: ['Ignoring mental rest', 'Expecting instant perfection', 'Staying in fear of judgment']
  },
  22: {
    title: 'Master Builder',
    description: 'Rare blend of vision and execution. You can turn ambitious ideals into concrete structures that help many people.',
    pros: 'Large-scale planning skill, practical leadership, and high impact potential.',
    cons: 'Pressure overload and fear of failure can cause paralysis.',
    doList: ['Break big vision into milestones', 'Delegate with trust', 'Balance ambition with recovery'],
    avoidList: ['Carrying everything alone', 'Abandoning vision after one setback', 'Sacrificing health for output']
  },
  33: {
    title: 'Master Teacher',
    description: 'Compassion-driven leadership through service and wisdom. You are often called to uplift, guide, and heal communities.',
    pros: 'Powerful empathy, mentoring ability, and service orientation.',
    cons: 'Over-responsibility and emotional burnout risk.',
    doList: ['Teach with clear boundaries', 'Prioritize self-care as duty', 'Focus on one core service path'],
    avoidList: ['Rescuing everyone', 'Feeling guilty for rest', 'Neglecting personal life mission']
  }
};

function calculateLifePath(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;

  const digits = dateOfBirth.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((acc, num) => acc + num, 0);

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((acc, num) => acc + num, 0);
  }

  return sum;
}

function calculateMulank(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;

  const date = new Date(dateOfBirth);
  const day = date.getDate();

  if (day === 11 || day === 22) return day;

  let sum = day;
  while (sum > 9) {
    sum = sum.toString().split('').map(Number).reduce((acc, num) => acc + num, 0);
  }

  return sum;
}

const mulankMeanings: Record<number, NumerologyMeaning> = {
  1: {
    title: 'The Sun',
    description: 'Natural leader with strong willpower. Independent, creative, and ambitious with excellent leadership qualities.',
    pros: 'Confidence, individuality, and leadership drive.',
    cons: 'May appear dominant or impatient in teams.',
    doList: ['Lead by example', 'Use confidence with empathy', 'Set measurable goals'],
    avoidList: ['Forcing your way in every discussion', 'Ignoring constructive criticism', 'Acting without planning']
  },
  2: {
    title: 'The Moon',
    description: 'Emotional, intuitive, and caring. Excellent at partnerships and have a gentle, diplomatic nature.',
    pros: 'Sensitivity, cooperation, and relationship insight.',
    cons: 'Mood fluctuations and indecision under pressure.',
    doList: ['Maintain emotional routine', 'Speak needs clearly', 'Choose calm communication'],
    avoidList: ['Suppressing emotions repeatedly', 'Overdependence on approval', 'Avoiding all hard conversations']
  },
  3: {
    title: 'Jupiter',
    description: 'Optimistic, creative, and sociable. Natural communicator with artistic talents and jovial personality.',
    pros: 'Creative expression and inspiring communication.',
    cons: 'Inconsistent focus and emotional dramatization.',
    doList: ['Use creativity in practical projects', 'Stay consistent with one habit', 'Express ideas with structure'],
    avoidList: ['Dropping work midway', 'Overcommitting socially', 'Reacting emotionally before thinking']
  },
  4: {
    title: 'Rahu',
    description: 'Practical, hardworking, and systematic. Strong foundation builder with disciplined approach to life.',
    pros: 'Consistency, practicality, and work ethic.',
    cons: 'Rigidity and resistance to uncertainty.',
    doList: ['Follow process with flexibility', 'Set realistic timelines', 'Keep healthy routines'],
    avoidList: ['Dismissing innovation blindly', 'Becoming too critical', 'Turning routine into stress']
  },
  5: {
    title: 'Mercury',
    description: 'Quick-witted, versatile, and communicative. Love freedom and change, excellent business sense.',
    pros: 'Adaptability, persuasion, and mental agility.',
    cons: 'Restlessness and poor follow-through.',
    doList: ['Commit to one priority at a time', 'Use communication skill in learning', 'Ground your day with structure'],
    avoidList: ['Jumping between unfinished plans', 'Risky decisions without checks', 'Escaping responsibility via novelty']
  },
  6: {
    title: 'Venus',
    description: 'Loving, artistic, and harmonious. Strong sense of beauty and balance, natural caretaker.',
    pros: 'Harmony building, caregiving, and aesthetic sense.',
    cons: 'Can become over-involved in others lives.',
    doList: ['Offer care with boundaries', 'Create balance between duty and joy', 'Support loved ones consistently'],
    avoidList: ['Taking guilt-driven decisions', 'Ignoring your own needs', 'Controlling out of care']
  },
  7: {
    title: 'Ketu',
    description: 'Spiritual, analytical, and introspective. Deep thinker with strong intuition and mystical inclinations.',
    pros: 'Analytical depth and intuitive wisdom.',
    cons: 'Isolation tendencies and distrust.',
    doList: ['Balance solitude with connection', 'Study deeply and apply practically', 'Practice mindfulness for clarity'],
    avoidList: ['Overthinking every interaction', 'Cutting off people abruptly', 'Ignoring material responsibilities']
  },
  8: {
    title: 'Saturn',
    description: 'Ambitious, authoritative, and determined. Strong organizational skills and material success.',
    pros: 'Authority, discipline, and strategic persistence.',
    cons: 'Can become severe, rigid, or work-obsessed.',
    doList: ['Build long-term systems', 'Lead with fairness', 'Protect physical and mental health'],
    avoidList: ['Defining worth by status only', 'Overcontrolling teams', 'Neglecting emotional life']
  },
  9: {
    title: 'Mars',
    description: 'Dynamic, courageous, and passionate. Natural fighter with humanitarian ideals and strong energy.',
    pros: 'High energy, courage, and compassionate action.',
    cons: 'Emotional intensity and burnout risk.',
    doList: ['Channel passion into service', 'Use physical activity to regulate stress', 'Focus on meaningful goals'],
    avoidList: ['Reactive anger', 'Taking every burden personally', 'Ignoring rest and recovery']
  },
  11: {
    title: 'Master Number',
    description: 'Highly intuitive and spiritual. Inspirational leader with heightened awareness and psychic abilities.',
    pros: 'Strong spiritual insight and inspiration power.',
    cons: 'Emotional overload and nervous sensitivity.',
    doList: ['Ground intuition with routine', 'Share guidance responsibly', 'Protect quiet time'],
    avoidList: ['Absorbing every external emotion', 'Making fear-based choices', 'Ignoring body signals']
  },
  22: {
    title: 'Master Builder',
    description: 'Practical visionary with ability to manifest dreams. Combines intuition with material mastery.',
    pros: 'Vision-to-execution power and strong planning.',
    cons: 'Heavy pressure and unrealistic self-expectations.',
    doList: ['Translate vision into action plans', 'Ask for support early', 'Work in sustainable rhythm'],
    avoidList: ['Doing everything alone', 'All-or-nothing thinking', 'Ignoring rest in pursuit of goals']
  }
};

interface BehaviorProfile {
  naturalBehavior: string;
  stressBehavior: string;
  angerPattern: string;
  calmSuggestions: string[];
}

const behaviorProfiles: Record<number, BehaviorProfile> = {
  1: {
    naturalBehavior: 'Direct, bold, and self-driven. You prefer leading rather than waiting for instructions.',
    stressBehavior: 'Can become impatient and dominant if progress is blocked.',
    angerPattern: 'Anger appears quickly and openly, then cools down faster than expected.',
    calmSuggestions: ['Pause before responding in conflict', 'Use short physical activity breaks', 'Delegate when pressure rises']
  },
  2: {
    naturalBehavior: 'Gentle, cooperative, and peace-seeking. You value emotional safety and harmony.',
    stressBehavior: 'May become withdrawn, overly sensitive, or passive under criticism.',
    angerPattern: 'Anger is usually suppressed first, then may surface as emotional outburst later.',
    calmSuggestions: ['Express discomfort early', 'Use clear boundaries', 'Avoid silent resentment']
  },
  3: {
    naturalBehavior: 'Expressive, social, and optimistic. You process feelings through communication.',
    stressBehavior: 'Can become scattered, dramatic, or inconsistent during pressure.',
    angerPattern: 'Anger often comes through sharp words, tone, or sarcasm.',
    calmSuggestions: ['Take a short pause before speaking', 'Write feelings before reacting', 'Focus on one issue at a time']
  },
  4: {
    naturalBehavior: 'Practical, structured, and disciplined. You like systems and predictability.',
    stressBehavior: 'Can become rigid and controlling when plans fail.',
    angerPattern: 'Anger builds slowly but can stay for longer if not resolved.',
    calmSuggestions: ['Accept one flexible alternative', 'Separate facts from assumptions', 'Schedule recovery time']
  },
  5: {
    naturalBehavior: 'Curious, active, and freedom-oriented. You thrive in dynamic environments.',
    stressBehavior: 'May become restless, impulsive, or inconsistent.',
    angerPattern: 'Anger is reactive and fast, especially when feeling restricted.',
    calmSuggestions: ['Delay decisions by 10 minutes', 'Use movement to discharge stress', 'Commit to one priority first']
  },
  6: {
    naturalBehavior: 'Protective, caring, and relationship-focused. You naturally support others.',
    stressBehavior: 'Can become over-responsible, controlling, or emotionally burdened.',
    angerPattern: 'Anger often appears when efforts are unappreciated or boundaries are crossed.',
    calmSuggestions: ['Say no without guilt', 'Ask for support directly', 'Balance care for self and others']
  },
  7: {
    naturalBehavior: 'Analytical, reflective, and private. You prefer depth over noise.',
    stressBehavior: 'May isolate, overthink, or distrust quickly.',
    angerPattern: 'Anger is often internalized and shown through distance or silence.',
    calmSuggestions: ['Communicate one clear feeling', 'Use grounding exercises', 'Return to practical next steps']
  },
  8: {
    naturalBehavior: 'Goal-focused, strategic, and decisive. You naturally take charge in pressure.',
    stressBehavior: 'Can become harsh, work-obsessed, or controlling.',
    angerPattern: 'Anger can become intense when authority or fairness is challenged.',
    calmSuggestions: ['Separate ego from outcome', 'Lower voice and slow pace', 'Include others in decisions']
  },
  9: {
    naturalBehavior: 'Compassionate, idealistic, and emotionally deep. You care about the bigger picture.',
    stressBehavior: 'May absorb too much emotion and feel drained.',
    angerPattern: 'Anger can be explosive after long emotional buildup.',
    calmSuggestions: ['Release emotions through journaling', 'Set emotional boundaries', 'Rest before reacting']
  },
  11: {
    naturalBehavior: 'Highly intuitive, sensitive, and inspirational.',
    stressBehavior: 'Can become anxious, overwhelmed, or mentally overloaded.',
    angerPattern: 'Anger is less outward but may turn into nervous tension and emotional spikes.',
    calmSuggestions: ['Reduce stimulation', 'Use breathwork and sleep discipline', 'Convert insight into small actions']
  },
  22: {
    naturalBehavior: 'Visionary and practical at the same time. You can execute large plans.',
    stressBehavior: 'May carry too much responsibility and become emotionally hard.',
    angerPattern: 'Anger appears when things feel inefficient or out of control.',
    calmSuggestions: ['Break large goals into phases', 'Delegate proactively', 'Keep recovery time non-negotiable']
  },
  33: {
    naturalBehavior: 'Compassion-led teacher energy with strong service orientation.',
    stressBehavior: 'Can over-give and become emotionally exhausted.',
    angerPattern: 'Anger appears as disappointment when values are repeatedly violated.',
    calmSuggestions: ['Protect your energy', 'Help without self-sacrifice', 'Create emotional reset rituals']
  }
};

interface NumerologyCardProps {
  dateOfBirth: string;
}

export function NumerologyCard({ dateOfBirth }: NumerologyCardProps) {
  const lifePathRef = useRef<HTMLDivElement>(null);
  const mulankRef = useRef<HTMLDivElement>(null);
  const [lifePath, setLifePath] = useState(0);
  const [mulank, setMulank] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const prevLifePath = useRef(0);
  const prevMulank = useRef(0);

  useEffect(() => {
    const newLifePath = calculateLifePath(dateOfBirth);
    const newMulank = calculateMulank(dateOfBirth);

    if (newLifePath !== prevLifePath.current && lifePathRef.current) {
      gsap.fromTo(
        lifePathRef.current,
        { scale: 0.5, opacity: 0, rotation: -180 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }
      );
      prevLifePath.current = newLifePath;
    }

    if (newMulank !== prevMulank.current && mulankRef.current) {
      gsap.fromTo(
        mulankRef.current,
        { scale: 0.5, opacity: 0, rotation: 180 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.2 }
      );
      prevMulank.current = newMulank;
    }

    setLifePath(newLifePath);
    setMulank(newMulank);
  }, [dateOfBirth]);

  const lifePathMeaning = lifePathMeanings[lifePath] || {
    title: 'Awaiting Your Birth Date',
    description: 'Enter your date of birth to discover your Life Path Number and unlock insights into your personality.',
    pros: 'Potential strengths will appear after calculation.',
    cons: 'Potential challenges will appear after calculation.',
    doList: ['Enter a valid date of birth'],
    avoidList: ['Using an incorrect date']
  };

  const mulankMeaning = mulankMeanings[mulank] || {
    title: 'Your Root Number',
    description: 'Mulank reveals your core personality and the planetary influence on your life path.',
    pros: 'Core strengths will appear after calculation.',
    cons: 'Core cautions will appear after calculation.',
    doList: ['Enter a valid date of birth'],
    avoidList: ['Using an incorrect date']
  };

  const lifePathBehavior = behaviorProfiles[lifePath] || {
    naturalBehavior: 'Your behavior profile will appear after entering date of birth.',
    stressBehavior: 'Stress response will appear after calculation.',
    angerPattern: 'Anger tendency will appear after calculation.',
    calmSuggestions: ['Enter date of birth to view suggestions']
  };

  const mulankBehavior = behaviorProfiles[mulank] || {
    naturalBehavior: 'Your root behavior profile will appear after entering date of birth.',
    stressBehavior: 'Stress response will appear after calculation.',
    angerPattern: 'Anger tendency will appear after calculation.',
    calmSuggestions: ['Enter date of birth to view suggestions']
  };

  return (
    <div className="bg-white/[0.008] backdrop-blur-2xl rounded-2xl p-5 md:p-8 border border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.045)]">
      <div className="flex items-center gap-3 mb-6">
        <Hash className="text-pink-400 w-6 h-6" />
        <h2 className="text-xl md:text-2xl text-white/90">Numerology</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg text-pink-300">Life Path Number</h3>
          <div
            ref={lifePathRef}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/50"
          >
            {lifePath > 0 ? (
              <span className="text-5xl text-white">{lifePath}</span>
            ) : (
              <span className="text-3xl text-white/50">?</span>
            )}
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-md text-pink-200">{lifePathMeaning.title}</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              {lifePathMeaning.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg text-purple-300">Mulank (Root Number)</h3>
          <div
            ref={mulankRef}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50"
          >
            {mulank > 0 ? (
              <span className="text-5xl text-white">{mulank}</span>
            ) : (
              <span className="text-3xl text-white/50">?</span>
            )}
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-md text-purple-200">{mulankMeaning.title}</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              {mulankMeaning.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="w-full rounded-lg border border-white/40 bg-white/[0.01] px-4 py-2 text-sm text-white/90 hover:bg-white/[0.04] transition-colors"
        >
          {showDetails ? 'Hide Detailed Numerology' : 'Show Detailed Numerology'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-300/30 bg-white/0 p-4">
              <h4 className="text-emerald-200 text-sm mb-2">Life Path Pros</h4>
              <p className="text-white/70 text-sm">{lifePathMeaning.pros}</p>
            </div>
            <div className="rounded-xl border border-amber-300/30 bg-white/0 p-4">
              <h4 className="text-amber-200 text-sm mb-2">Life Path Cons</h4>
              <p className="text-white/70 text-sm">{lifePathMeaning.cons}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-cyan-300/30 bg-white/0 p-4">
              <h4 className="text-cyan-200 text-sm mb-2">Life Path What To Do</h4>
              <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                {lifePathMeaning.doList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-300/30 bg-white/0 p-4">
              <h4 className="text-rose-200 text-sm mb-2">Life Path What Not To Do</h4>
              <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                {lifePathMeaning.avoidList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-300/30 bg-white/0 p-4">
              <h4 className="text-emerald-200 text-sm mb-2">Mulank Pros</h4>
              <p className="text-white/70 text-sm">{mulankMeaning.pros}</p>
            </div>
            <div className="rounded-xl border border-amber-300/30 bg-white/0 p-4">
              <h4 className="text-amber-200 text-sm mb-2">Mulank Cons</h4>
              <p className="text-white/70 text-sm">{mulankMeaning.cons}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-violet-300/30 bg-white/0 p-4 space-y-2">
              <h4 className="text-violet-200 text-sm">Life Path Behavior</h4>
              <p className="text-white/70 text-sm"><span className="text-white/90">Natural:</span> {lifePathBehavior.naturalBehavior}</p>
              <p className="text-white/70 text-sm"><span className="text-white/90">Under Stress:</span> {lifePathBehavior.stressBehavior}</p>
              <p className="text-white/70 text-sm"><span className="text-white/90">Anger Pattern:</span> {lifePathBehavior.angerPattern}</p>
              <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                {lifePathBehavior.calmSuggestions.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-indigo-300/30 bg-white/0 p-4 space-y-2">
              <h4 className="text-indigo-200 text-sm">Mulank Behavior</h4>
              <p className="text-white/70 text-sm"><span className="text-white/90">Natural:</span> {mulankBehavior.naturalBehavior}</p>
              <p className="text-white/70 text-sm"><span className="text-white/90">Under Stress:</span> {mulankBehavior.stressBehavior}</p>
              <p className="text-white/70 text-sm"><span className="text-white/90">Anger Pattern:</span> {mulankBehavior.angerPattern}</p>
              <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                {mulankBehavior.calmSuggestions.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/0 p-4">
            <h4 className="text-white/90 text-sm mb-2">How Numerology Is Calculated From Your Data</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Life Path Number is computed by summing all digits in your full date of birth and reducing the result until a single digit or a master number (11, 22, 33) remains. Mulank is computed from the day of month in your birth date.
            </p>
            <p className="text-white/50 text-xs mt-2">
              This numerology model currently uses date of birth only. Name, birth time, and place are not included in the calculation logic.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

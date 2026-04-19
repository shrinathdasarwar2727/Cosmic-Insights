import { useEffect, useMemo, useState } from 'react';

const zodiacImages: Record<string, string> = {
  Aries: 'https://images.unsplash.com/photo-1564846930470-4b034d717347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW0lMjBhbmltYWwlMjBob3Juc3xlbnwxfHx8fDE3NzY1NDMyNDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  Taurus: 'https://images.unsplash.com/photo-1626042265937-bb3a49b549b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWxsJTIwYW5pbWFsfGVufDF8fHx8MTc3NjU0MzI0MHww&ixlib=rb-4.1.0&q=80&w=1080',
  Gemini: 'https://images.unsplash.com/photo-1758513359694-a05310909988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0d2lucyUyMGNoaWxkcmVuJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzc2NTQzMjUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  Cancer: 'https://images.unsplash.com/photo-1649191191052-bdebd22b3f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFiJTIwb2NlYW58ZW58MXx8fHwxNzc2NTQzMjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  Leo: 'https://images.unsplash.com/photo-1719234523363-ce688024e93f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW9uJTIwbWFqZXN0aWN8ZW58MXx8fHwxNzc2NTQzMjQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  Virgo: 'https://images.unsplash.com/photo-1603132789551-47b97377046e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzY1NDMyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  Libra: 'https://images.unsplash.com/photo-1760089449852-e8cade7feb53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FsZXMlMjBiYWxhbmNlJTIwanVzdGljZXxlbnwxfHx8fDE3NzY1NDMyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  Scorpio: 'https://images.unsplash.com/photo-1774832683198-f4195bd13bc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY29ycGlvbiUyMGFuaW1hbHxlbnwxfHx8fDE3NzY1NDMyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  Sagittarius: 'https://images.unsplash.com/photo-1761157997337-1bb60b0fbc57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoZXIlMjBib3clMjBhcnJvdyUyMHdhcnJpb3J8ZW58MXx8fHwxNzc2NTQzMjUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  Capricorn: 'https://images.unsplash.com/photo-1719232183598-e2d7d46c297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2F0JTIwbW91bnRhaW4lMjBhbmltYWx8ZW58MXx8fHwxNzc2NTQzMjUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  Aquarius: 'https://images.unsplash.com/photo-1561561683-a7ddea2358e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHdhdmVzJTIwb2NlYW4lMjBmbG93fGVufDF8fHx8MTc3NjU0MzI1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  Pisces: 'https://images.unsplash.com/photo-1563723322969-ac76605d9604?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwc3dpbW1pbmclMjB1bmRlcndhdGVyfGVufDF8fHx8MTc3NjU0MzI0Mnww&ixlib=rb-4.1.0&q=80&w=1080'
};

interface ZodiacAnimalBackgroundProps {
  sign: string;
}

export function ZodiacAnimalBackground({ sign }: ZodiacAnimalBackgroundProps) {
  const zodiacImageQueries: Record<string, string> = {
    Aries: 'aries ram animal',
    Taurus: 'taurus bull animal',
    Gemini: 'gemini twins portrait',
    Cancer: 'cancer crab ocean',
    Leo: 'leo lion wildlife',
    Virgo: 'virgo maiden portrait',
    Libra: 'libra scales balance',
    Scorpio: 'scorpio scorpion macro',
    Sagittarius: 'sagittarius archer bow',
    Capricorn: 'capricorn mountain goat',
    Aquarius: 'aquarius water flow',
    Pisces: 'pisces fish underwater'
  };

  const primaryImageUrl = zodiacImages[sign] || zodiacImages.Aries;
  const fallbackImageUrl = useMemo(() => {
    const query = zodiacImageQueries[sign] || 'zodiac animal';
    return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;
  }, [sign]);

  const [imageUrl, setImageUrl] = useState(primaryImageUrl);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  useEffect(() => {
    setImageUrl(primaryImageUrl);
    setHasTriedFallback(false);
  }, [primaryImageUrl]);

  const handleImageError = () => {
    if (!hasTriedFallback) {
      setImageUrl(fallbackImageUrl);
      setHasTriedFallback(true);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        key={imageUrl}
        src={imageUrl}
        alt={`${sign} zodiac animal`}
        onError={handleImageError}
        className="w-full h-full object-cover object-center opacity-10 scale-105"
        style={{
          filter: 'blur(1px) brightness(0.98) saturate(1.02)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/3 to-black/10" />
    </div>
  );
}

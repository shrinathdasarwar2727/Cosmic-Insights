import { useEffect, useRef } from 'react';

const constellationPatterns: Record<string, { stars: [number, number][]; lines: [number, number][] }> = {
  Aries: {
    stars: [[50, 30], [70, 40], [60, 60], [45, 50]],
    lines: [[0, 1], [1, 2], [0, 3], [3, 2]]
  },
  Taurus: {
    stars: [[40, 40], [60, 35], [80, 40], [70, 60], [50, 70], [30, 60]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
  },
  Gemini: {
    stars: [[35, 30], [35, 70], [30, 50], [65, 30], [65, 70], [70, 50]],
    lines: [[0, 2], [2, 1], [3, 5], [5, 4]]
  },
  Cancer: {
    stars: [[50, 30], [70, 45], [60, 65], [40, 65], [30, 45]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]
  },
  Leo: {
    stars: [[30, 40], [50, 25], [70, 30], [80, 50], [70, 70], [50, 75], [40, 60]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]]
  },
  Virgo: {
    stars: [[40, 20], [60, 30], [50, 50], [40, 70], [60, 80], [70, 60]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]]
  },
  Libra: {
    stars: [[30, 50], [50, 40], [70, 50], [50, 60]],
    lines: [[0, 1], [1, 2], [1, 3]]
  },
  Scorpio: {
    stars: [[25, 40], [40, 35], [55, 40], [65, 50], [70, 65], [60, 75], [50, 70]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
  },
  Sagittarius: {
    stars: [[30, 60], [50, 40], [70, 30], [60, 50], [50, 70]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4]]
  },
  Capricorn: {
    stars: [[40, 30], [60, 35], [70, 50], [65, 70], [45, 75], [35, 60]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
  },
  Aquarius: {
    stars: [[35, 35], [50, 25], [65, 35], [50, 50], [35, 65], [50, 75], [65, 65]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 3]]
  },
  Pisces: {
    stars: [[30, 30], [40, 45], [35, 65], [65, 30], [60, 45], [65, 65], [50, 50]],
    lines: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 6], [6, 4]]
  }
};

interface ZodiacConstellationProps {
  sign: string;
}

export function ZodiacConstellation({ sign }: ZodiacConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pattern = constellationPatterns[sign] || constellationPatterns.Aries;
    let opacity = 0;
    let pulse = 0;
    let animationFrame: number;

    const drawConstellation = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulseEffect = Math.sin(pulse) * 0.3 + 0.7;

      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
      ctx.strokeStyle = `rgba(199, 142, 255, ${opacity * 0.9 * pulseEffect})`;
      ctx.lineWidth = 3;

      pattern.lines.forEach(([start, end]) => {
        const [x1, y1] = pattern.stars[start];
        const [x2, y2] = pattern.stars[end];

        ctx.beginPath();
        ctx.moveTo((x1 / 100) * canvas.width, (y1 / 100) * canvas.height);
        ctx.lineTo((x2 / 100) * canvas.width, (y2 / 100) * canvas.height);
        ctx.stroke();
      });

      pattern.stars.forEach(([x, y]) => {
        const posX = (x / 100) * canvas.width;
        const posY = (y / 100) * canvas.height;

        const gradient = ctx.createRadialGradient(posX, posY, 0, posX, posY, 20);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * pulseEffect})`);
        gradient.addColorStop(0.3, `rgba(199, 142, 255, ${opacity * 0.8 * pulseEffect})`);
        gradient.addColorStop(0.7, `rgba(139, 92, 246, ${opacity * 0.4 * pulseEffect})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(posX, posY, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * pulseEffect})`;
        ctx.beginPath();
        ctx.arc(posX, posY, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    };

    const animate = () => {
      if (opacity < 1) {
        opacity += 0.03;
      }
      pulse += 0.05;
      drawConstellation();
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [sign]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="absolute inset-0 w-full h-full opacity-70"
    />
  );
}

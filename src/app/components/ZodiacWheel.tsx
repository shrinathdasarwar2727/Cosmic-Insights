import { useRef, useEffect } from 'react';

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

export function ZodiacWheel({ activeSign }: { activeSign: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

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
    <div className="w-full h-[320px] sm:h-[420px] lg:h-[500px] rounded-2xl overflow-hidden relative bg-black/45">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="w-full h-full"
      />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        <p className="text-white/90 text-sm">
          Active Sign: <span className="font-semibold text-purple-400">{activeSign}</span>
        </p>
      </div>
    </div>
  );
}

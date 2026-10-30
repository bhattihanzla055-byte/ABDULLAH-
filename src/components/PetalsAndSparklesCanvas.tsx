import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'petal' | 'sparkle';
  color: string;
}

export const PetalsAndSparklesCanvas: React.FC<{ density?: number; isInteractive?: boolean }> = ({
  density = 24
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const petalColors = [
      'rgba(244, 217, 219, 0.65)', // soft blush
      'rgba(235, 196, 201, 0.6)',  // rose quartz
      'rgba(255, 240, 235, 0.7)',  // ivory petal
      'rgba(218, 185, 135, 0.55)', // soft gold leaf
    ];

    const particles: Particle[] = [];

    for (let i = 0; i < density; i++) {
      const isSparkle = Math.random() > 0.65;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSparkle ? Math.random() * 2.5 + 1.2 : Math.random() * 7 + 6,
        speedY: isSparkle ? Math.random() * 0.4 + 0.2 : Math.random() * 0.7 + 0.35,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.6 + 0.3,
        type: isSparkle ? 'sparkle' : 'petal',
        color: isSparkle
          ? 'rgba(218, 165, 32, 0.75)'
          : petalColors[Math.floor(Math.random() * petalColors.length)]
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(time + p.size) * 0.5 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === 'petal') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.7, p.size * 1.2, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // Sparkle star
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#D4AF37';
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      id="ambient-particles-canvas"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full opacity-70"
      aria-hidden="true"
    />
  );
};

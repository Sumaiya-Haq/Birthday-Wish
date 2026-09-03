import React, { useRef, useEffect } from 'react';

// Floating pink/red/white confetti drifting across the black background.
const COLORS = ['#ff3d7f', '#ff5c9d', '#e11d48', '#ffffff', '#ffd9e6'];

export default function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    const spawn = () => {
      const w = canvas.width;
      const h = canvas.height;
      const count = Math.floor((w * h) / (26000 * window.devicePixelRatio));
      particles = Array.from({ length: Math.max(40, count) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 3 + 1.5) * window.devicePixelRatio,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: (Math.random() * 0.5 + 0.15) * window.devicePixelRatio,
        drift: (Math.random() - 0.5) * 0.6 * window.devicePixelRatio,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        sway: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.5 + 0.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y += p.speed;
        p.sway += 0.02;
        p.x += p.drift + Math.sin(p.sway) * 0.3 * window.devicePixelRatio;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.x < -10) p.x = canvas.width + 10;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      spawn();
    };

    resize();
    spawn();
    draw();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}

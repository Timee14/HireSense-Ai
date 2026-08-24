import React, { useState, useEffect, useMemo } from 'react';

export const LumaBackground: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Origin point behind the event card (approx 35% from left, 28% from top on desktop; 50% on mobile)
  const origin = useMemo(() => {
    const isMobile = dimensions.width < 768;
    return {
      x: isMobile ? dimensions.width * 0.5 : dimensions.width * 0.36,
      y: isMobile ? dimensions.height * 0.22 : dimensions.height * 0.30,
    };
  }, [dimensions]);

  // Generate 80 high-intensity chromatic rays
  const rays = useMemo(() => {
    const items = [];
    const colors = [
      '#38bdf8', // Electric Cyan
      '#60a5fa', // Soft Sky Blue
      '#f59e0b', // Radiant Amber/Orange
      '#ec4899', // Hot Pink
      '#a855f7', // Purple/Violet
      '#34d399', // Mint Green
      '#ffffff', // Bright White
      '#fcd34d', // Warm Gold
      '#818cf8', // Indigo
    ];

    const maxRadius = Math.sqrt(dimensions.width ** 2 + dimensions.height ** 2) * 1.2;

    for (let i = 0; i < 84; i++) {
      const angle = (i * (360 / 84)) + (Math.sin(i * 4.2) * 2.2);
      const length = maxRadius * (0.55 + (Math.abs(Math.sin(i * 2.3)) * 0.55));
      const width = i % 8 === 0 ? 2.4 : i % 3 === 0 ? 1.4 : 0.75;
      const opacity = i % 7 === 0 ? 0.75 : i % 3 === 0 ? 0.55 : 0.30;
      const color = colors[i % colors.length];

      items.push({
        id: i,
        angle,
        length,
        width,
        opacity,
        color,
      });
    }
    return items;
  }, [dimensions]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#07080b]">
      
      {/* 1. Deep Atmospheric Cosmic Radial Glows */}
      <div 
        className="absolute w-[800px] h-[600px] rounded-full blur-[130px] opacity-35 transition-all duration-700"
        style={{
          top: origin.y - 300,
          left: origin.x - 400,
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, rgba(99, 102, 241, 0.25) 50%, transparent 75%)',
        }}
      />
      <div 
        className="absolute w-[600px] h-[500px] rounded-full blur-[140px] opacity-25"
        style={{
          top: origin.y - 100,
          left: origin.x + 200,
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 80%)',
        }}
      />
      <div 
        className="absolute w-[700px] h-[600px] rounded-full blur-[160px] opacity-20"
        style={{
          bottom: '5%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* 2. SVG Chromatic Prism Light Streaks */}
      <svg 
        className="absolute inset-0 w-full h-full mix-blend-screen"
        width={dimensions.width}
        height={dimensions.height}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="luma-streak-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="core-flare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g filter="url(#luma-streak-glow)">
          {/* Central Bright Lens Flare Nucleus */}
          <circle cx={origin.x} cy={origin.y} r="18" fill="url(#core-flare)" />
          <circle cx={origin.x} cy={origin.y} r="3" fill="#ffffff" />

          {/* Radiating Chromatic Streaks */}
          {rays.map((ray) => {
            const rad = (ray.angle * Math.PI) / 180;
            const x2 = origin.x + Math.cos(rad) * ray.length;
            const y2 = origin.y + Math.sin(rad) * ray.length;

            return (
              <line
                key={ray.id}
                x1={origin.x}
                y1={origin.y}
                x2={x2}
                y2={y2}
                stroke={ray.color}
                strokeWidth={ray.width}
                strokeOpacity={ray.opacity}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </svg>

      {/* 3. Subtle Vignette Overlay for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(7,8,11,0.85)_100%)]" />
    </div>
  );
};

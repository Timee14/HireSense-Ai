import React, { useRef, useEffect } from 'react';

export const LumaBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Target origin and smooth animated origin with spring physics
    const targetOrigin = {
      x: width > 768 ? width * 0.36 : width * 0.5,
      y: width > 768 ? height * 0.30 : height * 0.22,
    };
    const currentOrigin = { ...targetOrigin };

    // Handle high DPI and responsive window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      targetOrigin.x = width > 768 ? width * 0.36 : width * 0.5;
      targetOrigin.y = width > 768 ? height * 0.30 : height * 0.22;
    };

    // Smooth subtle mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = (e.clientX - width / 2) * 0.04;
      const offsetY = (e.clientY - height / 2) * 0.04;
      targetOrigin.x = (width > 768 ? width * 0.36 : width * 0.5) + offsetX;
      targetOrigin.y = (width > 768 ? height * 0.30 : height * 0.22) + offsetY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Chromatic Spectral Color Palette
    const colors = [
      { r: 56, g: 189, b: 248 },  // Electric Cyan
      { r: 96, g: 165, b: 250 },  // Sky Blue
      { r: 245, g: 158, b: 11 },  // Warm Amber
      { r: 236, g: 72, b: 153 },  // Hot Pink
      { r: 168, g: 85, b: 247 },  // Violet / Purple
      { r: 52, g: 211, b: 153 },  // Mint Green
      { r: 255, g: 255, b: 255 },  // Pure White Flare
      { r: 251, g: 191, b: 36 },  // Gold
      { r: 129, g: 140, b: 248 },  // Indigo
    ];

    // Initialize 96 rich multi-dimensional rays
    const numRays = 96;
    const rays = Array.from({ length: numRays }, (_, i) => {
      return {
        baseAngle: (i * (Math.PI * 2 / numRays)),
        speed: (Math.random() * 0.0003 + 0.00015) * (i % 2 === 0 ? 1 : -0.7),
        lengthFactor: 0.65 + Math.random() * 0.75,
        width: i % 9 === 0 ? 2.5 : i % 3 === 0 ? 1.4 : 0.8,
        baseOpacity: i % 8 === 0 ? 0.8 : i % 3 === 0 ? 0.55 : 0.28,
        pulseSpeed: 0.8 + Math.random() * 1.5,
        pulseOffset: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
      };
    });

    // Particle Warp Pulses shooting outward along rays
    const numPulses = 36;
    const pulses = Array.from({ length: numPulses }, (_, i) => ({
      rayIndex: Math.floor(Math.random() * numRays),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.005,
      length: 60 + Math.random() * 90,
      size: 1.5 + Math.random() * 2,
    }));

    let time = 0;

    // Render loop (60fps silky smooth)
    const render = () => {
      time += 0.016;

      // Smooth lerp origin for springy motion
      currentOrigin.x += (targetOrigin.x - currentOrigin.x) * 0.05;
      currentOrigin.y += (targetOrigin.y - currentOrigin.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const maxRadius = Math.sqrt(width * width + height * height) * 1.25;

      // Blend mode for luminous additive light rays
      ctx.globalCompositeOperation = 'lighter';

      // 1. Draw Central Radiant Glow
      const coreGradient = ctx.createRadialGradient(
        currentOrigin.x, currentOrigin.y, 0,
        currentOrigin.x, currentOrigin.y, 160
      );
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      coreGradient.addColorStop(0.15, 'rgba(56, 189, 248, 0.45)');
      coreGradient.addColorStop(0.4, 'rgba(168, 85, 247, 0.25)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(currentOrigin.x, currentOrigin.y, 160, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Moving Rays with Continuous Gentle Wave Rotation & Pulse
      rays.forEach((ray) => {
        // Continuous slow orbit
        const currentAngle = ray.baseAngle + (time * ray.speed) + (Math.sin(time * 0.2 + ray.pulseOffset) * 0.02);
        
        // Breathing pulse on length and opacity
        const pulse = Math.sin(time * ray.pulseSpeed + ray.pulseOffset);
        const dynamicLength = maxRadius * ray.lengthFactor * (0.85 + pulse * 0.15);
        const dynamicOpacity = Math.max(0.08, Math.min(0.95, ray.baseOpacity + pulse * 0.18));

        const endX = currentOrigin.x + Math.cos(currentAngle) * dynamicLength;
        const endY = currentOrigin.y + Math.sin(currentAngle) * dynamicLength;

        // Gradient fade along the ray
        const gradient = ctx.createLinearGradient(currentOrigin.x, currentOrigin.y, endX, endY);
        const { r, g, b } = ray.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${dynamicOpacity})`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${dynamicOpacity * 0.85})`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${dynamicOpacity * 0.35})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = ray.width * (0.9 + pulse * 0.2);
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(currentOrigin.x, currentOrigin.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      // 3. Draw Moving Warp Light Pulses Traveling Outward
      pulses.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.rayIndex = Math.floor(Math.random() * numRays);
        }

        const ray = rays[p.rayIndex];
        if (!ray) return;

        const currentAngle = ray.baseAngle + (time * ray.speed);
        const dist = p.progress * maxRadius * ray.lengthFactor;
        const startDist = Math.max(0, dist - p.length);

        const x1 = currentOrigin.x + Math.cos(currentAngle) * startDist;
        const y1 = currentOrigin.y + Math.sin(currentAngle) * startDist;
        const x2 = currentOrigin.x + Math.cos(currentAngle) * dist;
        const y2 = currentOrigin.y + Math.sin(currentAngle) * dist;

        const { r, g, b } = ray.color;
        const pulseGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        pulseGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        pulseGrad.addColorStop(0.8, `rgba(255, 255, 255, ${0.9 * (1 - p.progress * 0.5)})`);
        pulseGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.strokeStyle = pulseGrad;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // 4. Draw Nucleus Sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(currentOrigin.x, currentOrigin.y, 3.5 + Math.sin(time * 3) * 0.8, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#07080b]">
      {/* 1. Deep Atmospheric Radial Ambient Glows */}
      <div 
        className="absolute w-[800px] h-[600px] rounded-full blur-[140px] opacity-35 animate-pulse"
        style={{
          top: '20%',
          left: '25%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, rgba(99, 102, 241, 0.25) 50%, transparent 75%)',
          animationDuration: '6s',
        }}
      />
      <div 
        className="absolute w-[600px] h-[500px] rounded-full blur-[150px] opacity-25"
        style={{
          top: '28%',
          left: '55%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 80%)',
        }}
      />

      {/* 2. Interactive High-Performance Moving Ray Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />

      {/* 3. Deep Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(7,8,11,0.82)_100%)]" />
    </div>
  );
};

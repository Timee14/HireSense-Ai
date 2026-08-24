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

    // Centered origin point (centered horizontally and vertically in the screen)
    const targetOrigin = {
      x: width * 0.5,
      y: height * 0.42,
    };
    const currentOrigin = { ...targetOrigin };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      targetOrigin.x = width * 0.5;
      targetOrigin.y = height * 0.42;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = (e.clientX - width / 2) * 0.03;
      const offsetY = (e.clientY - height / 2) * 0.03;
      targetOrigin.x = width * 0.5 + offsetX;
      targetOrigin.y = height * 0.42 + offsetY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Chromatic Spectral Colors
    const colors = [
      { r: 56, g: 189, b: 248 },  // Electric Cyan
      { r: 96, g: 165, b: 250 },  // Sky Blue
      { r: 245, g: 158, b: 11 },  // Warm Amber
      { r: 236, g: 72, b: 153 },  // Hot Pink
      { r: 168, g: 85, b: 247 },  // Violet / Purple
      { r: 52, g: 211, b: 153 },  // Mint Green
      { r: 255, g: 255, b: 255 },  // Soft White
      { r: 251, g: 191, b: 36 },  // Radiant Gold
      { r: 129, g: 140, b: 248 },  // Indigo
    ];

    // Generate 90 vibrant rays with balanced, elegant dimmed intensity
    const numRays = 90;
    const rays = Array.from({ length: numRays }, (_, i) => {
      const baseAngle = (i * (Math.PI * 2 / numRays));
      return {
        id: i,
        baseAngle,
        rotationSpeed: (0.0006 + (i % 5) * 0.0002) * (i % 2 === 0 ? 1 : -0.8),
        swayFrequency: 0.7 + (i % 7) * 0.15,
        swayAmplitude: 0.035 + (i % 4) * 0.015,
        streamSpeed: 0.006 + (i % 6) * 0.003,
        lengthFactor: 0.75 + (Math.abs(Math.sin(i * 1.7)) * 0.55),
        width: i % 8 === 0 ? 2.2 : i % 3 === 0 ? 1.3 : 0.8,
        baseOpacity: i % 7 === 0 ? 0.65 : i % 3 === 0 ? 0.45 : 0.25,
        color: colors[i % colors.length],
        pulseOffset: (i * Math.PI * 2) / numRays,
      };
    });

    let time = 0;

    // Render loop with active continuous streaming animation
    const render = () => {
      time += 0.016;

      // Smooth spring interpolation for origin
      currentOrigin.x += (targetOrigin.x - currentOrigin.x) * 0.05;
      currentOrigin.y += (targetOrigin.y - currentOrigin.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const maxRadius = Math.sqrt(width * width + height * height) * 1.25;

      ctx.globalCompositeOperation = 'lighter';

      // 1. Dimmed, Elegant Central Core Glow
      const corePulse = Math.sin(time * 2.5) * 10;
      const coreGradient = ctx.createRadialGradient(
        currentOrigin.x, currentOrigin.y, 0,
        currentOrigin.x, currentOrigin.y, 140 + corePulse
      );
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      coreGradient.addColorStop(0.18, 'rgba(56, 189, 248, 0.28)');
      coreGradient.addColorStop(0.45, 'rgba(168, 85, 247, 0.14)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(currentOrigin.x, currentOrigin.y, 140 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      // 2. Subtle Expanding Light Shockwaves
      for (let w = 0; w < 3; w++) {
        const waveProgress = (time * 0.3 + w * 0.33) % 1;
        const waveRadius = waveProgress * 280;
        const waveOpacity = (1 - waveProgress) * 0.20;

        ctx.strokeStyle = `rgba(56, 189, 248, ${waveOpacity})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(currentOrigin.x, currentOrigin.y, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Draw Rays with Dimmed Start & Outward Flowing Streams
      rays.forEach((ray) => {
        const sway = Math.sin(time * ray.swayFrequency + ray.pulseOffset) * ray.swayAmplitude;
        const angle = ray.baseAngle + (time * ray.rotationSpeed) + sway;

        const lengthPulse = Math.sin(time * 1.8 + ray.pulseOffset) * 0.12;
        const currentLength = maxRadius * ray.lengthFactor * (0.9 + lengthPulse);

        const endX = currentOrigin.x + Math.cos(angle) * currentLength;
        const endY = currentOrigin.y + Math.sin(angle) * currentLength;

        const streamProgress = (time * ray.streamSpeed * 60) % 1;
        const { r, g, b } = ray.color;

        // Base Line Gradient (Softly dimmed at the center origin)
        const gradient = ctx.createLinearGradient(currentOrigin.x, currentOrigin.y, endX, endY);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${ray.baseOpacity * 0.4})`);
        gradient.addColorStop(0.15, `rgba(${r}, ${g}, ${b}, ${ray.baseOpacity * 0.85})`);
        gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${ray.baseOpacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = ray.width;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(currentOrigin.x, currentOrigin.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // 4. Outward Flowing Stream Pulses along EVERY line
        const streamStartRatio = streamProgress;
        const streamEndRatio = Math.min(1, streamProgress + 0.22);

        const pulseStartX = currentOrigin.x + Math.cos(angle) * (currentLength * streamStartRatio);
        const pulseStartY = currentOrigin.y + Math.sin(angle) * (currentLength * streamStartRatio);
        const pulseEndX = currentOrigin.x + Math.cos(angle) * (currentLength * streamEndRatio);
        const pulseEndY = currentOrigin.y + Math.sin(angle) * (currentLength * streamEndRatio);

        const pulseGrad = ctx.createLinearGradient(pulseStartX, pulseStartY, pulseEndX, pulseEndY);
        pulseGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        pulseGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.65 * (1 - streamStartRatio * 0.5)})`);
        pulseGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.strokeStyle = pulseGrad;
        ctx.lineWidth = ray.width * 1.5;
        ctx.beginPath();
        ctx.moveTo(pulseStartX, pulseStartY);
        ctx.lineTo(pulseEndX, pulseEndY);
        ctx.stroke();
      });

      // 5. Dimmed Soft Center Flare
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(currentOrigin.x, currentOrigin.y, 2.5 + Math.sin(time * 3) * 0.8, 0, Math.PI * 2);
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
      {/* Centered Deep Atmospheric Ambient Glows (Dimmed & Soft) */}
      <div 
        className="absolute w-[750px] h-[550px] rounded-full blur-[150px] opacity-25 animate-pulse"
        style={{
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 75%)',
          animationDuration: '5s',
        }}
      />
      <div 
        className="absolute w-[600px] h-[450px] rounded-full blur-[160px] opacity-20"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 80%)',
        }}
      />

      {/* Interactive Centered Moving Ray Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />

      {/* Deep Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(7,8,11,0.88)_100%)]" />
    </div>
  );
};

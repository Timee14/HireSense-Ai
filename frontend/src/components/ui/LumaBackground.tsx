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

    // Responsive origin point
    const targetOrigin = {
      x: width > 768 ? width * 0.36 : width * 0.5,
      y: width > 768 ? height * 0.30 : height * 0.22,
    };
    const currentOrigin = { ...targetOrigin };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      targetOrigin.x = width > 768 ? width * 0.36 : width * 0.5;
      targetOrigin.y = width > 768 ? height * 0.30 : height * 0.22;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = (e.clientX - width / 2) * 0.05;
      const offsetY = (e.clientY - height / 2) * 0.05;
      targetOrigin.x = (width > 768 ? width * 0.36 : width * 0.5) + offsetX;
      targetOrigin.y = (width > 768 ? height * 0.30 : height * 0.22) + offsetY;
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
      { r: 255, g: 255, b: 255 },  // Pure White
      { r: 251, g: 191, b: 36 },  // Radiant Gold
      { r: 129, g: 140, b: 248 },  // Indigo
    ];

    // Generate 100 vibrant rays - every ray has visible independent motion
    const numRays = 100;
    const rays = Array.from({ length: numRays }, (_, i) => {
      const baseAngle = (i * (Math.PI * 2 / numRays));
      return {
        id: i,
        baseAngle,
        rotationSpeed: (0.0008 + (i % 5) * 0.0003) * (i % 2 === 0 ? 1 : -0.85),
        swayFrequency: 0.8 + (i % 7) * 0.2,
        swayAmplitude: 0.04 + (i % 4) * 0.02,
        streamSpeed: 0.008 + (i % 6) * 0.004,
        lengthFactor: 0.7 + (Math.abs(Math.sin(i * 1.7)) * 0.6),
        width: i % 8 === 0 ? 2.8 : i % 3 === 0 ? 1.6 : 0.9,
        baseOpacity: i % 7 === 0 ? 0.85 : i % 3 === 0 ? 0.6 : 0.35,
        color: colors[i % colors.length],
        pulseOffset: (i * Math.PI * 2) / numRays,
      };
    });

    let time = 0;

    // Render loop with active continuous streaming animation
    const render = () => {
      time += 0.016;

      // Smooth spring interpolation for origin
      currentOrigin.x += (targetOrigin.x - currentOrigin.x) * 0.06;
      currentOrigin.y += (targetOrigin.y - currentOrigin.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const maxRadius = Math.sqrt(width * width + height * height) * 1.3;

      ctx.globalCompositeOperation = 'lighter';

      // 1. Central Core Pulsing Flare & Expanding Radiance
      const corePulse = Math.sin(time * 3) * 15;
      const coreGradient = ctx.createRadialGradient(
        currentOrigin.x, currentOrigin.y, 0,
        currentOrigin.x, currentOrigin.y, 180 + corePulse
      );
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      coreGradient.addColorStop(0.12, 'rgba(56, 189, 248, 0.55)');
      coreGradient.addColorStop(0.35, 'rgba(168, 85, 247, 0.3)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(currentOrigin.x, currentOrigin.y, 180 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      // 2. Expanding Light Shockwaves radiating from the core
      for (let w = 0; w < 3; w++) {
        const waveProgress = (time * 0.4 + w * 0.33) % 1;
        const waveRadius = waveProgress * 320;
        const waveOpacity = (1 - waveProgress) * 0.35;

        ctx.strokeStyle = `rgba(56, 189, 248, ${waveOpacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(currentOrigin.x, currentOrigin.y, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Draw EVERY Ray with Visible Stream & Angular Movement
      rays.forEach((ray) => {
        // Active rotation + natural swaying motion
        const sway = Math.sin(time * ray.swayFrequency + ray.pulseOffset) * ray.swayAmplitude;
        const angle = ray.baseAngle + (time * ray.rotationSpeed) + sway;

        // Dynamic length breathing
        const lengthPulse = Math.sin(time * 2 + ray.pulseOffset) * 0.15;
        const currentLength = maxRadius * ray.lengthFactor * (0.9 + lengthPulse);

        const endX = currentOrigin.x + Math.cos(angle) * currentLength;
        const endY = currentOrigin.y + Math.sin(angle) * currentLength;

        // Dynamic streaming offset along each ray (moving outward from center)
        const streamProgress = (time * ray.streamSpeed * 60) % 1;
        const { r, g, b } = ray.color;

        // Base Line Gradient
        const gradient = ctx.createLinearGradient(currentOrigin.x, currentOrigin.y, endX, endY);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${ray.baseOpacity})`);
        gradient.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, ${ray.baseOpacity * 0.9})`);
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${ray.baseOpacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = ray.width;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(currentOrigin.x, currentOrigin.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // 4. Outward Flowing Light Beams along EVERY SINGLE line
        const streamStartRatio = streamProgress;
        const streamEndRatio = Math.min(1, streamProgress + 0.25);

        const pulseStartX = currentOrigin.x + Math.cos(angle) * (currentLength * streamStartRatio);
        const pulseStartY = currentOrigin.y + Math.sin(angle) * (currentLength * streamStartRatio);
        const pulseEndX = currentOrigin.x + Math.cos(angle) * (currentLength * streamEndRatio);
        const pulseEndY = currentOrigin.y + Math.sin(angle) * (currentLength * streamEndRatio);

        const pulseGrad = ctx.createLinearGradient(pulseStartX, pulseStartY, pulseEndX, pulseEndY);
        pulseGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        pulseGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.85 * (1 - streamStartRatio * 0.6)})`);
        pulseGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.strokeStyle = pulseGrad;
        ctx.lineWidth = ray.width * 1.8;
        ctx.beginPath();
        ctx.moveTo(pulseStartX, pulseStartY);
        ctx.lineTo(pulseEndX, pulseEndY);
        ctx.stroke();
      });

      // 5. Center Flare Sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(currentOrigin.x, currentOrigin.y, 4 + Math.sin(time * 4) * 1.5, 0, Math.PI * 2);
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
      {/* Deep Atmospheric Radial Ambient Glows */}
      <div 
        className="absolute w-[800px] h-[600px] rounded-full blur-[140px] opacity-35 animate-pulse"
        style={{
          top: '20%',
          left: '25%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, rgba(99, 102, 241, 0.25) 50%, transparent 75%)',
          animationDuration: '4s',
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

      {/* Interactive High-Performance Moving Ray Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />

      {/* Deep Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(7,8,11,0.85)_100%)]" />
    </div>
  );
};

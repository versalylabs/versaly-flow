import React, { useRef, useState, MouseEvent } from 'react';

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'emerald' | 'teal' | 'sky' | 'white';
  intensity?: 'subtle' | 'medium' | 'high';
  interactive?: boolean;
  borderGlow?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  className = '',
  glowColor = 'emerald',
  intensity = 'medium',
  interactive = true,
  borderGlow = true,
  onClick,
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Color mappings
  const colorMap = {
    emerald: {
      light: 'rgba(52, 211, 153, 0.16)',
      border: 'rgba(52, 211, 153, 0.35)',
      shimmer: 'rgba(52, 211, 153, 0.08)',
      highlight: 'rgba(167, 243, 208, 0.25)'
    },
    teal: {
      light: 'rgba(45, 212, 191, 0.16)',
      border: 'rgba(45, 212, 191, 0.35)',
      shimmer: 'rgba(45, 212, 191, 0.08)',
      highlight: 'rgba(153, 246, 228, 0.25)'
    },
    sky: {
      light: 'rgba(56, 189, 248, 0.16)',
      border: 'rgba(56, 189, 248, 0.35)',
      shimmer: 'rgba(56, 189, 248, 0.08)',
      highlight: 'rgba(186, 230, 253, 0.25)'
    },
    white: {
      light: 'rgba(255, 255, 255, 0.14)',
      border: 'rgba(255, 255, 255, 0.3)',
      shimmer: 'rgba(255, 255, 255, 0.06)',
      highlight: 'rgba(255, 255, 255, 0.3)'
    }
  };

  const selectedColors = colorMap[glowColor];

  // Opacity factors
  const opacityMultiplier = intensity === 'subtle' ? 0.6 : intensity === 'high' ? 1.4 : 1.0;

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 50, y: 50 });
      }}
      className={`relative overflow-hidden transition-all duration-300 rounded-3xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.65) 0%, rgba(2, 6, 23, 0.8) 100%)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: `1px solid ${isHovered && borderGlow ? selectedColors.border : 'rgba(51, 65, 85, 0.6)'}`,
        boxShadow: `
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4),
          inset 0 0 24px 0 ${selectedColors.shimmer},
          0 20px 40px -15px rgba(0, 0, 0, 0.7)
        `,
        ...style
      }}
    >
      {/* Dynamic Specular Liquid Sheen (Cursor tracked) */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0.45,
          background: `
            radial-gradient(
              500px circle at ${mousePos.x}% ${mousePos.y}%,
              ${selectedColors.light} 0%,
              ${selectedColors.shimmer} 35%,
              transparent 70%
            )
          `
        }}
      />

      {/* Top Hairline Light Ridge (Simulates glass refraction edge) */}
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-[1px] z-10"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${selectedColors.highlight} ${mousePos.x}%, transparent 100%)`,
          opacity: isHovered ? 1 * opacityMultiplier : 0.6 * opacityMultiplier
        }}
      />

      {/* Liquid Glass Iridescent Wave Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 60%)`
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

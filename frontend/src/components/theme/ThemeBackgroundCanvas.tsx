import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from './ThemeProvider';

interface Particle {
  id: number;
  x: number; // percentage (0 - 100)
  size: number; // pixels
  duration: number; // seconds
  delay: number; // seconds
  driftX: number; // pixels
  rotationSpeed: number; // deg
  opacity: number;
}

export const ThemeBackgroundCanvas: React.FC = () => {
  const { currentThemeConfig, animationSettings, isReducedMotion } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  // Monitor document visibility to pause animation loops when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const bgEffectsType = currentThemeConfig.backgroundEffects.type;
  const isEnabled = animationSettings.enabled && animationSettings.bgEffectsEnabled && !isReducedMotion && isVisible;

  // Particle counts scaled by intensity
  const particleCount = useMemo(() => {
    if (!isEnabled || bgEffectsType === 'swiss-grid') return 0;
    const base = bgEffectsType === 'sakura-petals' || bgEffectsType === 'falling-leaves' ? 14 : 12;
    const multiplier =
      animationSettings.intensity === 'low' ? 0.5 : animationSettings.intensity === 'high' ? 1.6 : 1.0;
    return Math.round(base * multiplier * currentThemeConfig.backgroundEffects.particleCountMultiplier);
  }, [isEnabled, bgEffectsType, animationSettings.intensity, currentThemeConfig]);

  // Deterministically generate particles
  const particles: Particle[] = useMemo(() => {
    const items: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      items.push({
        id: i,
        x: (i * (100 / particleCount) + (i % 3) * 7) % 96 + 2,
        size: 10 + (i % 5) * 4,
        duration: 8 + (i % 6) * 2.5,
        delay: -(i * 1.5),
        driftX: ((i % 4) - 1.5) * 40,
        rotationSpeed: (i % 2 === 0 ? 1 : -1) * (180 + (i % 3) * 60),
        opacity: 0.35 + (i % 4) * 0.15,
      });
    }
    return items;
  }, [particleCount]);

  return (
    <div
      aria-hidden="true"
      className="theme-bg-canvas-container"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        transition: 'background 400ms ease',
      }}
    >
      {/* 1. Ambient Radial Gradients */}
      {currentThemeConfig.backgroundEffects.ambientLightGradients.map((gradient, idx) => (
        <div
          key={`grad-${idx}`}
          style={{
            position: 'absolute',
            inset: 0,
            background: gradient,
            opacity: isReducedMotion ? 0.4 : 0.8,
            transition: 'opacity 300ms ease',
          }}
        />
      ))}

      {/* 2. Cyberpunk Scanline & Edge Glow Layer */}
      {bgEffectsType === 'cyber-scanlines' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
            backgroundSize: '100% 3px, 6px 100%',
            opacity: 0.5,
          }}
        />
      )}

      {/* 3. Theme-Specific Animated Particle Layer */}
      {isEnabled && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* Sakura Petals for Japanese Theme */}
          {bgEffectsType === 'sakura-petals' &&
            particles.map((p) => (
              <span
                key={p.id}
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: `${p.x}%`,
                  width: `${p.size}px`,
                  height: `${p.size * 1.3}px`,
                  backgroundColor: '#F8BBD0',
                  borderRadius: '12px 1px 12px 1px',
                  opacity: p.opacity * 0.75,
                  boxShadow: '0 0 4px rgba(244, 143, 177, 0.4)',
                  animation: `sakuraDrift ${p.duration}s linear infinite`,
                  animationDelay: `${p.delay}s`,
                  transformOrigin: 'center center',
                }}
              />
            ))}

          {/* Falling Organic Leaves for Nature Theme */}
          {bgEffectsType === 'falling-leaves' &&
            particles.map((p) => (
              <span
                key={p.id}
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: `${p.x}%`,
                  width: `${p.size * 1.2}px`,
                  height: `${p.size * 0.9}px`,
                  backgroundColor: p.id % 2 === 0 ? '#A3B899' : '#C28D58',
                  borderRadius: '20px 2px 20px 2px',
                  opacity: p.opacity * 0.7,
                  animation: `leafFall ${p.duration * 1.2}s ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}

          {/* Golden Floating Dust for Academia Theme */}
          {bgEffectsType === 'floating-dust' &&
            particles.map((p) => (
              <span
                key={p.id}
                style={{
                  position: 'absolute',
                  bottom: `${(p.x * 0.8) % 90}%`,
                  left: `${p.x}%`,
                  width: `${Math.max(3, p.size * 0.28)}px`,
                  height: `${Math.max(3, p.size * 0.28)}px`,
                  backgroundColor: '#D4AF37',
                  borderRadius: '50%',
                  opacity: p.opacity * 0.5,
                  boxShadow: '0 0 6px rgba(212, 175, 55, 0.6)',
                  animation: `dustFloat ${p.duration * 0.9}s ease-in-out infinite alternate`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}

          {/* Glowing Stars for Anime Theme */}
          {bgEffectsType === 'glowing-stars' &&
            particles.map((p) => (
              <span
                key={p.id}
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: `${p.x}%`,
                  width: `${p.size * 0.6}px`,
                  height: `${p.size * 0.6}px`,
                  color: p.id % 2 === 0 ? '#818CF8' : '#F472B6',
                  opacity: p.opacity * 0.8,
                  fontSize: `${p.size * 0.8}px`,
                  animation: `starFloat ${p.duration * 0.8}s ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                  display: 'inline-block',
                }}
              >
                ✦
              </span>
            ))}

          {/* Gentle Floating Shapes for Editorial Zen Theme */}
          {bgEffectsType === 'gentle-orbs' &&
            particles.slice(0, 5).map((p) => (
              <span
                key={p.id}
                style={{
                  position: 'absolute',
                  top: `${20 + (p.id * 18)}%`,
                  left: `${15 + (p.id * 16)}%`,
                  width: `${120 + p.size * 4}px`,
                  height: `${120 + p.size * 4}px`,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--accent-surface) 0%, transparent 70%)',
                  opacity: 0.35,
                  filter: 'blur(35px)',
                  animation: `orbPulse ${p.duration * 1.5}s ease-in-out infinite alternate`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}

          {/* Geometric Wireframe Shapes for Experimental Theme */}
          {bgEffectsType === 'geometric-drift' &&
            particles.slice(0, 8).map((p) => (
              <span
                key={p.id}
                style={{
                  position: 'absolute',
                  top: `${10 + (p.id * 12)}%`,
                  left: `${p.x}%`,
                  width: `${24 + p.size}px`,
                  height: `${24 + p.size}px`,
                  border: '2px solid var(--accent)',
                  borderRadius: p.id % 3 === 0 ? '50%' : p.id % 3 === 1 ? '4px' : '0px',
                  opacity: p.opacity * 0.3,
                  animation: `geoRotate ${p.duration}s linear infinite`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
};

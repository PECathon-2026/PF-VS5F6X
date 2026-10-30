import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, buttonHover } from '../../utils/animations';

export interface WelcomeHeroScreenProps {
  onStartOnboarding: () => void;
  onExploreAsGuest: () => void;
}

export const WelcomeHeroScreen: React.FC<WelcomeHeroScreenProps> = ({
  onStartOnboarding,
  onExploreAsGuest,
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Subtle animated background orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-surface) 0%, transparent 70%)',
          opacity: 0.6,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-surface) 0%, transparent 70%)',
          opacity: 0.5,
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Welcome Card */}
      <motion.div
        {...fadeInUp}
        style={{
          maxWidth: '680px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '3.5rem 2rem',
        }}
      >
        {/* Brand Logo & Icon */}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-surface)', color: 'var(--accent)', fontSize: '2rem', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
          📖
        </div>

        <span
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            marginBottom: '0.85rem',
          }}
        >
          Welcome to SmallWebReader
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.8rem',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}
        >
          Enter Your Personal Reading Space
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
          }}
        >
          A distraction-free reading sanctuary. We strip the noise, popups, and trackers from any web article—leaving only pure prose, tactile typography, and bespoke themes.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '340px', margin: '0 auto' }}>
          <motion.button
            {...buttonHover}
            onClick={onStartOnboarding}
            style={{
              padding: '0.85rem 1.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-text)',
              fontSize: '1.05rem',
              fontWeight: 600,
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span>Get Started</span>
            <span>→</span>
          </motion.button>

          <button
            onClick={onExploreAsGuest}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '0.92rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid transparent',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              transition: 'color var(--transition-fast)',
            }}
          >
            Explore as Guest
          </button>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
          }}
        >
          <span>✓ Local-First Privacy</span>
          <span>✓ 8 Bespoke Themes</span>
          <span>✓ Zero Ads & Trackers</span>
          <span>✓ WCAG AA Accessible</span>
        </div>
      </motion.div>
    </div>
  );
};

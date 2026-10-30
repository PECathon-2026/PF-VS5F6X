import React from 'react';
import { UrlSubmitBar } from '../reader/UrlSubmitBar';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeId } from '../../types/article';

export interface LandingViewProps {
  onSubmitUrl: (url: string) => void;
  isLoading: boolean;
  onOpenOnboarding: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onSubmitUrl,
  isLoading,
  onOpenOnboarding,
}) => {
  const { settings, updateSettings } = useTheme();

  const themeShowcase: { id: ThemeId; title: string; desc: string; sampleBg: string; sampleText: string }[] = [
    { id: 'editorial-zen', title: 'Editorial Zen', desc: 'Warm paper & charcoal typography', sampleBg: '#FAF8F5', sampleText: '#1F1E1D' },
    { id: 'japanese-minimal', title: 'Japanese', desc: 'Earth tones, subtle bamboo stone cues', sampleBg: '#F5F3EF', sampleText: '#232220' },
    { id: 'academia', title: 'Academia', desc: 'Parchment & deep ink with serif depth', sampleBg: '#FBF7ED', sampleText: '#1C1917' },
    { id: 'dark-mono', title: 'Dark Mono', desc: 'High-contrast nocturnal reading', sampleBg: '#131416', sampleText: '#EAEBEE' },
    { id: 'nature', title: 'Nature', desc: 'Calming forest sage & stone hues', sampleBg: '#F2F5F0', sampleText: '#1C271E' },
    { id: 'cyberpunk', title: 'Cyberpunk', desc: 'Terminal dark mode with neon cyan', sampleBg: '#0C0E14', sampleText: '#00F0FF' },
    { id: 'minimalist', title: 'Minimalist', desc: 'Pure monochrome Swiss clarity', sampleBg: '#FFFFFF', sampleText: '#000000' },
    { id: 'anime', title: 'Anime', desc: 'Crisp lines & indigo energy', sampleBg: '#F7F7FD', sampleText: '#4F46E5' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '6rem' }}>
      {/* Hero Section */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem 1rem',
          maxWidth: '840px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--accent-surface)',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            Distraction-Free Reading Platform
          </span>
          <button
            onClick={onOpenOnboarding}
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Take Tour ↗
          </button>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '3.4rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}
        >
          Read in Peace.
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}
        >
          Transform noisy, ad-cluttered web pages into clean, highly customizable editorial prose with refined typography.
        </p>

        <UrlSubmitBar onSubmit={onSubmitUrl} isLoading={isLoading} />
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.75rem' }}>📖</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Zero-Clutter Reader
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Strips cookie banners, video overlays, and newsletter popups to present pure prose and essential photography.
            </p>
          </div>

          <div
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.75rem' }}>🎨</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              8 Curated Themes
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              From warm Editorial Zen and Japanese earthiness to Cyberpunk neon and Swiss minimalism.
            </p>
          </div>

          <div
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.75rem' }}>🔒</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Private & Local-First
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your library, history, and reading statistics remain in your browser storage. Zero trackers or behavioral profiling.
            </p>
          </div>

          <div
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.75rem' }}>⚡</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Defense in Depth
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Automated XSS sanitization with DOMPurify and client/backend protections against dangerous network loops.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Theme Gallery */}
      <section style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Explore Reading Themes
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Click any palette below to instantly experience the reading canvas in that aesthetic.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {themeShowcase.map((t) => {
            const isActive = settings.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => updateSettings({ theme: t.id })}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: t.sampleBg,
                  color: t.sampleText,
                  border: isActive ? '2px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                  boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.title}</span>
                  {isActive && <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', backgroundColor: t.sampleText, color: t.sampleBg }}>ACTIVE</span>}
                </div>
                <p style={{ fontSize: '0.82rem', opacity: 0.85, lineHeight: 1.4 }}>{t.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section
        style={{
          maxWidth: '840px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)' }}>
          How SmallWebReader Works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: 'var(--accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '0.75rem' }}>1</div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Paste URL</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Submit any public essay, technical article, or blog post link.</p>
          </div>
          <div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: 'var(--accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '0.75rem' }}>2</div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Sanitize & Clean</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Removes trackers, scripts, and clutter while preserving essential headings and text.</p>
          </div>
          <div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: 'var(--accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '0.75rem' }}>3</div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Read in Comfort</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Fine-tune font scales, column widths, and themes for maximum ocular comfort.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

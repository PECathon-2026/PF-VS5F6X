import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { FontFamily } from '../../types/article';
import { THEME_CONFIGS, AnimationIntensity } from '../../theme/themeConfig';

export interface ReadingControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadingControls: React.FC<ReadingControlsProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    isFocusMode,
    isFullscreen,
    toggleFocusMode,
    toggleFullscreen,
    updateSettings,
    resetSettings,
    currentThemeConfig,
    setPreviewTheme,
    animationSettings,
    updateAnimationSettings,
    soundtrackSettings,
    updateSoundtrackSettings,
    isReducedMotion,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'appearance' | 'motion' | 'sound'>('appearance');

  if (!isOpen) return null;

  const themes = Object.values(THEME_CONFIGS);

  const fonts: { id: FontFamily; label: string; fontStack: string }[] = [
    { id: 'serif', label: 'Serif', fontStack: 'var(--font-serif)' },
    { id: 'sans', label: 'Sans', fontStack: 'var(--font-sans)' },
    { id: 'mono', label: 'Mono', fontStack: 'var(--font-mono)' },
  ];

  const widths = [
    { label: 'Narrow', value: 620 },
    { label: 'Comfortable', value: 720 },
    { label: 'Wide', value: 860 },
  ];

  const lineHeights = [
    { label: 'Compact', value: 1.5 },
    { label: 'Standard', value: 1.75 },
    { label: 'Spacious', value: 2.0 },
  ];

  return (
    <div
      role="region"
      aria-label="Reading Appearance Settings"
      style={{
        position: 'fixed',
        top: '4.5rem',
        right: '1.5rem',
        width: '360px',
        maxWidth: 'calc(100vw - 3rem)',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: '1.25rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.15rem',
        maxHeight: 'calc(100vh - 6rem)',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Reader Atmosphere & Controls
        </h2>
        <button
          onClick={onClose}
          aria-label="Close settings"
          style={{
            fontSize: '1.2rem',
            lineHeight: 1,
            color: 'var(--text-muted)',
            padding: '0.2rem',
          }}
        >
          &times;
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: '0.75rem', paddingBottom: '0.35rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          style={{
            fontSize: '0.82rem',
            fontWeight: activeTab === 'appearance' ? 600 : 400,
            color: activeTab === 'appearance' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'appearance' ? '2px solid var(--accent)' : 'none',
            paddingBottom: '0.25rem',
            cursor: 'pointer',
          }}
        >
          Appearance
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('motion')}
          style={{
            fontSize: '0.82rem',
            fontWeight: activeTab === 'motion' ? 600 : 400,
            color: activeTab === 'motion' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'motion' ? '2px solid var(--accent)' : 'none',
            paddingBottom: '0.25rem',
            cursor: 'pointer',
          }}
        >
          Motion & Effects
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sound')}
          style={{
            fontSize: '0.82rem',
            fontWeight: activeTab === 'sound' ? 600 : 400,
            color: activeTab === 'sound' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'sound' ? '2px solid var(--accent)' : 'none',
            paddingBottom: '0.25rem',
            cursor: 'pointer',
          }}
        >
          Soundtrack
        </button>
      </div>

      {/* Tab 1: Appearance & Typography */}
      {activeTab === 'appearance' && (
        <>
          {/* View Modes (Focus / Fullscreen) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleFocusMode}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isFocusMode ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                color: isFocusMode ? 'var(--accent-text)' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <span>🎯</span>
              <span>{isFocusMode ? 'Focus On' : 'Focus Mode'}</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isFullscreen ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                color: isFullscreen ? 'var(--accent-text)' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <span>⛶</span>
              <span>{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
            </button>
          </div>

          {/* Theme Presets (8 Canonical Themes) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Theme Environment ({themes.length})
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click to apply • Eye to preview</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
              {themes.map((t) => {
                const isActive = settings.theme === t.id;
                return (
                  <div
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: t.colors.bgPage,
                      border: isActive ? `2px solid ${t.colors.accent}` : '1px solid var(--border-subtle)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => updateSettings({ theme: t.id })}
                      style={{
                        flex: 1,
                        padding: '0.45rem 0.55rem',
                        backgroundColor: 'transparent',
                        color: t.colors.textPrimary,
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: t.colors.accent,
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.name}
                      </span>
                    </button>

                    <button
                      onClick={() => setPreviewTheme(t.id)}
                      title={`Preview ${t.name} without applying`}
                      aria-label={`Preview ${t.name}`}
                      style={{
                        padding: '0.45rem 0.4rem',
                        backgroundColor: 'transparent',
                        color: t.colors.textMuted,
                        border: 'none',
                        borderLeft: '1px solid var(--border-subtle)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      👁
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Typography */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
              Typography Family
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {fonts.map((f) => {
                const isActive = settings.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => updateSettings({ fontFamily: f.id })}
                    style={{
                      padding: '0.45rem 0.25rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                      color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
                      fontFamily: f.fontStack,
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 600 : 400,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Text Size
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {settings.fontSizePx}px
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => updateSettings({ fontSizePx: Math.max(15, settings.fontSizePx - 1) })}
                disabled={settings.fontSizePx <= 15}
                aria-label="Decrease text size"
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                }}
              >
                A-
              </button>
              <input
                type="range"
                min={15}
                max={26}
                step={1}
                value={settings.fontSizePx}
                onChange={(e) => updateSettings({ fontSizePx: Number(e.target.value) })}
                aria-label="Font size in pixels"
                style={{ flex: 1, accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <button
                onClick={() => updateSettings({ fontSizePx: Math.min(26, settings.fontSizePx + 1) })}
                disabled={settings.fontSizePx >= 26}
                aria-label="Increase text size"
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                }}
              >
                A+
              </button>
            </div>
          </div>

          {/* Column Width & Line Spacing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Width
              </label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {widths.map((w) => (
                  <button
                    key={w.value}
                    onClick={() => updateSettings({ contentWidthPx: w.value })}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: settings.contentWidthPx === w.value ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                      color: settings.contentWidthPx === w.value ? 'var(--accent-text)' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                    }}
                  >
                    {w.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Spacing
              </label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {lineHeights.map((lh) => (
                  <button
                    key={lh.value}
                    onClick={() => updateSettings({ lineHeightRatio: lh.value })}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: settings.lineHeightRatio === lh.value ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                      color: settings.lineHeightRatio === lh.value ? 'var(--accent-text)' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                    }}
                  >
                    {lh.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Motion, Intensity & Background Visual Effects */}
      {activeTab === 'motion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Active Animation Identity:
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.15rem' }}>
              {currentThemeConfig.animation.name}
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>
              {currentThemeConfig.animation.description}
            </p>
          </div>

          {/* Master Animations Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Interface Animations
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Card entrances, button hovers, page dissolves
              </div>
            </div>
            <input
              type="checkbox"
              checked={animationSettings.enabled}
              onChange={(e) => updateAnimationSettings({ enabled: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Animation Intensity */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
              Animation Intensity (Default: Medium)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {(['low', 'medium', 'high'] as AnimationIntensity[]).map((lvl) => {
                const isActive = animationSettings.intensity === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => updateAnimationSettings({ intensity: lvl })}
                    style={{
                      padding: '0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                      color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 600 : 400,
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                    }}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background Effects Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Ambient Background Effects
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {currentThemeConfig.backgroundEffects.type === 'sakura-petals'
                  ? 'Drifting sakura petals'
                  : currentThemeConfig.backgroundEffects.type === 'falling-leaves'
                  ? 'Falling forest foliage'
                  : currentThemeConfig.backgroundEffects.type === 'glowing-stars'
                  ? 'Glowing starlight particles'
                  : currentThemeConfig.backgroundEffects.type === 'floating-dust'
                  ? 'Sunbeam floating dust motes'
                  : currentThemeConfig.backgroundEffects.type === 'cyber-scanlines'
                  ? 'Digital scanline grid'
                  : currentThemeConfig.backgroundEffects.type === 'geometric-drift'
                  ? 'Geometric wireframe shapes'
                  : 'Gentle ambient orbs'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={animationSettings.bgEffectsEnabled}
              onChange={(e) => updateAnimationSettings({ bgEffectsEnabled: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Reduced Motion Indicator */}
          <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-elevated)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>System Reduced Motion: </span>
            {isReducedMotion ? 'ACTIVE (Animations auto-dampened to instant/fades)' : 'Inactive'}
          </div>
        </div>
      )}

      {/* Tab 3: Soundtrack Controls */}
      {activeTab === 'sound' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Theme Soundtrack:
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 700, marginTop: '0.15rem' }}>
              {currentThemeConfig.soundtrack.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
              Genre: {currentThemeConfig.soundtrack.genre}
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              {currentThemeConfig.soundtrack.description}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Soundtrack Master State
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Non-autoplay; starts only when initiated
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundtrackSettings.enabled}
              onChange={(e) => updateSoundtrackSettings({ enabled: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Volume ({Math.round(soundtrackSettings.volume * 100)}%)
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundtrackSettings.volume}
              onChange={(e) => updateSoundtrackSettings({ volume: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-elevated)', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            💡 You can also use the floating sound dock in the bottom-right corner to play, pause, loop, and adjust procedural ambient tones on the fly.
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <span>Shortcuts: <kbd>F</kbd> Focus mode • <kbd>Esc</kbd> Close</span>
      </div>

      {/* Reset Defaults */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={resetSettings}
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
};

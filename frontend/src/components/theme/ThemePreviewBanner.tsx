import React from 'react';
import { useTheme } from './ThemeProvider';

export const ThemePreviewBanner: React.FC = () => {
  const { previewThemeConfig, applyPreviewTheme, cancelPreviewTheme } = useTheme();

  if (!previewThemeConfig) return null;

  return (
    <aside
      aria-label="Theme Preview Banner"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        maxWidth: '640px',
        width: 'calc(100% - 2rem)',
        backgroundColor: 'var(--bg-surface)',
        border: '2px solid var(--accent)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        backdropFilter: 'blur(12px)',
        animation: 'fadeInUp 200ms ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: previewThemeConfig.colors.accent,
            border: '2px solid var(--bg-surface)',
            boxShadow: '0 0 0 1px var(--border-subtle)',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Previewing: {previewThemeConfig.name}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-surface)',
                color: 'var(--text-secondary)',
              }}
            >
              {previewThemeConfig.animation.name}
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
            {previewThemeConfig.tagline}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <button
          onClick={cancelPreviewTheme}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>

        <button
          onClick={applyPreviewTheme}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-text)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
        >
          Apply Theme
        </button>
      </div>
    </aside>
  );
};

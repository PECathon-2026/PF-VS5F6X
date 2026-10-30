import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 1.5rem',
        marginTop: 'auto',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p>
          <strong>SmallWebReader</strong> — Distraction-free, accessible reading for the web.
        </p>
        <p style={{ fontSize: '0.78rem' }}>
          Honors WCAG 2.1 AA accessibility and <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code>. External content sanitized prior to display.
        </p>
      </div>
    </footer>
  );
};

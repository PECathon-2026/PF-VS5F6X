import React from 'react';

export interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Extracting and rendering article...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem',
        gap: '1.5rem',
        maxWidth: 'var(--reader-max-width)',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '2.5rem',
          height: '2.5rem',
          border: '3px solid var(--border-subtle)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
        aria-hidden="true"
      />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</p>

      {/* Reading canvas skeleton preview */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '1.5rem',
          opacity: 0.5,
        }}
        aria-hidden="true"
      >
        <div style={{ height: '2.5rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', width: '75%' }} />
        <div style={{ height: '1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', width: '35%' }} />
        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '1rem 0' }} />
        <div style={{ height: '1.2rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', width: '100%' }} />
        <div style={{ height: '1.2rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', width: '92%' }} />
        <div style={{ height: '1.2rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', width: '96%' }} />
        <div style={{ height: '1.2rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', width: '60%' }} />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

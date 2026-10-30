import React from 'react';
import { Button } from './Button';

export interface ErrorBannerProps {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'Unable to Load Article',
  message,
  code,
  onRetry,
  onDismiss,
}) => {
  return (
    <div
      role="alert"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid #FCA5A5',
        borderLeft: '4px solid #DC2626',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        maxWidth: 'var(--reader-max-width)',
        margin: '2rem auto',
        width: '100%',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#B91C1C', marginBottom: '0.35rem' }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {message}
          </p>
          {code && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
              Reference code: {code}
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss error"
            style={{
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              lineHeight: 1,
              padding: '0.2rem',
            }}
          >
            &times;
          </button>
        )}
      </div>

      {onRetry && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

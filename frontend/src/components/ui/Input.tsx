import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  errorMessage,
  value,
  onClear,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        <input
          id={inputId}
          value={value}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            paddingRight: onClear && value ? '2.5rem' : '1rem',
            fontSize: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: `1px solid ${errorMessage ? '#DC2626' : 'var(--border-subtle)'}`,
            outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            boxShadow: 'var(--shadow-sm)',
          }}
          className={`app-input ${className}`}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear input"
            style={{
              position: 'absolute',
              right: '0.75rem',
              color: 'var(--text-muted)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        )}
      </div>
      {errorMessage && (
        <span
          id={inputId ? `${inputId}-error` : undefined}
          style={{
            fontSize: '0.82rem',
            color: '#DC2626',
            marginTop: '0.2rem',
          }}
          role="alert"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};

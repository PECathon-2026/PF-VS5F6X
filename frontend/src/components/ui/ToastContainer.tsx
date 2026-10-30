import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from '../../types/article';
import { slideFromBottom } from '../../utils/animations';

export interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        pointerEvents: 'none',
      }}
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <motion.div
              key={toast.id}
              {...slideFromBottom}
              style={{
                pointerEvents: 'auto',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: `1px solid ${isError ? '#EF4444' : isSuccess ? '#10B981' : 'var(--border-subtle)'}`,
                borderLeft: `4px solid ${isError ? '#EF4444' : isSuccess ? '#10B981' : 'var(--accent)'}`,
                boxShadow: 'var(--shadow-lg)',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                minWidth: '260px',
                maxWidth: '400px',
              }}
            >
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1.1rem',
                  padding: '0.2rem',
                }}
              >
                &times;
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

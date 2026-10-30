import React, { useState, useEffect } from 'react';
import { HistoryEntry } from '../../types/article';
import { getHistory, clearHistory } from '../../utils/storage';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export interface HistoryViewProps {
  onSelectArticleUrl: (url: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectArticleUrl, onNotify }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleConfirmClear = () => {
    clearHistory();
    setHistory([]);
    setIsConfirmClearOpen(false);
    onNotify('Reading history cleared.', 'info');
  };

  const filteredHistory = history.filter((h) => {
    const q = searchQuery.toLowerCase();
    return (
      h.title.toLowerCase().includes(q) ||
      (h.siteName && h.siteName.toLowerCase().includes(q)) ||
      h.url.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Activity Log
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Reading History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Recently visited articles ({history.length} {history.length === 1 ? 'entry' : 'entries'}).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {history.length > 0 && (
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                width: '180px',
              }}
            />
          )}

          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmClearOpen(true)}
              style={{ color: '#DC2626' }}
            >
              Clear History
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        title="Clear Reading History?"
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          This will permanently remove all {history.length} visited article entries from your local browser storage. This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setIsConfirmClearOpen(false)}>
            Cancel
          </Button>
          <button
            onClick={handleConfirmClear}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Yes, Clear History
          </button>
        </div>
      </Modal>

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredHistory.map((entry) => {
            const progress = entry.readProgress || 0;
            const timeSpent = entry.readingTimeSpent;

            return (
              <div
                key={entry.id}
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1.25rem',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {entry.siteName || 'Web Page'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      • {new Date(entry.visitedAt).toLocaleString()}
                    </span>
                    {timeSpent !== undefined && timeSpent > 0 && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.1rem 0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--accent-surface)',
                          color: 'var(--accent)',
                          fontWeight: 600,
                        }}
                      >
                        ⏱️ {Math.round(timeSpent / 60)} min spent
                      </span>
                    )}
                  </div>

                  <h4
                    onClick={() => onSelectArticleUrl(entry.url)}
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-serif)',
                      cursor: 'pointer',
                      margin: 0,
                      lineHeight: 1.35,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {entry.title}
                  </h4>

                  {/* Reading Progress Indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div
                      style={{
                        width: '100px',
                        height: '5px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(5, progress)}%`,
                          height: '100%',
                          backgroundColor: 'var(--accent)',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {progress > 0 ? `${progress}% finished` : 'Opened'}
                    </span>
                  </div>
                </div>

                <Button variant="secondary" size="sm" onClick={() => onSelectArticleUrl(entry.url)}>
                  Re-open
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            padding: '4rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>⏱️</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            No reading history yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            When you read articles in SmallWebReader, your activity log will appear here with scroll progress and visit times.
          </p>
        </div>
      )}
    </div>
  );
};

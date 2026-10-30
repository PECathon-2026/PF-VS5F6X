import React, { useState, useEffect } from 'react';
import { Bookmark, HistoryEntry } from '../../types/article';
import { getBookmarks, removeBookmark, getHistory } from '../../utils/storage';
import { Button } from '../ui/Button';

export interface LibraryViewProps {
  onSelectArticleUrl: (url: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
  initialTab?: 'bookmarks' | 'recent';
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  onSelectArticleUrl,
  onNotify,
  initialTab = 'bookmarks',
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'recent'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'time'>('newest');
  const [genreFilter, setGenreFilter] = useState<string>('All');

  useEffect(() => {
    setBookmarks(getBookmarks());
    setHistory(getHistory());
  }, []);

  const handleRemove = (url: string, title: string) => {
    removeBookmark(url);
    setBookmarks(getBookmarks());
    onNotify(`Removed "${title.length > 25 ? `${title.slice(0, 25)}…` : title}" from bookmarks.`, 'info');
  };

  // Collect available genres from items
  const genres = ['All', 'Technology', 'Design', 'Philosophy', 'Science', 'General'];

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      b.title.toLowerCase().includes(q) ||
      (b.siteName && b.siteName.toLowerCase().includes(q)) ||
      (b.byline && b.byline.toLowerCase().includes(q)) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(q));

    const matchesGenre = genreFilter === 'All' || b.genre === genreFilter;
    return matchesQuery && matchesGenre;
  });

  // Sort bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    if (sortBy === 'oldest') return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'time') return (b.readingTimeMinutes || 0) - (a.readingTimeMinutes || 0);
    return 0;
  });

  // Filter history
  const filteredHistory = history.filter((h) => {
    const q = searchQuery.toLowerCase();
    return (
      h.title.toLowerCase().includes(q) ||
      (h.siteName && h.siteName.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Guest Storage
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Personal Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Saved articles stored securely in your browser ({bookmarks.length} {bookmarks.length === 1 ? 'item' : 'items'}).
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search saved articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              width: '210px',
            }}
          />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical</option>
            <option value="time">Reading Time</option>
          </select>
        </div>
      </div>

      {/* Tabs & Genre Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('bookmarks')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: activeTab === 'bookmarks' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'bookmarks' ? 'var(--accent-text)' : 'var(--text-secondary)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            🔖 Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: activeTab === 'recent' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'recent' ? 'var(--accent-text)' : 'var(--text-secondary)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            ⏱️ Recently Read ({history.length})
          </button>
        </div>

        {activeTab === 'bookmarks' && (
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Category:</span>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Bookmarks View */}
      {activeTab === 'bookmarks' && (
        <>
          {sortedBookmarks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sortedBookmarks.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {item.siteName || 'Web Page'}
                        </span>
                        {item.byline && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            • {item.byline}
                          </span>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          • Saved {new Date(item.savedAt).toLocaleDateString()}
                        </span>
                        {item.genre && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--accent-surface)',
                              color: 'var(--accent)',
                              fontWeight: 600,
                            }}
                          >
                            {item.genre}
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => onSelectArticleUrl(item.url)}
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-serif)',
                          cursor: 'pointer',
                          lineHeight: 1.3,
                          margin: 0,
                        }}
                      >
                        {item.title}
                      </h3>

                      {item.excerpt && (
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.45 }}>
                          {item.excerpt}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Button variant="secondary" size="sm" onClick={() => onSelectArticleUrl(item.url)}>
                        Read Article
                      </Button>
                      <button
                        onClick={() => handleRemove(item.url, item.title)}
                        aria-label={`Remove ${item.title} from bookmarks`}
                        style={{
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          color: '#DC2626',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {item.readProgress !== undefined && item.readProgress > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <div style={{ flex: 1, maxWidth: '120px', height: '4px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ width: `${item.readProgress}%`, height: '100%', backgroundColor: 'var(--accent)' }} />
                      </div>
                      <span>{item.readProgress}% read</span>
                    </div>
                  )}
                </div>
              ))}
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
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🔖</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Your library is empty
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
                Save articles you discover by clicking the bookmark button inside the reader.
              </p>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Recently Read View */}
      {activeTab === 'recent' && (
        <>
          {filteredHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.siteName || 'Web Page'} • Visited {new Date(item.visitedAt).toLocaleDateString()}
                    </div>
                    <h4
                      onClick={() => onSelectArticleUrl(item.url)}
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-serif)',
                        cursor: 'pointer',
                        marginTop: '0.2rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>

                  <Button variant="secondary" size="sm" onClick={() => onSelectArticleUrl(item.url)}>
                    Re-open
                  </Button>
                </div>
              ))}
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
                No recent reading history
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                Articles you read will automatically appear in your recent history.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { SAMPLE_ARTICLES } from '../../services/fixtures/sampleArticles';
import { UserProfile, ReadingGenre, PopularFeed, RecommendationItem } from '../../types/article';
import { getUserProfile, getBookmarks } from '../../utils/storage';
import { useTheme } from '../theme/ThemeProvider';
import { readerApi } from '../../services/api';

export interface DiscoverViewProps {
  onSelectArticleUrl: (url: string) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface CuratedArticle {
  url: string;
  title: string;
  byline: string;
  siteName: string;
  excerpt: string;
  readingTimeMinutes: number;
  wordCount: number;
  genre: ReadingGenre;
}

const CURATED_LIST: CuratedArticle[] = [
  {
    url: 'https://editorial.smallweb.example/zen-reading',
    title: SAMPLE_ARTICLES['https://editorial.smallweb.example/zen-reading'].title,
    byline: SAMPLE_ARTICLES['https://editorial.smallweb.example/zen-reading'].byline || 'Elena Vance',
    siteName: SAMPLE_ARTICLES['https://editorial.smallweb.example/zen-reading'].siteName || 'Small Web Journal',
    excerpt: SAMPLE_ARTICLES['https://editorial.smallweb.example/zen-reading'].excerpt || '',
    readingTimeMinutes: SAMPLE_ARTICLES['https://editorial.smallweb.example/zen-reading'].readingTimeMinutes || 4,
    wordCount: SAMPLE_ARTICLES['https://editorial.smallweb.example/zen-reading'].wordCount || 780,
    genre: 'Design',
  },
  {
    url: 'https://tech.smallweb.example/simple-standards',
    title: SAMPLE_ARTICLES['https://tech.smallweb.example/simple-standards'].title,
    byline: SAMPLE_ARTICLES['https://tech.smallweb.example/simple-standards'].byline || 'Marcus Chen',
    siteName: SAMPLE_ARTICLES['https://tech.smallweb.example/simple-standards'].siteName || 'Hypertext Review',
    excerpt: SAMPLE_ARTICLES['https://tech.smallweb.example/simple-standards'].excerpt || '',
    readingTimeMinutes: SAMPLE_ARTICLES['https://tech.smallweb.example/simple-standards'].readingTimeMinutes || 3,
    wordCount: SAMPLE_ARTICLES['https://tech.smallweb.example/simple-standards'].wordCount || 620,
    genre: 'Technology',
  },
  {
    url: 'https://minimal.smallweb.example/brief-dispatch',
    title: SAMPLE_ARTICLES['https://minimal.smallweb.example/brief-dispatch'].title,
    byline: SAMPLE_ARTICLES['https://minimal.smallweb.example/brief-dispatch'].byline || 'A. Sato',
    siteName: SAMPLE_ARTICLES['https://minimal.smallweb.example/brief-dispatch'].siteName || 'Kyoto Notes',
    excerpt: SAMPLE_ARTICLES['https://minimal.smallweb.example/brief-dispatch'].excerpt || '',
    readingTimeMinutes: SAMPLE_ARTICLES['https://minimal.smallweb.example/brief-dispatch'].readingTimeMinutes || 1,
    wordCount: SAMPLE_ARTICLES['https://minimal.smallweb.example/brief-dispatch'].wordCount || 160,
    genre: 'Philosophy',
  },
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({ onSelectArticleUrl, onNotify }) => {
  const { currentThemeConfig } = useTheme();
  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());
  const [activeTab, setActiveTab] = useState<'articles' | 'feeds'>('articles');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [customUrl, setCustomUrl] = useState('');

  // Live Discovery state
  const [popularFeeds, setPopularFeeds] = useState<PopularFeed[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [popularError, setPopularError] = useState<string | null>(null);

  const [queryInput, setQueryInput] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [recsError, setRecsError] = useState<string | null>(null);

  const [consentGiven, setConsentGiven] = useState(false);
  const [submitFeedsInput, setSubmitFeedsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  // Fetch popular feeds when switching to 'feeds' tab
  useEffect(() => {
    if (activeTab === 'feeds' && popularFeeds.length === 0 && !isLoadingPopular) {
      loadPopularFeeds();
    }
  }, [activeTab]);

  const loadPopularFeeds = async () => {
    if (!readerApi.getPopularFeeds) return;
    setIsLoadingPopular(true);
    setPopularError(null);
    try {
      const res = await readerApi.getPopularFeeds(20, 0);
      if (res.success) {
        setPopularFeeds(res.data.feeds);
      } else {
        setPopularError(res.error.message);
      }
    } catch {
      setPopularError('Could not connect to discovery service.');
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const handleQueryRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerApi.queryRecommendations) return;

    let feedsToQuery: string[] = [];
    if (queryInput.trim()) {
      feedsToQuery = queryInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    } else {
      // Fallback to bookmarks
      const bms = getBookmarks();
      feedsToQuery = bms.map((b) => b.url).slice(0, 5);
    }

    if (feedsToQuery.length === 0) {
      setRecsError('Please enter at least one feed URL or save articles to bookmarks.');
      return;
    }

    setIsLoadingRecs(true);
    setRecsError(null);
    try {
      const res = await readerApi.queryRecommendations(feedsToQuery, 10);
      if (res.success) {
        setRecommendations(res.data.recommendations);
        if (res.data.recommendations.length === 0) {
          setRecsError('No co-occurrence recommendations found yet for these feeds. As more readers contribute, discovery expands!');
        }
      } else {
        setRecsError(res.error.message);
      }
    } catch {
      setRecsError('Failed to query recommendations.');
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerApi.submitContribution) return;

    if (!consentGiven) {
      if (onNotify) onNotify('Explicit consent is required to contribute.', 'error');
      return;
    }

    let feedsToSubmit: string[] = [];
    if (submitFeedsInput.trim()) {
      feedsToSubmit = submitFeedsInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    } else {
      const bms = getBookmarks();
      feedsToSubmit = bms.map((b) => b.url).slice(0, 10);
    }

    if (feedsToSubmit.length === 0) {
      setSubmitResult('Please enter at least one feed URL to contribute.');
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await readerApi.submitContribution(feedsToSubmit, true);
      if (res.success) {
        const msg = `Accepted! Processed ${res.data.feedsProcessed} feeds and updated ${res.data.pairsUpdated} relationships anonymously.`;
        setSubmitResult(msg);
        if (onNotify) onNotify(msg, 'success');
        setSubmitFeedsInput('');
      } else {
        setSubmitResult(`Submission failed: ${res.error.message}`);
        if (onNotify) onNotify(res.error.message, 'error');
      }
    } catch {
      setSubmitResult('Submission failed due to a network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const genres = ['All', 'Technology', 'Design', 'Philosophy', 'Literature', 'Science'];

  const filteredArticles = CURATED_LIST.filter((article) => {
    if (selectedGenre === 'All') return true;
    return article.genre === selectedGenre;
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelectArticleUrl(customUrl.trim());
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Curated Directory
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-surface)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            Zero Tracking • Human Curated
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Discover the Small Web
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
          Quiet, thoughtful essays and articles from the independent web. No sensational algorithmic feeds.
        </p>
      </div>

      {/* Custom URL Quick Reader Input */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Read Any Web Article Instantly
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Paste any external article link to strip all clutter and read with your current theme.
        </p>

        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <input
            type="url"
            placeholder="https://example.com/essay-or-article"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            required
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-page)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-text)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Extract & Read 📖
          </button>
        </form>
      </div>

      {/* View Mode Tabs: Curated Articles vs Live Feed Network */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('articles')}
          style={{
            padding: '0.5rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'articles' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'articles' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'articles' ? 600 : 500,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Curated Articles
        </button>
        <button
          onClick={() => setActiveTab('feeds')}
          style={{
            padding: '0.5rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'feeds' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'feeds' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'feeds' ? 600 : 500,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Live Feed Directory & Discovery 🌐
        </button>
      </div>

      {activeTab === 'articles' ? (
        <>
          {/* Genre Filter Tabs */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {genres.map((genre) => {
              const isSelected = selectedGenre === genre;
              const isUserInterest = profile.preferredGenres?.includes(genre as ReadingGenre);
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-surface)',
                    color: isSelected ? 'var(--accent-text)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span>{genre}</span>
                  {isUserInterest && genre !== 'All' && <span title="Matches your profile interests">✨</span>}
                </button>
              );
            })}
          </div>

          {/* Curated Articles List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredArticles.map((article) => {
              const isUserGenre = profile.preferredGenres?.includes(article.genre);
              return (
                <div
                  key={article.url}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: `transform ${currentThemeConfig.animation.transitionDuration}`,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--accent-surface)',
                          color: 'var(--accent)',
                        }}
                      >
                        {article.genre}
                      </span>

                      {isUserGenre && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--accent)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                        >
                          <span>✨</span> Matches your interests
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => onSelectArticleUrl(article.url)}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        lineHeight: 1.35,
                      }}
                    >
                      {article.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      {article.byline} • {article.siteName}
                    </p>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {article.excerpt}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      ⏱️ {article.readingTimeMinutes} min read ({article.wordCount} words)
                    </span>

                    <button
                      onClick={() => onSelectArticleUrl(article.url)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--accent)',
                        color: 'var(--accent-text)',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      Read Article →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Live Feed Network Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1: Popular Feeds */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Popular Small Web Feeds
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  Aggregated public feeds from independent web authors and personal sites.
                </p>
              </div>
              <button
                onClick={loadPopularFeeds}
                disabled={isLoadingPopular}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {isLoadingPopular ? 'Refreshing…' : '↻ Refresh'}
              </button>
            </div>

            {popularError && (
              <p style={{ color: 'var(--danger, #e53e3e)', fontSize: '0.85rem' }}>{popularError}</p>
            )}

            {isLoadingPopular && popularFeeds.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading popular feeds…</p>
            ) : popularFeeds.length === 0 && !popularError ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No popular feeds recorded yet. You can be the first to contribute below!
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {popularFeeds.map((feed) => (
                  <div
                    key={feed.canonicalUrl}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-page)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
                          {feed.host}
                        </span>
                        {feed.isSeed && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--accent-surface)',
                              color: 'var(--accent)',
                              fontWeight: 600,
                            }}
                          >
                            Seed
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>
                        {feed.title || feed.host}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ❤️ Followed by {feed.aggregateCount} readers
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectArticleUrl(feed.canonicalUrl)}
                      style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--accent)',
                        color: 'var(--accent-text)',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        alignSelf: 'flex-start',
                      }}
                    >
                      Read Feed / Site →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Related Feed Recommendations */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>
              Find Related Feeds (Co-occurrence Query)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Discover blogs frequently followed together with feeds you read. Minimum support k=3 required for specific co-occurrence evidence.
            </p>

            <form onSubmit={handleQueryRecommendations} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="https://example.com/feed.xml (or leave blank to use your saved bookmarks)"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
              <button
                type="submit"
                disabled={isLoadingRecs}
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.55rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-text)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {isLoadingRecs ? 'Querying Recommendations…' : 'Find Related Feeds 🔍'}
              </button>
            </form>

            {recsError && (
              <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{recsError}</p>
            )}

            {recommendations.length > 0 && (
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recommendations.map((rec) => (
                  <div
                    key={rec.canonicalUrl}
                    style={{
                      padding: '0.85rem 1.1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-page)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {rec.title || rec.host}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {rec.reason} {rec.supportCount ? `(support: ${rec.supportCount})` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectArticleUrl(rec.canonicalUrl)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--accent)',
                        color: 'var(--accent-text)',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Read →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Opt-in Anonymous Feed Contribution */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>
              Contribute to the Independent Web Graph
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Opt-in only. We never persist user accounts, reading history, or raw contribution batches. Only aggregate popularity and co-occurrence pair counts are recorded.
            </p>

            <form onSubmit={handleSubmitContribution} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Feed URLs to contribute (comma-separated, or leave blank to use your saved bookmarks)"
                value={submitFeedsInput}
                onChange={(e) => setSubmitFeedsInput(e.target.value)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                />
                <span>I explicitly consent to anonymously sharing this feed list to help others discover independent web blogs.</span>
              </label>

              <button
                type="submit"
                disabled={!consentGiven || isSubmitting}
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.55rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: consentGiven ? 'var(--accent)' : 'var(--bg-surface)',
                  color: consentGiven ? 'var(--accent-text)' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: consentGiven ? 'pointer' : 'not-allowed',
                  opacity: consentGiven ? 1 : 0.6,
                }}
              >
                {isSubmitting ? 'Submitting…' : 'Contribute Anonymously 🤝'}
              </button>
            </form>

            {submitResult && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {submitResult}
              </p>
            )}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Curated for SmallWebReader demonstration. In live mode, connect to your RSS feeds or any web URL.
      </div>
    </div>
  );
};

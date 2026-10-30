import React, { useState, useEffect } from 'react';
import { UserProfile, ReadingGenre } from '../../types/article';
import { getUserProfile, saveUserProfile } from '../../utils/storage';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '../ui/Button';

export interface ProfileViewProps {
  onOpenEditModal: () => void;
  onNavigateToView?: (view: any) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenEditModal,
  onNotify,
}) => {
  const { currentThemeConfig } = useTheme();
  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<ReadingGenre[]>([]);

  useEffect(() => {
    const p = getUserProfile();
    setProfile(p);
    setDisplayName(p.displayName || 'Guest Reader');
    setUsername(p.username || 'guest_reader');
    setSelectedGenres(p.preferredGenres || []);
  }, []);

  const allGenres: ReadingGenre[] = [
    'Technology',
    'Science',
    'Business',
    'Finance',
    'Psychology',
    'History',
    'Philosophy',
    'Literature',
    'Education',
    'Design',
  ];

  const toggleGenre = (genre: ReadingGenre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveUserProfile({
      displayName: displayName.trim() || 'Guest Reader',
      username: username.trim() || 'guest_reader',
      preferredGenres: selectedGenres,
    });
    setProfile(updated);
    setIsEditingInline(false);
    onNotify?.('Profile updated successfully!', 'success');
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          Personal Sanctuary
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Reader Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
          Your reading identity and customized preferences stored on this device.
        </p>
      </div>

      {/* Main Profile Card */}
      <div
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.4rem',
                border: '2px solid var(--border-subtle)',
              }}
            >
              {profile.avatar || '📚'}
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {profile.displayName || 'Guest Reader'}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                @{profile.username || 'guest_reader'} • Local Reader
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-surface)',
                    color: 'var(--accent)',
                    fontWeight: 600,
                  }}
                >
                  Style: {profile.readingStyle || 'deep-focus'}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-surface)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  Theme: {currentThemeConfig.name}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" size="sm" onClick={() => setIsEditingInline((prev) => !prev)}>
              {isEditingInline ? 'Cancel' : 'Edit Profile ✏️'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onOpenEditModal}>
              Full Preferences
            </Button>
          </div>
        </div>

        {/* Inline Edit Form */}
        {isEditingInline && (
          <form
            onSubmit={handleSaveProfile}
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Preferred Genres
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {allGenres.map((g) => {
                  const isChecked = selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre(g)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isChecked ? 'var(--accent)' : 'var(--bg-surface)',
                        color: isChecked ? 'var(--accent-text)' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.8rem',
                        fontWeight: isChecked ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Profile Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reading Style</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem', textTransform: 'capitalize' }}>
              {profile.readingStyle || 'deep-focus'}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Optimized for immersion and typography
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Atmosphere Soundtrack</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {currentThemeConfig.soundtrack.title}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Non-intrusive ambient audio
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Daily Reading Goal</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {profile.readingGoal?.dailyArticles || 3} articles ({profile.readingGoal?.dailyMinutes || 30} mins)
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Streak target: {profile.readingGoal?.streakTarget || 7} days
            </span>
          </div>
        </div>
      </div>

      {/* Selected Genres Badge Collection */}
      <div
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Interests & Discovery Topics
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Articles matching these genres receive discovery priority.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {profile.preferredGenres?.map((genre) => (
            <span
              key={genre}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-surface)',
                color: 'var(--accent)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid var(--border-subtle)',
              }}
            >
              🏷️ {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

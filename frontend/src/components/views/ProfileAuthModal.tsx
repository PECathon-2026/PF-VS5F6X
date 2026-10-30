import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserProfile } from '../../types/article';
import {
  getUserProfile,
  saveUserProfile,
  resetOnboardingPreferences,
  getBookmarks,
  getHistory,
  clearHistory,
} from '../../utils/storage';
import { THEMES_META, READING_STYLES } from '../onboarding/OnboardingWizard';

export interface ProfileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRestartOnboarding?: () => void;
}

export const ProfileAuthModal: React.FC<ProfileAuthModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  onRestartOnboarding,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'auth' | 'privacy'>('profile');
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editGoalArticles, setEditGoalArticles] = useState(3);
  const [editGoalMinutes, setEditGoalMinutes] = useState(30);

  // Auth fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      const p = getUserProfile();
      setProfile(p);
      setEditName(p.displayName);
      setEditUsername(p.username);
      setEditGoalArticles(p.readingGoal.dailyArticles);
      setEditGoalMinutes(p.readingGoal.dailyMinutes);
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveUserProfile({
      displayName: editName.trim() || 'Guest Reader',
      username: editUsername.trim() || 'guest_reader',
      readingGoal: {
        dailyArticles: Number(editGoalArticles),
        dailyMinutes: Number(editGoalMinutes),
      },
    });
    setProfile(updated);
    setIsEditing(false);
    onNotify('Profile and reading goals saved!', 'success');
  };

  const handleResetOnboarding = () => {
    if (window.confirm('Reset all onboarding preferences and restart the welcome tour?')) {
      resetOnboardingPreferences();
      onClose();
      onRestartOnboarding?.();
      onNotify('Onboarding preferences reset. Welcome back!', 'info');
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Rule: Never fake backend authentication.
    onNotify(
      'Account authentication is pending backend server integration. You are actively using Local Guest Mode.',
      'info'
    );
  };

  const handleExportData = () => {
    const data = {
      profile: getUserProfile(),
      exportedAt: new Date().toISOString(),
      bookmarks: getBookmarks(),
      history: getHistory(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smallwebreader-profile-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Local reading profile exported as JSON!', 'success');
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear your local reading history and bookmarks? This cannot be undone.')) {
      clearHistory();
      localStorage.removeItem('swr_bookmarks_v1');
      onNotify('All local history and bookmarks have been cleared.', 'info');
      onClose();
    }
  };

  const activeThemeMeta = THEMES_META.find((t) => t.id === profile.preferredTheme) || THEMES_META[0];
  const activeStyleMeta = READING_STYLES.find((s) => s.id === profile.readingStyle) || READING_STYLES[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reader Profile & Settings" maxWidth="620px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '1.25rem',
            paddingBottom: '0.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '0.4rem 0.2rem',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'profile' ? 600 : 400,
              color: activeTab === 'profile' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'profile' ? '2px solid var(--accent)' : 'none',
              cursor: 'pointer',
            }}
          >
            Profile & Reading Space
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('auth')}
            style={{
              padding: '0.4rem 0.2rem',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'auth' ? 600 : 400,
              color: activeTab === 'auth' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'auth' ? '2px solid var(--accent)' : 'none',
              cursor: 'pointer',
            }}
          >
            Account & Cloud Sync
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: '0.4rem 0.2rem',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'privacy' ? 600 : 400,
              color: activeTab === 'privacy' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'privacy' ? '2px solid var(--accent)' : 'none',
              cursor: 'pointer',
            }}
          >
            Privacy & Data
          </button>
        </div>

        {/* Tab 1: Profile & Preferences */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Identity Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  border: '2px solid var(--border-focus)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {profile.avatar}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                    {profile.displayName}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--accent-text)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {profile.accountType === 'guest' ? 'Guest Profile' : 'Member'}
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  @{profile.username}
                </span>
              </div>

              {!isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Details
                </Button>
              )}
            </div>

            {/* Profile Edit Form */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Input
                    label="Display Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <Input
                    label="Username"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                      Daily Articles Goal
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={editGoalArticles}
                      onChange={(e) => setEditGoalArticles(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                      Daily Minutes Goal
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={editGoalMinutes}
                      onChange={(e) => setEditGoalMinutes(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              /* Configured Attributes Grid */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Preferred Theme</span>
                  <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                    {activeThemeMeta.name}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Font: {activeThemeMeta.fontName}</span>
                </div>

                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Soundtrack Identity</span>
                  <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                    {profile.soundtrack}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ambient background</span>
                </div>

                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reading Pace</span>
                  <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                    {activeStyleMeta.label}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{activeStyleMeta.desc.slice(0, 35)}…</span>
                </div>

                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Goal</span>
                  <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                    {profile.readingGoal.dailyArticles} articles ({profile.readingGoal.dailyMinutes} mins)
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Habit tracking active</span>
                </div>
              </div>
            )}

            {/* Preferred Genres Badges */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>
                Preferred Reading Genres
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {profile.preferredGenres.map((g) => (
                  <span
                    key={g}
                    style={{
                      fontSize: '0.82rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Reset Onboarding Option */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Want to change your reading space from scratch?
              </span>
              <button
                type="button"
                onClick={handleResetOnboarding}
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Reset Onboarding Preferences
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Authentication / Cloud Sync */}
        {activeTab === 'auth' && (
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <strong>Status: Local Guest Mode Active</strong>
              <p style={{ marginTop: '0.35rem' }}>
                Backend account synchronization is pending team agreement on the API contract. All reading sessions, library bookmarks, and goals remain stored securely in your browser's private memory.
              </p>
            </div>

            <Input
              type="email"
              label="Email Address"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="reader@example.com"
            />
            <Input
              type="password"
              label="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => onNotify('Password recovery will be supported upon backend auth implementation.', 'info')}
                style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
              >
                Forgot Password?
              </button>
              <Button type="submit" variant="secondary">
                Connect Account
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Privacy & Data Hygiene */}
        {activeTab === 'privacy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              SmallWebReader operates on a <strong>zero-telemetry, local-first</strong> architecture. We store no tracking pixels, analytics cookies, or personal behavioral logs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              <Button type="button" variant="secondary" onClick={handleExportData}>
                Export Entire Profile & Library (JSON)
              </Button>
              <Button type="button" variant="ghost" onClick={handleClearAllData} style={{ color: '#DC2626' }}>
                Clear All Local Reading History & Bookmarks
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

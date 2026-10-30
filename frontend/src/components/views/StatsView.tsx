import React, { useState, useEffect } from 'react';
import { DailyReadingStats, ReadingGoal, UserProfile } from '../../types/article';
import {
  getDailyStats,
  getTodayStats,
  getCurrentStreak,
  getReadingGoal,
  setReadingGoal,
  getUserProfile,
  saveUserProfile,
} from '../../utils/storage';
import { useTheme } from '../theme/ThemeProvider';

export interface StatsViewProps {
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onNotify }) => {
  const { currentThemeConfig } = useTheme();

  const [stats, setStats] = useState<DailyReadingStats[]>([]);
  const [today, setToday] = useState<DailyReadingStats>({ date: '', articlesRead: 0, minutesRead: 0, wordsRead: 0 });
  const [streak, setStreak] = useState(0);
  const [goal, setGoal] = useState<ReadingGoal>({ dailyArticles: 3, dailyMinutes: 30, weeklyArticles: 15, streakTarget: 7 });
  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());

  // Interactive goal edit inputs
  const [editDailyMinutes, setEditDailyMinutes] = useState(30);
  const [editDailyArticles, setEditDailyArticles] = useState(3);
  const [editWeeklyArticles, setEditWeeklyArticles] = useState(15);
  const [editStreakTarget, setEditStreakTarget] = useState(7);
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  useEffect(() => {
    const s = getDailyStats();
    setStats(s);
    setToday(getTodayStats());
    setStreak(getCurrentStreak());
    const g = getReadingGoal();
    setGoal(g);
    setEditDailyMinutes(g.dailyMinutes || 30);
    setEditDailyArticles(g.dailyArticles || 3);
    setEditWeeklyArticles(g.weeklyArticles || 15);
    setEditStreakTarget(g.streakTarget || 7);
    setProfile(getUserProfile());
  }, []);

  const totalArticles = stats.reduce((acc, s) => acc + s.articlesRead, 0);
  const totalMinutes = stats.reduce((acc, s) => acc + s.minutesRead, 0);
  const totalWords = stats.reduce((acc, s) => acc + s.wordsRead, 0);

  // Past 7 days calculation
  const last7Days: { dateStr: string; label: string; count: number; minutes: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });
    const match = stats.find((s) => s.date === dateStr);
    last7Days.push({
      dateStr,
      label: dayLabel,
      count: match ? match.articlesRead : 0,
      minutes: match ? match.minutesRead : 0,
    });
  }

  const weeklyArticlesRead = last7Days.reduce((acc, d) => acc + d.count, 0);
  const weeklyMinutesRead = last7Days.reduce((acc, d) => acc + d.minutes, 0);
  const maxWeeklyCount = Math.max(1, ...last7Days.map((d) => d.count));

  // Goal progress calculations
  const dailyArticleProgress = Math.min(100, Math.round((today.articlesRead / Math.max(1, goal.dailyArticles)) * 100));
  const dailyMinuteProgress = Math.min(100, Math.round((today.minutesRead / Math.max(1, goal.dailyMinutes)) * 100));
  const weeklyTarget = goal.weeklyArticles || 15;
  const weeklyArticleProgress = Math.min(100, Math.round((weeklyArticlesRead / Math.max(1, weeklyTarget)) * 100));
  const streakTarget = goal.streakTarget || 7;
  const streakProgress = Math.min(100, Math.round((streak / Math.max(1, streakTarget)) * 100));

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ReadingGoal = {
      dailyArticles: Math.max(1, editDailyArticles),
      dailyMinutes: Math.max(5, editDailyMinutes),
      weeklyArticles: Math.max(1, editWeeklyArticles),
      streakTarget: Math.max(1, editStreakTarget),
    };
    setReadingGoal(updated);
    saveUserProfile({ readingGoal: updated });
    setGoal(updated);
    setIsEditingGoals(false);
    onNotify?.('Reading goals updated successfully!', 'success');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          Real Telemetry-Free Metrics
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
          Reading Statistics & Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Accurate metrics calculated exclusively from your local browser reading sessions.
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Articles Read</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
            {totalArticles}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Verified extractions</span>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Reading Time</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
            {totalMinutes} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>min</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Calculated from article pace</span>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Words Explored</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
            {totalWords >= 1000 ? `${(totalWords / 1000).toFixed(1)}k` : totalWords}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Sanitized body content</span>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Current Streak</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: streak > 0 ? '#F59E0B' : 'var(--text-primary)', marginTop: '0.35rem' }}>
            {streak} <span style={{ fontSize: '1.2rem' }}>🔥</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Consecutive reading days</span>
        </div>
      </div>

      {/* Reading Goals Visualizer & Editor */}
      <div
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Reading Goals & Milestones
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Custom targets to cultivate a sustainable daily reading habit.
            </p>
          </div>

          <button
            onClick={() => setIsEditingGoals((prev) => !prev)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isEditingGoals ? 'var(--accent)' : 'var(--bg-surface-elevated)',
              color: isEditingGoals ? 'var(--accent-text)' : 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isEditingGoals ? 'Cancel' : 'Adjust Goals ⚙️'}
          </button>
        </div>

        {/* Goal Edit Form */}
        {isEditingGoals && (
          <form
            onSubmit={handleSaveGoals}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Daily Articles Goal
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={editDailyArticles}
                onChange={(e) => setEditDailyArticles(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Daily Time Goal (min)
              </label>
              <input
                type="number"
                min="5"
                max="240"
                value={editDailyMinutes}
                onChange={(e) => setEditDailyMinutes(parseInt(e.target.value) || 5)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Weekly Articles Target
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={editWeeklyArticles}
                onChange={(e) => setEditWeeklyArticles(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Streak Target (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={editStreakTarget}
                onChange={(e) => setEditStreakTarget(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-text)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Save Preferences
              </button>
            </div>
          </form>
        )}

        {/* 4 Visual Progress Rings / Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.25rem' }}>
          {/* Daily Articles */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Today's Articles</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{dailyArticleProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-page)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.4rem' }}>
              <div style={{ width: `${dailyArticleProgress}%`, height: '100%', backgroundColor: 'var(--accent)' }} />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {today.articlesRead} of {goal.dailyArticles} completed
            </span>
          </div>

          {/* Daily Minutes */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Daily Time</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{dailyMinuteProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-page)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.4rem' }}>
              <div style={{ width: `${dailyMinuteProgress}%`, height: '100%', backgroundColor: 'var(--accent)' }} />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {today.minutesRead} of {goal.dailyMinutes} mins read
            </span>
          </div>

          {/* Weekly Articles */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Weekly Goal</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{weeklyArticleProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-page)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.4rem' }}>
              <div style={{ width: `${weeklyArticleProgress}%`, height: '100%', backgroundColor: 'var(--accent)' }} />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {weeklyArticlesRead} of {weeklyTarget} articles
            </span>
          </div>

          {/* Streak Target */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Streak Target</span>
              <span style={{ fontWeight: 700, color: '#F59E0B' }}>{streakProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-page)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.4rem' }}>
              <div style={{ width: `${streakProgress}%`, height: '100%', backgroundColor: '#F59E0B' }} />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {streak} of {streakTarget} day target 🔥
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Activity Chart (Rendered ONLY with real data) */}
      <div
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              7-Day Activity Breakdown
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Genuine daily volume (Articles and Minutes) from your browsing sessions.
            </p>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {weeklyMinutesRead} total mins this week
          </span>
        </div>

        {totalArticles > 0 ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', gap: '0.75rem', paddingTop: '1rem' }}>
            {last7Days.map((d) => {
              const heightPercent = Math.max(6, (d.count / maxWeeklyCount) * 100);
              return (
                <div key={d.dateStr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: d.count > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {d.count} {d.count === 1 ? 'art' : 'arts'}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '44px',
                      height: `${heightPercent}%`,
                      backgroundColor: d.count > 0 ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                      transition: `height ${currentThemeConfig.animation.transitionDuration}`,
                    }}
                    title={`${d.count} articles (${d.minutes} mins) on ${d.dateStr}`}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📊</span>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Chart waiting for your first reading session
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto' }}>
              SmallWebReader never fabricates dummy chart bars. As you read articles, this graph will automatically record your daily cadence.
            </p>
          </div>
        )}
      </div>

      {/* Most-Read Interests / Genres */}
      <div
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Interests & Preferences
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Your selected reading topics from onboarding and reading configuration.
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
          {(!profile.preferredGenres || profile.preferredGenres.length === 0) && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No genres selected yet. You can configure them in your Profile.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

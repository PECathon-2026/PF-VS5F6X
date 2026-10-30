/**
 * SmallWebReader — Local Storage Persistence for Guest Features
 * Bookmarks, history, reading stats, preferences, and onboarding state.
 * All data stays in the browser. No backend calls.
 */

import {
  Bookmark,
  HistoryEntry,
  DailyReadingStats,
  ReadingGoal,
  UserProfile,
} from '../types/article';

const KEYS = {
  bookmarks: 'swr_bookmarks_v1',
  history: 'swr_history_v1',
  stats: 'swr_daily_stats_v1',
  goals: 'swr_goals_v1',
  streakAnchor: 'swr_streak_anchor_v1',
  onboardingCompleted: 'swr_onboarding_completed_v1',
  userProfile: 'swr_user_profile_v1',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* -------------------------------------------------------------------------
   Onboarding State & User Profile
   ------------------------------------------------------------------------- */

export const DEFAULT_USER_PROFILE: UserProfile = {
  displayName: 'Guest Reader',
  username: 'guest_reader',
  avatar: '📚',
  preferredGenres: ['Technology', 'Literature', 'Philosophy'],
  readingStyle: 'deep-focus',
  preferredTheme: 'editorial-zen',
  soundtrack: 'Zen Flute & Gentle Rain',
  readingGoal: { dailyArticles: 3, dailyMinutes: 30 },
  accountType: 'guest',
};

export function isOnboardingCompleted(): boolean {
  return read<boolean>(KEYS.onboardingCompleted, false);
}

export function setOnboardingCompleted(completed: boolean): void {
  write(KEYS.onboardingCompleted, completed);
}

export function getUserProfile(): UserProfile {
  return read<UserProfile>(KEYS.userProfile, DEFAULT_USER_PROFILE);
}

export function saveUserProfile(updates: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated: UserProfile = { ...current, ...updates };
  write(KEYS.userProfile, updated);
  // Also synchronize legacy username/goals if needed
  if (updates.displayName) {
    try {
      localStorage.setItem('swr_user_name', updates.displayName);
    } catch {
      // Ignore
    }
  }
  if (updates.readingGoal) {
    setReadingGoal(updates.readingGoal);
  }
  return updated;
}

export function resetOnboardingPreferences(): void {
  write(KEYS.onboardingCompleted, false);
  write(KEYS.userProfile, DEFAULT_USER_PROFILE);
}

/* -------------------------------------------------------------------------
   Bookmarks
   ------------------------------------------------------------------------- */

export function getBookmarks(): Bookmark[] {
  return read<Bookmark[]>(KEYS.bookmarks, []);
}

export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'savedAt'>): Bookmark {
  const items = getBookmarks();
  const existing = items.find((b) => b.url === bookmark.url);
  if (existing) return existing;

  const entry: Bookmark = {
    ...bookmark,
    id: generateId(),
    savedAt: new Date().toISOString(),
  };
  items.unshift(entry);
  write(KEYS.bookmarks, items.slice(0, 500));
  return entry;
}

export function removeBookmark(url: string): void {
  const items = getBookmarks().filter((b) => b.url !== url);
  write(KEYS.bookmarks, items);
}

export function isBookmarked(url: string): boolean {
  return getBookmarks().some((b) => b.url === url);
}

/* -------------------------------------------------------------------------
   Reading History
   ------------------------------------------------------------------------- */

export function getHistory(): HistoryEntry[] {
  return read<HistoryEntry[]>(KEYS.history, []);
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'visitedAt'>): HistoryEntry {
  const items = getHistory();
  const filtered = items.filter((h) => h.url !== entry.url);

  const newEntry: HistoryEntry = {
    ...entry,
    id: generateId(),
    visitedAt: new Date().toISOString(),
  };
  filtered.unshift(newEntry);
  write(KEYS.history, filtered.slice(0, 1000));
  return newEntry;
}

export function clearHistory(): void {
  write(KEYS.history, []);
}

/* -------------------------------------------------------------------------
   Daily Stats
   ------------------------------------------------------------------------- */

export function getDailyStats(): DailyReadingStats[] {
  return read<DailyReadingStats[]>(KEYS.stats, []);
}

export function getTodayStats(): DailyReadingStats {
  const all = getDailyStats();
  const today = todayKey();
  return all.find((s) => s.date === today) || { date: today, articlesRead: 0, minutesRead: 0, wordsRead: 0 };
}

export function recordArticleRead(wordCount: number, minutesRead: number): void {
  const all = getDailyStats();
  const today = todayKey();
  const idx = all.findIndex((s) => s.date === today);

  if (idx >= 0) {
    all[idx].articlesRead += 1;
    all[idx].minutesRead += minutesRead;
    all[idx].wordsRead += wordCount;
  } else {
    all.unshift({ date: today, articlesRead: 1, minutesRead, wordsRead: wordCount });
  }
  write(KEYS.stats, all.slice(0, 365));
  write(KEYS.streakAnchor, today);
}

export function getCurrentStreak(): number {
  const stats = getDailyStats();
  if (stats.length === 0) return 0;

  let streak = 0;
  const now = new Date();

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() - i);
    const key = checkDate.toISOString().slice(0, 10);

    const found = stats.find((s) => s.date === key && s.articlesRead > 0);
    if (found) {
      streak++;
    } else if (i > 0) {
      break;
    } else {
      break;
    }
  }
  return streak;
}

/* -------------------------------------------------------------------------
   Goals
   ------------------------------------------------------------------------- */

export function getReadingGoal(): ReadingGoal {
  const goal = read<ReadingGoal>(KEYS.goals, {
    dailyArticles: 3,
    dailyMinutes: 30,
    weeklyArticles: 15,
    streakTarget: 7,
  });
  return {
    dailyArticles: goal.dailyArticles ?? 3,
    dailyMinutes: goal.dailyMinutes ?? 30,
    weeklyArticles: goal.weeklyArticles ?? 15,
    streakTarget: goal.streakTarget ?? 7,
  };
}

export function setReadingGoal(goal: ReadingGoal): void {
  write(KEYS.goals, goal);
}

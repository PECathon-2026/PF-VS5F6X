import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationSidebar } from '../components/layout/NavigationSidebar';
import { DiscoverView } from '../components/views/DiscoverView';
import { StatsView } from '../components/views/StatsView';
import { SettingsView } from '../components/views/SettingsView';
import { ProfileView } from '../components/views/ProfileView';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { recordArticleRead, setReadingGoal } from '../utils/storage';

describe('NavigationSidebar (9-item layout)', () => {
  it('renders all 9 requested navigation items', () => {
    render(
      <ThemeProvider>
        <NavigationSidebar
          isOpen={true}
          onClose={vi.fn()}
          currentView="dashboard"
          onNavigate={vi.fn()}
          onOpenProfile={vi.fn()}
          hasActiveArticle={false}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Read an Article')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('My Library')).toBeInTheDocument();
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('Reading History')).toBeInTheDocument();
    expect(screen.getByText('Reading Statistics')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('triggers onNavigate callback when an item is clicked', () => {
    const handleNavigate = vi.fn();
    const handleClose = vi.fn();

    render(
      <ThemeProvider>
        <NavigationSidebar
          isOpen={true}
          onClose={handleClose}
          currentView="dashboard"
          onNavigate={handleNavigate}
          onOpenProfile={vi.fn()}
          hasActiveArticle={false}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Discover'));
    expect(handleNavigate).toHaveBeenCalledWith('discover');
    expect(handleClose).toHaveBeenCalled();
  });
});

describe('DiscoverView', () => {
  it('renders curated demo articles and genre filters', () => {
    const handleSelectUrl = vi.fn();

    render(
      <ThemeProvider>
        <DiscoverView onSelectArticleUrl={handleSelectUrl} />
      </ThemeProvider>
    );

    expect(screen.getByText('Discover the Small Web')).toBeInTheDocument();
    expect(screen.getByText('Read Any Web Article Instantly')).toBeInTheDocument();
    expect(screen.getByText('The Architecture of Distraction-Free Spaces')).toBeInTheDocument();
    expect(screen.getByText('Why Simple Web Standards Outlast Modern Hype')).toBeInTheDocument();

    // Click "Read Article" on first item
    const readButtons = screen.getAllByText('Read Article →');
    expect(readButtons.length).toBeGreaterThan(0);
    fireEvent.click(readButtons[0]);
    expect(handleSelectUrl).toHaveBeenCalled();
  });
});

describe('StatsView', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders real metrics and allows updating goals', () => {
    recordArticleRead(2000, 10);
    setReadingGoal({ dailyArticles: 4, dailyMinutes: 45, weeklyArticles: 20, streakTarget: 10 });

    render(
      <ThemeProvider>
        <StatsView onNotify={vi.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText('Reading Statistics & Analytics')).toBeInTheDocument();
    expect(screen.getByText('2.0k')).toBeInTheDocument(); // 2000 words
    expect(screen.getByText('Total Articles Read')).toBeInTheDocument();
    expect(screen.getByText('Adjust Goals ⚙️')).toBeInTheDocument();

    // Toggle edit goals form
    fireEvent.click(screen.getByText('Adjust Goals ⚙️'));
    expect(screen.getByText('Daily Articles Goal')).toBeInTheDocument();
    expect(screen.getByText('Save Preferences')).toBeInTheDocument();
  });
});

describe('SettingsView', () => {
  it('renders theme selector and reading canvas typography controls', () => {
    render(
      <ThemeProvider>
        <SettingsView onNotify={vi.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText('Settings & Preferences')).toBeInTheDocument();
    expect(screen.getByText('Visual Theme')).toBeInTheDocument();
    expect(screen.getByText('Reading Canvas Typography')).toBeInTheDocument();
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
    expect(screen.getByText('Export Local Data (JSON)')).toBeInTheDocument();
  });
});

describe('ProfileView', () => {
  it('renders profile details and allows toggling inline edit', () => {
    render(
      <ThemeProvider>
        <ProfileView onOpenEditModal={vi.fn()} onNotify={vi.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText('Reader Profile')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile ✏️')).toBeInTheDocument();

    // Click inline edit
    fireEvent.click(screen.getByText('Edit Profile ✏️'));
    expect(screen.getByText('Display Name')).toBeInTheDocument();
    expect(screen.getByText('Preferred Genres')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WelcomeHeroScreen } from '../components/onboarding/WelcomeHeroScreen';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { Header } from '../components/layout/Header';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import {
  isOnboardingCompleted,
  setOnboardingCompleted,
  getUserProfile,
  saveUserProfile,
  resetOnboardingPreferences,
} from '../utils/storage';

describe('Onboarding & First-Time Visitor Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('WelcomeHeroScreen', () => {
    it('renders hero branding, headlines, and calls to action', () => {
      const handleStart = vi.fn();
      const handleGuest = vi.fn();

      render(
        <WelcomeHeroScreen
          onStartOnboarding={handleStart}
          onExploreAsGuest={handleGuest}
        />
      );

      expect(screen.getByText(/Welcome to SmallWebReader/i)).toBeInTheDocument();
      expect(screen.getByText(/Enter Your Personal Reading Space/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Explore as Guest/i })).toBeInTheDocument();
    });

    it('triggers onStartOnboarding when Get Started is clicked', () => {
      const handleStart = vi.fn();
      const handleGuest = vi.fn();

      render(
        <WelcomeHeroScreen
          onStartOnboarding={handleStart}
          onExploreAsGuest={handleGuest}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
      expect(handleStart).toHaveBeenCalledTimes(1);
      expect(handleGuest).not.toHaveBeenCalled();
    });

    it('triggers onExploreAsGuest when Explore as Guest is clicked', () => {
      const handleStart = vi.fn();
      const handleGuest = vi.fn();

      render(
        <WelcomeHeroScreen
          onStartOnboarding={handleStart}
          onExploreAsGuest={handleGuest}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /Explore as Guest/i }));
      expect(handleGuest).toHaveBeenCalledTimes(1);
      expect(handleStart).not.toHaveBeenCalled();
    });
  });

  describe('OnboardingWizard Step-by-Step Flow', () => {
    it('allows full progression across all 6 steps and completes onboarding', () => {
      const handleComplete = vi.fn();
      const handleSkip = vi.fn();

      render(
        <ThemeProvider>
          <OnboardingWizard
            onComplete={handleComplete}
            onSkipToGuest={handleSkip}
          />
        </ThemeProvider>
      );

      // --- STEP 1: Welcome ---
      expect(screen.getByText(/How SmallWebReader Works/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();

      // Click Next to Step 2
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // --- STEP 2: Genres ---
      expect(screen.getByText(/What do you enjoy reading\?/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 2 of 6/i)).toBeInTheDocument();

      // Toggle some genres
      const techBtn = screen.getByRole('button', { name: /Technology/i });
      fireEvent.click(techBtn);
      const philosophyBtn = screen.getByRole('button', { name: /Philosophy/i });
      fireEvent.click(philosophyBtn);

      // Click Next to Step 3
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // --- STEP 3: Reading Style ---
      expect(screen.getByText(/What is your primary reading style\?/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 3 of 6/i)).toBeInTheDocument();

      // Select Deep Focus style
      const deepFocusOption = screen.getByText('Deep Focus');
      fireEvent.click(deepFocusOption);

      // Click Next to Step 4
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // --- STEP 4: Visual Theme ---
      expect(screen.getByText(/Choose your default theme/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 4 of 6/i)).toBeInTheDocument();

      // Select Japanese theme
      const japaneseThemeCard = screen.getByText('Japanese');
      fireEvent.click(japaneseThemeCard);

      // Click Next to Step 5
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // --- STEP 5: Profile & Goals ---
      expect(screen.getByText(/Personalize your reader profile/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 5 of 6/i)).toBeInTheDocument();

      // Enter custom name
      const nameInput = screen.getByLabelText(/Display Name/i);
      fireEvent.change(nameInput, { target: { value: 'Aria Silver' } });

      // Click Next to Step 6
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      // --- STEP 6: Completion & Summary ---
      expect(screen.getByText(/Your reading space is ready, Aria Silver/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 6 of 6/i)).toBeInTheDocument();

      // Click finish button
      const enterBtn = screen.getByRole('button', { name: /Enter My Reading Space/i });
      fireEvent.click(enterBtn);

      expect(handleComplete).toHaveBeenCalledTimes(1);

      // Verify profile was saved to localStorage
      const profile = getUserProfile();
      expect(profile.displayName).toBe('Aria Silver');
      expect(profile.readingStyle).toBe('deep-focus');
      expect(profile.preferredTheme).toBe('japanese-minimal');
    });

    it('allows skipping directly to guest mode at any point', () => {
      const handleComplete = vi.fn();
      const handleSkip = vi.fn();

      render(
        <ThemeProvider>
          <OnboardingWizard
            onComplete={handleComplete}
            onSkipToGuest={handleSkip}
          />
        </ThemeProvider>
      );

      const skipBtn = screen.getByRole('button', { name: /Skip Setup/i });
      fireEvent.click(skipBtn);

      expect(handleSkip).toHaveBeenCalledTimes(1);
      expect(handleComplete).not.toHaveBeenCalled();
    });
  });

  describe('Storage Onboarding & Profile Helpers', () => {
    it('tracks onboarding completion flag correctly', () => {
      expect(isOnboardingCompleted()).toBe(false);

      setOnboardingCompleted(true);
      expect(isOnboardingCompleted()).toBe(true);

      setOnboardingCompleted(false);
      expect(isOnboardingCompleted()).toBe(false);
    });

    it('manages default and updated user profile', () => {
      const initial = getUserProfile();
      expect(initial.accountType).toBe('guest');
      expect(initial.displayName).toBe('Guest Reader');

      const updated = saveUserProfile({
        displayName: 'Haruki Murakami',
        username: 'haruki_m',
        readingStyle: 'deep-focus',
        preferredTheme: 'japanese-minimal',
      });

      expect(updated.displayName).toBe('Haruki Murakami');
      expect(getUserProfile().displayName).toBe('Haruki Murakami');
    });

    it('resets onboarding preferences to defaults', () => {
      setOnboardingCompleted(true);
      saveUserProfile({ displayName: 'Custom User' });

      resetOnboardingPreferences();

      expect(isOnboardingCompleted()).toBe(false);
      expect(getUserProfile().displayName).toBe('Guest Reader');
    });
  });

  describe('Header Profile Display', () => {
    it('displays custom profile name and avatar in the header', () => {
      const profile = {
        displayName: 'Akira',
        username: 'akira_k',
        avatar: '🦊',
        preferredTheme: 'anime' as const,
        readingStyle: 'casual' as const,
        preferredGenres: ['Technology' as const],
        readingGoal: { dailyArticles: 3, dailyMinutes: 30 },
        soundtrack: 'Lo-Fi Beats & Tokyo Rain',
        accountType: 'guest' as const,
      };

      render(
        <Header
          onToggleSidebar={() => {}}
          onOpenProfile={() => {}}
          currentView="landing"
          profile={profile}
        />
      );

      expect(screen.getByText('Akira')).toBeInTheDocument();
      expect(screen.getByText('🦊')).toBeInTheDocument();
    });
  });
});

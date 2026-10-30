import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../components/theme/ThemeProvider';
import { THEME_CONFIGS, applyThemeToDom } from '../theme/themeConfig';
import { ThemePreviewBanner } from '../components/theme/ThemePreviewBanner';
import { ThemeBackgroundCanvas } from '../components/theme/ThemeBackgroundCanvas';
import { ThemeId } from '../types/article';

// Helper test component to exercise theme context
const ThemeTestConsumer: React.FC = () => {
  const {
    settings,
    currentThemeConfig,
    previewThemeConfig,
    setPreviewTheme,
    applyPreviewTheme,
    cancelPreviewTheme,
    animationSettings,
    updateAnimationSettings,
    updateSettings,
    isReducedMotion,
  } = useTheme();

  return (
    <div>
      <div data-testid="current-theme-id">{settings.theme}</div>
      <div data-testid="current-theme-name">{currentThemeConfig.name}</div>
      <div data-testid="preview-theme-name">{previewThemeConfig?.name || 'none'}</div>
      <div data-testid="animation-intensity">{animationSettings.intensity}</div>
      <div data-testid="animation-enabled">{animationSettings.enabled ? 'true' : 'false'}</div>
      <div data-testid="bg-effects-enabled">{animationSettings.bgEffectsEnabled ? 'true' : 'false'}</div>
      <div data-testid="reduced-motion">{isReducedMotion ? 'true' : 'false'}</div>

      <button onClick={() => updateSettings({ theme: 'cyberpunk' })}>Switch to Cyberpunk</button>
      <button onClick={() => updateSettings({ theme: 'nature' })}>Switch to Nature</button>
      <button onClick={() => setPreviewTheme('japanese-minimal')}>Preview Japanese</button>
      <button onClick={applyPreviewTheme}>Apply Preview</button>
      <button onClick={cancelPreviewTheme}>Cancel Preview</button>
      <button onClick={() => updateAnimationSettings({ intensity: 'high' })}>Set High Intensity</button>
      <button onClick={() => updateAnimationSettings({ bgEffectsEnabled: false })}>Disable BG Effects</button>
    </div>
  );
};

describe('Central Theme & Animation Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Theme Configuration Integrity', () => {
    it('defines complete configurations for all 8 canonical themes', () => {
      const canonicalIds: ThemeId[] = [
        'editorial-zen',
        'japanese-minimal',
        'academia',
        'dark-mono',
        'nature',
        'minimalist',
        'anime',
        'cyberpunk',
        'experimental',
      ];

      canonicalIds.forEach((id) => {
        const theme = THEME_CONFIGS[id];
        expect(theme).toBeDefined();
        expect(theme.name).toBeTruthy();
        expect(theme.colors.bgPage).toMatch(/^#/);
        expect(theme.colors.accent).toMatch(/^#/);
        expect(theme.typography.bodyFamily).toBeTruthy();
        expect(theme.buttonStyle.borderRadius).toBeTruthy();
        expect(theme.cardStyle.borderRadius).toBeTruthy();
        expect(theme.soundtrack.title).toBeTruthy();
        expect(theme.animation.name).toBeTruthy();
        expect(theme.backgroundEffects.type).toBeTruthy();
      });
    });

    it('correctly applies theme CSS custom properties to document root', () => {
      const editorial = THEME_CONFIGS['editorial-zen'];
      applyThemeToDom(editorial, 'medium', true, true);

      expect(document.documentElement.getAttribute('data-theme')).toBe('editorial-zen');
      expect(document.documentElement.style.getPropertyValue('--bg-page')).toBe(editorial.colors.bgPage);
      expect(document.documentElement.style.getPropertyValue('--accent')).toBe(editorial.colors.accent);
    });
  });

  describe('Theme Switching & State Persistence', () => {
    it('switches themes dynamically and updates DOM attributes', () => {
      render(
        <ThemeProvider>
          <ThemeTestConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme-id').textContent).toBe('editorial-zen');

      fireEvent.click(screen.getByText('Switch to Cyberpunk'));

      expect(screen.getByTestId('current-theme-id').textContent).toBe('cyberpunk');
      expect(screen.getByTestId('current-theme-name').textContent).toBe('Cyberpunk');
      expect(document.documentElement.getAttribute('data-theme')).toBe('cyberpunk');

      // Verify localStorage persistence
      const stored = JSON.parse(localStorage.getItem('smallwebreader_preferences_v1') || '{}');
      expect(stored.theme).toBe('cyberpunk');
    });

    it('supports previewing a theme and committing via applyPreviewTheme', () => {
      render(
        <ThemeProvider>
          <ThemeTestConsumer />
          <ThemePreviewBanner />
        </ThemeProvider>
      );

      // Initially no preview
      expect(screen.getByTestId('preview-theme-name').textContent).toBe('none');

      // Trigger preview
      fireEvent.click(screen.getByText('Preview Japanese'));
      expect(screen.getByTestId('preview-theme-name').textContent).toBe('Japanese');
      expect(screen.getByText(/Previewing: Japanese/i)).toBeInTheDocument();

      // Apply the preview
      fireEvent.click(screen.getByRole('button', { name: /Apply Theme/i }));
      expect(screen.getByTestId('current-theme-id').textContent).toBe('japanese-minimal');
      expect(screen.getByTestId('preview-theme-name').textContent).toBe('none');
    });

    it('allows cancelling a preview to revert to previous theme', () => {
      render(
        <ThemeProvider>
          <ThemeTestConsumer />
          <ThemePreviewBanner />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText('Preview Japanese'));
      expect(screen.getByText(/Previewing: Japanese/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /^Cancel$/i }));
      expect(screen.getByTestId('preview-theme-name').textContent).toBe('none');
      expect(screen.getByTestId('current-theme-id').textContent).toBe('editorial-zen');
    });
  });

  describe('Animation & Visual Effects Controls', () => {
    it('updates animation intensity and background effects toggles', () => {
      render(
        <ThemeProvider>
          <ThemeTestConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('animation-intensity').textContent).toBe('medium');
      expect(screen.getByTestId('bg-effects-enabled').textContent).toBe('true');

      fireEvent.click(screen.getByText('Set High Intensity'));
      expect(screen.getByTestId('animation-intensity').textContent).toBe('high');

      fireEvent.click(screen.getByText('Disable BG Effects'));
      expect(screen.getByTestId('bg-effects-enabled').textContent).toBe('false');
    });

    it('renders background canvas safely with pointer-events: none', () => {
      const { container } = render(
        <ThemeProvider>
          <ThemeBackgroundCanvas />
        </ThemeProvider>
      );

      const canvasContainer = container.querySelector('.theme-bg-canvas-container');
      expect(canvasContainer).toBeInTheDocument();
      expect(canvasContainer).toHaveStyle('pointer-events: none');
    });
  });
});

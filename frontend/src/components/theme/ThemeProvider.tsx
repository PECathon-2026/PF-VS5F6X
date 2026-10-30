import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { ReaderSettings, ThemeId } from '../../types/article';
import {
  ThemeConfig,
  THEME_CONFIGS,
  AnimationSettings,
  SoundtrackSettings,
  DEFAULT_ANIMATION_SETTINGS,
  DEFAULT_SOUNDTRACK_SETTINGS,
  applyThemeToDom,
} from '../../theme/themeConfig';
import { soundtrackEngine } from '../../services/soundtrackService';

export interface ThemeContextType {
  settings: ReaderSettings;
  currentThemeConfig: ThemeConfig;
  previewThemeConfig: ThemeConfig | null;
  setPreviewTheme: (themeId: ThemeId | null) => void;
  applyPreviewTheme: () => void;
  cancelPreviewTheme: () => void;
  animationSettings: AnimationSettings;
  updateAnimationSettings: (newSettings: Partial<AnimationSettings>) => void;
  soundtrackSettings: SoundtrackSettings;
  updateSoundtrackSettings: (newSettings: Partial<SoundtrackSettings>) => void;
  isReducedMotion: boolean;
  isFocusMode: boolean;
  isFullscreen: boolean;
  toggleFocusMode: () => void;
  toggleFullscreen: () => void;
  updateSettings: (newSettings: Partial<ReaderSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'editorial-zen',
  fontFamily: 'serif',
  fontSizePx: 18,
  contentWidthPx: 720,
  lineHeightRatio: 1.75,
};

const STORAGE_KEY = 'smallwebreader_preferences_v1';
const ANIMATION_STORAGE_KEY = 'smallwebreader_animation_settings_v1';
const SOUNDTRACK_STORAGE_KEY = 'smallwebreader_soundtrack_settings_v1';

const ThemeContext = createContext<ThemeContextType>({
  settings: DEFAULT_SETTINGS,
  currentThemeConfig: THEME_CONFIGS['editorial-zen'],
  previewThemeConfig: null,
  setPreviewTheme: () => {},
  applyPreviewTheme: () => {},
  cancelPreviewTheme: () => {},
  animationSettings: DEFAULT_ANIMATION_SETTINGS,
  updateAnimationSettings: () => {},
  soundtrackSettings: DEFAULT_SOUNDTRACK_SETTINGS,
  updateSoundtrackSettings: () => {},
  isReducedMotion: false,
  isFocusMode: false,
  isFullscreen: false,
  toggleFocusMode: () => {},
  toggleFullscreen: () => {},
  updateSettings: () => {},
  resetSettings: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Reader settings state
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_SETTINGS;
  });

  // 2. Animation & motion settings
  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>(() => {
    try {
      const stored = localStorage.getItem(ANIMATION_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_ANIMATION_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_ANIMATION_SETTINGS;
  });

  // 3. Soundtrack settings
  const [soundtrackSettings, setSoundtrackSettings] = useState<SoundtrackSettings>(() => {
    try {
      const stored = localStorage.getItem(SOUNDTRACK_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SOUNDTRACK_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SOUNDTRACK_SETTINGS;
  });

  // 4. Preview theme state
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId | null>(null);

  // 5. System prefers-reduced-motion listener
  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Compute effective reduced motion
  const isReducedMotion = useMemo(() => {
    if (animationSettings.reducedMotion === 'reduce') return true;
    if (animationSettings.reducedMotion === 'motion') return false;
    return systemReducedMotion;
  }, [animationSettings.reducedMotion, systemReducedMotion]);

  // 6. View modes
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFocusMode = () => setIsFocusMode((prev) => !prev);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Current and preview configurations
  const currentThemeConfig = useMemo(() => {
    const activeId = previewThemeId || settings.theme;
    return THEME_CONFIGS[activeId] || THEME_CONFIGS['editorial-zen'];
  }, [previewThemeId, settings.theme]);

  const previewThemeConfig = useMemo(() => {
    if (!previewThemeId) return null;
    return THEME_CONFIGS[previewThemeId] || null;
  }, [previewThemeId]);

  // Synchronize CSS custom properties on DOM root
  useEffect(() => {
    applyThemeToDom(
      currentThemeConfig,
      animationSettings.intensity,
      animationSettings.enabled,
      animationSettings.bgEffectsEnabled
    );

    // Apply font variables for reader
    const root = document.documentElement;
    let fontValue = 'var(--font-serif)';
    if (settings.fontFamily === 'sans') fontValue = 'var(--font-sans)';
    if (settings.fontFamily === 'mono') fontValue = 'var(--font-mono)';

    root.style.setProperty('--reader-font-family', fontValue);
    root.style.setProperty('--reader-font-size', `${settings.fontSizePx}px`);
    root.style.setProperty('--reader-line-height', `${settings.lineHeightRatio}`);
    root.style.setProperty('--reader-max-width', `${settings.contentWidthPx}px`);

    if (isFocusMode) {
      document.body.classList.add('focus-mode-active');
    } else {
      document.body.classList.remove('focus-mode-active');
    }
  }, [currentThemeConfig, animationSettings, settings, isFocusMode]);

  // Synchronize soundtrack engine
  useEffect(() => {
    soundtrackEngine.syncWithSettings(currentThemeConfig.id, soundtrackSettings);
  }, [currentThemeConfig.id, soundtrackSettings]);

  // Settings update functions
  const updateSettings = useCallback((newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // LocalStorage failure handling
      }
      return updated;
    });
  }, []);

  const updateAnimationSettings = useCallback((newSettings: Partial<AnimationSettings>) => {
    setAnimationSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(ANIMATION_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });
  }, []);

  const updateSoundtrackSettings = useCallback((newSettings: Partial<SoundtrackSettings>) => {
    setSoundtrackSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SOUNDTRACK_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setAnimationSettings(DEFAULT_ANIMATION_SETTINGS);
    setSoundtrackSettings(DEFAULT_SOUNDTRACK_SETTINGS);
    setPreviewThemeId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ANIMATION_STORAGE_KEY);
      localStorage.removeItem(SOUNDTRACK_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  // Theme preview controls
  const setPreviewTheme = useCallback((themeId: ThemeId | null) => {
    setPreviewThemeId(themeId);
  }, []);

  const applyPreviewTheme = useCallback(() => {
    if (previewThemeId) {
      updateSettings({ theme: previewThemeId });
      setPreviewThemeId(null);
    }
  }, [previewThemeId, updateSettings]);

  const cancelPreviewTheme = useCallback(() => {
    setPreviewThemeId(null);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        settings,
        currentThemeConfig,
        previewThemeConfig,
        setPreviewTheme,
        applyPreviewTheme,
        cancelPreviewTheme,
        animationSettings,
        updateAnimationSettings,
        soundtrackSettings,
        updateSoundtrackSettings,
        isReducedMotion,
        isFocusMode,
        isFullscreen,
        toggleFocusMode,
        toggleFullscreen,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

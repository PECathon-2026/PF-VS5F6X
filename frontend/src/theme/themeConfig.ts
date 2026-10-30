/**
 * SmallWebReader — Central Theme & Animation Architecture
 * Defines canonical configurations, color palettes, typography, radii, shadows,
 * component styles, animation personalities, background visual effects, and soundtrack identities.
 */

import { ThemeId, FontFamily } from '../types/article';

export type AnimationIntensity = 'low' | 'medium' | 'high';
export type ReducedMotionPreference = 'auto' | 'reduce' | 'motion';

export interface ThemeColors {
  bgPage: string;
  bgSurface: string;
  bgSurfaceElevated: string;
  bgSurfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderSubtle: string;
  borderHover: string;
  borderFocus: string;
  accent: string;
  accentSurface: string;
  accentText: string;
  tagBg: string;
  tagText: string;
  codeBg: string;
  codeBorder: string;
  quoteBorder: string;
  glow?: string;
}

export interface ThemeTypography {
  fontSerif: string;
  fontSans: string;
  fontMono: string;
  fontDisplay: string;
  defaultFontFamily: FontFamily;
  headingFamily: string;
  bodyFamily: string;
  letterSpacingHeadings: string;
  fontScaleMultiplier: number;
}

export interface ThemeRadius {
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  glow?: string;
}

export interface ThemeButtonStyle {
  borderRadius: string;
  border: string;
  textTransform?: 'none' | 'uppercase' | 'capitalize';
  fontWeight: number;
  letterSpacing?: string;
  hoverScale: number;
  boxShadow?: string;
}

export interface ThemeCardStyle {
  borderRadius: string;
  border: string;
  boxShadow: string;
  backdropBlur?: string;
  hoverLiftY: number;
  hoverScale: number;
}

export interface ThemeSoundtrack {
  id: string;
  title: string;
  genre: string;
  description: string;
  isAvailable: boolean;
  audioSrc?: string;
  notes: string;
  proceduralPreset: 'piano' | 'traditional' | 'dreamy' | 'minimal' | 'strings' | 'nature' | 'synth' | 'abstract';
}

export interface ThemeAnimationPersonality {
  name: string;
  description: string;
  transitionDuration: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
  };
  cardEntrance: {
    y?: number;
    scale?: number;
    transitionEase: string;
  };
  buttonHoverTransition: string;
  interactiveRipple?: boolean;
  inkSpreadReveal?: boolean;
  reducedMotionBehavior: 'fade-only' | 'instant' | 'minimal-fade';
}

export interface ThemeBackgroundEffects {
  type:
    | 'gentle-orbs'
    | 'sakura-petals'
    | 'floating-dust'
    | 'monochrome-still'
    | 'falling-leaves'
    | 'swiss-grid'
    | 'glowing-stars'
    | 'cyber-scanlines'
    | 'geometric-drift';
  particleCountMultiplier: number;
  ambientLightGradients: string[];
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  buttonStyle: ThemeButtonStyle;
  cardStyle: ThemeCardStyle;
  soundtrack: ThemeSoundtrack;
  animation: ThemeAnimationPersonality;
  backgroundEffects: ThemeBackgroundEffects;
  sampleHeadline: string;
  sampleExcerpt: string;
}

export interface AnimationSettings {
  enabled: boolean;
  intensity: AnimationIntensity;
  bgEffectsEnabled: boolean;
  reducedMotion: ReducedMotionPreference;
}

export interface SoundtrackSettings {
  enabled: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  useProceduralFallback: boolean;
}

export const DEFAULT_ANIMATION_SETTINGS: AnimationSettings = {
  enabled: true,
  intensity: 'medium',
  bgEffectsEnabled: true,
  reducedMotion: 'auto',
};

export const DEFAULT_SOUNDTRACK_SETTINGS: SoundtrackSettings = {
  enabled: false, // Sound OFF by default per instructions
  volume: 0.5,
  isMuted: false,
  isLooping: true,
  useProceduralFallback: true,
};

/* --------------------------------------------------------------------------
   8 Canonical Central Theme Definitions
   -------------------------------------------------------------------------- */

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  'editorial-zen': {
    id: 'editorial-zen',
    name: 'Editorial Zen',
    tagline: 'Warm tactile paper, charcoal ink, and serene contemplative balance.',
    colors: {
      bgPage: '#FAF8F5',
      bgSurface: '#FFFFFF',
      bgSurfaceElevated: '#F4EFEB',
      bgSurfaceMuted: '#EFE9E2',
      textPrimary: '#1F1E1D',
      textSecondary: '#54514C',
      textMuted: '#87827B',
      borderSubtle: '#E8E2D9',
      borderHover: '#D4CCBF',
      borderFocus: '#1F1E1D',
      accent: '#2C2A28',
      accentSurface: '#F0ECE4',
      accentText: '#FFFFFF',
      tagBg: '#EAE3D6',
      tagText: '#45423E',
      codeBg: '#EFE9E1',
      codeBorder: '#E0D7CC',
      quoteBorder: '#C8BFB0',
    },
    typography: {
      fontSerif: "'Lora', Georgia, serif",
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      fontDisplay: "'Cinzel', 'Lora', serif",
      defaultFontFamily: 'serif',
      headingFamily: "'Lora', Georgia, serif",
      bodyFamily: "'Lora', Georgia, serif",
      letterSpacingHeadings: '-0.02em',
      fontScaleMultiplier: 1.0,
    },
    radius: {
      sm: '6px',
      md: '10px',
      lg: '16px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 3px rgba(31, 30, 29, 0.04)',
      md: '0 4px 12px rgba(31, 30, 29, 0.06)',
      lg: '0 10px 28px rgba(31, 30, 29, 0.08)',
    },
    buttonStyle: {
      borderRadius: '8px',
      border: '1px solid transparent',
      textTransform: 'none',
      fontWeight: 600,
      hoverScale: 1.015,
      boxShadow: '0 2px 6px rgba(31, 30, 29, 0.06)',
    },
    cardStyle: {
      borderRadius: '14px',
      border: '1px solid #E8E2D9',
      boxShadow: '0 3px 12px rgba(31, 30, 29, 0.04)',
      hoverLiftY: -3,
      hoverScale: 1.01,
    },
    soundtrack: {
      id: 'zen-piano',
      title: 'Quiet Contemplation',
      genre: 'Soft Ambient Piano',
      description: 'Gentle acoustic piano motifs layered over soft rain and subtle paper textures.',
      isAvailable: false,
      audioSrc: '/audio/editorial-zen.mp3',
      notes: 'Original peaceful solo piano ambient composition.',
      proceduralPreset: 'piano',
    },
    animation: {
      name: 'Paper Dissolve',
      description: 'Soft page fades, gentle floating background shapes, and smooth card entrances.',
      transitionDuration: { instant: 80, fast: 150, normal: 260, slow: 420 },
      cardEntrance: { y: 12, transitionEase: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      buttonHoverTransition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      reducedMotionBehavior: 'fade-only',
    },
    backgroundEffects: {
      type: 'gentle-orbs',
      particleCountMultiplier: 1.0,
      ambientLightGradients: [
        'radial-gradient(circle at 15% 20%, rgba(240, 236, 228, 0.8) 0%, transparent 60%)',
        'radial-gradient(circle at 85% 80%, rgba(234, 227, 214, 0.6) 0%, transparent 65%)',
      ],
    },
    sampleHeadline: 'The Architecture of Distraction-Free Spaces',
    sampleExcerpt: 'Acoustic dampeners for the eye where generous margins absorb modern noise.',
  },

  'japanese-minimal': {
    id: 'japanese-minimal',
    name: 'Japanese',
    tagline: 'Wabi-sabi bamboo stone, drifting sakura petals, and ink stillness.',
    colors: {
      bgPage: '#F5F3EF',
      bgSurface: '#FCFAF7',
      bgSurfaceElevated: '#EDE9E1',
      bgSurfaceMuted: '#E4DFD5',
      textPrimary: '#232220',
      textSecondary: '#58554F',
      textMuted: '#8E8980',
      borderSubtle: '#E2DDD3',
      borderHover: '#CDC6B8',
      borderFocus: '#3D3934',
      accent: '#3F3C36',
      accentSurface: '#E8E3D8',
      accentText: '#FCFAF7',
      tagBg: '#E5DFD4',
      tagText: '#48443D',
      codeBg: '#EBE5DB',
      codeBorder: '#DCD4C6',
      quoteBorder: '#BDB4A3',
    },
    typography: {
      fontSerif: "'Lora', serif",
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      fontDisplay: "'Plus Jakarta Sans', sans-serif",
      defaultFontFamily: 'sans',
      headingFamily: "'Plus Jakarta Sans', sans-serif",
      bodyFamily: "'Lora', Georgia, serif",
      letterSpacingHeadings: '-0.01em',
      fontScaleMultiplier: 0.98,
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px rgba(35, 34, 32, 0.04)',
      md: '0 3px 8px rgba(35, 34, 32, 0.05)',
      lg: '0 8px 20px rgba(35, 34, 32, 0.07)',
    },
    buttonStyle: {
      borderRadius: '6px',
      border: '1px solid #CDC6B8',
      textTransform: 'none',
      fontWeight: 500,
      hoverScale: 1.01,
      boxShadow: '0 1px 4px rgba(35, 34, 32, 0.04)',
    },
    cardStyle: {
      borderRadius: '10px',
      border: '1px solid #E2DDD3',
      boxShadow: '0 2px 8px rgba(35, 34, 32, 0.03)',
      hoverLiftY: -2,
      hoverScale: 1.01,
    },
    soundtrack: {
      id: 'japanese-koto',
      title: 'Bamboo Grove & Koto',
      genre: 'Traditional Instrumental Ambience',
      description: 'Gentle bamboo flute (shakuhachi), delicate koto arpeggios, and distant mountain streams.',
      isAvailable: false,
      audioSrc: '/audio/japanese.mp3',
      notes: 'Traditional Japanese acoustic instruments evoking Kyoto gardens.',
      proceduralPreset: 'traditional',
    },
    animation: {
      name: 'Sakura Glide & Ink Reveal',
      description: 'Slow-drifting sakura petals, soft circular ripple clicks, and ink-inspired text reveal.',
      transitionDuration: { instant: 70, fast: 160, normal: 300, slow: 460 },
      cardEntrance: { y: 16, transitionEase: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
      buttonHoverTransition: 'all 220ms ease-out',
      interactiveRipple: true,
      inkSpreadReveal: true,
      reducedMotionBehavior: 'fade-only',
    },
    backgroundEffects: {
      type: 'sakura-petals',
      particleCountMultiplier: 1.0,
      ambientLightGradients: [
        'radial-gradient(circle at 80% 10%, rgba(247, 235, 230, 0.7) 0%, transparent 55%)',
        'radial-gradient(circle at 20% 90%, rgba(228, 223, 213, 0.5) 0%, transparent 60%)',
      ],
    },
    sampleHeadline: 'Ma (間): The Power of Intentional Interval',
    sampleExcerpt: 'The silence between notes is not emptiness, but the crucible where understanding forms.',
  },

  'anime': {
    id: 'anime',
    name: 'Anime',
    tagline: 'Dreamy cel-shaded clarity, glowing starlight, and cinematic vibrancy.',
    colors: {
      bgPage: '#F7F7FD',
      bgSurface: '#FFFFFF',
      bgSurfaceElevated: '#EFEFFC',
      bgSurfaceMuted: '#E2E3F9',
      textPrimary: '#1B1E36',
      textSecondary: '#4D5275',
      textMuted: '#848AB0',
      borderSubtle: '#E0E2F5',
      borderHover: '#C5C9EB',
      borderFocus: '#5046E5',
      accent: '#4F46E5',
      accentSurface: '#EEF0FF',
      accentText: '#FFFFFF',
      tagBg: '#E5E8FD',
      tagText: '#3730A3',
      codeBg: '#F0F2FD',
      codeBorder: '#D5D9F6',
      quoteBorder: '#6366F1',
      glow: 'rgba(79, 70, 229, 0.22)',
    },
    typography: {
      fontSerif: "'Lora', serif",
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      fontDisplay: "'Plus Jakarta Sans', sans-serif",
      defaultFontFamily: 'sans',
      headingFamily: "'Plus Jakarta Sans', sans-serif",
      bodyFamily: "'Plus Jakarta Sans', sans-serif",
      letterSpacingHeadings: '-0.02em',
      fontScaleMultiplier: 1.02,
    },
    radius: {
      sm: '8px',
      md: '14px',
      lg: '20px',
      full: '9999px',
    },
    shadows: {
      sm: '0 2px 6px rgba(79, 70, 229, 0.06)',
      md: '0 6px 16px rgba(79, 70, 229, 0.08)',
      lg: '0 12px 32px rgba(79, 70, 229, 0.12)',
      glow: '0 0 16px rgba(79, 70, 229, 0.25)',
    },
    buttonStyle: {
      borderRadius: '12px',
      border: '1px solid rgba(79, 70, 229, 0.3)',
      textTransform: 'none',
      fontWeight: 600,
      hoverScale: 1.03,
      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.18)',
    },
    cardStyle: {
      borderRadius: '18px',
      border: '1px solid #E0E2F5',
      boxShadow: '0 6px 20px rgba(79, 70, 229, 0.05)',
      hoverLiftY: -4,
      hoverScale: 1.015,
    },
    soundtrack: {
      id: 'anime-cinematic',
      title: 'Starlight Melody & Tokyo Rain',
      genre: 'Dreamy Cinematic Ambient Instrumental',
      description: 'Lush lo-fi keys, atmospheric Rhodes swells, and nostalgic emotional film score textures.',
      isAvailable: false,
      audioSrc: '/audio/anime.mp3',
      notes: 'Makoto Shinkai-inspired cinematic soundtrack.',
      proceduralPreset: 'dreamy',
    },
    animation: {
      name: 'Starlight Sparkle & Cinematic Zoom',
      description: 'Floating glowing particles, dreamy gradient movements, and soft glowing card borders.',
      transitionDuration: { instant: 70, fast: 140, normal: 240, slow: 380 },
      cardEntrance: { scale: 0.97, transitionEase: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      buttonHoverTransition: 'all 180ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      reducedMotionBehavior: 'fade-only',
    },
    backgroundEffects: {
      type: 'glowing-stars',
      particleCountMultiplier: 1.2,
      ambientLightGradients: [
        'radial-gradient(circle at 20% 15%, rgba(238, 240, 255, 0.8) 0%, transparent 60%)',
        'radial-gradient(circle at 80% 85%, rgba(226, 227, 249, 0.7) 0%, transparent 65%)',
      ],
    },
    sampleHeadline: 'Cinematic Horizon and Twilight Echoes',
    sampleExcerpt: 'Vibrant indigo undertones and crystal-clear glyphs capture the wonder of boundless skies.',
  },

  'minimalist': {
    id: 'minimalist',
    name: 'Minimalist',
    tagline: 'Pure high-contrast Swiss typography, zero ornamentation, and absolute focus.',
    colors: {
      bgPage: '#FFFFFF',
      bgSurface: '#FFFFFF',
      bgSurfaceElevated: '#F6F6F6',
      bgSurfaceMuted: '#EEEEEE',
      textPrimary: '#000000',
      textSecondary: '#444444',
      textMuted: '#888888',
      borderSubtle: '#E0E0E0',
      borderHover: '#999999',
      borderFocus: '#000000',
      accent: '#000000',
      accentSurface: '#F0F0F0',
      accentText: '#FFFFFF',
      tagBg: '#F0F0F0',
      tagText: '#000000',
      codeBg: '#F8F8F8',
      codeBorder: '#DDDDDD',
      quoteBorder: '#000000',
    },
    typography: {
      fontSerif: "'Lora', serif",
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      fontDisplay: "'Plus Jakarta Sans', sans-serif",
      defaultFontFamily: 'sans',
      headingFamily: "'Plus Jakarta Sans', sans-serif",
      bodyFamily: "'Plus Jakarta Sans', sans-serif",
      letterSpacingHeadings: '-0.03em',
      fontScaleMultiplier: 1.0,
    },
    radius: {
      sm: '2px',
      md: '4px',
      lg: '6px',
      full: '9999px',
    },
    shadows: {
      sm: 'none',
      md: '0 1px 3px rgba(0, 0, 0, 0.05)',
      lg: '0 3px 8px rgba(0, 0, 0, 0.08)',
    },
    buttonStyle: {
      borderRadius: '3px',
      border: '1px solid #000000',
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.05em',
      hoverScale: 1.0,
      boxShadow: 'none',
    },
    cardStyle: {
      borderRadius: '4px',
      border: '1px solid #E0E0E0',
      boxShadow: 'none',
      hoverLiftY: 0,
      hoverScale: 1.0,
    },
    soundtrack: {
      id: 'minimal-silence',
      title: 'White Room Silence',
      genre: 'Quiet Ambient Soundscape',
      description: 'Pristine near-silence with sub-bass frequency hums and room-tone acoustic stillness.',
      isAvailable: false,
      audioSrc: '/audio/minimalist.mp3',
      notes: 'Zero harmonic distraction; pure acoustic dampener.',
      proceduralPreset: 'minimal',
    },
    animation: {
      name: 'Swiss Precision Cut',
      description: 'Precise, clean micro-transitions, razor-sharp focus states, and zero gratuitous movement.',
      transitionDuration: { instant: 40, fast: 90, normal: 160, slow: 240 },
      cardEntrance: { y: 0, transitionEase: 'linear' },
      buttonHoverTransition: 'background-color 100ms linear, color 100ms linear',
      reducedMotionBehavior: 'instant',
    },
    backgroundEffects: {
      type: 'swiss-grid',
      particleCountMultiplier: 0, // No particles for minimalist
      ambientLightGradients: [],
    },
    sampleHeadline: 'Pure Monochrome Swiss Functionalism',
    sampleExcerpt: 'Form follows word. Every pixel not serving comprehension is stripped away without apology.',
  },

  'academia': {
    id: 'academia',
    name: 'Academia',
    tagline: 'Antiquarian parchment, warm light motes, and classical scholarly rigor.',
    colors: {
      bgPage: '#FBF7ED',
      bgSurface: '#FFFDF8',
      bgSurfaceElevated: '#F2ECDC',
      bgSurfaceMuted: '#E7DFCA',
      textPrimary: '#1C1917',
      textSecondary: '#4A443E',
      textMuted: '#7E756B',
      borderSubtle: '#E5DCC9',
      borderHover: '#D0C3A8',
      borderFocus: '#1C1917',
      accent: '#2B2621',
      accentSurface: '#EAE1CD',
      accentText: '#FFFDF8',
      tagBg: '#E8DFC9',
      tagText: '#3D362F',
      codeBg: '#EFE7D2',
      codeBorder: '#DFD4BA',
      quoteBorder: '#C4B495',
    },
    typography: {
      fontSerif: "'Lora', 'Times New Roman', serif",
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      fontDisplay: "'Cinzel', 'Lora', serif",
      defaultFontFamily: 'serif',
      headingFamily: "'Cinzel', 'Lora', serif",
      bodyFamily: "'Lora', Georgia, serif",
      letterSpacingHeadings: '0.02em',
      fontScaleMultiplier: 1.04,
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 3px rgba(28, 25, 23, 0.05)',
      md: '0 4px 10px rgba(28, 25, 23, 0.07)',
      lg: '0 10px 24px rgba(28, 25, 23, 0.1)',
    },
    buttonStyle: {
      borderRadius: '6px',
      border: '1px solid #D0C3A8',
      textTransform: 'none',
      fontWeight: 600,
      hoverScale: 1.015,
      boxShadow: '0 2px 6px rgba(28, 25, 23, 0.06)',
    },
    cardStyle: {
      borderRadius: '10px',
      border: '1px solid #E5DCC9',
      boxShadow: '0 3px 12px rgba(28, 25, 23, 0.05)',
      hoverLiftY: -3,
      hoverScale: 1.01,
    },
    soundtrack: {
      id: 'academia-strings',
      title: 'Parchment Nocturne',
      genre: 'Classical Piano and Strings',
      description: 'Chamber cello, soft violin sustain, rain upon library stained glass, and turning vellum.',
      isAvailable: false,
      audioSrc: '/audio/academia.mp3',
      notes: 'Scholarly chamber classical accompaniment.',
      proceduralPreset: 'strings',
    },
    animation: {
      name: 'Vellum Page Glide & Amber Dust',
      description: 'Paper-glide transitions, subtle floating dust motes in sunbeams, and ink-toned hover accents.',
      transitionDuration: { instant: 70, fast: 150, normal: 280, slow: 440 },
      cardEntrance: { y: 14, transitionEase: 'cubic-bezier(0.25, 1, 0.5, 1)' },
      buttonHoverTransition: 'all 200ms ease-out',
      reducedMotionBehavior: 'fade-only',
    },
    backgroundEffects: {
      type: 'floating-dust',
      particleCountMultiplier: 1.0,
      ambientLightGradients: [
        'radial-gradient(circle at 75% 20%, rgba(242, 236, 220, 0.7) 0%, transparent 60%)',
        'radial-gradient(circle at 25% 80%, rgba(231, 223, 202, 0.5) 0%, transparent 65%)',
      ],
    },
    sampleHeadline: 'Scholarly Inquiries in Typographic Architecture',
    sampleExcerpt: 'Dense vellum balance, hand-set margins, and charcoal ink evoke quiet monastic reading desks.',
  },

  'nature': {
    id: 'nature',
    name: 'Nature',
    tagline: 'Forest canopy sage, dappled sunbeams, and falling autumn foliage.',
    colors: {
      bgPage: '#F2F5F0',
      bgSurface: '#FAFCF9',
      bgSurfaceElevated: '#E5EBE2',
      bgSurfaceMuted: '#D8E0D4',
      textPrimary: '#1C271E',
      textSecondary: '#425446',
      textMuted: '#6C7F71',
      borderSubtle: '#D4DDD1',
      borderHover: '#BAC6B6',
      borderFocus: '#2A4430',
      accent: '#2D4A33',
      accentSurface: '#E0EADE',
      accentText: '#FAFCF9',
      tagBg: '#DBE4D8',
      tagText: '#26382A',
      codeBg: '#E3EBE0',
      codeBorder: '#CBD6C7',
      quoteBorder: '#8FA693',
    },
    typography: {
      fontSerif: "'Lora', serif",
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      fontDisplay: "'Lora', serif",
      defaultFontFamily: 'serif',
      headingFamily: "'Lora', Georgia, serif",
      bodyFamily: "'Lora', Georgia, serif",
      letterSpacingHeadings: '-0.01em',
      fontScaleMultiplier: 1.01,
    },
    radius: {
      sm: '8px',
      md: '14px',
      lg: '22px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 3px rgba(28, 39, 30, 0.04)',
      md: '0 4px 12px rgba(28, 39, 30, 0.06)',
      lg: '0 10px 26px rgba(28, 39, 30, 0.08)',
    },
    buttonStyle: {
      borderRadius: '10px',
      border: '1px solid #BAC6B6',
      textTransform: 'none',
      fontWeight: 600,
      hoverScale: 1.02,
      boxShadow: '0 2px 8px rgba(45, 74, 51, 0.1)',
    },
    cardStyle: {
      borderRadius: '16px',
      border: '1px solid #D4DDD1',
      boxShadow: '0 4px 14px rgba(28, 39, 30, 0.04)',
      hoverLiftY: -3,
      hoverScale: 1.01,
    },
    soundtrack: {
      id: 'nature-canopy',
      title: 'Canopy Whispers & Forest Rain',
      genre: 'Forest Ambience, Gentle Rain & Birds',
      description: 'Dappled woodland breeze through high pines, soft forest floor rain, and gentle dawn warblers.',
      isAvailable: false,
      audioSrc: '/audio/nature.mp3',
      notes: 'Organic field recording atmosphere.',
      proceduralPreset: 'nature',
    },
    animation: {
      name: 'Organic Breeze & Falling Leaves',
      description: 'Slow-moving organic gradients, falling foliage, and soft natural card transitions.',
      transitionDuration: { instant: 70, fast: 160, normal: 300, slow: 480 },
      cardEntrance: { y: 16, transitionEase: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      buttonHoverTransition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      reducedMotionBehavior: 'fade-only',
    },
    backgroundEffects: {
      type: 'falling-leaves',
      particleCountMultiplier: 1.0,
      ambientLightGradients: [
        'radial-gradient(circle at 10% 20%, rgba(224, 234, 222, 0.8) 0%, transparent 60%)',
        'radial-gradient(circle at 90% 80%, rgba(216, 224, 212, 0.6) 0%, transparent 65%)',
      ],
    },
    sampleHeadline: 'Still Waters and Dappled Forest Shimmer',
    sampleExcerpt: 'Sage earth tones and organic curves inspired by ancient redwoods and morning mist.',
  },

  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    tagline: 'High-contrast nocturnal grid, electric cyan scanlines, and synth neon pulses.',
    colors: {
      bgPage: '#0C0E14',
      bgSurface: '#141722',
      bgSurfaceElevated: '#1B2030',
      bgSurfaceMuted: '#242A3E',
      textPrimary: '#F0F6FC',
      textSecondary: '#9BA7C0',
      textMuted: '#5E6984',
      borderSubtle: '#252D42',
      borderHover: '#00F0FF',
      borderFocus: '#00F0FF',
      accent: '#00F0FF',
      accentSurface: '#16293A',
      accentText: '#0C0E14',
      tagBg: '#112638',
      tagText: '#38BDF8',
      codeBg: '#090B10',
      codeBorder: '#1E283D',
      quoteBorder: '#00F0FF',
      glow: 'rgba(0, 240, 255, 0.35)',
    },
    typography: {
      fontSerif: "'Lora', serif",
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      fontDisplay: "'JetBrains Mono', monospace",
      defaultFontFamily: 'mono',
      headingFamily: "'JetBrains Mono', monospace",
      bodyFamily: "'Plus Jakarta Sans', sans-serif",
      letterSpacingHeadings: '0.04em',
      fontScaleMultiplier: 0.98,
    },
    radius: {
      sm: '2px',
      md: '4px',
      lg: '8px',
      full: '9999px',
    },
    shadows: {
      sm: '0 2px 8px rgba(0, 240, 255, 0.1)',
      md: '0 4px 16px rgba(0, 240, 255, 0.15)',
      lg: '0 8px 30px rgba(0, 240, 255, 0.22)',
      glow: '0 0 16px rgba(0, 240, 255, 0.4)',
    },
    buttonStyle: {
      borderRadius: '4px',
      border: '1px solid #00F0FF',
      textTransform: 'uppercase',
      fontWeight: 700,
      letterSpacing: '0.08em',
      hoverScale: 1.02,
      boxShadow: '0 0 12px rgba(0, 240, 255, 0.3)',
    },
    cardStyle: {
      borderRadius: '6px',
      border: '1px solid #252D42',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      hoverLiftY: -3,
      hoverScale: 1.01,
    },
    soundtrack: {
      id: 'cyber-synth',
      title: 'Neon Horizon & Analog Synth',
      genre: 'Futuristic Electronic Ambient',
      description: 'Slow-sweeping analog poly-synths, blade runner tape swells, and deep sub-bass pulse.',
      isAvailable: false,
      audioSrc: '/audio/cyberpunk.mp3',
      notes: 'Futuristic ambient synthesizer tapestry.',
      proceduralPreset: 'synth',
    },
    animation: {
      name: 'Scanline Pulse & Glitch Transition',
      description: 'Subtle digital scanlines, neon edge glow on focus, and crisp terminal interactions.',
      transitionDuration: { instant: 50, fast: 110, normal: 200, slow: 320 },
      cardEntrance: { y: 10, transitionEase: 'cubic-bezier(0.1, 0.9, 0.2, 1)' },
      buttonHoverTransition: 'all 140ms ease-out',
      reducedMotionBehavior: 'instant',
    },
    backgroundEffects: {
      type: 'cyber-scanlines',
      particleCountMultiplier: 0.8,
      ambientLightGradients: [
        'radial-gradient(circle at 15% 15%, rgba(0, 240, 255, 0.12) 0%, transparent 55%)',
        'radial-gradient(circle at 85% 85%, rgba(236, 72, 153, 0.08) 0%, transparent 60%)',
      ],
    },
    sampleHeadline: 'High-Density Low-Luminance Cyber Prose',
    sampleExcerpt: 'Zero eye fatigue terminal typography with crisp contrast across dark net protocols.',
  },

  'experimental': {
    id: 'experimental',
    name: 'Experimental',
    tagline: 'Brutalist terracotta, offset block shadows, and playful geometric reveals.',
    colors: {
      bgPage: '#F7F1EB',
      bgSurface: '#FFFFFF',
      bgSurfaceElevated: '#EFE4D8',
      bgSurfaceMuted: '#E4D5C5',
      textPrimary: '#2B1D14',
      textSecondary: '#5C4638',
      textMuted: '#8E7361',
      borderSubtle: '#DFCFC1',
      borderHover: '#B89981',
      borderFocus: '#B85028',
      accent: '#B85028',
      accentSurface: '#F8EDE5',
      accentText: '#FFFFFF',
      tagBg: '#F1DFD1',
      tagText: '#7C2D12',
      codeBg: '#EFE1D3',
      codeBorder: '#DEC8B4',
      quoteBorder: '#B85028',
    },
    typography: {
      fontSerif: "'Lora', serif",
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      fontDisplay: "'JetBrains Mono', sans-serif",
      defaultFontFamily: 'sans',
      headingFamily: "'Plus Jakarta Sans', sans-serif",
      bodyFamily: "'Lora', Georgia, serif",
      letterSpacingHeadings: '-0.02em',
      fontScaleMultiplier: 1.0,
    },
    radius: {
      sm: '4px',
      md: '6px',
      lg: '10px',
      full: '9999px',
    },
    shadows: {
      sm: '2px 2px 0 #2B1D14',
      md: '4px 4px 0 #2B1D14',
      lg: '6px 6px 0 #2B1D14',
    },
    buttonStyle: {
      borderRadius: '4px',
      border: '2px solid #2B1D14',
      textTransform: 'uppercase',
      fontWeight: 700,
      letterSpacing: '0.04em',
      hoverScale: 1.02,
      boxShadow: '3px 3px 0 #2B1D14',
    },
    cardStyle: {
      borderRadius: '6px',
      border: '2px solid #2B1D14',
      boxShadow: '4px 4px 0 #DFCFC1',
      hoverLiftY: -3,
      hoverScale: 1.01,
    },
    soundtrack: {
      id: 'experimental-tape',
      title: 'Analog Tape & Resonances',
      genre: 'Abstract Ambient Soundscape',
      description: 'Warm vinyl crackle, tape-loop flutters, resonant wooden chimes, and tactile room textures.',
      isAvailable: false,
      audioSrc: '/audio/experimental.mp3',
      notes: 'Experimental tape music for deep contemplation.',
      proceduralPreset: 'abstract',
    },
    animation: {
      name: 'Geometric Snap & Angular Shift',
      description: 'Block reveals, geometric transitions, playful staggered entrances, and offset hover depth.',
      transitionDuration: { instant: 60, fast: 130, normal: 220, slow: 360 },
      cardEntrance: { y: 16, transitionEase: 'cubic-bezier(0.22, 0.68, 0, 1)' },
      buttonHoverTransition: 'transform 120ms ease, box-shadow 120ms ease',
      reducedMotionBehavior: 'instant',
    },
    backgroundEffects: {
      type: 'geometric-drift',
      particleCountMultiplier: 0.9,
      ambientLightGradients: [
        'radial-gradient(circle at 10% 85%, rgba(248, 237, 229, 0.8) 0%, transparent 60%)',
        'radial-gradient(circle at 90% 15%, rgba(239, 228, 216, 0.7) 0%, transparent 65%)',
      ],
    },
    sampleHeadline: 'Tactile Brutalism and Geometric Editorial Flow',
    sampleExcerpt: 'Bold offset block shadows paired with warm terracotta tones provide tangible tactile weight.',
  },

  'dark-mono': {
    id: 'dark-mono',
    name: 'Dark Mono',
    tagline: 'Focused charcoal, deep slate night reading, and low-luminance quiet.',
    colors: {
      bgPage: '#131416',
      bgSurface: '#1B1D21',
      bgSurfaceElevated: '#24272C',
      bgSurfaceMuted: '#2E3239',
      textPrimary: '#EAEBEE',
      textSecondary: '#A6ABB5',
      textMuted: '#6E7480',
      borderSubtle: '#2C3038',
      borderHover: '#404652',
      borderFocus: '#EAEBEE',
      accent: '#EAEBEE',
      accentSurface: '#2E3239',
      accentText: '#131416',
      tagBg: '#272A30',
      tagText: '#CED2DA',
      codeBg: '#1B1D21',
      codeBorder: '#333842',
      quoteBorder: '#4D5360',
    },
    typography: {
      fontSerif: "'Lora', serif",
      fontSans: "'Plus Jakarta Sans', sans-serif",
      fontMono: "'JetBrains Mono', monospace",
      fontDisplay: "'JetBrains Mono', monospace",
      defaultFontFamily: 'mono',
      headingFamily: "'JetBrains Mono', monospace",
      bodyFamily: "'JetBrains Mono', monospace",
      letterSpacingHeadings: '0.02em',
      fontScaleMultiplier: 0.96,
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
      md: '0 4px 12px rgba(0, 0, 0, 0.4)',
      lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    },
    buttonStyle: {
      borderRadius: '6px',
      border: '1px solid #404652',
      textTransform: 'none',
      fontWeight: 500,
      hoverScale: 1.015,
      boxShadow: 'none',
    },
    cardStyle: {
      borderRadius: '10px',
      border: '1px solid #2C3038',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
      hoverLiftY: -2,
      hoverScale: 1.01,
    },
    soundtrack: {
      id: 'mono-whitenoise',
      title: 'Deep Night Silence & White Noise',
      genre: 'Quiet Ambient Soundscape',
      description: 'Low-frequency night hum, gentle continuous acoustic tape bed, and zero distracting melody.',
      isAvailable: false,
      audioSrc: '/audio/dark-mono.mp3',
      notes: 'Nocturnal deep focus soundscape.',
      proceduralPreset: 'minimal',
    },
    animation: {
      name: 'Nocturnal Fade',
      description: 'Subdued luminance shifts, crisp monochrome focus rings, and gentle low-strain fades.',
      transitionDuration: { instant: 50, fast: 120, normal: 220, slow: 340 },
      cardEntrance: { y: 10, transitionEase: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      buttonHoverTransition: 'all 160ms ease',
      reducedMotionBehavior: 'fade-only',
    },
    backgroundEffects: {
      type: 'monochrome-still',
      particleCountMultiplier: 0.5,
      ambientLightGradients: [
        'radial-gradient(circle at 50% 50%, rgba(27, 29, 33, 0.6) 0%, transparent 70%)',
      ],
    },
    sampleHeadline: 'Low-Luminance Terminal Prose',
    sampleExcerpt: 'High contrast for nocturnal reading without blue-light exhaustion or visual strain.',
  },
};

/**
 * Applies a theme configuration to the DOM documentElement.
 * Centralizes all CSS custom property assignments in one place.
 */
export function applyThemeToDom(
  theme: ThemeConfig,
  intensity: AnimationIntensity = 'medium',
  animationsEnabled: boolean = true,
  bgEffectsEnabled: boolean = true
) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-theme', theme.id);

  // Intensity multipliers: low = 0.5x, medium = 1x, high = 1.5x
  const durationMultiplier = !animationsEnabled ? 0.001 : intensity === 'low' ? 0.6 : intensity === 'high' ? 1.3 : 1.0;

  // Colors
  root.style.setProperty('--bg-page', theme.colors.bgPage);
  root.style.setProperty('--bg-surface', theme.colors.bgSurface);
  root.style.setProperty('--bg-surface-elevated', theme.colors.bgSurfaceElevated);
  root.style.setProperty('--bg-surface-muted', theme.colors.bgSurfaceMuted);
  root.style.setProperty('--text-primary', theme.colors.textPrimary);
  root.style.setProperty('--text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--text-muted', theme.colors.textMuted);
  root.style.setProperty('--border-subtle', theme.colors.borderSubtle);
  root.style.setProperty('--border-hover', theme.colors.borderHover);
  root.style.setProperty('--border-focus', theme.colors.borderFocus);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-surface', theme.colors.accentSurface);
  root.style.setProperty('--accent-text', theme.colors.accentText);
  root.style.setProperty('--tag-bg', theme.colors.tagBg);
  root.style.setProperty('--tag-text', theme.colors.tagText);
  root.style.setProperty('--code-bg', theme.colors.codeBg);
  root.style.setProperty('--code-border', theme.colors.codeBorder);
  root.style.setProperty('--quote-border', theme.colors.quoteBorder);
  root.style.setProperty('--theme-glow', theme.colors.glow || 'transparent');

  // Typography
  root.style.setProperty('--font-serif', theme.typography.fontSerif);
  root.style.setProperty('--font-sans', theme.typography.fontSans);
  root.style.setProperty('--font-mono', theme.typography.fontMono);
  root.style.setProperty('--font-display', theme.typography.fontDisplay);
  root.style.setProperty('--heading-family', theme.typography.headingFamily);
  root.style.setProperty('--body-family', theme.typography.bodyFamily);
  root.style.setProperty('--letter-spacing-headings', theme.typography.letterSpacingHeadings);

  // Radius
  root.style.setProperty('--radius-sm', theme.radius.sm);
  root.style.setProperty('--radius-md', theme.radius.md);
  root.style.setProperty('--radius-lg', theme.radius.lg);
  root.style.setProperty('--radius-full', theme.radius.full);

  // Shadows
  root.style.setProperty('--shadow-sm', theme.shadows.sm);
  root.style.setProperty('--shadow-md', theme.shadows.md);
  root.style.setProperty('--shadow-lg', theme.shadows.lg);

  // Component Custom Properties
  root.style.setProperty('--btn-radius', theme.buttonStyle.borderRadius);
  root.style.setProperty('--btn-border', theme.buttonStyle.border);
  root.style.setProperty('--btn-font-weight', `${theme.buttonStyle.fontWeight}`);
  root.style.setProperty('--btn-text-transform', theme.buttonStyle.textTransform || 'none');
  root.style.setProperty('--btn-letter-spacing', theme.buttonStyle.letterSpacing || 'normal');
  root.style.setProperty('--btn-box-shadow', theme.buttonStyle.boxShadow || 'none');

  root.style.setProperty('--card-radius', theme.cardStyle.borderRadius);
  root.style.setProperty('--card-border', theme.cardStyle.border);
  root.style.setProperty('--card-shadow', theme.cardStyle.boxShadow);
  root.style.setProperty('--card-lift-y', `${theme.cardStyle.hoverLiftY}px`);

  // Animation Durations
  const durations = theme.animation.transitionDuration;
  root.style.setProperty('--transition-instant', `${Math.round(durations.instant * durationMultiplier)}ms`);
  root.style.setProperty('--transition-fast', `${Math.round(durations.fast * durationMultiplier)}ms`);
  root.style.setProperty('--transition-normal', `${Math.round(durations.normal * durationMultiplier)}ms`);
  root.style.setProperty('--transition-slow', `${Math.round(durations.slow * durationMultiplier)}ms`);

  // Background visual effects indicator
  root.setAttribute('data-bg-effects', bgEffectsEnabled ? 'on' : 'off');
}

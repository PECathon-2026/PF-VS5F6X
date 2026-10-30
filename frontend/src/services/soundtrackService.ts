/**
 * SmallWebReader — Central Soundtrack Engine
 * Manages audio lifecycle, playback, volume, looping, error states, and procedural ambience.
 * Strictly adheres to non-autoplay rules and handles missing audio assets honestly.
 */

import { ThemeConfig, THEME_CONFIGS, SoundtrackSettings } from '../theme/themeConfig';
import { ThemeId } from '../types/article';

export interface SoundtrackPlaybackState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isLooping: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  activeThemeId: ThemeId;
  trackTitle: string;
  genre: string;
  audioSrc?: string;
  isAvailable: boolean;
  isProceduralActive: boolean;
  useProceduralFallback: boolean;
}

type StateListener = (state: SoundtrackPlaybackState) => void;

class SoundtrackEngine {
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private proceduralNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    filter?: BiquadFilterNode;
  } | null = null;

  private activeTheme: ThemeConfig = THEME_CONFIGS['editorial-zen'];
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.5;
  private isLooping = true;
  private isLoading = false;
  private hasError = false;
  private errorMessage: string | null = null;
  private isProceduralActive = false;
  private useProceduralFallback = false;

  private listeners: Set<StateListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (this.audioElement) return;

    this.audioElement = new Audio();
    this.audioElement.preload = 'none'; // NEVER preload or autoplay
    this.audioElement.loop = this.isLooping;
    this.audioElement.volume = this.isMuted ? 0 : this.volume;

    this.audioElement.addEventListener('loadstart', () => {
      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = null;
      this.notify();
    });

    this.audioElement.addEventListener('playing', () => {
      this.isLoading = false;
      this.isPlaying = true;
      this.hasError = false;
      this.errorMessage = null;
      this.notify();
    });

    this.audioElement.addEventListener('pause', () => {
      if (!this.isProceduralActive) {
        this.isPlaying = false;
      }
      this.notify();
    });

    this.audioElement.addEventListener('ended', () => {
      if (!this.isLooping) {
        this.isPlaying = false;
        this.notify();
      }
    });

    this.audioElement.addEventListener('error', () => {
      this.isLoading = false;
      this.isPlaying = false;
      this.hasError = true;
      this.errorMessage = `Audio file not found (${this.activeTheme.soundtrack.audioSrc || 'pending'}). Local asset has not been installed.`;

      // If user enabled procedural fallback, seamlessly switch to Web Audio procedural soundscape
      if (this.useProceduralFallback) {
        this.startProceduralAmbience();
      } else {
        this.notify();
      }
    });
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  public getState(): SoundtrackPlaybackState {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      isLooping: this.isLooping,
      isLoading: this.isLoading,
      hasError: this.hasError,
      errorMessage: this.errorMessage,
      activeThemeId: this.activeTheme.id,
      trackTitle: this.activeTheme.soundtrack.title,
      genre: this.activeTheme.soundtrack.genre,
      audioSrc: this.activeTheme.soundtrack.audioSrc,
      isAvailable: this.activeTheme.soundtrack.isAvailable,
      isProceduralActive: this.isProceduralActive,
      useProceduralFallback: this.useProceduralFallback,
    };
  }

  public syncWithSettings(themeId: ThemeId, settings: Partial<SoundtrackSettings>) {
    const config = THEME_CONFIGS[themeId] || THEME_CONFIGS['editorial-zen'];
    const themeChanged = this.activeTheme.id !== config.id;

    this.activeTheme = config;

    if (settings.volume !== undefined) {
      this.setVolume(settings.volume);
    }
    if (settings.isMuted !== undefined) {
      this.setMuted(settings.isMuted);
    }
    if (settings.isLooping !== undefined) {
      this.setLooping(settings.isLooping);
    }
    if (settings.useProceduralFallback !== undefined) {
      this.useProceduralFallback = settings.useProceduralFallback;
    }

    if (themeChanged) {
      if (this.isPlaying) {
        // Smoothly transition track
        this.stop();
        this.play();
      } else {
        this.hasError = false;
        this.errorMessage = null;
        this.notify();
      }
    }
  }

  public async play(): Promise<void> {
    this.hasError = false;
    this.errorMessage = null;

    if (this.useProceduralFallback) {
      this.startProceduralAmbience();
      return;
    }

    if (!this.audioElement) {
      this.initAudioElement();
    }

    if (!this.audioElement) return;

    const src = this.activeTheme.soundtrack.audioSrc;
    if (!this.activeTheme.soundtrack.isAvailable || !src) {
      this.hasError = true;
      this.errorMessage = `Soundtrack asset pending (${src || 'not installed'}). Local audio file has not been installed.`;
      this.isPlaying = false;
      this.notify();
      return;
    }

    try {
      this.audioElement.src = src;
      this.audioElement.loop = this.isLooping;
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      this.isLoading = true;
      this.notify();

      await this.audioElement.play();
      this.isPlaying = true;
      this.isLoading = false;
      this.notify();
    } catch (err: any) {
      this.isLoading = false;
      this.isPlaying = false;
      this.hasError = true;
      this.errorMessage = `Soundtrack asset not found (${src}). Showing honest unavailable state.`;
      this.notify();
    }
  }

  public pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopProceduralAmbience();
    this.isPlaying = false;
    this.notify();
  }

  public stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.stopProceduralAmbience();
    this.isPlaying = false;
    this.isLoading = false;
    this.notify();
  }

  public togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.volume = clamped;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : clamped;
    }
    if (this.proceduralNodes) {
      this.proceduralNodes.gains.forEach((g) => {
        g.gain.setValueAtTime(this.isMuted ? 0 : clamped * 0.15, this.audioContext?.currentTime || 0);
      });
    }
    this.notify();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.audioElement) {
      this.audioElement.volume = muted ? 0 : this.volume;
    }
    if (this.proceduralNodes) {
      this.proceduralNodes.gains.forEach((g) => {
        g.gain.setValueAtTime(muted ? 0 : this.volume * 0.15, this.audioContext?.currentTime || 0);
      });
    }
    this.notify();
  }

  public toggleMute(): void {
    this.setMuted(!this.isMuted);
  }

  public setLooping(looping: boolean): void {
    this.isLooping = looping;
    if (this.audioElement) {
      this.audioElement.loop = looping;
    }
    this.notify();
  }

  public setProceduralFallback(enabled: boolean): void {
    this.useProceduralFallback = enabled;
    if (this.isPlaying) {
      this.stop();
      this.play();
    } else {
      this.notify();
    }
  }

  /* --------------------------------------------------------------------------
     Procedural Web Audio Ambient Synthesizer
     Generates authentic, relaxing, copyright-free soundscapes tailored to themes.
     -------------------------------------------------------------------------- */
  private startProceduralAmbience() {
    this.stopProceduralAmbience();

    if (typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        this.hasError = true;
        this.errorMessage = 'Web Audio API is not supported in this browser.';
        this.isPlaying = false;
        this.notify();
        return;
      }

      this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const masterGain = this.audioContext.createGain();
      const targetVolume = this.isMuted ? 0 : this.volume * 0.15;
      masterGain.gain.setValueAtTime(targetVolume, this.audioContext.currentTime);

      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.audioContext.currentTime);

      filter.connect(masterGain);
      masterGain.connect(this.audioContext.destination);

      const oscillators: OscillatorNode[] = [];
      const gains: GainNode[] = [masterGain];

      const preset = this.activeTheme.soundtrack.proceduralPreset;

      // Theme-specific chord frequencies (gentle, warm, meditative intervals)
      const themeChords: Record<string, number[]> = {
        piano: [261.63, 329.63, 392.0, 523.25], // C major 7th warm piano chord
        traditional: [220.0, 246.94, 293.66, 329.63], // Japanese In-sen scale (A, B, D, E)
        dreamy: [349.23, 440.0, 523.25, 659.25], // F major 7th ethereal lo-fi
        minimal: [110.0, 164.81], // A2 low deep sine drone
        strings: [196.0, 246.94, 293.66, 392.0], // G major cello/strings
        nature: [174.61, 261.63, 349.23], // F major forest breeze
        synth: [130.81, 196.0, 261.63, 311.13], // C minor / cyberpunk analog pad
        abstract: [146.83, 220.0, 293.66, 440.0], // D resonant tape harmonics
      };

      const freqs = themeChords[preset] || [220, 330, 440];

      freqs.forEach((freq, i) => {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();

        osc.type = preset === 'synth' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq + (i * 0.4), this.audioContext.currentTime);

        // Subtly detune for natural analog chorus drift
        osc.detune.setValueAtTime((i - 1) * 4, this.audioContext.currentTime);

        const oscLevel = 0.2 / freqs.length;
        oscGain.gain.setValueAtTime(oscLevel, this.audioContext.currentTime);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();

        oscillators.push(osc);
        gains.push(oscGain);
      });

      this.proceduralNodes = { oscillators, gains, filter };
      this.isProceduralActive = true;
      this.isPlaying = true;
      this.isLoading = false;
      this.hasError = false;
      this.errorMessage = null;
      this.notify();
    } catch (err: any) {
      this.isProceduralActive = false;
      this.isPlaying = false;
      this.hasError = true;
      this.errorMessage = 'Could not initialize procedural audio ambience.';
      this.notify();
    }
  }

  private stopProceduralAmbience() {
    if (this.proceduralNodes) {
      this.proceduralNodes.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore
        }
      });
      this.proceduralNodes = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {
        // Ignore
      }
      this.audioContext = null;
    }
    this.isProceduralActive = false;
  }
}

export const soundtrackEngine = new SoundtrackEngine();

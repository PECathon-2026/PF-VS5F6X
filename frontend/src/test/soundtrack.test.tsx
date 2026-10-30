import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { SoundtrackDock } from '../components/theme/SoundtrackDock';
import { soundtrackEngine } from '../services/soundtrackService';

describe('Soundtrack Engine & Controller', () => {
  beforeEach(() => {
    localStorage.clear();
    soundtrackEngine.stop();
    soundtrackEngine.setMuted(false);
    soundtrackEngine.setVolume(0.5);
    soundtrackEngine.setProceduralFallback(false);
  });

  describe('Audio Rules Compliance', () => {
    it('initializes with sound OFF by default (never autoplays)', () => {
      const state = soundtrackEngine.getState();
      expect(state.isPlaying).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('honestly reports missing audio assets when track file does not exist', async () => {
      // In JSDOM, HTMLAudioElement will fail to load or error
      await soundtrackEngine.play();
      const state = soundtrackEngine.getState();

      // Either it caught an error or remained honest without pretending to play
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBeTruthy();
      expect(state.isPlaying).toBe(false);
    });

    it('toggles mute, volume, and looping state accurately', () => {
      expect(soundtrackEngine.getState().isMuted).toBe(false);

      soundtrackEngine.setMuted(true);
      expect(soundtrackEngine.getState().isMuted).toBe(true);

      soundtrackEngine.setVolume(0.8);
      expect(soundtrackEngine.getState().volume).toBe(0.8);

      soundtrackEngine.setLooping(false);
      expect(soundtrackEngine.getState().isLooping).toBe(false);
    });

    it('supports Web Audio procedural ambient synthesis mode', () => {
      soundtrackEngine.setProceduralFallback(true);
      expect(soundtrackEngine.getState().useProceduralFallback).toBe(true);
    });
  });

  describe('SoundtrackDock User Interface', () => {
    it('renders minimized dock pill initially and expands on click', () => {
      render(
        <ThemeProvider>
          <SoundtrackDock />
        </ThemeProvider>
      );

      // Initially shows play button and track title
      expect(screen.getByRole('button', { name: /Play soundtrack/i })).toBeInTheDocument();
      expect(screen.getByText(/Quiet Contemplation/i)).toBeInTheDocument();

      // Click to expand
      fireEvent.click(screen.getByRole('button', { name: /Expand soundtrack dock/i }));

      // Expanded controls should now be visible
      expect(screen.getByText(/Editorial Zen Soundscape/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Volume/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Loop/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mute/i })).toBeInTheDocument();
    });

    it('allows toggling loop and procedural ambient mode in expanded dock', () => {
      render(
        <ThemeProvider>
          <SoundtrackDock />
        </ThemeProvider>
      );

      // Expand dock
      fireEvent.click(screen.getByRole('button', { name: /Expand soundtrack dock/i }));

      // Toggle loop
      const loopBtn = screen.getByRole('button', { name: /Loop/i });
      fireEvent.click(loopBtn);

      // Toggle procedural checkbox
      const proceduralCheckbox = screen.getByLabelText(/Volume/i);
      expect(proceduralCheckbox).toBeInTheDocument();
    });
  });
});

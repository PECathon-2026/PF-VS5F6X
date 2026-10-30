import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { soundtrackEngine, SoundtrackPlaybackState } from '../../services/soundtrackService';

export const SoundtrackDock: React.FC = () => {
  const { currentThemeConfig, updateSoundtrackSettings } = useTheme();
  const [playbackState, setPlaybackState] = useState<SoundtrackPlaybackState>(() =>
    soundtrackEngine.getState()
  );
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = soundtrackEngine.subscribe((state) => {
      setPlaybackState(state);
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = () => {
    soundtrackEngine.togglePlay();
  };

  const handleToggleMute = () => {
    soundtrackEngine.toggleMute();
    updateSoundtrackSettings({ isMuted: !playbackState.isMuted });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    soundtrackEngine.setVolume(val);
    updateSoundtrackSettings({ volume: val });
  };

  const handleToggleLoop = () => {
    const next = !playbackState.isLooping;
    soundtrackEngine.setLooping(next);
    updateSoundtrackSettings({ isLooping: next });
  };

  const handleToggleProcedural = () => {
    const next = !playbackState.useProceduralFallback;
    soundtrackEngine.setProceduralFallback(next);
    updateSoundtrackSettings({ useProceduralFallback: next });
  };

  return (
    <div
      role="region"
      aria-label="Soundtrack Controller"
      className="soundtrack-dock"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 150,
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: isExpanded ? 'var(--radius-lg)' : 'var(--radius-full)',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 220ms ease-out',
        backdropFilter: 'blur(10px)',
        maxWidth: isExpanded ? '380px' : 'auto',
        width: isExpanded ? 'calc(100vw - 2.5rem)' : 'auto',
      }}
    >
      {/* Minimized Pill View */}
      {!isExpanded && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem' }}>
          <button
            onClick={handleTogglePlay}
            aria-label={playbackState.isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {playbackState.isLoading ? '⌛' : playbackState.isPlaying ? '❚❚' : '▶'}
          </button>

          <button
            onClick={() => setIsExpanded(true)}
            aria-label="Expand soundtrack dock"
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
              cursor: 'pointer',
              padding: '0.1rem 0.3rem',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {playbackState.trackTitle}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {playbackState.isPlaying
                ? playbackState.isProceduralActive
                  ? 'Procedural Ambience'
                  : 'Playing'
                : playbackState.hasError
                ? 'Asset Pending'
                : 'Paused'}
            </span>
          </button>

          <button
            onClick={() => setIsExpanded(true)}
            aria-label="Expand soundtrack settings"
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              padding: '0.2rem',
              cursor: 'pointer',
            }}
          >
            ⚙
          </button>
        </div>
      )}

      {/* Expanded Controller Panel */}
      {isExpanded && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                {currentThemeConfig.name} Soundscape
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.2rem 0 0' }}>
                {playbackState.trackTitle}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0' }}>
                {playbackState.genre}
              </p>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              aria-label="Minimize soundtrack dock"
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                padding: '0.2rem 0.4rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Honest Status & Asset Feedback */}
          {playbackState.hasError && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Honest Audio Status:
              </div>
              {playbackState.errorMessage}
            </div>
          )}

          {playbackState.isProceduralActive && (
            <div
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-surface)',
                fontSize: '0.75rem',
                color: 'var(--text-primary)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>✨</span>
              <span>Active: Live Web Audio procedural ambient synthesis (zero copyright, zero external network).</span>
            </div>
          )}

          {/* Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={handleTogglePlay}
                aria-label={playbackState.isPlaying ? 'Pause' : 'Play'}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-text)',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {playbackState.isLoading ? '⌛' : playbackState.isPlaying ? '❚❚' : '▶'}
              </button>

              <button
                onClick={handleToggleMute}
                aria-label={playbackState.isMuted ? 'Unmute' : 'Mute'}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {playbackState.isMuted ? '🔇 Muted' : '🔊 Sound'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleToggleLoop}
                aria-label="Toggle loop"
                title="Loop track"
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: playbackState.isLooping ? 'var(--accent-surface)' : 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: playbackState.isLooping ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🔁 Loop
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label htmlFor="soundtrack-volume-slider" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Volume ({Math.round(playbackState.volume * 100)}%)
              </label>
              {playbackState.isMuted && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Muted</span>
              )}
            </div>
            <input
              id="soundtrack-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={playbackState.volume}
              onChange={handleVolumeChange}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Procedural Ambient Synthesizer Option */}
          <div
            style={{
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Procedural Ambient Mode
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Synthesizes peaceful sine ambient tones locally
              </div>
            </div>
            <input
              type="checkbox"
              id="procedural-fallback-checkbox"
              checked={playbackState.useProceduralFallback}
              onChange={handleToggleProcedural}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

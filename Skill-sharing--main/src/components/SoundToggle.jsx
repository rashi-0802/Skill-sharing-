import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled } from '../utils/soundUtil.js';
import './SoundToggle.css';

/**
 * Manga / Anime Sound Toggle Button
 * Reusable across navbar, headers and modals
 */
export default function SoundToggle({ className = '', variant = 'chip' }) {
  const [enabled, setEnabled] = useState(isSoundEnabled());

  useEffect(() => {
    const handleToggle = (e) => {
      if (e?.detail?.enabled !== undefined) {
        setEnabled(e.detail.enabled);
      } else {
        setEnabled(isSoundEnabled());
      }
    };
    window.addEventListener('4s_sound_toggle', handleToggle);
    return () => window.removeEventListener('4s_sound_toggle', handleToggle);
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`sound-toggle-btn ${variant === 'icon' ? 'sound-icon-only' : 'sound-chip'} ${
        enabled ? 'sound-on' : 'sound-off'
      } ${className}`}
      title={enabled ? 'Sound Effects: ON (Click to mute)' : 'Sound Effects: MUTED (Click to unmute)'}
      aria-label={enabled ? 'Sound Effects: ON (Click to mute)' : 'Sound Effects: MUTED (Click to unmute)'}
      aria-pressed={enabled}
    >
      {enabled ? (
        <>
          <Volume2 size={16} className="sound-icon-active" />
          {variant !== 'icon' && <span>SFX ON</span>}
        </>
      ) : (
        <>
          <VolumeX size={16} className="sound-icon-muted" />
          {variant !== 'icon' && <span>SFX OFF</span>}
        </>
      )}
    </button>
  );
}

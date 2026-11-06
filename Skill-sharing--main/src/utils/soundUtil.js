/**
 * Sound Utility and State for 4S Academy
 * Provides global sound toggle state and synthesizer sound effects via Web Audio API.
 * No external audio files or network calls are made.
 */

const SOUND_STORAGE_KEY = '4s_sound_enabled';

export const isSoundEnabled = () => {
  try {
    const val = localStorage.getItem(SOUND_STORAGE_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled) => {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('4s_sound_toggle', { detail: { enabled } }));
  } catch (e) {
    console.error('Error saving sound preference', e);
  }
};

export const toggleSound = () => {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
};

/**
 * Plays the signature match-found / rank-up anime chime
 * Uses Web Audio API oscillator only if sound is enabled.
 */
export const playMatchFoundChime = () => {
  if (!isSoundEnabled()) return;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.5);
    });
  } catch (e) {
    // audio silently bypassed if blocked by autoplay policy
  }
};

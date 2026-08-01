/* ==========================================================================
   WEB AUDIO API SOUND SYNTHESIZER & AUDIO MANAGER
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
    this.volume = 0.5;
    this.bgMusicPlaying = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play a synthesized chime for correct answer
  playCorrectSound() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0.01, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.3 * this.volume, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.45);
    });
  }

  // Play a soft encouraging bell sound for incorrect answer
  playIncorrectSound() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [440, 415.30]; // A4 to Ab4 soft transition

    notes.forEach((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.15);

      gain.gain.setValueAtTime(0.01, now + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.2 * this.volume, now + index * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + index * 0.15);
      osc.stop(now + index * 0.15 + 0.55);
    });
  }

  // Play soft tactile click sound
  playClickSound() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.15 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Play heart pop sound for Easter egg or heart click
  playHeartPopSound() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);

    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Soft ambient music loop generator using Web Audio API synthesis
  toggleAmbientBgMusic() {
    this.init();
    if (!this.audioCtx) return;

    if (this.bgMusicPlaying) {
      if (this.bgMusicTimer) clearInterval(this.bgMusicTimer);
      this.bgMusicPlaying = false;
      return false;
    } else {
      this.bgMusicPlaying = true;
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // C maj7
        [220.00, 261.63, 329.63, 392.00], // A min7
        [174.61, 220.00, 261.63, 329.63], // F maj7
        [196.00, 246.94, 293.66, 349.23]  // G7
      ];
      let chordIndex = 0;

      const playChord = () => {
        if (!this.bgMusicPlaying || this.muted) return;
        const now = this.audioCtx.currentTime;
        const currentChord = chords[chordIndex];
        
        currentChord.forEach((freq) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.02 * this.volume, now + 1.5);
          gain.gain.linearRampToValueAtTime(0.001, now + 3.8);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 4.0);
        });

        chordIndex = (chordIndex + 1) % chords.length;
      };

      playChord();
      this.bgMusicTimer = setInterval(playChord, 4000);
      return true;
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

window.soundEngine = new SoundEngine();

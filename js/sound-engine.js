/* ==========================================================================
   DEDICATED MOBILE-OPTIMIZED AUDIO & SOUND SYNTHESIZER ENGINE
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
    this.volume = 0.85;
    this.bgMusicPlaying = false;

    // Dedicated background song (music.mp3 - "I Think They Call This Love")
    this.audioElement = new Audio('music.mp3');
    this.audioElement.loop = true;
    this.audioElement.volume = this.volume;
    this.audioElement.setAttribute('playsinline', 'true');
    this.audioElement.setAttribute('webkit-playsinline', 'true');

    // Mobile Audio Unlocking logic (listens to all mobile touch & pointer gestures)
    const unlockMobileAudio = () => {
      this.init();
      if (!this.bgMusicPlaying && !this.muted) {
        this.playBgMusic();
      }
      // Remove listeners once audio is unlocked
      ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(evt => {
        window.removeEventListener(evt, unlockMobileAudio);
      });
    };

    ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(evt => {
      window.addEventListener(evt, unlockMobileAudio, { passive: true });
    });
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

  playBgMusic() {
    this.init();
    if (this.muted) return false;

    this.audioElement.volume = this.volume;
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.bgMusicPlaying = true;
      }).catch(err => {
        console.warn('Mobile autoplay policy waiting for user touch gesture...', err);
      });
    }
    return true;
  }

  pauseBgMusic() {
    this.bgMusicPlaying = false;
    this.audioElement.pause();
  }

  toggleSound() {
    this.init();
    this.muted = !this.muted;
    this.audioElement.muted = this.muted;

    if (this.muted) {
      this.pauseBgMusic();
    } else {
      this.playBgMusic();
    }

    return this.muted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audioElement.volume = this.volume;
  }

  // Synthesized Sound FX
  playCorrectSound() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];

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

  playIncorrectSound() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [440, 415.30];

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
}

window.soundEngine = new SoundEngine();

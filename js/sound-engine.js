/* ==========================================================================
   DEDICATED MOBILE-OPTIMIZED AUDIO & SOUND SYNTHESIZER ENGINE
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
    this.volume = 0.85;
    this.bgMusicPlaying = false;
    this.playlist = [];

    // Dedicated background song (music.mp3 - "I Think They Call This Love")
    this.audioElement = new Audio('music.mp3');
    this.audioElement.loop = true;
    this.audioElement.volume = this.volume;
    this.audioElement.setAttribute('playsinline', 'true');
    this.audioElement.setAttribute('webkit-playsinline', 'true');

    // Dedicated Grand Finale Soft Piano Love BGM
    this.finaleAudioElement = new Audio('https://assets.mixkit.co/music/preview/mixkit-romantic-sunset-594.mp3');
    this.finaleAudioElement.loop = true;
    this.finaleAudioElement.volume = this.volume;
    this.finaleAudioElement.setAttribute('playsinline', 'true');
    this.finaleAudioElement.setAttribute('webkit-playsinline', 'true');

    // Mobile Audio Unlocking logic
    const unlockMobileAudio = () => {
      this.init();
      if (!this.bgMusicPlaying && !this.muted) {
        this.playBgMusic();
      }
    };

    ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(evt => {
      window.addEventListener(evt, unlockMobileAudio, { once: true, passive: true });
    });
  }

  setPlaylist(list) {
    this.playlist = list || [];
    if (Array.isArray(list) && list.length > 0 && list[0].url) {
      this.audioElement.src = list[0].url;
    }
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

    this.audioElement.muted = false;
    this.audioElement.volume = this.volume;
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.bgMusicPlaying = true;
      }).catch(err => {
        console.warn('Autoplay policy waiting for user touch gesture...', err);
      });
    }
    return true;
  }

  pauseBgMusic() {
    this.bgMusicPlaying = false;
    this.audioElement.pause();
  }

  playFinaleBgm() {
    this.init();
    if (this.muted) return false;

    this.pauseBgMusic();
    this.finaleAudioElement.muted = false;
    this.finaleAudioElement.volume = this.volume;
    this.finaleAudioElement.currentTime = 0;

    const playPromise = this.finaleAudioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.bgMusicPlaying = true;
      }).catch(err => {
        console.warn('Finale BGM autoplay waiting for gesture', err);
      });
    }
    return true;
  }

  stopFinaleBgm() {
    if (this.finaleAudioElement) {
      this.finaleAudioElement.pause();
    }
  }

  toggleSound() {
    this.init();
    this.muted = !this.muted;

    if (this.muted) {
      this.audioElement.muted = true;
      this.audioElement.pause();
      if (this.finaleAudioElement) this.finaleAudioElement.pause();
      this.bgMusicPlaying = false;
    } else {
      this.audioElement.muted = false;
      this.audioElement.volume = this.volume;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.bgMusicPlaying = true;
        }).catch(err => {
          console.warn('Error unmuting audio:', err);
        });
      }
    }

    return this.muted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audioElement.volume = this.volume;
    if (this.finaleAudioElement) this.finaleAudioElement.volume = this.volume;
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

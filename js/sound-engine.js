/* ==========================================================================
   WEB AUDIO API SYNTHESIZER & 5-SONG PLAYLIST MUSIC MANAGER
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
    this.volume = 0.5;
    this.bgMusicPlaying = false;

    // 5-Song Playlist setup
    this.playlist = [];
    this.currentTrackIndex = 0;
    this.audioElement = new Audio();
    this.audioElement.volume = this.volume;

    // Auto-advance playlist when current song ends
    this.audioElement.addEventListener('ended', () => {
      this.playNextTrack();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio playlist track error, trying next track or synth fallback...', e);
      this.playNextTrack();
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

  setPlaylist(songsArray) {
    if (Array.isArray(songsArray) && songsArray.length > 0) {
      this.playlist = songsArray;
    }
  }

  getCurrentTrack() {
    if (!this.playlist || this.playlist.length === 0) return null;
    return this.playlist[this.currentTrackIndex];
  }

  toggleAmbientBgMusic() {
    this.init();

    if (this.bgMusicPlaying) {
      this.pauseBgMusic();
      return false;
    } else {
      return this.playBgMusic();
    }
  }

  playBgMusic() {
    if (this.playlist && this.playlist.length > 0) {
      const track = this.getCurrentTrack();
      if (track && track.url) {
        this.audioElement.src = track.url;
        this.audioElement.volume = this.volume;
        this.audioElement.loop = (this.playlist.length === 1);
        this.audioElement.play().then(() => {
          this.bgMusicPlaying = true;
          this.showTrackToast(track.title);
        }).catch(err => {
          console.warn('HTML5 Audio autoplay restricted. Falling back to Web Audio synth.', err);
          this.playSynthBgMusic();
        });
        return true;
      }
    }

    // Fallback Web Audio Synth
    return this.playSynthBgMusic();
  }

  playNextTrack() {
    if (!this.playlist || this.playlist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    if (this.bgMusicPlaying) {
      this.playBgMusic();
    }
  }

  playPreviousTrack() {
    if (!this.playlist || this.playlist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    if (this.bgMusicPlaying) {
      this.playBgMusic();
    }
  }

  pauseBgMusic() {
    this.bgMusicPlaying = false;
    this.audioElement.pause();
    if (this.bgMusicTimer) clearInterval(this.bgMusicTimer);
  }

  showTrackToast(title) {
    const existing = document.getElementById('music-track-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'music-track-toast';
    toast.className = 'glass-card text-center p-2 position-fixed shadow-lg';
    toast.style.top = '70px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.borderRadius = '30px';
    toast.style.fontSize = '0.9rem';
    toast.innerHTML = `<span class="text-accent fw-bold"><i class="fa-solid fa-music me-1"></i> Now Playing:</span> ${title || 'Romantic Melody'}`;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3500);
  }

  // Synthesized chord loop fallback
  playSynthBgMusic() {
    if (!this.audioCtx) return false;
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

  // Sound FX Synthesizers
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

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audioElement.volume = this.volume;
  }

  toggleMute() {
    this.muted = !this.muted;
    this.audioElement.muted = this.muted;
    return this.muted;
  }
}

window.soundEngine = new SoundEngine();

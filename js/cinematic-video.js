/* ==========================================================================
   1–2 MINUTE CINEMATIC AI ROMANTIC VIDEO ENGINE
   ========================================================================== */

class CinematicVideoEngine {
  constructor() {
    this.canvas = document.getElementById('cinematic-video-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 90; // 1:30 total duration
    this.animFrameId = null;
    this.lastTimestamp = 0;

    // Audio Soundtrack
    this.audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-romantic-sunset-594.mp3');
    this.audio.loop = true;

    // Scene & Story Text Schedule
    this.storyTimeline = [
      { start: 0,  end: 12, scene: 'sunrise',        badge: '🌅 Sunrise',         text: 'Every story begins with a hello...' },
      { start: 12, end: 25, scene: 'sunrise',        badge: '🌅 Sunrise',         text: 'Ours became my favorite.' },
      { start: 25, end: 38, scene: 'blossoms',       badge: '🌸 Cherry Blossoms', text: 'Every smile...' },
      { start: 38, end: 50, scene: 'blossoms',       badge: '🌸 Cherry Blossoms', text: 'Every laugh...' },
      { start: 50, end: 63, scene: 'beach',          badge: '🌊 Beach Sunset',    text: 'Every memory...' },
      { start: 63, end: 75, scene: 'night',          badge: '✨ Night Sky',       text: 'Led me to you.' },
      { start: 75, end: 90, scene: 'hearts',         badge: '💖 Floating Hearts', text: 'Thank you for being part of my life. ❤️' }
    ];

    // Particle Systems for Scenes
    this.petals = [];
    this.stars = [];
    this.hearts = [];
    this.meteors = [];

    this.initSceneParticles();
    this.initControls();
    this.renderInitialFrame();
  }

  initSceneParticles() {
    if (!this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Blossoms
    this.petals = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 6 + 4,
      d: Math.random() * 2 + 1,
      tilt: Math.random() * 10 - 5
    }));

    // Stars
    this.stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * (h * 0.7),
      r: Math.random() * 2 + 1,
      alpha: Math.random()
    }));

    // Hearts
    this.hearts = Array.from({ length: 25 }, () => ({
      x: Math.random() * w,
      y: h + Math.random() * 50,
      size: Math.random() * 16 + 12,
      speedY: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.7 + 0.3
    }));
  }

  initControls() {
    const btnBigPlay = document.getElementById('btn-play-cinematic-video');
    const btnPlayPause = document.getElementById('btn-cinematic-play-pause');
    const progressContainer = document.getElementById('cinematic-progress-container');

    if (btnBigPlay) {
      btnBigPlay.addEventListener('click', () => this.togglePlay());
    }
    if (btnPlayPause) {
      btnPlayPause.addEventListener('click', () => this.togglePlay());
    }
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.currentTime = pos * this.duration;
        this.updateUI();
        if (this.isPlaying) this.audio.currentTime = this.currentTime % this.audio.duration;
      });
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    const btnBigPlay = document.getElementById('btn-play-cinematic-video');
    const btnPlayPause = document.getElementById('btn-cinematic-play-pause');

    if (btnBigPlay) btnBigPlay.classList.add('d-none');
    if (btnPlayPause) btnPlayPause.innerHTML = '<i class="fa-solid fa-pause fs-5"></i>';

    if (window.soundEngine && window.soundEngine.bgMusicPlaying) {
      window.soundEngine.pauseBgMusic();
    }

    this.audio.currentTime = this.currentTime % (this.audio.duration || 90);
    this.audio.play().catch(() => {});

    this.lastTimestamp = performance.now();
    this.tick(performance.now());
  }

  pause() {
    this.isPlaying = false;
    const btnBigPlay = document.getElementById('btn-play-cinematic-video');
    const btnPlayPause = document.getElementById('btn-cinematic-play-pause');

    if (btnBigPlay) btnBigPlay.classList.remove('d-none');
    if (btnPlayPause) btnPlayPause.innerHTML = '<i class="fa-solid fa-play fs-5"></i>';

    this.audio.pause();
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }

  tick(timestamp) {
    if (!this.isPlaying) return;

    const delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    this.currentTime += delta;
    if (this.currentTime >= this.duration) {
      this.currentTime = this.duration;
      this.updateUI();
      this.pause();
      this.currentTime = 0;
      return;
    }

    this.renderCurrentScene();
    this.updateUI();

    this.animFrameId = requestAnimationFrame((t) => this.tick(t));
  }

  getCurrentState() {
    const item = this.storyTimeline.find(t => this.currentTime >= t.start && this.currentTime < t.end);
    return item || this.storyTimeline[this.storyTimeline.length - 1];
  }

  updateUI() {
    const state = this.getCurrentState();
    const sceneBadge = document.getElementById('cinematic-scene-badge');
    const textDisplay = document.getElementById('cinematic-text-display');
    const progressBar = document.getElementById('cinematic-progress-bar');
    const timeDisplay = document.getElementById('cinematic-time-display');

    if (sceneBadge) sceneBadge.innerText = state.badge;
    if (textDisplay) textDisplay.innerText = state.text;

    const pct = (this.currentTime / this.duration) * 100;
    if (progressBar) progressBar.style.width = `${pct}%`;

    if (timeDisplay) {
      const curM = Math.floor(this.currentTime / 60);
      const curS = Math.floor(this.currentTime % 60);
      const durM = Math.floor(this.duration / 60);
      const durS = Math.floor(this.duration % 60);
      timeDisplay.innerText = `${curM}:${curS < 10 ? '0' + curS : curS} / ${durM}:${durS < 10 ? '0' + durS : durS}`;
    }
  }

  renderInitialFrame() {
    this.currentTime = 0;
    this.renderCurrentScene();
    this.updateUI();
  }

  renderCurrentScene() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const state = this.getCurrentState();

    this.ctx.clearRect(0, 0, w, h);

    switch (state.scene) {
      case 'sunrise':
        this.drawSunriseScene(w, h);
        break;
      case 'blossoms':
        this.drawBlossomsScene(w, h);
        break;
      case 'beach':
        this.drawBeachScene(w, h);
        break;
      case 'night':
        this.drawNightScene(w, h);
        break;
      case 'hearts':
        this.drawHeartsScene(w, h);
        break;
      default:
        this.drawSunriseScene(w, h);
    }
  }

  // 1. Sunrise Scene 🌅
  drawSunriseScene(w, h) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#ff7e5f');
    grad.addColorStop(0.5, '#feb47b');
    grad.addColorStop(1, '#ffeccc');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Sun Disc
    const sunGrad = this.ctx.createRadialGradient(w / 2, h * 0.6, 10, w / 2, h * 0.6, 120);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    sunGrad.addColorStop(0.4, 'rgba(255, 200, 100, 0.6)');
    sunGrad.addColorStop(1, 'rgba(255, 126, 95, 0)');
    this.ctx.fillStyle = sunGrad;
    this.ctx.beginPath();
    this.ctx.arc(w / 2, h * 0.6, 120, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 2. Cherry Blossoms Scene 🌸
  drawBlossomsScene(w, h) {
    const grad = this.ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#ffafbd');
    grad.addColorStop(1, '#ffc3a0');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Drifting Petals
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.petals.forEach(p => {
      p.y += p.d * 0.5;
      p.x += Math.sin(p.y * 0.02) * 0.8;
      if (p.y > h) p.y = -10;

      this.ctx.beginPath();
      this.ctx.ellipse(p.x, p.y, p.r, p.r * 1.5, p.tilt, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  // 3. Beach Sunset Scene 🌊
  drawBeachScene(w, h) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#2b5876');
    grad.addColorStop(0.5, '#4e4376');
    grad.addColorStop(0.8, '#f857a6');
    grad.addColorStop(1, '#ff7e5f');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Rolling Waves
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, h * 0.7);
    for (let x = 0; x <= w; x += 20) {
      this.ctx.lineTo(x, h * 0.7 + Math.sin(x * 0.02 + this.currentTime * 2) * 8);
    }
    this.ctx.lineTo(w, h);
    this.ctx.lineTo(0, h);
    this.ctx.fill();
  }

  // 4. Night Sky Scene ✨
  drawNightScene(w, h) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0f2027');
    grad.addColorStop(0.5, '#203a43');
    grad.addColorStop(1, '#2c5364');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Stars
    this.stars.forEach(s => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(this.currentTime * 3 + s.x) * 0.4 + 0.6})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  // 5. Floating Hearts Scene 💖
  drawHeartsScene(w, h) {
    const grad = this.ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#4a00e0');
    grad.addColorStop(0.5, '#8e2de2');
    grad.addColorStop(1, '#ff4081');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Floating Hearts
    this.hearts.forEach(ht => {
      ht.y -= ht.speedY;
      if (ht.y < -20) ht.y = h + 20;

      this.ctx.fillStyle = `rgba(255, 255, 255, ${ht.alpha})`;
      this.ctx.font = `${ht.size}px sans-serif`;
      this.ctx.fillText('❤️', ht.x, ht.y);
    });
  }
}

window.cinematicVideoEngine = new CinematicVideoEngine();

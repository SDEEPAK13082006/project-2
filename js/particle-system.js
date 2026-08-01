/* ==========================================================================
   PARTICLE & CANVAS ANIMATION SYSTEM
   ========================================================================== */

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 35;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.initFloatingHearts();
    this.animate();
    this.initCursorSparkles();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initFloatingHearts() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createHeartParticle());
    }
  }

  createHeartParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + Math.random() * 100,
      size: Math.random() * 16 + 10,
      speedY: Math.random() * 1.5 + 0.5,
      speedX: Math.random() * 1 - 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 1 - 0.5,
      color: `hsl(${Math.random() * 40 + 330}, 85%, ${Math.random() * 20 + 65}%)`
    };
  }

  drawHeart(x, y, size, color, opacity, rotation) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate((rotation * Math.PI) / 180);
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;

    this.ctx.beginPath();
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(0, topCurveHeight);
    // Left curve
    this.ctx.bezierCurveTo(
      0, 0,
      -size / 2, 0,
      -size / 2, topCurveHeight
    );
    this.ctx.bezierCurveTo(
      -size / 2, (size + topCurveHeight) / 2,
      0, size,
      0, size
    );
    // Right curve
    this.ctx.bezierCurveTo(
      0, size,
      size / 2, (size + topCurveHeight) / 2,
      size / 2, topCurveHeight
    );
    this.ctx.bezierCurveTo(
      size / 2, 0,
      0, 0,
      0, topCurveHeight
    );
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, idx) => {
      p.y -= p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.5;
      p.rotation += p.rotationSpeed;

      if (p.y < -30) {
        this.particles[idx] = this.createHeartParticle();
      }

      this.drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
    });

    requestAnimationFrame(() => this.animate());
  }

  // Trigger burst of confetti & hearts on correct answer or quiz complete
  triggerConfettiBurst(count = 40) {
    const colors = ['#ff4081', '#ff80ab', '#e8c5c8', '#d4af37', '#e6e6fa', '#ff4d8d'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.innerText = Math.random() > 0.4 ? '❤️' : '✨';
      el.style.fontSize = `${Math.random() * 12 + 14}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 300 + 100;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 100;
      const rot = Math.random() * 720 - 360;

      el.style.setProperty('--tx', `${tx}px`);
      el.style.setProperty('--ty', `${ty}px`);
      el.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(el);

      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 1200);
    }
  }

  // Interactive mouse sparkles
  initCursorSparkles() {
    let lastTime = 0;
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime < 100) return; // Throttle
      lastTime = now;

      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      sparkle.innerText = Math.random() > 0.5 ? '✨' : '💖';
      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;
      document.body.appendChild(sparkle);

      setTimeout(() => {
        if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
      }, 800);
    });
  }

  // Easter Egg Rainbow Storm
  triggerRainbowStorm() {
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        this.triggerConfettiBurst(5);
      }, i * 50);
    }
  }
}

window.particleSystem = new ParticleSystem();

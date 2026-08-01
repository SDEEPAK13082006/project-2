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
    this.finaleActive = false;
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
    this.ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
    this.ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
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

  // Confetti Burst
  triggerConfettiBurst(count = 40) {
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

  initCursorSparkles() {
    let lastTime = 0;
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime < 100) return;
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

  triggerRainbowStorm() {
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        this.triggerConfettiBurst(5);
      }, i * 50);
    }
  }

  // Grand Finale Fireworks System
  startFinaleFireworks() {
    const fCanvas = document.getElementById('finale-fireworks-canvas');
    if (!fCanvas) return;
    const fCtx = fCanvas.getContext('2d');
    fCanvas.width = window.innerWidth;
    fCanvas.height = window.innerHeight;

    let fireworks = [];
    let particles = [];
    this.finaleActive = true;

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    class Firework {
      constructor() {
        this.x = random(100, fCanvas.width - 100);
        this.y = fCanvas.height;
        this.ty = random(50, fCanvas.height / 2);
        this.speed = random(5, 8);
        this.hue = random(320, 360);
      }
      update(index) {
        this.y -= this.speed;
        if (this.y <= this.ty) {
          createParticles(this.x, this.ty, this.hue);
          fireworks.splice(index, 1);
        }
      }
      draw() {
        fCtx.beginPath();
        fCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        fCtx.fillStyle = `hsl(${this.hue}, 100%, 75%)`;
        fCtx.fill();
      }
    }

    class Particle {
      constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 7);
        this.friction = 0.95;
        this.gravity = 0.4;
        this.hue = hue || random(320, 360);
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
      }
      update(index) {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
        if (this.alpha <= this.decay) {
          particles.splice(index, 1);
        }
      }
      draw() {
        fCtx.save();
        fCtx.globalAlpha = this.alpha;
        fCtx.fillStyle = `hsl(${this.hue}, 100%, 75%)`;
        fCtx.font = '14px sans-serif';
        fCtx.fillText('❤️', this.x, this.y);
        fCtx.restore();
      }
    }

    function createParticles(x, y, hue) {
      for (let i = 0; i < 25; i++) {
        particles.push(new Particle(x, y, hue));
      }
    }

    const self = this;
    let timer = 0;

    function loop() {
      if (!self.finaleActive) return;
      requestAnimationFrame(loop);
      fCtx.globalCompositeOperation = 'destination-out';
      fCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      fCtx.fillRect(0, 0, fCanvas.width, fCanvas.height);
      fCtx.globalCompositeOperation = 'lighter';

      timer++;
      if (timer % 20 === 0) {
        fireworks.push(new Firework());
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].draw();
        particles[i].update(i);
      }
    }

    loop();
  }

  stopFinaleFireworks() {
    this.finaleActive = false;
  }
}

window.particleSystem = new ParticleSystem();

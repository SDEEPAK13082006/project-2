/* ==========================================================================
   ROMANTIC MINI-GAMES ARCADE ENGINE 🎮❤️
   - Game 1: Catch the Hearts ❤️
   - Game 2: Find the Hidden Heart 🔍
   - Game 3: Love Puzzle 🧩
   - Game 4: Pop the Balloons 🎈
   ========================================================================== */

class MiniGamesManager {
  constructor() {
    this.activeGame = null;
  }

  // --------------------------------------------------------------------------
  // GAME 1: CATCH THE HEARTS ❤️
  // --------------------------------------------------------------------------
  initCatchTheHearts() {
    this.activeGame = 'catch';
    const canvas = document.getElementById('catch-hearts-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const container = canvas.parentElement;
    canvas.width = Math.min(window.innerWidth - 32, container.clientWidth || 600);
    canvas.height = 380;

    let score = 0;
    let timeLeft = 30;
    let gameLoopId = null;
    let timerId = null;
    let isRunning = true;

    // Responsive basket properties
    const basket = {
      w: Math.min(80, canvas.width * 0.22),
      h: 26,
      x: canvas.width / 2 - 40,
      y: canvas.height - 35,
      speed: 8
    };

    // Hearts falling list
    let fallingHearts = [];

    function spawnHeart() {
      fallingHearts.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -20,
        size: Math.random() * 12 + 16,
        speedY: Math.random() * 2 + 2,
        color: `hsl(${Math.random() * 40 + 330}, 90%, 65%)`
      });
    }

    // Mouse / Touch Controls
    function handleMove(clientX) {
      const rect = canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      basket.x = Math.max(0, Math.min(canvas.width - basket.w, relativeX - basket.w / 2));
    }

    canvas.addEventListener('mousemove', (e) => handleMove(e.clientX));
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    });

    // Keyboard Controls
    const keys = {};
    window.addEventListener('keydown', (e) => { keys[e.key] = true; });
    window.addEventListener('keyup', (e) => { keys[e.key] = false; });

    // Spawn heart interval
    const spawnInterval = setInterval(() => {
      if (isRunning && Math.random() > 0.3) spawnHeart();
    }, 600);

    // Countdown Timer
    const scoreDisplay = document.getElementById('catch-score-display');
    const timerDisplay = document.getElementById('catch-timer-display');

    if (scoreDisplay) scoreDisplay.innerText = score;
    if (timerDisplay) timerDisplay.innerText = timeLeft;

    timerId = setInterval(() => {
      if (!isRunning) return;
      timeLeft--;
      if (timerDisplay) timerDisplay.innerText = timeLeft;

      if (timeLeft <= 0) {
        endCatchGame();
      }
    }, 1000);

    function endCatchGame() {
      isRunning = false;
      clearInterval(spawnInterval);
      clearInterval(timerId);
      cancelAnimationFrame(gameLoopId);

      if (window.soundEngine) window.soundEngine.playCorrectSound();
      if (window.particleSystem) window.particleSystem.triggerConfettiBurst(40);

      alert(`🎉 TIME'S UP! 🎉\nYou caught ${score} hearts! You have a truly quick and loving heart! ❤️`);
    }

    // Main Game Loop
    function gameLoop() {
      if (!isRunning) return;

      // Handle keyboard basket movement
      if (keys['ArrowLeft'] || keys['a']) basket.x = Math.max(0, basket.x - basket.speed);
      if (keys['ArrowRight'] || keys['d']) basket.x = Math.min(canvas.width - basket.w, basket.x + basket.speed);

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Basket
      ctx.fillStyle = '#ff4081';
      ctx.beginPath();
      ctx.roundRect(basket.x, basket.y, basket.w, basket.h, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧺 LOVE', basket.x + basket.w / 2, basket.y + 16);

      // Update & Draw Falling Hearts
      for (let i = fallingHearts.length - 1; i >= 0; i--) {
        const h = fallingHearts[i];
        h.y += h.speedY;

        // Draw Heart
        ctx.fillStyle = h.color;
        ctx.font = `${h.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('❤️', h.x, h.y);

        // Catch Collision Detection
        if (
          h.y >= basket.y - 10 &&
          h.y <= basket.y + basket.h &&
          h.x >= basket.x &&
          h.x <= basket.x + basket.w
        ) {
          // Heart Caught!
          score += 10;
          if (scoreDisplay) scoreDisplay.innerText = score;
          if (window.soundEngine) window.soundEngine.playClickSound();
          fallingHearts.splice(i, 1);
          continue;
        }

        // Missed Heart
        if (h.y > canvas.height + 20) {
          fallingHearts.splice(i, 1);
        }
      }

      gameLoopId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    // Attach cleanup
    this.cleanupCatchGame = () => {
      isRunning = false;
      clearInterval(spawnInterval);
      clearInterval(timerId);
      cancelAnimationFrame(gameLoopId);
    };
  }

  // --------------------------------------------------------------------------
  // GAME 2: FIND THE HIDDEN HEART 🔍
  // --------------------------------------------------------------------------
  initFindHiddenHeart() {
    this.activeGame = 'find';
    const gridContainer = document.getElementById('find-heart-grid');
    const scoreDisplay = document.getElementById('find-score-display');
    const attemptsDisplay = document.getElementById('find-attempts-display');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    let attempts = 0;
    let foundCount = 0;
    const totalHearts = 3;
    const totalCards = 12;

    // Pick 3 secret indices for golden hearts
    const secretIndices = new Set();
    while (secretIndices.size < totalHearts) {
      secretIndices.add(Math.floor(Math.random() * totalCards));
    }

    const cuteNotes = [
      "Sweet smile! 😊", "hug coupon 🫂", "So close! 💕",
      "You're cute! 🥰", "Almost there! ✨", "Kiss coupon 💋",
      "Forever yours! ❤️", "Lucky guess! 🌟", "Keep looking! 💖"
    ];

    if (scoreDisplay) scoreDisplay.innerText = `0 / ${totalHearts}`;
    if (attemptsDisplay) attemptsDisplay.innerText = attempts;

    for (let i = 0; i < totalCards; i++) {
      const card = document.createElement('div');
      card.className = 'find-card glass-card p-3 text-center cursor-pointer';
      card.style.height = '110px';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'center';
      card.style.fontSize = '2.2rem';
      card.style.transition = 'transform 0.4s ease, background 0.4s ease';

      card.innerHTML = `<span class="card-icon">🎁</span>`;
      card.dataset.index = i;

      card.addEventListener('click', () => {
        if (card.classList.contains('flipped')) return;
        card.classList.add('flipped');
        attempts++;
        if (attemptsDisplay) attemptsDisplay.innerText = attempts;

        if (secretIndices.has(i)) {
          // Found a Golden Heart!
          card.innerHTML = `❤️`;
          card.style.background = 'rgba(255, 64, 129, 0.4)';
          card.style.borderColor = '#ff4081';
          foundCount++;
          if (scoreDisplay) scoreDisplay.innerText = `${foundCount} / ${totalHearts}`;
          if (window.soundEngine) window.soundEngine.playCorrectSound();
          if (window.particleSystem) window.particleSystem.triggerConfettiBurst(25);

          if (foundCount >= totalHearts) {
            setTimeout(() => {
              alert(`🎉 CONGRATULATIONS! 🎉\nYou found all hidden hearts in ${attempts} attempts! You know where my heart belongs! ❤️`);
            }, 300);
          }
        } else {
          // Missed note
          const note = cuteNotes[i % cuteNotes.length];
          card.innerHTML = `<span style="font-size: 1rem; color: var(--text-muted);">${note}</span>`;
          card.style.background = 'rgba(255, 255, 255, 0.3)';
          if (window.soundEngine) window.soundEngine.playIncorrectSound();
        }
      });

      gridContainer.appendChild(card);
    }
  }

  // --------------------------------------------------------------------------
  // GAME 3: LOVE PUZZLE 🧩
  // --------------------------------------------------------------------------
  initLovePuzzle() {
    this.activeGame = 'puzzle';
    const grid = document.getElementById('puzzle-grid');
    const movesDisplay = document.getElementById('puzzle-moves-display');
    if (!grid) return;

    grid.innerHTML = '';
    let moves = 0;
    if (movesDisplay) movesDisplay.innerText = moves;

    // 3x3 Puzzle State (numbers 0..8, where 8 is blank)
    let tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // Shuffle tiles (ensure solvable state)
    function shuffleTiles() {
      for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }
    }

    shuffleTiles();

    const sampleImg = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';

    function renderPuzzle() {
      grid.innerHTML = '';
      tiles.forEach((tileVal, idx) => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.dataset.idx = idx;

        if (tileVal === 8) {
          tile.classList.add('blank-tile');
          tile.style.background = 'rgba(255, 255, 255, 0.15)';
          tile.style.border = '2px dashed rgba(255, 64, 129, 0.4)';
        } else {
          const row = Math.floor(tileVal / 3);
          const col = tileVal % 3;
          tile.style.backgroundImage = `url(${sampleImg})`;
          tile.style.backgroundSize = '300px 300px';
          tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
          tile.style.borderRadius = '12px';
          tile.style.cursor = 'pointer';
          tile.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        }

        tile.addEventListener('click', () => handleTileClick(idx));
        grid.appendChild(tile);
      });
    }

    function handleTileClick(clickedIdx) {
      const blankIdx = tiles.indexOf(8);
      const isAdjacent = (
        (Math.abs(clickedIdx - blankIdx) === 1 && Math.floor(clickedIdx / 3) === Math.floor(blankIdx / 3)) ||
        Math.abs(clickedIdx - blankIdx) === 3
      );

      if (isAdjacent) {
        [tiles[clickedIdx], tiles[blankIdx]] = [tiles[blankIdx], tiles[clickedIdx]];
        moves++;
        if (movesDisplay) movesDisplay.innerText = moves;
        if (window.soundEngine) window.soundEngine.playClickSound();
        renderPuzzle();
        checkPuzzleSolved();
      }
    }

    function checkPuzzleSolved() {
      const isSolved = tiles.every((val, idx) => val === idx);
      if (isSolved) {
        if (window.soundEngine) window.soundEngine.playCorrectSound();
        if (window.particleSystem) window.particleSystem.triggerConfettiBurst(50);
        setTimeout(() => {
          alert(`🧩 PUZZLE SOLVED! 🧩\nYou completed our Love Puzzle in ${moves} moves! Perfectly put together! ❤️`);
        }, 300);
      }
    }

    renderPuzzle();
  }

  // --------------------------------------------------------------------------
  // GAME 4: POP THE BALLOONS 🎈
  // --------------------------------------------------------------------------
  initPopTheBalloons() {
    this.activeGame = 'balloons';
    const arena = document.getElementById('balloons-arena');
    const scoreDisplay = document.getElementById('balloons-score-display');
    const timerDisplay = document.getElementById('balloons-timer-display');
    if (!arena) return;

    arena.innerHTML = '';
    let score = 0;
    let timeLeft = 25;
    let isRunning = true;

    if (scoreDisplay) scoreDisplay.innerText = score;
    if (timerDisplay) timerDisplay.innerText = timeLeft;

    const balloonColors = ['#ff4081', '#ff80ab', '#e8c5c8', '#d81b60', '#ab47bc', '#ff1744'];
    const quotes = ["I Love You! ❤️", "+10 🎈", "Sweetheart! 💕", "Cutie! 🥰", "Forever! ✨", "My World! 💖"];

    function spawnBalloon() {
      if (!isRunning) return;
      const balloon = document.createElement('div');
      balloon.className = 'heart-balloon';
      
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const leftPos = Math.random() * (arena.clientWidth - 70);
      const duration = Math.random() * 3 + 4; // 4s to 7s

      balloon.style.left = `${leftPos}px`;
      balloon.style.animationDuration = `${duration}s`;
      balloon.style.background = color;

      balloon.innerHTML = `❤️`;

      balloon.addEventListener('click', (e) => {
        if (!isRunning) return;
        score += 10;
        if (scoreDisplay) scoreDisplay.innerText = score;
        if (window.soundEngine) window.soundEngine.playHeartPopSound();

        // Spawn floating text
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        const floatText = document.createElement('div');
        floatText.className = 'pop-float-text';
        floatText.innerText = quote;
        floatText.style.left = `${e.clientX}px`;
        floatText.style.top = `${e.clientY}px`;
        document.body.appendChild(floatText);

        setTimeout(() => {
          if (floatText.parentNode) floatText.parentNode.removeChild(floatText);
        }, 800);

        if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
      });

      arena.appendChild(balloon);

      // Remove after floating off screen
      setTimeout(() => {
        if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
      }, duration * 1000);
    }

    const spawnTimer = setInterval(() => {
      if (isRunning) spawnBalloon();
    }, 700);

    const countTimer = setInterval(() => {
      if (!isRunning) return;
      timeLeft--;
      if (timerDisplay) timerDisplay.innerText = timeLeft;

      if (timeLeft <= 0) {
        isRunning = false;
        clearInterval(spawnTimer);
        clearInterval(countTimer);
        if (window.soundEngine) window.soundEngine.playCorrectSound();
        if (window.particleSystem) window.particleSystem.triggerConfettiBurst(40);
        alert(`🎈 POPPING CHAMPION! 🎈\nYou popped ${score / 10} balloons and earned ${score} points! So much fun with you! ❤️`);
      }
    }, 1000);

    this.cleanupBalloonsGame = () => {
      isRunning = false;
      clearInterval(spawnTimer);
      clearInterval(countTimer);
    };
  }

  stopAllGames() {
    if (this.cleanupCatchGame) this.cleanupCatchGame();
    if (this.cleanupBalloonsGame) this.cleanupBalloonsGame();
    this.activeGame = null;
  }
}

window.miniGamesManager = new MiniGamesManager();

/* ==========================================================================
   OUR LOVE QUIZ ❤️ - MAIN APPLICATION ENGINE & BACKEND INTEGRATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load Data & Saved State
  const data = await window.dataLoader.loadData();
  const savedState = window.dataLoader.getSavedState();

  // Set 5-song playlist in Sound Engine
  if (data.musicPlaylist && window.soundEngine) {
    window.soundEngine.setPlaylist(data.musicPlaylist);
  }

  // Parse URL Parameters (for received share links: ?to=Sweetheart&from=YourLove&video=...)
  const urlParams = new URLSearchParams(window.location.search);
  const paramTo = urlParams.get('to');
  const paramFrom = urlParams.get('from');
  const paramVideo = urlParams.get('video');

  if (paramTo) {
    data.config.partnerNickname = paramTo;
  }
  if (paramFrom && data.loveLetter) {
    data.loveLetter.signature = `Forever Yours,\n${paramFrom} ❤️`;
  }
  if (paramVideo && data.videoMessage) {
    data.videoMessage.videoUrl = paramVideo;
  }

  // Initialize Quiz Engine
  window.quizEngine.init(data, savedState);

  // App State Variables
  let partnerNickname = data.config.partnerNickname || "My Sweetheart";
  let senderName = paramFrom || "Your Devoted Love";
  let easterEggClicks = 0;
  let currentTheme = (savedState && savedState.theme) ? savedState.theme : 'day';
  
  // DOM Element References
  const views = {
    hero: document.getElementById('view-hero'),
    quiz: document.getElementById('view-quiz'),
    results: document.getElementById('view-results'),
    story: document.getElementById('view-story'),
    games: document.getElementById('view-games')
  };

  const nicknameInput = document.getElementById('input-partner-nickname');
  const heroNicknameDisplay = document.getElementById('hero-nickname-display');
  const navBrandLogo = document.getElementById('nav-brand-logo');
  
  // Top Nav Buttons
  const btnToggleTheme = document.getElementById('btn-toggle-theme');
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const btnRestartQuiz = document.getElementById('btn-restart-quiz');
  const btnNavGames = document.getElementById('btn-nav-games');
  const btnOpenShareModal = document.getElementById('btn-open-share-modal');
  const btnOpenSubmissionsModal = document.getElementById('btn-open-submissions-modal');

  // Hero Controls
  const btnStartJourney = document.getElementById('btn-start-journey');
  const btnHeroGames = document.getElementById('btn-hero-games');
  const heroHeartMascot = document.getElementById('hero-heart-mascot');

  // Quiz Controls & Elements
  const quizCounter = document.getElementById('quiz-question-counter');
  const quizTimerBadge = document.getElementById('quiz-timer-badge');
  const timerSeconds = document.getElementById('timer-seconds');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizExplanationBox = document.getElementById('quiz-explanation-box');
  const explanationHeader = document.getElementById('explanation-header');
  const explanationText = document.getElementById('explanation-text');
  const quizQuoteInterstitial = document.getElementById('quiz-quote-interstitial');
  const quoteText = document.getElementById('quote-text');
  const quizNextContainer = document.getElementById('quiz-next-container');
  const btnNextQuestion = document.getElementById('btn-next-question');

  // Results Elements
  const resultScoreNum = document.getElementById('result-score-num');
  const resultProgressCircle = document.getElementById('score-progress-circle');
  const resultTierMessage = document.getElementById('result-tier-message');
  const backendStatusBadge = document.getElementById('backend-status-badge');
  const btnDownloadCert = document.getElementById('btn-download-certificate');
  const btnOpenLoveStory = document.getElementById('btn-open-love-story');

  // Story Elements
  const letterBody = document.getElementById('letter-body');
  const galleryGrid = document.getElementById('gallery-grid');
  const timelineContainer = document.getElementById('timeline-container');
  const btnOpenMyHeart = document.getElementById('btn-open-my-heart');
  const secretMessageText = document.getElementById('secret-message-text');

  // Share Modal Elements
  const shareInputTo = document.getElementById('share-input-to');
  const shareInputFrom = document.getElementById('share-input-from');
  const shareInputVideo = document.getElementById('share-input-video');
  const generatedShareUrl = document.getElementById('generated-share-url');
  const btnCopyShareUrl = document.getElementById('btn-copy-share-url');
  const btnWhatsappShare = document.getElementById('btn-whatsapp-share');
  const btnTelegramShare = document.getElementById('btn-telegram-share');

  // Submissions Modal Container
  const submissionsListContainer = document.getElementById('submissions-list-container');

  // Games Hub References
  const gamesHubSelector = document.getElementById('games-hub-selector');
  const gameArenaCatch = document.getElementById('game-arena-catch');
  const gameArenaFind = document.getElementById('game-arena-find');
  const gameArenaPuzzle = document.getElementById('game-arena-puzzle');
  const gameArenaBalloons = document.getElementById('game-arena-balloons');

  // --------------------------------------------------------------------------
  // 2. THEME & INITIALIZATION
  // --------------------------------------------------------------------------
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    btnToggleTheme.innerHTML = theme === 'night' 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';
    window.dataLoader.saveState({ theme });
  }
  applyTheme(currentTheme);

  if (paramTo) {
    partnerNickname = paramTo;
  } else if (savedState && savedState.partnerNickname) {
    partnerNickname = savedState.partnerNickname;
  }

  if (nicknameInput) {
    nicknameInput.value = partnerNickname;
  }
  updateNicknameDisplays();

  function updateNicknameDisplays() {
    partnerNickname = nicknameInput ? (nicknameInput.value.trim() || "My Sweetheart") : "My Sweetheart";
    if (heroNicknameDisplay) heroNicknameDisplay.innerText = partnerNickname;
    document.querySelectorAll('.partner-name-tag').forEach(el => {
      el.innerText = partnerNickname;
    });
    window.dataLoader.saveState({ partnerNickname });
    updateShareUrlPreview();
  }

  if (nicknameInput) {
    nicknameInput.addEventListener('input', updateNicknameDisplays);
  }

  // --------------------------------------------------------------------------
  // 3. NAVIGATION VIEW SWITCHER
  // --------------------------------------------------------------------------
  function showView(viewId) {
    // Stop active mini-games when leaving games view
    if (viewId !== 'view-games' && window.miniGamesManager) {
      window.miniGamesManager.stopAllGames();
    }

    Object.keys(views).forEach(key => {
      if (views[key]) {
        if (key === viewId.replace('view-', '')) {
          views[key].classList.remove('hidden-view');
        } else {
          views[key].classList.add('hidden-view');
        }
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (navBrandLogo) {
    navBrandLogo.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      showView('view-hero');
    });
  }

  // --------------------------------------------------------------------------
  // 4. HERO SECTION LOGIC & EASTER EGGS
  // --------------------------------------------------------------------------
  btnStartJourney.addEventListener('click', () => {
    window.soundEngine.playClickSound();
    showView('view-quiz');
    loadQuestionView();
  });

  if (btnHeroGames) {
    btnHeroGames.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      showView('view-games');
      openGamesHub();
    });
  }

  if (btnNavGames) {
    btnNavGames.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      showView('view-games');
      openGamesHub();
    });
  }

  // Mascot Easter Egg (Click 5 times)
  heroHeartMascot.addEventListener('click', () => {
    easterEggClicks++;
    window.soundEngine.playHeartPopSound();

    if (easterEggClicks >= 5) {
      window.particleSystem.triggerRainbowStorm();
      alert(`💖 SECRET UNLOCKED! 💖\n"You are the most precious person in the world to me, ${partnerNickname}!" ✨`);
      easterEggClicks = 0;
    }
  });

  // --------------------------------------------------------------------------
  // 5. QUIZ ENGINE VIEW & LOGIC
  // --------------------------------------------------------------------------
  function loadQuestionView() {
    const q = window.quizEngine.getCurrentQuestion();
    const total = window.quizEngine.getTotalQuestions();
    const currentIdx = window.quizEngine.currentIndex;

    if (!q) {
      renderResultsView();
      return;
    }

    quizExplanationBox.classList.add('d-none');
    quizQuoteInterstitial.classList.add('d-none');
    quizNextContainer.classList.add('d-none');
    quizOptionsContainer.innerHTML = '';

    quizCounter.innerText = `Question ${currentIdx + 1} of ${total}`;
    const progressPct = ((currentIdx) / total) * 100;
    quizProgressBar.style.width = `${progressPct}%`;

    quizQuestionText.innerText = q.question;

    q.options.forEach((optText, idx) => {
      const optBtn = document.createElement('div');
      optBtn.className = 'option-card';
      optBtn.innerHTML = `
        <span>${optText}</span>
        <i class="fa-regular fa-circle option-icon text-muted fs-5"></i>
      `;
      optBtn.addEventListener('click', () => handleAnswerSelection(idx));
      quizOptionsContainer.appendChild(optBtn);
    });

    if (data.config.enableTimer) {
      quizTimerBadge.classList.remove('d-none');
      window.quizEngine.startTimer(
        (sec) => { timerSeconds.innerText = sec; },
        () => { handleAnswerSelection(-1); }
      );
    } else {
      quizTimerBadge.classList.add('d-none');
    }
  }

  function handleAnswerSelection(selectedIdx) {
    const result = window.quizEngine.submitAnswer(selectedIdx);
    if (!result) return;

    const optionCards = quizOptionsContainer.querySelectorAll('.option-card');

    optionCards.forEach((card, idx) => {
      card.classList.add('disabled');
      const icon = card.querySelector('.option-icon');

      if (idx === result.correctIndex) {
        card.classList.add('correct');
        if (icon) icon.className = 'fa-solid fa-circle-check text-success fs-5';
      } else if (idx === selectedIdx && !result.isCorrect) {
        card.classList.add('incorrect');
        if (icon) icon.className = 'fa-solid fa-circle-xmark text-danger fs-5';
      }
    });

    if (result.isCorrect) {
      window.soundEngine.playCorrectSound();
      window.particleSystem.triggerConfettiBurst(35);
      explanationHeader.innerHTML = `<span class="text-success"><i class="fa-solid fa-heart"></i> Spot On, ${partnerNickname}!</span>`;
    } else {
      window.soundEngine.playIncorrectSound();
      explanationHeader.innerHTML = `<span class="text-danger"><i class="fa-solid fa-heart-crack"></i> Almost! But I Still Love You 💕</span>`;
    }

    explanationText.innerText = result.explanation;
    quizExplanationBox.classList.remove('d-none');

    if (window.quizEngine.currentIndex % 3 === 0) {
      quoteText.innerText = window.quizEngine.getRandomQuote();
      quizQuoteInterstitial.classList.remove('d-none');
    }

    quizNextContainer.classList.remove('d-none');
  }

  btnNextQuestion.addEventListener('click', () => {
    window.soundEngine.playClickSound();
    const nextState = window.quizEngine.nextQuestion();

    if (nextState.isCompleted) {
      renderResultsView();
    } else {
      loadQuestionView();
    }
  });

  // --------------------------------------------------------------------------
  // 6. RESULTS & CERTIFICATE
  // --------------------------------------------------------------------------
  function renderResultsView() {
    showView('view-results');
    window.soundEngine.playCorrectSound();
    window.particleSystem.triggerConfettiBurst(50);

    const score = window.quizEngine.score;
    const total = window.quizEngine.getTotalQuestions();
    const tierMsg = window.quizEngine.getScoreMessage();

    resultScoreNum.innerText = score;
    resultTierMessage.innerText = `“${tierMsg}”`;

    const ratio = score / total;
    const offset = 440 - (440 * ratio);
    setTimeout(() => {
      if (resultProgressCircle) {
        resultProgressCircle.style.strokeDashoffset = offset;
      }
    }, 200);

    submitResultToBackend(partnerNickname, senderName, score, total, tierMsg, window.quizEngine.userAnswers);
  }

  async function submitResultToBackend(partnerNickname, senderName, score, totalQuestions, tierMessage, answers) {
    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerNickname, senderName, score, totalQuestions, tierMessage, answers })
      });

      if (response.ok) {
        if (backendStatusBadge) backendStatusBadge.classList.remove('d-none');
      }
    } catch (err) {
      console.warn('Backend API submission note: Running in static mode.', err);
    }
  }

  btnDownloadCert.addEventListener('click', () => {
    window.soundEngine.playClickSound();
    const score = window.quizEngine.score;
    const total = window.quizEngine.getTotalQuestions();
    const tierMsg = window.quizEngine.getScoreMessage();
    window.certificateGenerator.downloadCertificate(partnerNickname, score, total, tierMsg);
  });

  btnOpenLoveStory.addEventListener('click', () => {
    window.soundEngine.playClickSound();
    showView('view-story');
    renderLoveStoryPage();
  });

  // --------------------------------------------------------------------------
  // 7. LOVE STORY PAGE LOGIC
  // --------------------------------------------------------------------------
  function renderLoveStoryPage() {
    renderTypewriterLetter();
    renderGallery();
    renderTimeline();
    initCountdownTimer();
    renderVideoSection();
  }

  function renderVideoSection() {
    const vSec = document.getElementById('video-message-section');
    const vConfig = data.videoMessage;

    if (!vConfig || !vConfig.enabled) {
      if (vSec) vSec.classList.add('d-none');
      return;
    }

    if (vSec) vSec.classList.remove('d-none');

    const vBadge = document.getElementById('video-badge-text');
    const vTitle = document.getElementById('video-title-text');
    const vSubtitle = document.getElementById('video-subtitle-text');
    const vVideo = document.getElementById('personal-love-video');
    const vSource = document.getElementById('video-source-elem');

    if (vBadge && vConfig.badge) vBadge.innerText = vConfig.badge;
    if (vTitle && vConfig.title) vTitle.innerText = vConfig.title;
    if (vSubtitle && vConfig.subtitle) vSubtitle.innerText = vConfig.subtitle;

    if (vVideo && vConfig.videoUrl) {
      if (vConfig.posterUrl) vVideo.setAttribute('poster', vConfig.posterUrl);
      if (vSource) vSource.setAttribute('src', vConfig.videoUrl);
      vVideo.load();

      vVideo.addEventListener('play', () => {
        if (window.soundEngine && window.soundEngine.bgMusicPlaying) {
          window.soundEngine.toggleAmbientBgMusic();
        }
        if (window.particleSystem) {
          window.particleSystem.triggerConfettiBurst(20);
        }
      });
    }
  }

  function renderTypewriterLetter() {
    if (!letterBody) return;
    letterBody.innerHTML = '';
    const paragraphs = data.loveLetter ? data.loveLetter.paragraphs : [];
    
    let fullText = paragraphs.join('\n\n');
    let charIdx = 0;

    function typeChar() {
      if (charIdx < fullText.length) {
        const char = fullText.charAt(charIdx);
        if (char === '\n') {
          letterBody.innerHTML += '<br>';
        } else {
          letterBody.innerHTML += char;
        }
        charIdx++;
        setTimeout(typeChar, 25);
      }
    }
    typeChar();
  }

  function renderGallery(filter = 'all') {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    const items = data.gallery || [];
    const filtered = filter === 'all' 
      ? items 
      : items.filter(item => item.category === filter);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.innerHTML = `
        <div class="polaroid-img-wrapper">
          <img src="${item.imageUrl}" alt="${item.title}" class="polaroid-img" loading="lazy">
        </div>
        <div class="polaroid-caption">${item.title}</div>
        <div class="text-center text-muted small mt-1">${item.date}</div>
      `;
      card.addEventListener('click', () => {
        window.soundEngine.playClickSound();
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        if (lightboxImg) lightboxImg.src = item.imageUrl;
        if (lightboxTitle) lightboxTitle.innerText = item.title;
        if (lightboxCaption) lightboxCaption.innerText = item.caption;

        const modal = new bootstrap.Modal(document.getElementById('lightboxModal'));
        modal.show();
      });
      galleryGrid.appendChild(card);
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      window.soundEngine.playClickSound();
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderGallery(e.target.dataset.filter);
    });
  });

  function renderTimeline() {
    if (!timelineContainer) return;
    timelineContainer.innerHTML = '';

    const milestones = data.timeline || [];
    milestones.forEach((item) => {
      const tItem = document.createElement('div');
      tItem.className = 'timeline-item';
      tItem.innerHTML = `
        <div class="timeline-icon">${item.icon || '❤️'}</div>
        <div class="timeline-content">
          <div class="timeline-date">${item.date}</div>
          <h4 class="timeline-title font-heading">${item.title}</h4>
          <p class="mb-0 text-muted small">${item.description}</p>
        </div>
      `;
      timelineContainer.appendChild(tItem);
    });
  }

  function initCountdownTimer() {
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');

    const targetDate = new Date(data.config.anniversaryDate || "2027-02-14T00:00:00").getTime();

    function updateCd() {
      const now = new Date().getTime();
      let diff = targetDate - now;

      if (diff < 0) {
        diff += 365 * 24 * 60 * 60 * 1000;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (cdDays) cdDays.innerText = days < 10 ? '0' + days : days;
      if (cdHours) cdHours.innerText = hours < 10 ? '0' + hours : hours;
      if (cdMins) cdMins.innerText = mins < 10 ? '0' + mins : mins;
      if (cdSecs) cdSecs.innerText = secs < 10 ? '0' + secs : secs;
    }

    updateCd();
    setInterval(updateCd, 1000);
  }

  btnOpenMyHeart.addEventListener('click', () => {
    window.soundEngine.playHeartPopSound();
    window.particleSystem.triggerConfettiBurst(40);
    if (secretMessageText) {
      secretMessageText.innerText = data.secretMessage || "You hold the key to my heart! 💖";
    }
    const modal = new bootstrap.Modal(document.getElementById('heartSecretModal'));
    modal.show();
  });

  // --------------------------------------------------------------------------
  // 8. ROMANTIC MINI-GAMES ARCADE CONTROLLER 🎮❤️
  // --------------------------------------------------------------------------
  function openGamesHub() {
    if (window.miniGamesManager) window.miniGamesManager.stopAllGames();
    if (gamesHubSelector) gamesHubSelector.classList.remove('d-none');
    if (gameArenaCatch) gameArenaCatch.classList.add('d-none');
    if (gameArenaFind) gameArenaFind.classList.add('d-none');
    if (gameArenaPuzzle) gameArenaPuzzle.classList.add('d-none');
    if (gameArenaBalloons) gameArenaBalloons.classList.add('d-none');
  }

  function hideHubShowArena(arenaElem) {
    if (gamesHubSelector) gamesHubSelector.classList.add('d-none');
    if (arenaElem) arenaElem.classList.remove('d-none');
  }

  // Bind Mini Games Selection Cards
  const selectCatch = document.getElementById('select-game-catch');
  const selectFind = document.getElementById('select-game-find');
  const selectPuzzle = document.getElementById('select-game-puzzle');
  const selectBalloons = document.getElementById('select-game-balloons');

  if (selectCatch) {
    selectCatch.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      hideHubShowArena(gameArenaCatch);
      if (window.miniGamesManager) window.miniGamesManager.initCatchTheHearts();
    });
  }

  if (selectFind) {
    selectFind.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      hideHubShowArena(gameArenaFind);
      if (window.miniGamesManager) window.miniGamesManager.initFindHiddenHeart();
    });
  }

  if (selectPuzzle) {
    selectPuzzle.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      hideHubShowArena(gameArenaPuzzle);
      if (window.miniGamesManager) window.miniGamesManager.initLovePuzzle();
    });
  }

  if (selectBalloons) {
    selectBalloons.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      hideHubShowArena(gameArenaBalloons);
      if (window.miniGamesManager) window.miniGamesManager.initPopTheBalloons();
    });
  }

  // Back to Hub Buttons
  document.querySelectorAll('.btn-back-to-hub').forEach(btn => {
    btn.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      openGamesHub();
    });
  });

  // --------------------------------------------------------------------------
  // 9. SHARE LINK GENERATOR LOGIC
  // --------------------------------------------------------------------------
  function updateShareUrlPreview() {
    const baseUrl = window.location.origin + window.location.pathname;
    const toVal = shareInputTo ? (shareInputTo.value.trim() || 'My Sweetheart') : partnerNickname;
    const fromVal = shareInputFrom ? shareInputFrom.value.trim() : 'Your Devoted Love';
    const videoVal = shareInputVideo ? shareInputVideo.value.trim() : '';

    const params = new URLSearchParams();
    if (toVal) params.set('to', toVal);
    if (fromVal) params.set('from', fromVal);
    if (videoVal) params.set('video', videoVal);

    const fullShareUrl = `${baseUrl}?${params.toString()}`;
    
    if (generatedShareUrl) generatedShareUrl.value = fullShareUrl;

    const encodedText = encodeURIComponent(`Hey ${toVal}! ❤️ I created a special romantic quiz & mini-games for you: "Our Love Quiz ❤️". Take it here:`);
    const encodedUrl = encodeURIComponent(fullShareUrl);

    if (btnWhatsappShare) {
      btnWhatsappShare.href = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
    }
    if (btnTelegramShare) {
      btnTelegramShare.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    }
  }

  if (shareInputTo) shareInputTo.addEventListener('input', updateShareUrlPreview);
  if (shareInputFrom) shareInputFrom.addEventListener('input', updateShareUrlPreview);
  if (shareInputVideo) shareInputVideo.addEventListener('input', updateShareUrlPreview);

  if (btnOpenShareModal) {
    btnOpenShareModal.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      updateShareUrlPreview();
      const modal = new bootstrap.Modal(document.getElementById('shareLinkModal'));
      modal.show();
    });
  }

  if (btnCopyShareUrl) {
    btnCopyShareUrl.addEventListener('click', () => {
      window.soundEngine.playClickSound();
      if (generatedShareUrl) {
        generatedShareUrl.select();
        navigator.clipboard.writeText(generatedShareUrl.value);
        btnCopyShareUrl.innerHTML = '<i class="fa-solid fa-check me-1"></i> Copied!';
        setTimeout(() => {
          btnCopyShareUrl.innerHTML = '<i class="fa-solid fa-copy me-1"></i> Copy';
        }, 2000);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. SUBMISSIONS MODAL LOGIC (Creator View)
  // --------------------------------------------------------------------------
  if (btnOpenSubmissionsModal) {
    btnOpenSubmissionsModal.addEventListener('click', async () => {
      window.soundEngine.playClickSound();
      const modal = new bootstrap.Modal(document.getElementById('submissionsModal'));
      modal.show();

      if (submissionsListContainer) {
        submissionsListContainer.innerHTML = '<div class="text-center py-3"><i class="fa-solid fa-spinner fa-spin fs-3 text-accent"></i></div>';
      }

      try {
        const response = await fetch('/api/results');
        if (response.ok) {
          const resData = await response.json();
          renderSubmissionsList(resData.data || []);
        } else {
          submissionsListContainer.innerHTML = '<div class="alert alert-warning">No backend API connected. Submissions are saved when running Express/Node server!</div>';
        }
      } catch (err) {
        submissionsListContainer.innerHTML = `
          <div class="alert alert-info small">
            <i class="fa-solid fa-info-circle me-1"></i> Running in client-side / static deployment mode. Launch with <code>npm start</code> to enable local submission tracking database!
          </div>
        `;
      }
    });
  }

  function renderSubmissionsList(submissions) {
    if (!submissionsListContainer) return;
    if (!submissions.length) {
      submissionsListContainer.innerHTML = '<div class="text-center text-muted py-4">No quiz submissions recorded yet! Send your link to your partner to receive their results here. ❤️</div>';
      return;
    }

    let html = '<div class="list-group">';
    submissions.forEach(sub => {
      const dateStr = new Date(sub.submittedAt).toLocaleString();
      html += `
        <div class="list-group-item bg-transparent border-bottom p-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-1 text-accent font-heading fw-bold">${sub.partnerNickname}</h5>
            <span class="badge bg-danger rounded-pill fs-6">${sub.score} / ${sub.totalQuestions} (${sub.percentage}%)</span>
          </div>
          <p class="mb-1 text-muted small">“${sub.tierMessage}”</p>
          <div class="small text-muted"><i class="fa-regular fa-clock me-1"></i> Completed on: ${dateStr}</div>
        </div>
      `;
    });
    html += '</div>';
    submissionsListContainer.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 11. NAVBAR CONTROLS
  // --------------------------------------------------------------------------
  btnToggleTheme.addEventListener('click', () => {
    window.soundEngine.playClickSound();
    const newTheme = currentTheme === 'day' ? 'night' : 'day';
    applyTheme(newTheme);
  });

  btnToggleAudio.addEventListener('click', () => {
    const isPlaying = window.soundEngine.toggleAmbientBgMusic();
    btnToggleAudio.innerHTML = isPlaying 
      ? '<i class="fa-solid fa-volume-xmark text-danger"></i>' 
      : '<i class="fa-solid fa-music"></i>';
  });

  btnToggleSound.addEventListener('click', () => {
    const isMuted = window.soundEngine.toggleSound();
    btnToggleSound.innerHTML = isMuted 
      ? '<i class="fa-solid fa-volume-xmark text-muted"></i>' 
      : '<i class="fa-solid fa-volume-high text-accent"></i>';
  });

  btnRestartQuiz.addEventListener('click', () => {
    if (confirm('Are you sure you want to restart Our Love Quiz? ❤️')) {
      window.dataLoader.resetProgress();
      window.quizEngine.init(data, null);
      showView('view-hero');
    }
  });

});

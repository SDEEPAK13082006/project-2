/* ==========================================================================
   QUIZ ENGINE & STATE CONTROLLER
   ========================================================================== */

class QuizEngine {
  constructor() {
    this.questions = [];
    this.quotes = [];
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timer = null;
    this.timeLeft = 25;
    this.isAnswered = false;
    this.partnerNickname = "My Sweetheart";
  }

  init(data, savedState) {
    this.questions = data.questions || [];
    this.quotes = data.quotes || [];
    this.partnerNickname = data.config.partnerNickname || "My Sweetheart";

    if (savedState && savedState.currentIndex !== undefined && !savedState.isCompleted) {
      this.currentIndex = savedState.currentIndex;
      this.score = savedState.score || 0;
      this.userAnswers = savedState.userAnswers || [];
    } else {
      this.currentIndex = 0;
      this.score = 0;
      this.userAnswers = [];
    }
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  getTotalQuestions() {
    return this.questions.length;
  }

  submitAnswer(optionIndex) {
    if (this.isAnswered) return null;
    this.isAnswered = true;
    this.stopTimer();

    const q = this.getCurrentQuestion();
    const isCorrect = optionIndex === q.correctIndex;

    if (isCorrect) {
      this.score++;
    }

    this.userAnswers.push({
      questionId: q.id,
      selected: optionIndex,
      correct: q.correctIndex,
      isCorrect
    });

    // Save state
    window.dataLoader.saveState({
      currentIndex: this.currentIndex,
      score: this.score,
      userAnswers: this.userAnswers
    });

    return {
      isCorrect,
      correctIndex: q.correctIndex,
      explanation: q.explanation
    };
  }

  nextQuestion() {
    this.currentIndex++;
    this.isAnswered = false;
    
    if (this.currentIndex >= this.questions.length) {
      window.dataLoader.saveState({ isCompleted: true, score: this.score });
      return { isCompleted: true };
    }

    window.dataLoader.saveState({
      currentIndex: this.currentIndex,
      score: this.score,
      userAnswers: this.userAnswers
    });

    return { isCompleted: false, question: this.getCurrentQuestion() };
  }

  startTimer(onTick, onTimeout) {
    this.stopTimer();
    this.timeLeft = 25;
    onTick(this.timeLeft);

    this.timer = setInterval(() => {
      this.timeLeft--;
      onTick(this.timeLeft);
      if (this.timeLeft <= 0) {
        this.stopTimer();
        onTimeout();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getScoreMessage() {
    const score = this.score;
    const total = this.questions.length;
    const ratio = score / total;

    if (score >= 18 || ratio >= 0.9) {
      return "You know me almost perfectly ❤️";
    } else if (score >= 14 || ratio >= 0.7) {
      return "You know me really well 💕";
    } else if (score >= 10 || ratio >= 0.5) {
      return "We still have many adventures ahead 💖";
    } else {
      return "Looks like we need more cute dates together 🥰";
    }
  }

  getRandomQuote() {
    if (!this.quotes.length) return "";
    const idx = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[idx];
  }
}

window.quizEngine = new QuizEngine();

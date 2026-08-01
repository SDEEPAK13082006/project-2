/* ==========================================================================
   DATA LOADER & LOCAL STORAGE STATE MANAGER
   ========================================================================== */

class DataLoader {
  constructor() {
    this.quizData = null;
    this.storageKey = 'our_love_quiz_state_v1';
  }

  async loadData() {
    try {
      const response = await fetch('./data/quiz-data.json');
      if (response.ok) {
        this.quizData = await response.json();
        if (this.quizData && this.quizData.questions) {
          return this.quizData;
        }
      }
    } catch (err) {
      console.warn('DataLoader: Direct fetch note (CORS / file protocol). Loading complete inline data.', err);
    }
    this.quizData = this.getFallbackData();
    return this.quizData;
  }

  getSavedState() {
    try {
      const state = localStorage.getItem(this.storageKey);
      return state ? JSON.parse(state) : null;
    } catch (e) {
      return null;
    }
  }

  saveState(stateObj) {
    try {
      const existing = this.getSavedState() || {};
      const updated = { ...existing, ...stateObj, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  resetProgress() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {}
  }

  getFallbackData() {
    return {
      "config": {
        "siteTitle": "Our Love Quiz ❤️",
        "partnerNickname": "My Sweetheart",
        "anniversaryDate": "2024-02-14",
        "lockPassword": "",
        "timerSeconds": 25,
        "enableTimer": true,
        "enableAudio": true
      },
      "musicPlaylist": [
        {
          "id": 1,
          "title": "I Think They Call This Love ❤️",
          "url": "music.mp3"
        }
      ],
      "quotes": [
        "“In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.” — Maya Angelou",
        "“You will be my today and all of my tomorrows.” — Leo Christopher",
        "“If I know what love is, it is because of you.” — Hermann Hesse",
        "“I love you not only for what you are, but for what I will become when I am with you.” — Roy Croft",
        "“Every love story is beautiful, but our future together is my absolute favorite.” ❤️",
        "“You're the poem I never knew how to write, and our future is the story I will always tell.” 💖"
      ],
      "questions": [
        {
          "id": 1,
          "question": "Where will our next dream adventure take us?",
          "options": ["Romantic streets of Paris 🇫🇷", "Overwater bungalow in Maldives 🏝️", "Cozy cabin under Northern Lights 🌌", "Anywhere, as long as we're together! 🗺️"],
          "correctIndex": 3,
          "explanation": "The destination will never matter as much as the hand I'll get to hold along the journey! ✈️"
        },
        {
          "id": 2,
          "question": "What will be my absolute favorite thing about you forever?",
          "options": ["Your contagious laugh 😄", "Your gentle, warm heart 💖", "The way your eyes light up ✨", "Literally EVERYTHING about you! 🥰"],
          "correctIndex": 3,
          "explanation": "Trick question! How could I ever choose just one? You will always be my favorite person in every way. ❤️"
        },
        {
          "id": 3,
          "question": "What will be our favorite movie genre to watch together on movie nights?",
          "options": ["Romantic comedies 💕", "Action-packed thrillers 🎬", "Silly animations 🍿", "Horror movies where we hold hands tight 👻"],
          "correctIndex": 0,
          "explanation": "We will spend more time laughing and sharing sweet glances than actually watching the screen! 🍿"
        },
        {
          "id": 4,
          "question": "Which snack or food will we always end up craving together late at night?",
          "options": ["Midnight Pizza 🍕", "Sweet Creamy Ice Cream 🍦", "Late-night Ramen 🍜", "Crispy French Fries 🍟"],
          "correctIndex": 1,
          "explanation": "No matter the hour, sweet creamy ice cream will always taste 10x better when shared with you! 🍦"
        },
        {
          "id": 5,
          "question": "What will be my favorite nickname to call you when we're alone?",
          "options": ["My Sunshine ☀️", "Sweetheart 🍯", "My Favorite Human 💖", "Cutie Pie 🥧"],
          "correctIndex": 2,
          "explanation": "You will always be my favorite human in the entire universe! 🥰"
        },
        {
          "id": 6,
          "question": "How will we celebrate our future milestone anniversaries?",
          "options": ["Walking under evening lights ✨", "Candlelight dinner at a quiet restaurant 🕯️", "Picnic in a flower park 🧺", "Stargazing and deep talks 🌌"],
          "correctIndex": 0,
          "explanation": "Walking beside you under the stars will always make time feel like it stops. 🌹"
        },
        {
          "id": 7,
          "question": "What song will forever make me think of you?",
          "options": ["A soft romantic acoustic ballad 🎵", "An upbeat pop anthem 🎶", "Our official song 💕", "A sweet nostalgic melody 🎹"],
          "correctIndex": 2,
          "explanation": "Whenever our song plays, my heart will skip a beat just like the very first day! 🎧"
        },
        {
          "id": 8,
          "question": "What will be our ultimate favorite way to spend a quiet evening?",
          "options": ["Spontaneous road trips 🚗", "Quiet rainy days indoors 🌧️", "Endless deep conversations at 2 AM 🌙", "Every single second spent with you! ❤️"],
          "correctIndex": 3,
          "explanation": "Every future moment spent with you will become a prized memory in my heart. 💖"
        },
        {
          "id": 9,
          "question": "How will we handle silly disagreements in the future?",
          "options": ["With warm hugs and sweet compromises 💖", "With playful teasing and laughter 😂", "By making delicious peace-offering food 🍳", "By kissing and promising to love each other more 💋"],
          "correctIndex": 0,
          "explanation": "No matter what comes our way, love and warm hugs will always win! 💘"
        },
        {
          "id": 10,
          "question": "What will be our unspoken ritual whenever we say goodbye?",
          "options": ["A tight 10-second warm hug 🫂", "A sweet forehead kiss 💋", "Looking back and waving three times 👋", "Sending a 'get home safe' text immediately 📱"],
          "correctIndex": 1,
          "explanation": "A gentle kiss on your forehead will always carry all my love and protection for you. 💕"
        },
        {
          "id": 11,
          "question": "What will always bring a huge smile to our faces years from now?",
          "options": ["Inside jokes no one else understands 🤫", "Accidental silly mispronunciations 🤣", "Our goofy dancing in the kitchen 💃", "Playful teasing sessions 🤪"],
          "correctIndex": 0,
          "explanation": "Our secret inside jokes will keep us laughing together for a lifetime! 😂"
        },
        {
          "id": 12,
          "question": "If we were stranded on a deserted island in the future, what will I bring?",
          "options": ["A cozy blanket 🛌", "Endless snacks 🍫", "YOU, obviously! 🥰", "A camera to capture memories 📸"],
          "correctIndex": 2,
          "explanation": "With you by my side, even a deserted island will feel like paradise! 🏝️"
        },
        {
          "id": 13,
          "question": "What weather will be our absolute favorite for cuddling?",
          "options": ["Rainy afternoon with hot chocolate ☕", "Chilly winter night under warm blankets ❄️", "Breezy autumn sunset 🍂", "Sunny afternoon in a hammock ☀️"],
          "correctIndex": 0,
          "explanation": "Rain drops on the window, cozy blankets, and warm hugs with you will forever be perfection! 🌧️"
        },
        {
          "id": 14,
          "question": "What will be our dream house goal for the future?",
          "options": ["A cozy cottage with a big garden 🏡", "A modern penthouse with a city view 🏙️", "A seaside home near the waves 🌊", "Any home, as long as it's filled with your love! ❤️"],
          "correctIndex": 3,
          "explanation": "Home won't be a place—home will always be wherever you are! 🏡"
        },
        {
          "id": 15,
          "question": "What super power will best describe our future connection?",
          "options": ["Mind reading (finishing each other's sentences) 🧠", "Teleportation (wishing we were together instantly) ⚡", "Time travel (making moments last forever) ⌛", "Heart healing (your hug fixes everything) 💓"],
          "correctIndex": 3,
          "explanation": "No matter how tough any day gets, one warm embrace from you will instantly fix everything. 🫂"
        },
        {
          "id": 16,
          "question": "What will we love doing together on lazy Sundays?",
          "options": ["Binging our favorite series 📺", "Cooking a delicious messy meal 🍳", "Sleeping in late & cuddling 🛌", "All of the above! ✨"],
          "correctIndex": 3,
          "explanation": "Lazy Sundays with you will forever be the purest form of happiness! ☕"
        },
        {
          "id": 17,
          "question": "What will be the greatest gift you will ever give me?",
          "options": ["Your thoughtful words & time 💌", "Meaningful surprise gifts 🎁", "Warm embraces when I need them most 🫂", "Just being your amazing self every single day 🌟"],
          "correctIndex": 3,
          "explanation": "Your presence in my life will always be the greatest gift I could ever ask for. ❤️"
        },
        {
          "id": 18,
          "question": "What will we love doing together late at night?",
          "options": ["Talking about our big dreams for the future 🌟", "Sharing funny memes and laughing 📱", "Listening to soft music side by side 🎶", "Stargazing and making wishes 🌌"],
          "correctIndex": 0,
          "explanation": "Building our future in conversation under the night sky will always be my favorite pastime. ✨"
        },
        {
          "id": 19,
          "question": "How many times a day will I think about you in the future?",
          "options": ["About 100 times 💭", "Only when I'm awake ☀️", "Just once... because you will never leave my mind! ❤️", "Every single second ⏱️"],
          "correctIndex": 2,
          "explanation": "You will forever stay in my heart. You'll never leave my mind! 🥰"
        },
        {
          "id": 20,
          "question": "What will be my ultimate promise to you for all eternity?",
          "options": ["To always make you laugh 😂", "To hold your hand through every storm ⛈️", "To love you more tomorrow than today 💕", "To cherish and love you forever & always ❤️"],
          "correctIndex": 3,
          "explanation": "Forever & always, in every lifetime, my heart will belong to you. ❤️✨"
        }
      ],
      "loveLetter": {
        "title": "To My Dearest Love,",
        "paragraphs": [
          "Thank you for embarking on this little romantic journey with me today. Every question in this quiz is a tiny reflection of the massive love I hold in my heart for you.",
          "From the moment you entered my life, everything became brighter, warmer, and infinitely more beautiful. You have shown me what true love, laughter, and companionship really mean.",
          "No matter where life takes us, through every storm and every celebration, I promise to stand by your side, hold your hand tight, and love you more with every passing sunrise.",
          "You are my favorite hello, my hardest goodbye, my best friend, and my soulmate. I love you infinitely! ❤️"
        ],
        "signature": "Forever Yours,\nYour Devoted Love ❤️"
      },
      "videoMessage": {
        "enabled": true,
        "badge": "A Special Secret Video Message 🎥",
        "title": "Watch this only after finishing everything ❤️",
        "subtitle": "I recorded a special message just for you, from the bottom of my heart.",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-couple-holding-hands-and-walking-in-a-park-41555-large.mp4",
        "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
        "note": "Tip: You can easily replace this video with your own personal video clip by updating the videoUrl in data/quiz-data.json or dropping your video file into the project! 🎬❤️"
      },
      "gallery": [
        {
          "id": 1,
          "title": "Where It All Began",
          "date": "The First Chapter",
          "caption": "The sweet moment when our story unfolded.",
          "imageUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
          "category": "Firsts"
        },
        {
          "id": 2,
          "title": "Romantic Sunset Walk",
          "date": "Golden Hour",
          "caption": "Hand in hand under the painted sky.",
          "imageUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
          "category": "Dates"
        },
        {
          "id": 3,
          "title": "Cozy Rainy Afternoon",
          "date": "Warm Hugs & Coffee",
          "caption": "When the world outside faded away.",
          "imageUrl": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
          "category": "Memories"
        },
        {
          "id": 4,
          "title": "Our Favorite Date Night",
          "date": "Candlelight Magic",
          "caption": "Laughter, good food, and endless smiles.",
          "imageUrl": "https://images.unsplash.com/photo-1529634597503-139d362ae83a?auto=format&fit=crop&w=800&q=80",
          "category": "Dates"
        },
        {
          "id": 5,
          "title": "Under Starry Skies",
          "date": "Midnight Dreams",
          "caption": "Making wishes for a lifetime together.",
          "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
          "category": "Memories"
        },
        {
          "id": 6,
          "title": "Forever & Always",
          "date": "Today & Tomorrow",
          "caption": "Just the beginning of our infinite adventure.",
          "imageUrl": "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
          "category": "Firsts"
        }
      ],
      "timeline": [
        {
          "date": "Chapter 1",
          "title": "The First Spark ✨",
          "description": "The unforgettable moment we first talked and connected. Fate worked its magic!",
          "icon": "💬"
        },
        {
          "date": "Chapter 2",
          "title": "Our First Date 🌹",
          "description": "Butterflies in the stomach, warm smiles, and hours feeling like minutes.",
          "icon": "☕"
        },
        {
          "date": "Chapter 3",
          "title": "Confessing Our Love 💕",
          "description": "When 'I like you' turned into 'I love you with all my heart'.",
          "icon": "❤️"
        },
        {
          "date": "Chapter 4",
          "title": "Endless Adventures ✈️",
          "description": "Trips, late-night talks, lazy Sundays, and thousands of beautiful memories.",
          "icon": "🌟"
        },
        {
          "date": "Chapter 5",
          "title": "Our Next Anniversary 🥂",
          "description": "Counting down the days to celebrate another milestone of love together!",
          "icon": "💍"
        }
      ],
      "secretMessage": "Congratulations on finding my hidden heart! 💖 You mean more to me than words could ever capture. Here is a free coupon for: ONE BIG TIGHT HUG & A CUSTOM DATE NIGHT OF YOUR CHOICE! 🎟️✨"
    };
  }
}

window.dataLoader = new DataLoader();

/**
 * flashback.js
 * LanguageVerse Flashback Mode
 * Handles all data and logic for playing previous day's words
 */

// ─── Hardcoded Flashback Word Data ────────────────────────────────────────────
// Each key is a date string "YYYY-MM-DD". Add more dates here as needed.

const FLASHBACK_DATA = {
  "2026-03-28": {
    word: {
      word: "serene",
      engDef1: "Calm and peaceful",
      engDef2: "Free from disturbance",
      engDef3: ""
    },
    english_sentences: {
      engSentence1: "The lake looked serene at dawn",
      engSentence2: "She had a serene expression on her face",
      engSentence3: "The garden felt serene after the rain"
    },
    spanish_sentences: {
      spanishWord: "sereno",
      spaSentence1: "El lago parecía sereno al amanecer",
      spaSentence2: "Ella tenía una expresión serena en su cara",
      spaSentence3: "El jardín se sentía sereno después de la lluvia"
    },
    german_sentences: {
      germanWord: "ruhig",
      gerSentence1: "Der See sah bei Tagesanbruch ruhig aus",
      gerSentence2: "Sie hatte einen ruhigen Ausdruck im Gesicht",
      gerSentence3: "Der Garten fühlte sich nach dem Regen ruhig an"
    },
    dutch_sentences: {
      dutchWord: "sereen",
      dutSentence1: "Het meer zag er sereen uit bij het aanbreken van de dag",
      dutSentence2: "Ze had een serene uitdrukking op haar gezicht",
      dutSentence3: "De tuin voelde sereen aan na de regen"
    },
    incorrect_answers: ["volatile", "clumsy", "rigid"]
  },

  "2026-03-27": {
    word: {
      word: "wander",
      engDef1: "To walk without a fixed destination",
      engDef2: "To roam or drift freely",
      engDef3: ""
    },
    english_sentences: {
      engSentence1: "She likes to wander through the old market",
      engSentence2: "His mind began to wander during the lecture",
      engSentence3: "They wander the forest paths every weekend"
    },
    spanish_sentences: {
      spanishWord: "vagar",
      spaSentence1: "A ella le gusta vagar por el mercado antiguo",
      spaSentence2: "Su mente empezó a vagar durante la conferencia",
      spaSentence3: "Ellos vagan por los caminos del bosque cada fin de semana"
    },
    german_sentences: {
      germanWord: "wandern",
      gerSentence1: "Sie wandert gerne durch den alten Markt",
      gerSentence2: "Sein Geist begann während der Vorlesung zu wandern",
      gerSentence3: "Sie wandern jedes Wochenende durch die Waldwege"
    },
    dutch_sentences: {
      dutchWord: "dwalen",
      dutSentence1: "Ze dwaalt graag door de oude markt",
      dutSentence2: "Zijn gedachten begonnen te dwalen tijdens de lezing",
      dutSentence3: "Ze dwalen elk weekend door de bospaden"
    },
    incorrect_answers: ["collapse", "freeze", "compete"]
  },

  "2026-03-26": {
    word: {
      word: "hurry",
      engDef1: "To rush",
      engDef2: "To act quickly",
      engDef3: ""
    },
    english_sentences: {
      engSentence1: "Please hurry or we will be late",
      engSentence2: "Do not hurry through the work",
      engSentence3: "They hurry to catch the train"
    },
    spanish_sentences: {
      spanishWord: "prisa",
      spaSentence1: "Por favor prisa o llegaremos tarde",
      spaSentence2: "No prisa a través del trabajo",
      spaSentence3: "Ellos prisa para tomar el tren"
    },
    german_sentences: {
      germanWord: "beeilen",
      gerSentence1: "Bitte beeilen Sie sich oder wir werden zu spät sein",
      gerSentence2: "beeilen Sie sich nicht durch die Arbeit",
      gerSentence3: "Sie beeilen sich um den Zug zu erwischen"
    },
    dutch_sentences: {
      dutchWord: "haast",
      dutSentence1: "haast alstublieft of we komen te laat",
      dutSentence2: "haast je niet door het werk",
      dutSentence3: "Ze haast om de trein te halen"
    },
    incorrect_answers: ["finance", "hang", "infection"]
  },

  "2026-03-25": {
    word: {
      word: "gather",
      engDef1: "To bring things together",
      engDef2: "To collect or assemble",
      engDef3: ""
    },
    english_sentences: {
      engSentence1: "They gather around the fire every evening",
      engSentence2: "She went to gather flowers from the garden",
      engSentence3: "Clouds gather before a storm"
    },
    spanish_sentences: {
      spanishWord: "reunir",
      spaSentence1: "Se reúnen alrededor del fuego cada noche",
      spaSentence2: "Ella fue a reunir flores del jardín",
      spaSentence3: "Las nubes se reúnen antes de una tormenta"
    },
    german_sentences: {
      germanWord: "sammeln",
      gerSentence1: "Sie sammeln sich jeden Abend um das Feuer",
      gerSentence2: "Sie ging Blumen aus dem Garten sammeln",
      gerSentence3: "Wolken sammeln sich vor einem Sturm"
    },
    dutch_sentences: {
      dutchWord: "verzamelen",
      dutSentence1: "Ze verzamelen zich elke avond rond het vuur",
      dutSentence2: "Ze ging bloemen uit de tuin verzamelen",
      dutSentence3: "Wolken verzamelen zich voor een storm"
    },
    incorrect_answers: ["scatter", "ignore", "drain"]
  },

  "2026-03-24": {
    word: {
      word: "bloom",
      engDef1: "To produce flowers",
      engDef2: "To flourish or thrive",
      engDef3: ""
    },
    english_sentences: {
      engSentence1: "The roses bloom every spring",
      engSentence2: "Her confidence began to bloom after the award",
      engSentence3: "The cherry trees bloom beautifully in April"
    },
    spanish_sentences: {
      spanishWord: "florecer",
      spaSentence1: "Las rosas florecen cada primavera",
      spaSentence2: "Su confianza comenzó a florecer después del premio",
      spaSentence3: "Los cerezos florecen hermosamente en abril"
    },
    german_sentences: {
      germanWord: "blühen",
      gerSentence1: "Die Rosen blühen jeden Frühling",
      gerSentence2: "Ihr Selbstvertrauen begann nach dem Preis zu blühen",
      gerSentence3: "Die Kirschbäume blühen im April wunderschön"
    },
    dutch_sentences: {
      dutchWord: "bloeien",
      dutSentence1: "De rozen bloeien elke lente",
      dutSentence2: "Haar zelfvertrouwen begon te bloeien na de prijs",
      dutSentence3: "De kersenbomen bloeien prachtig in april"
    },
    incorrect_answers: ["wither", "stumble", "freeze"]
  }
};

// The earliest date our app has data for — dates before this show the "not invented yet" message.
const APP_LAUNCH_DATE = new Date("2026-03-24");
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

// ─── Flashback State ──────────────────────────────────────────────────────────

let flashbackOpen = false;
let flashbackCurrentWord = null;
let flashbackHasAnswered = false;
let flashbackSelectedDate = null;
let flashbackSelectedLanguage = null;
let flashbackActive = false;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format a Date as "YYYY-MM-DD"
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Given raw flashback data + language code, build the currentWord object
 * (same shape as used in app.js)
 */
function buildFlashbackWord(data, languageCode) {
  let translatedWord, translatedSentences;

  switch (languageCode) {
    case "spanish_sentences":
      translatedWord = data.spanish_sentences.spanishWord;
      translatedSentences = [
        data.spanish_sentences.spaSentence1,
        data.spanish_sentences.spaSentence2,
        data.spanish_sentences.spaSentence3
      ];
      break;
    case "german_sentences":
      translatedWord = data.german_sentences.germanWord;
      translatedSentences = [
        data.german_sentences.gerSentence1,
        data.german_sentences.gerSentence2,
        data.german_sentences.gerSentence3
      ];
      break;
    case "dutch_sentences":
      translatedWord = data.dutch_sentences.dutchWord;
      translatedSentences = [
        data.dutch_sentences.dutSentence1,
        data.dutch_sentences.dutSentence2,
        data.dutch_sentences.dutSentence3
      ];
      break;
    default:
      translatedWord = data.word.word;
      translatedSentences = [
        data.english_sentences.engSentence1,
        data.english_sentences.engSentence2,
        data.english_sentences.engSentence3
      ];
  }

  return {
    word: translatedWord,
    definitions: [data.word.engDef1, data.word.engDef2, data.word.engDef3].filter(Boolean),
    exampleSentences: {
      english: [
        data.english_sentences.engSentence1,
        data.english_sentences.engSentence2,
        data.english_sentences.engSentence3
      ].filter(Boolean),
      translated: translatedSentences.filter(Boolean)
    },
    correctAnswer: data.word.word,
    wrongAnswers: data.incorrect_answers
  };
}

// ─── UI Rendering ─────────────────────────────────────────────────────────────

function initFlashback() {
  injectFlashbackButton();
  injectFlashbackPanel();
}

function injectFlashbackButton() {
  const header = document.querySelector('.header');
  if (!header) return;

  // Make header flex so logo + button sit side by side
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';

  const btn = document.createElement('button');
  btn.id = 'flashback-btn';
  btn.className = 'flashback-header-btn';
  btn.innerHTML = `Flashback`;
  btn.addEventListener('click', toggleFlashbackPanel);
  header.appendChild(btn);
}

function injectFlashbackPanel() {
  const panel = document.createElement('div');
  panel.id = 'flashback-panel';
  panel.className = 'flashback-panel flashback-panel--hidden';
  panel.innerHTML = `
    <div class="flashback-panel-inner">
      <button class="flashback-close-btn" id="flashback-close-btn" title="Close">✕</button>

      <div class="flashback-header-content">
        <div class="flashback-rewind-icon">⏪</div>
        <h2 class="flashback-title">Play A Previous Day</h2>
        <p class="flashback-subtitle">Travel back in time and challenge yourself with a past word of the day.</p>
      </div>

      <div class="flashback-date-section">
        <label class="flashback-date-label" for="flashback-date-input">Which day would you like to play?</label>
        <input
          type="date"
          id="flashback-date-input"
          class="flashback-date-input"
          max="${formatDate(new Date(TODAY.getTime() - 86400000))}"
        />
        <div id="flashback-date-error" class="flashback-date-error" style="display:none;"></div>
      </div>

      <button class="flashback-go-btn" id="flashback-go-btn">Let's Go Back!</button>
    </div>
  `;

  // Insert right after <header>
  const header = document.querySelector('.header');
  header.insertAdjacentElement('afterend', panel);

  document.getElementById('flashback-close-btn').addEventListener('click', closeFlashbackPanel);
  document.getElementById('flashback-go-btn').addEventListener('click', handleFlashbackGo);
}

function toggleFlashbackPanel() {
  flashbackOpen ? closeFlashbackPanel() : openFlashbackPanel();
}

function openFlashbackPanel() {
  flashbackOpen = true;
  const panel = document.getElementById('flashback-panel');
  panel.classList.remove('flashback-panel--hidden');
  panel.classList.add('flashback-panel--visible');
  // clear any previous error / value
  document.getElementById('flashback-date-error').style.display = 'none';
}

function closeFlashbackPanel() {
  flashbackOpen = false;
  const panel = document.getElementById('flashback-panel');
  panel.classList.remove('flashback-panel--visible');
  panel.classList.add('flashback-panel--hidden');
}

function handleFlashbackGo() {
  const input = document.getElementById('flashback-date-input');
  const errorEl = document.getElementById('flashback-date-error');
  errorEl.style.display = 'none';

  const rawValue = input.value; // "YYYY-MM-DD"
  if (!rawValue) {
    showFlashbackError("Please select a date first!");
    return;
  }

  // Parse locally (avoid timezone offset issues)
  const [year, month, day] = rawValue.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day);
  selectedDate.setHours(0, 0, 0, 0);

  // Before our launch date?
  if (selectedDate < APP_LAUNCH_DATE) {
    showFlashbackError("🚀 Oops! LanguageVerse didn't exist yet on that day. Try a more recent date!");
    return;
  }

  // Is it today or the future?
  if (selectedDate >= TODAY) {
    showFlashbackError("🔮 That date hasn't happened yet — pick a past day!");
    return;
  }

  const dateKey = rawValue; // already "YYYY-MM-DD"
  const data = FLASHBACK_DATA[dateKey];

  if (!data) {
    showFlashbackError("📭 No word found for that date. Our archives must have a gap — try another day!");
    return;
  }

  // All good — store selected date and kick off the game
  flashbackSelectedDate = dateKey;
  closeFlashbackPanel();
  launchFlashbackGame(data, dateKey);
}

function showFlashbackError(msg) {
  const errorEl = document.getElementById('flashback-date-error');
  errorEl.textContent = msg;
  errorEl.style.display = 'block';
}

// ─── Flashback Game Flow ──────────────────────────────────────────────────────

function launchFlashbackGame(data, dateKey) {
  // We need a language. If the main game has already selected one, reuse it.
  // Otherwise, show the language select page briefly (it's already there).
  const currentLang = (typeof selectedLanguage !== 'undefined' && selectedLanguage)
    ? selectedLanguage
    : null;

  if (currentLang) {
    startFlashbackWithLanguage(data, dateKey, currentLang);
  } else {
    // No language chosen yet — show language picker, intercept submission for flashback
    const languageSelectPage = document.getElementById('language-select-page');
    const wordPage = document.getElementById('word-page');

    languageSelectPage.style.display = '';
    wordPage.style.display = 'none';

    // Temporarily override the form submit to launch flashback instead of normal game
    const form = document.getElementById('language-form');
    const originalHandler = form.onsubmit;

    form.addEventListener('submit', function flashbackLangHandler(e) {
      e.preventDefault();
      const lang = document.getElementById('target-language').value;
      if (!lang) return;
      form.removeEventListener('submit', flashbackLangHandler);
      startFlashbackWithLanguage(data, dateKey, lang);
    }, { once: true });
  }
}

function startFlashbackWithLanguage(data, dateKey, languageCode) {
  flashbackActive = true;
  flashbackHasAnswered = false;
  flashbackSelectedLanguage = languageCode;

  flashbackCurrentWord = buildFlashbackWord(data, languageCode);

  // Show the word page
  const languageSelectPage = document.getElementById('language-select-page');
  const wordPage = document.getElementById('word-page');
  languageSelectPage.style.display = 'none';
  wordPage.style.display = 'flex';

  // Inject the flashback banner
  renderFlashbackBanner(dateKey);

  // Render word content using shared helpers from app.js
  renderFlashbackWordPage();
}

function renderFlashbackBanner(dateKey) {
  // Remove existing banner if any
  const existing = document.getElementById('flashback-banner');
  if (existing) existing.remove();

  const wordTopSection = document.querySelector('.word-top-section');
  if (!wordTopSection) return;

  // Format readable date
  const [y, m, d] = dateKey.split('-').map(Number);
  const readable = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const banner = document.createElement('div');
  banner.id = 'flashback-banner';
  banner.className = 'flashback-banner';
  banner.innerHTML = `
    <span class="flashback-banner-icon">⏪</span>
    <span>Flashback Mode &mdash; ${readable}</span>
    <button class="flashback-banner-exit" id="flashback-banner-exit">Exit Flashback</button>
  `;
  wordTopSection.prepend(banner);

  document.getElementById('flashback-banner-exit').addEventListener('click', exitFlashbackMode);
}

function exitFlashbackMode() {
  flashbackActive = false;
  flashbackCurrentWord = null;

  // Remove the banner
  const banner = document.getElementById('flashback-banner');
  if (banner) banner.remove();

  // Go back to language select
  document.getElementById('word-page').style.display = 'none';
  document.getElementById('language-select-page').style.display = '';
}

// ─── Word Page Rendering (mirrors app.js but uses flashback state) ─────────────

function renderFlashbackWordPage() {
  const word = flashbackCurrentWord;
  if (!word) return;

  // Reuse the same DOM elements as the main game
  document.getElementById('word-value').textContent = word.word;

  const defTitle = document.getElementById('definitions-title');
  defTitle.textContent = word.definitions.length > 1 ? 'Definitions' : 'Definition';

  const definitionList = document.getElementById('definition-list');
  definitionList.innerHTML = '';
  word.definitions.forEach(def => {
    const li = document.createElement('li');
    li.className = 'definition-item';
    li.textContent = def;
    definitionList.appendChild(li);
  });

  const sentenceList = document.getElementById('sentence-list');
  sentenceList.innerHTML = '';
  word.exampleSentences.english.forEach((engSentence, i) => {
    const pairDiv = document.createElement('div');
    pairDiv.className = 'sentence-pair';

    const engDiv = document.createElement('div');
    engDiv.className = 'sentence-english';
    engDiv.textContent = engSentence;

    const transDiv = document.createElement('div');
    transDiv.className = 'sentence-translated';
    transDiv.textContent = word.exampleSentences.translated[i] || '';

    pairDiv.appendChild(engDiv);
    pairDiv.appendChild(transDiv);
    sentenceList.appendChild(pairDiv);
  });

  document.getElementById('answer-prompt').textContent =
    `What does "${word.word}" mean in English?`;

  renderFlashbackAnswerButtons();

  const feedback = document.getElementById('feedback-message');
  feedback.style.display = 'none';
}

function renderFlashbackAnswerButtons() {
  const answerGrid = document.getElementById('answer-grid');
  answerGrid.innerHTML = '';

  const allAnswers = [flashbackCurrentWord.correctAnswer, ...flashbackCurrentWord.wrongAnswers];
  const shuffled = shuffleArrayFB(allAnswers);

  shuffled.forEach(answer => {
    const btn = document.createElement('button');
    btn.className = 'answer-button';
    btn.textContent = answer;
    btn.onclick = () => handleFlashbackAnswerClick(answer, btn);
    answerGrid.appendChild(btn);
  });
}

function handleFlashbackAnswerClick(selectedAnswer, clickedButton) {
  if (flashbackHasAnswered) return;
  flashbackHasAnswered = true;

  const isCorrect = selectedAnswer === flashbackCurrentWord.correctAnswer;
  const allButtons = document.getElementById('answer-grid').querySelectorAll('.answer-button');

  allButtons.forEach(btn => { btn.disabled = true; });

  const feedback = document.getElementById('feedback-message');

  if (isCorrect) {
    clickedButton.classList.add('correct');
    feedback.textContent = '🎉 Correct! Great job!';
    feedback.className = 'feedback-message correct';
  } else {
    clickedButton.classList.add('incorrect');
    allButtons.forEach(btn => {
      if (btn.textContent === flashbackCurrentWord.correctAnswer) {
        btn.classList.add('revealed-correct');
      }
    });
    feedback.textContent = `❌ Incorrect. The correct answer is "${flashbackCurrentWord.correctAnswer}"`;
    feedback.className = 'feedback-message incorrect';
  }

  feedback.style.display = 'block';
  setTimeout(() => { feedback.style.display = 'none'; }, 3000);
}

function shuffleArrayFB(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFlashback);
} else {
  initFlashback();
}
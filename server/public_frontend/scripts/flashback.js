/**
 * flashback.js
 * LanguageVerse Flashback Mode
 * Handles all data and logic for playing previous day's words
 */

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
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

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
  document.getElementById('flashback-date-error').style.display = 'none';
}

function closeFlashbackPanel() {
  flashbackOpen = false;
  const panel = document.getElementById('flashback-panel');
  panel.classList.remove('flashback-panel--visible');
  panel.classList.add('flashback-panel--hidden');
}

async function handleFlashbackGo() {
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

  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  // Is it today or the future?
  if (selectedDate >= TODAY) {
    showFlashbackError("🔮 That date hasn't happened yet — pick a past day!");
    return;
  }

  const dateKey = rawValue; // already "YYYY-MM-DD"

  // Fetch from DB instead of hardcoded data
  const flashbackDoc = await fetchWordOfTheDay(dateKey);

  if (!flashbackDoc) {
    showFlashbackError("📭 No word found for that date. Our archives must have a gap — try another day!");
    return;
  }

  const fullData = await showcaseTodaysWord(flashbackDoc.wordIndex);

  if (!fullData) {
    showFlashbackError("⚠️ Something went wrong loading that word. Try another day!");
    return;
  }

  flashbackSelectedDate = dateKey;
  closeFlashbackPanel();
  launchFlashbackGame(fullData, dateKey);
}

function showFlashbackError(msg) {
  const errorEl = document.getElementById('flashback-date-error');
  errorEl.textContent = msg;
  errorEl.style.display = 'block';
}

// ─── Flashback Game Flow ──────────────────────────────────────────────────────

function launchFlashbackGame(data, dateKey) {
  const currentLang = (typeof selectedLanguage !== 'undefined' && selectedLanguage)
    ? selectedLanguage
    : null;

  if (currentLang) {
    startFlashbackWithLanguage(data, dateKey, currentLang);
  } else {
    const languageSelectPage = document.getElementById('language-select-page');
    const wordPage = document.getElementById('word-page');

    languageSelectPage.style.display = '';
    wordPage.style.display = 'none';

    const form = document.getElementById('language-form');

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

  const languageSelectPage = document.getElementById('language-select-page');
  const wordPage = document.getElementById('word-page');
  languageSelectPage.style.display = 'none';
  wordPage.style.display = 'flex';

  renderFlashbackBanner(dateKey);
  renderFlashbackWordPage();
}

function renderFlashbackBanner(dateKey) {
  const existing = document.getElementById('flashback-banner');
  if (existing) existing.remove();

  const wordTopSection = document.querySelector('.word-top-section');
  if (!wordTopSection) return;

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

  const banner = document.getElementById('flashback-banner');
  if (banner) banner.remove();

  document.getElementById('word-page').style.display = 'none';
  document.getElementById('language-select-page').style.display = '';
}

// ─── Word Page Rendering ──────────────────────────────────────────────────────

function renderFlashbackWordPage() {
  const word = flashbackCurrentWord;
  if (!word) return;

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
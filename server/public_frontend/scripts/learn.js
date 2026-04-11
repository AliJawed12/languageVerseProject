/**
 * learn.js
 * LanguageVerse — Learn Mode
 */

// ─── State ────────────────────────────────────────────────────────────────────

let learnOverlayOpen   = false;
let learnCardIndex     = 0;
let learnHasAnswered   = false;
let learnScore         = { correct: 0, incorrect: 0 };
let learnCards         = [];

// ─── Init ─────────────────────────────────────────────────────────────────────

function initLearn() {
  injectLearnButton();
  injectLearnOverlay();
}

// ─── Inject Header Button ─────────────────────────────────────────────────────

function injectLearnButton() {
  const header = document.querySelector('.header');
  if (!header) return;

  let btnGroup = document.getElementById('header-btn-group');
  if (!btnGroup) {
    btnGroup = document.createElement('div');
    btnGroup.id = 'header-btn-group';
    btnGroup.style.display    = 'flex';
    btnGroup.style.alignItems = 'center';
    btnGroup.style.gap        = '0.75rem';
    btnGroup.style.marginLeft = 'auto';
    header.appendChild(btnGroup);
  }

  const btn = document.createElement('button');
  btn.id        = 'learn-header-btn';
  btn.className = 'learn-header-btn';
  btn.innerHTML = '📚 Learn';
  btn.addEventListener('click', handleLearnButtonClick);
  btnGroup.prepend(btn);
}

// ─── Inject Overlay ───────────────────────────────────────────────────────────

function injectLearnOverlay() {
  const overlay = document.createElement('div');
  overlay.id        = 'learn-overlay';
  overlay.className = 'learn-overlay';
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('role', 'dialog');

  overlay.innerHTML = `
    <div class="learn-modal" id="learn-modal">

      <!-- Modal Header -->
      <div class="learn-modal-header">
        <div class="learn-mode-badge">📚 Learn Mode</div>

        <div class="learn-progress-wrap">
          <div class="learn-progress-label">
            <span id="learn-progress-text">Card 1 of 5</span>
            <span id="learn-progress-pct">0%</span>
          </div>
          <div class="learn-progress-bar-track">
            <div class="learn-progress-bar-fill" id="learn-progress-fill"></div>
          </div>
        </div>

        <button class="learn-close-btn" id="learn-close-btn" aria-label="Close Learn Mode">✕</button>
      </div>

      <!-- Login Prompt -->
      <div class="learn-login-prompt" id="learn-login-prompt">
        <div class="learn-login-icon">🔒</div>
        <h2 class="learn-login-title">Members Only</h2>
        <p class="learn-login-text">
          Learn Mode lets you practice 5 words a day and track your progress.
          Log in or create an account to unlock it!
        </p>
        <button class="learn-login-cta-btn" id="learn-login-cta">👤 Log In / Register</button>
      </div>

      <!-- Language Required Prompt -->
      <div class="learn-login-prompt" id="learn-language-prompt">
        <div class="learn-login-icon">🌍</div>
        <h2 class="learn-login-title">Choose a Language First</h2>
        <p class="learn-login-text">
          Select a language to learn from the main menu before starting Learn Mode.
          Your cards will be shown in your chosen language!
        </p>
        <button class="learn-login-cta-btn" id="learn-language-cta">← Go Select a Language</button>
      </div>

      <!-- Loading Screen -->
      <div class="learn-login-prompt" id="learn-loading-prompt">
        <div class="learn-login-icon">⏳</div>
        <h2 class="learn-login-title">Loading your cards…</h2>
        <p class="learn-login-text">Pulling from your learning history. Just a moment!</p>
      </div>

      <!-- Card Body -->
      <div class="learn-card-body" id="learn-card-body">
        <div class="learn-word-header">
          <div class="learn-card-number" id="learn-card-number">Card 1 of 5</div>
          <div class="learn-word-value" id="learn-word-value"></div>
          <div class="learn-word-divider"></div>
        </div>

        <div class="learn-section">
          <h3 class="learn-section-title" id="learn-def-title">Definitions</h3>
          <ul class="learn-definition-list" id="learn-def-list"></ul>
        </div>

        <div class="learn-section">
          <h3 class="learn-section-title">Example Sentences</h3>
          <div class="learn-sentence-list" id="learn-sentence-list"></div>
        </div>
      </div>

      <!-- Answer Section -->
      <div class="learn-answer-section" id="learn-answer-section">
        <p class="learn-answer-prompt" id="learn-answer-prompt"></p>
        <div class="learn-answer-grid" id="learn-answer-grid"></div>
        <div class="learn-feedback" id="learn-feedback"></div>
      </div>

      <!-- Completion Screen -->
      <div class="learn-complete-screen" id="learn-complete-screen">
        <div class="learn-complete-icon" id="learn-complete-icon">🎉</div>
        <h2 class="learn-complete-title">Session Complete!</h2>
        <p class="learn-complete-subtitle">Great work practising today. Come back tomorrow for more!</p>
        <div class="learn-score-display">
          <div class="learn-score-item">
            <span class="learn-score-number success-color" id="learn-score-correct">0</span>
            <span class="learn-score-label">Correct</span>
          </div>
          <div class="learn-score-item">
            <span class="learn-score-number error-color" id="learn-score-incorrect">0</span>
            <span class="learn-score-label">Incorrect</span>
          </div>
          <div class="learn-score-item">
            <span class="learn-score-number" id="learn-score-pct">0%</span>
            <span class="learn-score-label">Score</span>
          </div>
        </div>
        <button class="learn-complete-close-btn" id="learn-complete-close-btn">Done</button>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('learn-close-btn').addEventListener('click', closeLearnOverlay);
  document.getElementById('learn-complete-close-btn').addEventListener('click', closeLearnOverlay);
  document.getElementById('learn-login-cta').addEventListener('click', handleLearnLoginCTA);
  document.getElementById('learn-language-cta').addEventListener('click', closeLearnOverlay);

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLearnOverlay();
  });
}

// ─── Open / Close ─────────────────────────────────────────────────────────────

function handleLearnButtonClick() {
  if (typeof closeAuthPanel    === 'function' && authPanelOpen)    closeAuthPanel();
  if (typeof closeFlashbackPanel === 'function' && flashbackOpen) closeFlashbackPanel();
  openLearnOverlay();
}

function openLearnOverlay() {
  learnOverlayOpen = true;
  const overlay = document.getElementById('learn-overlay');
  overlay.classList.add('learn-overlay--visible');
  document.body.style.overflow = 'hidden';

  if (!isUserLoggedIn()) {
    showLearnLoginPrompt();
    return;
  }

  // Check language selected — selectedLanguage is declared in app.js
  if (typeof selectedLanguage === 'undefined' || !selectedLanguage) {
    showLearnLanguagePrompt();
    return;
  }

  startLearnSession();
}

function closeLearnOverlay() {
  learnOverlayOpen = false;
  const overlay = document.getElementById('learn-overlay');
  overlay.classList.remove('learn-overlay--visible');
  document.body.style.overflow = '';
  resetLearnSession();
}

// ─── Login / Language State ───────────────────────────────────────────────────

function isUserLoggedIn() {
  return typeof currentUser !== 'undefined' && currentUser !== null;
}

// Hide all content panels
function hideAllLearnPanels() {
  document.getElementById('learn-login-prompt').classList.remove('learn-login--show');
  document.getElementById('learn-language-prompt').classList.remove('learn-login--show');
  document.getElementById('learn-loading-prompt').classList.remove('learn-login--show');
  document.getElementById('learn-complete-screen').classList.remove('learn-complete--show');
  document.getElementById('learn-card-body').style.display      = 'none';
  document.getElementById('learn-answer-section').style.display = 'none';
}

function showLearnLoginPrompt() {
  hideAllLearnPanels();
  document.getElementById('learn-login-prompt').classList.add('learn-login--show');
  document.getElementById('learn-progress-text').textContent = 'Log in to play';
  document.getElementById('learn-progress-pct').textContent  = '';
}

function showLearnLanguagePrompt() {
  hideAllLearnPanels();
  document.getElementById('learn-language-prompt').classList.add('learn-login--show');
  document.getElementById('learn-progress-text').textContent = 'Select a language first';
  document.getElementById('learn-progress-pct').textContent  = '';
}

function showLearnLoadingPrompt() {
  hideAllLearnPanels();
  document.getElementById('learn-loading-prompt').classList.add('learn-login--show');
  document.getElementById('learn-progress-text').textContent = 'Loading…';
  document.getElementById('learn-progress-pct').textContent  = '';
}

function handleLearnLoginCTA() {
  closeLearnOverlay();
  if (typeof openAuthPanel === 'function') openAuthPanel();
}

// ─── Session Management ───────────────────────────────────────────────────────

async function startLearnSession() {
  learnCardIndex   = 0;
  learnHasAnswered = false;
  learnScore       = { correct: 0, incorrect: 0 };
  learnCards       = [];

  showLearnLoadingPrompt();

  try {
    // 1. Fetch the 5 card index objects from the backend
    const response = await fetch('/server/auth/learn/get_cards');
    if (!response.ok) throw new Error('Failed to fetch learn cards');
    const cardMeta = await response.json(); // [{wordIndex, comprehensionLevel, ...}, ...]

    // 2. For each index, fetch the full word data (sentences, definitions, answers)
    const wordDataResults = await Promise.all(
      cardMeta.map(meta => showcaseTodaysWord(meta.wordIndex))
    );

    // 3. Build card objects in the same shape renderLearnCard() expects,
    //    applying the selected language the same way app.js does.
    learnCards = wordDataResults
      .filter(Boolean) // drop any failed fetches
      .map(wordData => {
        const { translatedWord, translatedSentences } = getLanguageSentences(wordData, selectedLanguage);

        return {
          word: translatedWord,
          definitions: [
            wordData.word.engDef1,
            wordData.word.engDef2,
            wordData.word.engDef3
          ].filter(Boolean),
          exampleSentences: {
            english: [
              wordData.english_sentences.engSentence1,
              wordData.english_sentences.engSentence2,
              wordData.english_sentences.engSentence3
            ].filter(Boolean),
            translated: translatedSentences.filter(Boolean)
          },
          correctAnswer: wordData.word.word,
          wrongAnswers: [
            wordData.incorrect_answers[0],
            wordData.incorrect_answers[1],
            wordData.incorrect_answers[2]
          ]
        };
      });

    if (learnCards.length === 0) {
      throw new Error('No cards could be loaded');
    }

  } catch (err) {
    console.error('Learn session error:', err);
    hideAllLearnPanels();
    // Reuse the language prompt panel styling to show the error
    const prompt = document.getElementById('learn-language-prompt');
    prompt.querySelector('.learn-login-icon').textContent = '⚠️';
    prompt.querySelector('.learn-login-title').textContent = 'Something went wrong';
    prompt.querySelector('.learn-login-text').textContent = 'Could not load your learn cards. Please try again later.';
    prompt.querySelector('.learn-login-cta-btn').textContent = '← Close';
    prompt.classList.add('learn-login--show');
    return;
  }

  // 4. Show the card UI
  hideAllLearnPanels();
  document.getElementById('learn-card-body').style.display      = '';
  document.getElementById('learn-answer-section').style.display = '';

  renderLearnCard();
}

function resetLearnSession() {
  learnCardIndex   = 0;
  learnHasAnswered = false;
  learnScore       = { correct: 0, incorrect: 0 };
  learnCards       = [];

  // Reset the error panel text in case it was mutated
  const prompt = document.getElementById('learn-language-prompt');
  prompt.querySelector('.learn-login-icon').textContent  = '🌍';
  prompt.querySelector('.learn-login-title').textContent = 'Choose a Language First';
  prompt.querySelector('.learn-login-text').textContent  =
    'Select a language to learn from the main menu before starting Learn Mode. Your cards will be shown in your chosen language!';
  prompt.querySelector('.learn-login-cta-btn').textContent = '← Go Select a Language';

  hideAllLearnPanels();
  document.getElementById('learn-card-body').style.display      = '';
  document.getElementById('learn-answer-section').style.display = '';
  document.getElementById('learn-progress-fill').style.width    = '0%';
  document.getElementById('learn-progress-text').textContent    = 'Card 1 of 5';
  document.getElementById('learn-progress-pct').textContent     = '0%';
  document.getElementById('learn-feedback').className           = 'learn-feedback';
  document.getElementById('learn-feedback').textContent         = '';
  document.getElementById('learn-modal').classList.remove('learn-transitioning');
}

// ─── Render Current Card ──────────────────────────────────────────────────────

function renderLearnCard() {
  const card  = learnCards[learnCardIndex];
  const total = learnCards.length;
  const num   = learnCardIndex + 1;
  const pct   = Math.round(((num - 1) / total) * 100);

  document.getElementById('learn-progress-fill').style.width = pct + '%';
  document.getElementById('learn-progress-text').textContent = `Card ${num} of ${total}`;
  document.getElementById('learn-progress-pct').textContent  = pct + '%';
  document.getElementById('learn-card-number').textContent   = `Card ${num} of ${total}`;

  document.getElementById('learn-word-value').textContent = card.word;

  const defTitle = document.getElementById('learn-def-title');
  defTitle.textContent = card.definitions.length > 1 ? 'Definitions' : 'Definition';

  const defList = document.getElementById('learn-def-list');
  defList.innerHTML = '';
  card.definitions.forEach(function(def) {
    const li = document.createElement('li');
    li.className   = 'learn-definition-item';
    li.textContent = def;
    defList.appendChild(li);
  });

  const sentList = document.getElementById('learn-sentence-list');
  sentList.innerHTML = '';
  card.exampleSentences.english.forEach(function(engSentence, i) {
    const pair = document.createElement('div');
    pair.className = 'learn-sentence-pair';

    const engDiv = document.createElement('div');
    engDiv.className   = 'learn-sentence-english';
    engDiv.textContent = engSentence;

    const transDiv = document.createElement('div');
    transDiv.className   = 'learn-sentence-translated';
    transDiv.textContent = card.exampleSentences.translated[i] || '';

    pair.appendChild(engDiv);
    pair.appendChild(transDiv);
    sentList.appendChild(pair);
  });

  document.getElementById('learn-answer-prompt').textContent =
    `What does "${card.word}" mean in English?`;

  const feedback = document.getElementById('learn-feedback');
  feedback.className   = 'learn-feedback';
  feedback.textContent = '';

  learnHasAnswered = false;
  renderLearnAnswerButtons(card);

  document.getElementById('learn-card-body').scrollTop = 0;
}

// ─── Render Answer Buttons ────────────────────────────────────────────────────

function renderLearnAnswerButtons(card) {
  const grid = document.getElementById('learn-answer-grid');
  grid.innerHTML = '';

  const allAnswers = [card.correctAnswer].concat(card.wrongAnswers);
  const shuffled   = shuffleLearnArray(allAnswers);

  shuffled.forEach(function(answer) {
    const btn = document.createElement('button');
    btn.className   = 'learn-answer-btn';
    btn.textContent = answer;
    btn.addEventListener('click', function() {
      handleLearnAnswerClick(answer, btn, card);
    });
    grid.appendChild(btn);
  });
}

// ─── Handle Answer Click ──────────────────────────────────────────────────────

function handleLearnAnswerClick(selectedAnswer, clickedButton, card) {
  if (learnHasAnswered) return;
  learnHasAnswered = true;

  const isCorrect  = selectedAnswer === card.correctAnswer;
  const allButtons = document.getElementById('learn-answer-grid')
                       .querySelectorAll('.learn-answer-btn');

  allButtons.forEach(function(btn) { btn.disabled = true; });

  const feedback = document.getElementById('learn-feedback');

  if (isCorrect) {
    clickedButton.classList.add('correct');
    feedback.textContent = '🎉 Correct! Nice work!';
    feedback.className   = 'learn-feedback correct';
    learnScore.correct++;
  } else {
    clickedButton.classList.add('incorrect');
    allButtons.forEach(function(btn) {
      if (btn.textContent === card.correctAnswer) {
        btn.classList.add('revealed-correct');
      }
    });
    feedback.textContent = `❌ The answer was "${card.correctAnswer}"`;
    feedback.className   = 'learn-feedback incorrect';
    learnScore.incorrect++;
  }

  requestAnimationFrame(function() {
    feedback.classList.add('learn-feedback--show');
  });

  setTimeout(function() {
    advanceLearnCard();
  }, 1600);
}

// ─── Advance to Next Card ─────────────────────────────────────────────────────

function advanceLearnCard() {
  const modal = document.getElementById('learn-modal');
  modal.classList.add('learn-transitioning');

  setTimeout(function() {
    learnCardIndex++;
    modal.classList.remove('learn-transitioning');

    if (learnCardIndex >= learnCards.length) {
      showLearnComplete();
    } else {
      renderLearnCard();
    }
  }, 220);
}

// ─── Completion Screen ────────────────────────────────────────────────────────

function showLearnComplete() {
  const total     = learnCards.length;
  const correct   = learnScore.correct;
  const incorrect = learnScore.incorrect;
  const pct       = Math.round((correct / total) * 100);

  document.getElementById('learn-progress-fill').style.width = '100%';
  document.getElementById('learn-progress-text').textContent = 'Complete!';
  document.getElementById('learn-progress-pct').textContent  = '100%';

  document.getElementById('learn-card-body').style.display      = 'none';
  document.getElementById('learn-answer-section').style.display = 'none';

  document.getElementById('learn-score-correct').textContent   = correct;
  document.getElementById('learn-score-incorrect').textContent = incorrect;
  document.getElementById('learn-score-pct').textContent       = pct + '%';

  document.getElementById('learn-complete-icon').textContent =
    pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪';

  document.getElementById('learn-complete-screen').classList.add('learn-complete--show');
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function shuffleLearnArray(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j     = Math.floor(Math.random() * (i + 1));
    const tmp   = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  return shuffled;
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLearn);
} else {
  initLearn();
}
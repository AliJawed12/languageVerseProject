/**
 * learn.js
 * LanguageVerse — Learn Mode
 * Handles the 5-card daily practice session UI.
 *
 * Architecture:
 *  - Injects a "Learn" button into the shared header button group
 *  - On click: if user is logged in  → opens the learn modal/overlay
 *              if user is NOT logged in → opens the modal with a login prompt
 *  - Plays through 5 hardcoded cards (backend integration left to you)
 *  - Tracks correct / incorrect per session and shows a summary screen
 */

// ─── Hardcoded Sample Cards (replace with real fetch later) ───────────────────
// Shape mirrors the currentWord object used in app.js / flashback.js

const LEARN_SAMPLE_CARDS = [
  {
    word: "abandonar",
    definitions: ["To leave something or someone permanently", "To give up on a pursuit or activity"],
    exampleSentences: {
      english: [
        "He decided to abandon the sinking ship.",
        "She abandoned her plans after the storm.",
        "They abandoned the old house years ago."
      ],
      translated: [
        "Él decidió abandonar el barco que se hundía.",
        "Ella abandonó sus planes después de la tormenta.",
        "Ellos abandonaron la vieja casa hace años."
      ]
    },
    correctAnswer: "abandon",
    wrongAnswers: ["embrace", "pursue", "achieve"]
  },
  {
    word: "prosperar",
    definitions: ["To grow or develop in a healthy or vigorous way", "To flourish or succeed"],
    exampleSentences: {
      english: [
        "The business continued to thrive despite challenges.",
        "Plants thrive in warm, sunny conditions.",
        "Their friendship thrived over many years."
      ],
      translated: [
        "El negocio continuó prosperando a pesar de los desafíos.",
        "Las plantas prosperan en condiciones cálidas y soleadas.",
        "Su amistad prosperó durante muchos años."
      ]
    },
    correctAnswer: "thrive",
    wrongAnswers: ["wither", "collapse", "decline"]
  },
  {
    word: "distinguido",
    definitions: ["Recognized for excellence or outstanding quality", "Marked by elegance or refinement"],
    exampleSentences: {
      english: [
        "She was a distinguished professor at the university.",
        "He had a distinguished career in medicine.",
        "The distinguished guest received a warm welcome."
      ],
      translated: [
        "Ella era una profesora distinguida en la universidad.",
        "Él tuvo una carrera distinguida en medicina.",
        "El distinguido invitado recibió una cálida bienvenida."
      ]
    },
    correctAnswer: "distinguished",
    wrongAnswers: ["ordinary", "unknown", "mediocre"]
  },
  {
    word: "escaso",
    definitions: ["Available in insufficient quantity", "Barely enough to meet demand"],
    exampleSentences: {
      english: [
        "Clean water became scarce during the drought.",
        "Jobs were scarce in the small town.",
        "Fresh fruit is scarce in winter months."
      ],
      translated: [
        "El agua limpia se volvió escasa durante la sequía.",
        "Los empleos eran escasos en el pequeño pueblo.",
        "La fruta fresca es escasa en los meses de invierno."
      ]
    },
    correctAnswer: "scarce",
    wrongAnswers: ["abundant", "plentiful", "excessive"]
  },
  {
    word: "perseverar",
    definitions: ["To continue steadily despite difficulty", "To persist in doing something despite obstacles"],
    exampleSentences: {
      english: [
        "She persevered through years of hard training.",
        "He persevered despite multiple failures.",
        "The team persevered and won the championship."
      ],
      translated: [
        "Ella perseveró durante años de duro entrenamiento.",
        "Él perseveró a pesar de múltiples fracasos.",
        "El equipo perseveró y ganó el campeonato."
      ]
    },
    correctAnswer: "persevere",
    wrongAnswers: ["surrender", "quit", "hesitate"]
  }
];

// ─── State ────────────────────────────────────────────────────────────────────

let learnOverlayOpen   = false;
let learnCardIndex     = 0;       // 0-4
let learnHasAnswered   = false;
let learnScore         = { correct: 0, incorrect: 0 };
let learnCards         = [];      // populated when session starts

// ─── Init ─────────────────────────────────────────────────────────────────────

function initLearn() {
  injectLearnButton();
  injectLearnOverlay();
}

// ─── Inject Header Button ─────────────────────────────────────────────────────

function injectLearnButton() {
  const header = document.querySelector('.header');
  if (!header) return;

  // Re-use the shared button group (created by auth.js or flashback.js)
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
  // Prepend so it appears before Flashback / Login buttons
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

      <!-- Modal Header: badge + progress bar + close -->
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

      <!-- Login Prompt (shown when not logged in) -->
      <div class="learn-login-prompt" id="learn-login-prompt">
        <div class="learn-login-icon">🔒</div>
        <h2 class="learn-login-title">Members Only</h2>
        <p class="learn-login-text">
          Learn Mode lets you practice 5 words a day and track your progress.
          Log in or create an account to unlock it!
        </p>
        <button class="learn-login-cta-btn" id="learn-login-cta">👤 Log In / Register</button>
      </div>

      <!-- Card Body (word info) -->
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

  // Wire up close actions
  document.getElementById('learn-close-btn').addEventListener('click', closeLearnOverlay);
  document.getElementById('learn-complete-close-btn').addEventListener('click', closeLearnOverlay);
  document.getElementById('learn-login-cta').addEventListener('click', handleLearnLoginCTA);

  // Close on backdrop click
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLearnOverlay();
  });
}

// ─── Open / Close ─────────────────────────────────────────────────────────────

function handleLearnButtonClick() {
  // Close other panels if open
  if (typeof closeAuthPanel    === 'function' && authPanelOpen)    closeAuthPanel();
  if (typeof closeFlashbackPanel === 'function' && flashbackOpen) closeFlashbackPanel();

  openLearnOverlay();
}

function openLearnOverlay() {
  learnOverlayOpen = true;
  const overlay = document.getElementById('learn-overlay');
  overlay.classList.add('learn-overlay--visible');
  document.body.style.overflow = 'hidden'; // prevent background scroll

  // Decide what to show based on login state
  if (isUserLoggedIn()) {
    startLearnSession();
  } else {
    showLearnLoginPrompt();
  }
}

function closeLearnOverlay() {
  learnOverlayOpen = false;
  const overlay = document.getElementById('learn-overlay');
  overlay.classList.remove('learn-overlay--visible');
  document.body.style.overflow = '';
  resetLearnSession();
}

// ─── Login State Check ────────────────────────────────────────────────────────

/**
 * Checks if the user is currently logged in.
 * Relies on auth.js having set currentUser when login succeeded.
 */
function isUserLoggedIn() {
  // currentUser is declared in auth.js; falls back gracefully if undefined
  return typeof currentUser !== 'undefined' && currentUser !== null;
}

// ─── Login Prompt (not logged in) ─────────────────────────────────────────────

function showLearnLoginPrompt() {
  document.getElementById('learn-login-prompt').classList.add('learn-login--show');
  document.getElementById('learn-card-body').style.display    = 'none';
  document.getElementById('learn-answer-section').style.display = 'none';
  document.getElementById('learn-complete-screen').classList.remove('learn-complete--show');

  // Update progress bar label to reflect locked state
  document.getElementById('learn-progress-text').textContent = 'Log in to play';
  document.getElementById('learn-progress-pct').textContent  = '';
}

function handleLearnLoginCTA() {
  // Close learn modal and open auth panel
  closeLearnOverlay();
  if (typeof openAuthPanel === 'function') {
    openAuthPanel();
  }
}

// ─── Session Management ───────────────────────────────────────────────────────

function startLearnSession() {
  learnCardIndex   = 0;
  learnHasAnswered = false;
  learnScore       = { correct: 0, incorrect: 0 };

  // Use hardcoded cards for now — swap with backend fetch when ready
  learnCards = shuffleLearnArray(LEARN_SAMPLE_CARDS).slice(0, 5);

  // Make sure correct areas are visible
  document.getElementById('learn-login-prompt').classList.remove('learn-login--show');
  document.getElementById('learn-complete-screen').classList.remove('learn-complete--show');
  document.getElementById('learn-card-body').style.display      = '';
  document.getElementById('learn-answer-section').style.display = '';

  renderLearnCard();
}

function resetLearnSession() {
  learnCardIndex   = 0;
  learnHasAnswered = false;
  learnScore       = { correct: 0, incorrect: 0 };
  learnCards       = [];

  // Reset UI pieces so next open is clean
  document.getElementById('learn-login-prompt').classList.remove('learn-login--show');
  document.getElementById('learn-complete-screen').classList.remove('learn-complete--show');
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
  const card   = learnCards[learnCardIndex];
  const total  = learnCards.length;
  const num    = learnCardIndex + 1;
  const pct    = Math.round(((num - 1) / total) * 100);

  // Progress
  document.getElementById('learn-progress-fill').style.width = pct + '%';
  document.getElementById('learn-progress-text').textContent = `Card ${num} of ${total}`;
  document.getElementById('learn-progress-pct').textContent  = pct + '%';
  document.getElementById('learn-card-number').textContent   = `Card ${num} of ${total}`;

  // Word
  document.getElementById('learn-word-value').textContent = card.word;

  // Definitions
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

  // Sentences
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

  // Answer prompt
  document.getElementById('learn-answer-prompt').textContent =
    `What does "${card.word}" mean in English?`;

  // Reset feedback
  const feedback = document.getElementById('learn-feedback');
  feedback.className   = 'learn-feedback';
  feedback.textContent = '';

  learnHasAnswered = false;
  renderLearnAnswerButtons(card);

  // Scroll card body to top
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

  // Show feedback with animation
  requestAnimationFrame(function() {
    feedback.classList.add('learn-feedback--show');
  });

  // Auto-advance to next card after a short pause
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

  // Fill progress to 100%
  document.getElementById('learn-progress-fill').style.width = '100%';
  document.getElementById('learn-progress-text').textContent = 'Complete!';
  document.getElementById('learn-progress-pct').textContent  = '100%';

  // Hide card content
  document.getElementById('learn-card-body').style.display      = 'none';
  document.getElementById('learn-answer-section').style.display = 'none';

  // Update score display
  document.getElementById('learn-score-correct').textContent   = correct;
  document.getElementById('learn-score-incorrect').textContent = incorrect;
  document.getElementById('learn-score-pct').textContent       = pct + '%';

  // Pick icon based on score
  document.getElementById('learn-complete-icon').textContent =
    pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪';

  // Show completion
  document.getElementById('learn-complete-screen').classList.add('learn-complete--show');
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

function shuffleLearnArray(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j        = Math.floor(Math.random() * (i + 1));
    const tmp      = shuffled[i];
    shuffled[i]    = shuffled[j];
    shuffled[j]    = tmp;
  }
  return shuffled;
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLearn);
} else {
  initLearn();
}
/**
 * LanguageVerse Application Logic
 * Handles user interactions and page navigation
 */


// Global state
let selectedLanguage = null;
let currentWord = null;
let hasAnswered = false;
let randomWordData = null;

// DOM Elements
const languageSelectPage = document.getElementById('language-select-page');
const wordPage = document.getElementById('word-page');
const languageForm = document.getElementById('language-form');
const targetLanguageSelect = document.getElementById('target-language');
const startButton = document.getElementById('start-button');

// Word page elements
const wordValue = document.getElementById('word-value');
const definitionsTitle = document.getElementById('definitions-title');
const definitionList = document.getElementById('definition-list');
const sentenceList = document.getElementById('sentence-list');
const answerPrompt = document.getElementById('answer-prompt');
const answerGrid = document.getElementById('answer-grid');
const feedbackMessage = document.getElementById('feedback-message');

/**
 * Initialize the application
 */
async function init() {

  const todaysDate = getTodayDateString();
  console.log('Today:', todaysDate);
    
  todaysWord = await fetchWordOfTheDay(todaysDate);
  


  randomWordData = await fetchRandomWord();
  console.log('randomWordData:', randomWordData);


  if (!randomWordData) {
    console.error('fetchRandomWord returned null/undefined — check the /server/mongodb/read_random_word endpoint');
    return
  };

  languageForm.addEventListener('submit', handleLanguageSubmit);
  console.log('submit listener attached'); // <-- does this log?

  targetLanguageSelect.addEventListener('change', function() {
    startButton.disabled = !this.value;
  });
}

/**
 * Handle language form submission
 * @param {Event} e - Form submit event
 */
async function handleLanguageSubmit(e) {
  e.preventDefault();

  selectedLanguage = targetLanguageSelect.value;
  if (!selectedLanguage) return;

  const { translatedWord, translatedSentences } = getLanguageSentences(randomWordData, selectedLanguage);

  currentWord = {
    word: translatedWord,
    definitions: [
      randomWordData.word.engDef1,
      randomWordData.word.engDef2,
      randomWordData.word.engDef3
    ].filter(Boolean),
    exampleSentences: {
      english: [
        randomWordData.english_sentences.engSentence1,
        randomWordData.english_sentences.engSentence2,
        randomWordData.english_sentences.engSentence3
      ].filter(Boolean),
      translated: translatedSentences.filter(Boolean)
    },
    correctAnswer: randomWordData.word.word,
    wrongAnswers: [randomWordData.incorrect_answers[0], 
    randomWordData.incorrect_answers[1], 
    randomWordData.incorrect_answers[2]]
  };

  if (!currentWord.word) {
    alert('No word available for this language yet. Please check back later!');
    return;
  }

  languageSelectPage.style.display = 'none';
  wordPage.style.display = 'flex';

  renderWordPage();
}

/**
 * Render the word of the day page
 */
function renderWordPage() {
  if (!currentWord) return;

  hasAnswered = false;
  feedbackMessage.style.display = 'none';

  wordValue.textContent = currentWord.word;

  definitionsTitle.textContent = currentWord.definitions.length > 1 ? 'Definitions' : 'Definition';

  definitionList.innerHTML = '';
  currentWord.definitions.forEach(function(def) {
    const li = document.createElement('li');
    li.className = 'definition-item';
    li.textContent = def;
    definitionList.appendChild(li);
  });

  sentenceList.innerHTML = '';
  currentWord.exampleSentences.english.forEach(function(englishSentence, index) {
    const pairDiv = document.createElement('div');
    pairDiv.className = 'sentence-pair';

    const englishDiv = document.createElement('div');
    englishDiv.className = 'sentence-english';
    englishDiv.textContent = englishSentence;

    const translatedDiv = document.createElement('div');
    translatedDiv.className = 'sentence-translated';
    translatedDiv.textContent = currentWord.exampleSentences.translated[index];

    pairDiv.appendChild(englishDiv);
    pairDiv.appendChild(translatedDiv);
    sentenceList.appendChild(pairDiv);
  });

  answerPrompt.textContent = 'What does "' + currentWord.word + '" mean in English?';

  renderAnswerButtons();
}

/**
 * Render answer buttons with shuffled options
 */
function renderAnswerButtons() {
  answerGrid.innerHTML = '';

  const allAnswers = [currentWord.correctAnswer].concat(currentWord.wrongAnswers);
  const shuffledAnswers = shuffleArray(allAnswers);

  shuffledAnswers.forEach(function(answer) {
    const button = document.createElement('button');
    button.className = 'answer-button';
    button.textContent = answer;
    button.onclick = function() {
      handleAnswerClick(answer, button);
    };
    answerGrid.appendChild(button);
  });
}

/**
 * Handle answer button click
 * @param {string} selectedAnswer - The answer that was clicked
 * @param {HTMLElement} clickedButton - The button element that was clicked
 */
function handleAnswerClick(selectedAnswer, clickedButton) {
  if (hasAnswered) return;

  hasAnswered = true;

  const isCorrect = selectedAnswer === currentWord.correctAnswer;

  const allButtons = answerGrid.querySelectorAll('.answer-button');
  allButtons.forEach(function(btn) {
    btn.disabled = true;
  });

  if (isCorrect) {
    clickedButton.classList.add('correct');
    feedbackMessage.textContent = '🎉 Correct! Great job!';
    feedbackMessage.className = 'feedback-message correct';
  } else {
    clickedButton.classList.add('incorrect');
    allButtons.forEach(function(btn) {
      if (btn.textContent === currentWord.correctAnswer) {
        btn.classList.add('revealed-correct');
      }
    });
    feedbackMessage.textContent = '❌ Incorrect. The correct answer is "' + currentWord.correctAnswer + '"';
    feedbackMessage.className = 'feedback-message incorrect';
  }

  feedbackMessage.style.display = 'block';

  setTimeout(function() {
    feedbackMessage.style.display = 'none';
  }, 3000);
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
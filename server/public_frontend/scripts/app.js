/**
 * LanguageVerse Application Logic
 * Handles user interactions and page navigation
 */

// Global state
let selectedLanguage = null;
let currentWord = null;
let hasAnswered = false;

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
function init() {
  // Add form submit listener
  languageForm.addEventListener('submit', handleLanguageSubmit);
  
  // Enable/disable start button based on selection
  targetLanguageSelect.addEventListener('change', function() {
    startButton.disabled = !this.value;
  });
}

/**
 * Handle language form submission
 * @param {Event} e - Form submit event
 */
function handleLanguageSubmit(e) {
  e.preventDefault();
  
  selectedLanguage = targetLanguageSelect.value;
  
  if (!selectedLanguage) return;
  
  // Get word data for selected language
  currentWord = getWordOfTheDay(selectedLanguage);
  
  if (!currentWord) {
    alert('No word available for this language yet. Please check back later!');
    return;
  }
  
  // Hide language select page and show word page
  languageSelectPage.style.display = 'none';
  wordPage.style.display = 'flex';
  
  // Render the word page
  renderWordPage();
}

/**
 * Render the word of the day page
 */
function renderWordPage() {
  if (!currentWord) return;
  
  // Reset state
  hasAnswered = false;
  feedbackMessage.style.display = 'none';
  
  // Set word value
  wordValue.textContent = currentWord.word;
  
  // Set definitions title (singular or plural)
  definitionsTitle.textContent = currentWord.definitions.length > 1 ? 'Definitions' : 'Definition';
  
  // Render definitions
  definitionList.innerHTML = '';
  currentWord.definitions.forEach(function(def) {
    const li = document.createElement('li');
    li.className = 'definition-item';
    li.textContent = def;
    definitionList.appendChild(li);
  });
  
  // Render example sentences
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
  
  // Set answer prompt
  answerPrompt.textContent = 'What does "' + currentWord.word + '" mean in English?';
  
  // Render answer buttons
  renderAnswerButtons();
}

/**
 * Render answer buttons with shuffled options
 */
function renderAnswerButtons() {
  answerGrid.innerHTML = '';
  
  // Combine and shuffle answers
  const allAnswers = [currentWord.correctAnswer].concat(currentWord.wrongAnswers);
  const shuffledAnswers = shuffleArray(allAnswers);
  
  // Create button for each answer
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
  // Prevent multiple answers
  if (hasAnswered) return;
  
  hasAnswered = true;
  
  // Check if answer is correct
  const isCorrect = selectedAnswer === currentWord.correctAnswer;
  
  // Disable all buttons
  const allButtons = answerGrid.querySelectorAll('.answer-button');
  allButtons.forEach(function(btn) {
    btn.disabled = true;
  });
  
  // Apply styles to buttons
  if (isCorrect) {
    // Mark clicked button as correct
    clickedButton.classList.add('correct');
    
    // Show success feedback
    feedbackMessage.textContent = '🎉 Correct! Great job!';
    feedbackMessage.className = 'feedback-message correct';
  } else {
    // Mark clicked button as incorrect
    clickedButton.classList.add('incorrect');
    
    // Highlight the correct answer
    allButtons.forEach(function(btn) {
      if (btn.textContent === currentWord.correctAnswer) {
        btn.classList.add('revealed-correct');
      }
    });
    
    // Show error feedback
    feedbackMessage.textContent = '❌ Incorrect. The correct answer is "' + currentWord.correctAnswer + '"';
    feedbackMessage.className = 'feedback-message incorrect';
  }
  
  // Show feedback message
  feedbackMessage.style.display = 'block';
  
  // Hide feedback after 3 seconds
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
  const shuffled = array.slice(); // Create a copy
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

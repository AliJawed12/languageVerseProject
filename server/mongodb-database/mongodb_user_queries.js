// mongodb_user_queries.js

import { User } from "./model/user.js";

/**
 * Updates the progression of a word in wordsLearning
 * @param {Object} user - Mongoose user document
 * @param {Number} index - Word index
 * @param {String|Number} comprehension - 'ascend', 'descend', or 0-5 level
 * @param {Date} todaysDate - Date to mark progression
 * @returns {Array|null} - Updated word entry or null if not found
 */
async function progressionUpdate(user, index, comprehension, todaysDate = new Date()) {
  if (!user.wordsLearning || !Array.isArray(user.wordsLearning)) return null;

  const wordEntry = user.wordsLearning.find(arr => arr[0] === index);
  if (!wordEntry) return null;

  let currentLevel = wordEntry[2] || 0;

  if (comprehension === 'ascend') {
    currentLevel = Math.min(currentLevel + 1, 5);
  } else if (comprehension === 'descend') {
    currentLevel = Math.max(currentLevel - 1, 0);
  } else if (typeof comprehension === 'number') {
    currentLevel = Math.min(Math.max(comprehension, 0), 5);
  }

  wordEntry[2] = currentLevel;
  wordEntry[3] = todaysDate;

  await user.save();
  return wordEntry;
}


/**
 * Marks a word as completed
 * @param {Object} user - Mongoose user document
 * @param {Number} index - Word index
 * @param {Date} [date] - When the word was completed, defaults to now
 * @param {Date} [dateLearned] - Optional, defaults to now
 * @returns {Array} - Newly added completed entry
 */
async function addToWordsCompleted(user, index, todaysDate, dateLearned) {
  if (!user.wordsCompleted) {
    user.wordsCompleted = [];
  }

  // ✅ prevent duplicates
  const exists = user.wordsCompleted.some(w => w.wordIndex === index);
  if (exists) return null;

  const entry = {
    wordIndex: index,
    todaysDate,
    dateLearned
  };

  user.wordsCompleted.push(entry);
  await user.save();

  return entry;
}

async function addToWordsFailed(user, index, todaysDate) {
  if (!user.wordsFailed) {
    user.wordsFailed = [];
  }

  // prevent dupes
  const exists = user.wordsFailed.some(w => w.wordIndex === index);
  if (exists) return null;

  const entry = {
    wordIndex: index,
    todaysDate
  };

  user.wordsFailed.push(entry);
  await user.save();

  return entry;
}






export { progressionUpdate, addToWordsCompleted, addToWordsFailed };
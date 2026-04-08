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
 * Adds a word to wordsFailed array
 * @param {Object} user - Mongoose user document
 * @param {Number} index - Word index
 * @param {Date} date - Optional, defaults to now
 * @returns {Array} - Newly added entry
 */
async function addToWordsFailed(user, index, date) {
  const entry = [index, date];
  user.wordsFailed.push(entry);
  await user.save();
  return entry;
}

/**
 * Adds a word to wordsLearning array
 * @param {Object} user - Mongoose user document
 * @param {Number} index - Word index
 * @param {Date} date - Optional, defaults to now
 * @param {Number} comprehension - Initial understanding level, defaults to 0
 * @param {Date} progressionDate - Optional, defaults to now
 * @returns {Array} - Newly added entry
 */
async function addToWordsLearning(
  user,
  index,
  date,
  comprehension = 0,
  progressionDate
) {
  const entry = [index, date, comprehension, progressionDate];
  user.wordsLearning.push(entry);
  await user.save();
  return entry;
}

/**
 * Marks a word as completed
 * @param {Object} user - Mongoose user document
 * @param {Number} index - Word index
 * @param {Date} [date] - When the word was completed, defaults to now
 * @param {Date} [dateLearned] - Optional, defaults to now
 * @returns {Array} - Newly added completed entry
 */
async function addToWordsCompleted(user, index, date, dateLearned) {
  if (!user.wordsCompleted || !Array.isArray(user.wordsCompleted)) {
    user.wordsCompleted = [];
  }

  const entry = [index, date, dateLearned];
  user.wordsCompleted.push(entry);
  await user.save();
  return entry;
}

export { progressionUpdate, addToWordsFailed, addToWordsLearning, addToWordsCompleted };
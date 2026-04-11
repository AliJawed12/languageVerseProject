// mongodb_user_queries.js

import { User } from "./model/user.js";
import { BaseData } from "./model/base_data.js";

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

  // ❗ check other list first
  if (existsInDB(user, index, "wordsFailed")) {
    return "word exists in wordsFailed already. Must learn first!";
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

  // ❗ check other list first
  if (existsInDB(user, index, "wordsCompleted")) {
    return "word exists in wordsFailed already. Must learn first!";
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

async function addToWordsLearning(user, index, todaysDate, answerResult) {

  console.log("In addToWordsLearning");

  if (!user.wordsFailed) {
    user.wordsFailed = [];
  }


  // prevent dupes
  const exists = user.wordsLearning.some(w => w.wordIndex === index);
  if (exists) return null;

  // When adding a word to the DB if user got then answer correct, then comprehension level of 3, if wrong then 2
  let comprehensionLevel = 0;
  // if user got it right
  if (answerResult == 1) {
    comprehensionLevel = 3;
  }
  else {
    comprehensionLevel = 2;
  }

  const entry = {
    wordIndex: index,
    todaysDate,
    comprehensionLevel,
    progressionDate: todaysDate
  };

  user.wordsLearning.push(entry);
  await user.save();

  return entry;
}




// Takes either wordsCompleted or wordsFailed as param for dataArrayKey, checks whether the word already exists
// Meant to be used as helper functon for adding to DB, preventing a word from being in both wordsFailed and wordsCompleted
function existsInDB(user, index, dataArrayKey) {
  const arr = user[dataArrayKey];

  if (!arr || !Array.isArray(arr)) return false;

  return arr.some(item => item.wordIndex === index);
}


/**
 * Build a 5-card learning session:
 * - pulls from prioritized level chains
 * - falls back across multiple levels
 * - removes duplicates
 * - ensures exactly 5 cards (fills from full DB if needed)
 */

/**
 * Fisher-Yates shuffle
 */
function getRandomItems(arr, count) {
  const copy = arr.slice();

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, Math.min(count, copy.length));
}

/**
 * Pick from multiple comprehension levels (user data)
 */
function pickByLevels(user, levels, count) {
  let pool = [];

  for (const level of levels) {
    const matches = user.wordsLearning.filter(
      w => w.comprehensionLevel === level
    );
    pool = pool.concat(matches);
  }

  return getRandomItems(pool, count);
}

/**
 * Remove duplicates by wordIndex
 */
function uniqueByWordIndex(arr) {
  const seen = new Set();
  return arr.filter(item => {
    if (seen.has(item.wordIndex)) return false;
    seen.add(item.wordIndex);
    return true;
  });
}

/**
 * Fill missing cards from BaseData collection
 * (used when user learning pool is not enough)
 */
async function fillFromBaseData(excludeSet, count) {
  const pool = await BaseData.aggregate([
    { $match: { wordIndex: { 
      $nin: Array.from(excludeSet),
      $gte: 1, // Random cards selcted from only index of 1 - 1950, can remove this late 
      $lte: 1950
    } } },
    { $sample: { size: count } }
  ]);

  // convert BaseData → "filler learning card"
  return pool.map(word => ({
    wordIndex: word.wordIndex,
    todaysDate: "00-00-0000",
    comprehensionLevel: -100,
    progressionDate: "00-00-0000",
  }));
}

/**
 * MAIN: builds a 5-card session
 */
async function learnCards(user) {
  if (!user.wordsLearning) return [];

  // 1. Build learning pool (structured difficulty logic)
  let cards = [
    ...pickByLevels(user, [1, 2, 3, 4, 5], 2),
    ...pickByLevels(user, [2, 3, 4, 5, 1], 2),
    ...pickByLevels(user, [4, 5, 3, 2, 1], 1)
  ];

  // 2. Remove duplicates
  cards = uniqueByWordIndex(cards);

  // 3. Ensure exactly 5 cards
  const needed = 5 - cards.length;

  if (needed > 0) {
    const used = new Set(cards.map(c => c.wordIndex));

    const filler = await fillFromBaseData(used, needed);

    cards = cards.concat(filler);

    // final safety dedupe
    cards = uniqueByWordIndex(cards);
  }

  return cards;
}



export { progressionUpdate, addToWordsCompleted, addToWordsFailed, addToWordsLearning, learnCards };
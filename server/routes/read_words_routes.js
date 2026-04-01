// read_words_routes.js

import express from 'express';
import { readWordByIndex, getWordOfTheDay, readRandomWords, uploadToFlashback } from '../mongodb-database/mongodb_queries.js';

const readWordsRouter = express.Router();

// GET random word
readWordsRouter.get('/mongodb/read_random_word', async (req, res) => {
  try {
    // Call readRanndomWord function from mongodb_queries.js and store it
    const data = await readRandomWords();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST today's date to grab the word of the day
readWordsRouter.post('/mongodb/get_word_of_the_day', async (req, res) => {
  try {
    const wordString = req.body.date; // string from POST body

    const word = await getWordOfTheDay(wordString);
    res.json(word);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST todays word of the day data
readWordsRouter.post('/mongodb/add_word_to_flashback', async (req, res) => {
  try {

    // Grab the parsed in data from the frontend
    const dateString = req.body.date; // string from POST body
    const index = req.body.index;
    const word = req.body.word;


    const wordDataResult = await uploadToFlashback(dateString, index, word);
    res.json(wordDataResult);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

readWordsRouter.post('/mongodb/read_todays_word', async (req, res) => {
  try {

    // Grab the parsed in data from the frontend
    const index = req.body.index;
    


    const wordDataResult = await readWordByIndex(index);
    res.json(wordDataResult);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// POST a new word
readWordsRouter.post('/add', async (req, res) => {
  try {
    const word = await addToWordDB();
    res.json(word);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export { readWordsRouter };
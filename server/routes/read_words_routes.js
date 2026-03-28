// read_words_routes.js

import express from 'express';
import { readRandomWord } from '../mongodb-database/mongodb_queries.js';

const readWordsRouter = express.Router();

// GET random word
readWordsRouter.get('/mongodb/read_random_word', async (req, res) => {
  try {
    const data = await readRandomWord();
    res.json(data);
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
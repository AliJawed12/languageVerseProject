// auth_routes.js

import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../mongodb-database/model/user.js';
import { requireAuth } from '../middleware/auth.js';
import { addToWordsCompleted, addToWordsFailed, addToWordsLearning, learnCards } from '../mongodb-database/mongodb_user_queries.js';

const authRouter = express.Router();

// REGISTER
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    await User.create({ email, password });
    res.status(201).json({ message: 'Account created!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Logged in!', email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGOUT
authRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// GET CURRENT USER (protected)
authRouter.get('/me', requireAuth, (req, res) => {
  res.json({
    email: req.user.email,
    id: req.user._id,
    wordsCompleted: req.user.wordsCompleted
  });
});

// ADD a word to Completed List
authRouter.post('/add/completed_word', requireAuth, async (req, res) => {
  try {
    const { index, todaysDate } = req.body;

    if (index === undefined || !todaysDate) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const entry = await addToWordsCompleted(
      req.user,
      index,
      todaysDate,
      todaysDate // same value for now
    );

    res.json({ message: 'Word added to completed', entry });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ADD a word to Failed List
authRouter.post('/add/failed_word', requireAuth, async (req, res) => {
  try {
    const { index, todaysDate } = req.body;

    if (index === undefined || !todaysDate) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const entry = await addToWordsFailed(
      req.user,
      index,
      todaysDate,
    );

    res.json({ message: 'Word added to completed', entry });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ADD a word to Learning List
authRouter.post('/add/learning_word', requireAuth, async (req, res) => {
  try {
    const { index, todaysDate, answerResult } = req.body;

    console.log("Inside router");

    if (index === undefined || !todaysDate || (answerResult !== 0 && answerResult !== 1)) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const entry = await addToWordsLearning(
      req.user,
      index,
      todaysDate,
      answerResult
    );

    console.log("Sent data to server");

    res.json({ message: 'Word added to learning list', entry });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if user already attempted a word today
authRouter.get('/check_word_attempted', requireAuth, async (req, res) => {
  try {
    const { wordIndex, todaysDate } = req.query;
    if (wordIndex === undefined || !todaysDate) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const user = req.user;

    const completed = user.wordsCompleted.some(w => w.wordIndex === Number(wordIndex) && w.todaysDate === todaysDate);
    const failed = user.wordsFailed.some(w => w.wordIndex === Number(wordIndex) && w.todaysDate === todaysDate);

    if (completed) return res.json({ attempted: true, correct: true });
    if (failed) return res.json({ attempted: true, correct: false });

    res.json({ attempted: false, correct: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get learn cards
authRouter.get("/learn/get_cards", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const cards = await learnCards(user);

    console.log("Generated cards:", cards);

    res.json(cards);
  } catch (err) {
    console.error("TEST LEARN CARDS ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});




export { authRouter };
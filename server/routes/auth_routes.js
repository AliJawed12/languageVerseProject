// auth_routes.js

import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../mongodb-database/model/user.js';
import { requireAuth } from '../middleware/auth.js';

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

export { authRouter };
// flashback_data.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const flashbackDataSchema = new Schema({
  date: {
    type: String,        // "YYYY-MM-DD"
    required: true,
    unique: true,
  },
  wordIndex: {
    type: Number,
    required: true,
    unique: true
  },
  word: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const FlashbackData = model('Flashback', flashbackDataSchema);
export { FlashbackData };
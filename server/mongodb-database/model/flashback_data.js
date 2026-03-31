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
  incorrect_answers: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length === 3,
      message: "incorrect_answers must contain exactly 3 words",
    },
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
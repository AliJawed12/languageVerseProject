// english_sentences.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const englishSentenceSchema = new Schema({
  wordIndex: {
    type: Number,
    required: true,
    unique: true
  },
  englishWord: {
    type: String,
    required: true
  },
  engDef1: {
    type: String,
    required: true
  },
  engDef2: {
    type: String
  },
  engDef3: {
    type: String
  },
  engSentence1: {
    type: String,
    required: true
  },
  engSentence2: {
    type: String
  },
  engSentence3: {
    type: String
  },

}, {
  timestamps: true
});

const EnglishSentence = model('EnglishSentence', englishSentenceSchema);
export { EnglishSentence };
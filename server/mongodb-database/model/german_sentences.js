// german_sentences.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const germanSentenceSchema = new Schema({
  wordIndex: {
    type: Number,
    required: true,
    unique: true
  },
  englishWord: {
    type: String,
    required: true
  },
  germanWord: {
    type: String,
    required: true
  },
  gerDef1: {
    type: String,
    required: true
  },
  gerDef2: {
    type: String
  },
  gerDef3: {
    type: String
  },
  gerSentence1: {
    type: String,
    required: true
  },
  gerSentence2: {
    type: String
  },
  gerSentence3: {
    type: String
  }
}, {
  timestamps: true
});

const GermanSentence = model('GermanSentence', germanSentenceSchema);
export { GermanSentence };
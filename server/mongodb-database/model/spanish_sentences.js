// spanish_sentences.js

import mongoose from "mongoose";
import { type } from "os";
const { Schema, model } = mongoose;

const spanishSentenceSchema = new Schema({
  wordIndex: {
    type: Number,
    required: true,
    unique: true
  },
  englishWord: {
    type: String,
    required: true
  },
  spanishWord: {
    type: String,
    required: true
  },
  spaDef1: {
    type: String,
    required: true
  },
  spaDef2: {
    type: String
  },
  spaDef3: {
    type: String
  },
  spaSentence1: {
    type: String,
    required: true
  },
  spaSentence2: {
    type: String
  },
  spaSentence3: {
    type: String
  },
}, {
  timestamps: true
});

const SpanishSentence = model('SpanishSentence', spanishSentenceSchema);
export { SpanishSentence };
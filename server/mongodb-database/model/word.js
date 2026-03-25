// word.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const wordSchema = new Schema ({
  wordIndex: {
    type: Number,
    required: true,
    unique: true
  },
  word: {
    type: String,
    required: true
  },
  spanishWord: {
    type: String,
    required: true
  },
  germanWord: {
    type: String,
    required: true
  },
  dutchWord: {
    type: String,
    required: true
  },
  engDef1: {
    type: String,
    required: true
  },
  engDef2: String,
  engDef3: String 
}, {
    timestamps: true
});

const Word = model('Word', wordSchema);
export {Word};
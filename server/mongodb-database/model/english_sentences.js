// english_sentences.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const englishSentenceSchema = new Schema({
    
}, {
  timestamps: true
});

const EnglishSentence = model('EnglishSentence', englishSentenceSchema);
export { EnglishSentence };
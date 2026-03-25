// german_sentences.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const germanSentenceSchema = new Schema({
    
}, {
  timestamps: true
});

const GermanSentence = model('GermanSentence', germanSentenceSchema);
export { GermanSentence };
// dutch_sentences.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const dutchSentenceSchema = new Schema({
    
}, {
  timestamps: true
});

const DutchSentence = model('DutchSentence', dutchSentenceSchema);
export { DutchSentence };
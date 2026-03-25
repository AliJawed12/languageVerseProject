// spanish_sentences.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const spanishSentenceSchema = new Schema({
    
}, {
  timestamps: true
});

const SpanishSentence = model('SpanishSentence', spanishSentenceSchema);
export { SpanishSentence };
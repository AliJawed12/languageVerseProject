// user.js


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wordsCompleted: {
    // index, date, dateLearned
    type: [[Schema.Types.Mixed]], // array of arrays
    default: []
  },
  wordsFailed: {
    // index, date, 
    type: [[Schema.Types.Mixed]], // array of arrays
    default: []
  },
  wordsLearning: {
    // index, date, understandingLevel, progressionDate
    type: [[Schema.Types.Mixed]], // array of arrays
    default: []
  },
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = model('User', userSchema);
export { User };
// user.js


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wordsCompleted: [
    {
      wordIndex: {
        type: Number,
        required: true,
      },
      todaysDate: {
        type: String,        // "YYYY-MM-DD"
        required: true,
      },
      dateLearned: {
        type: String,        // "YYYY-MM-DD"
        required: true,
      }
    }
  ],
  wordsFailed: [
    {
      wordIndex: {
        type: Number,
        required: true,
      },
      todaysDate: {
        type: String,        // "YYYY-MM-DD"
        required: true,
      }
    }
  ],
  wordsLearning: [
    {
      wordIndex: {
        type: Number,
        required: true,
      },
      todaysDate: {
        type: String,        // "YYYY-MM-DD"
        required: true,
      },
      comprehensionLevel: {
        type: Number,
        required: true,
      },
      progressionDate: {
        type: String,        // "YYYY-MM-DD"
        required: true,
      },
    }
  ]
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
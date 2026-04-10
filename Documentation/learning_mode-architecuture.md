# Language Learning System — Current Architecture

## Overview

You have built a hybrid language learning system that combines:

- User progress tracking (learning state)
- Global vocabulary database (word source)
- Dynamic session builder (5-card generator)

The system generates a 5-card learning session for each user.

---

# Data Models

## 1. User Model (`User`)

Stores all learning progress per user.

### wordsLearning
Tracks active learning state.

```js
{
  wordIndex: Number,
  todaysDate: "YYYY-MM-DD",
  comprehensionLevel: Number,
  progressionDate: "YYYY-MM-DD"
}
This is the ONLY source of learning progress
These are the only objects with MongoDB _id
wordsCompleted

Words fully learned.

{
  wordIndex: Number,
  todaysDate: "YYYY-MM-DD",
  dateLearned: "YYYY-MM-DD"
}
wordsFailed

Words answered incorrectly.

{
  wordIndex: Number,
  todaysDate: "YYYY-MM-DD"
}
2. BaseData Model (BaseData)

Global vocabulary database (~2000+ words).

{
  wordIndex: Number,
  word: String,
  spanishWord: String,
  germanWord: String,
  dutchWord: String,
  engDef1: String,
  engDef2: String,
  engDef3: String
}
This is the master word source
No learning state stored here
Core System Logic
Session Builder (learnCards)

Generates a 5-card learning session.

Flow:
Pull words from wordsLearning based on comprehension levels
Randomize and combine results
Remove duplicates
Fill missing slots from BaseData
Return exactly 5 cards
Level-Based Selection
pickByLevels(user, [levels], count)
Pulls words matching comprehension levels
Supports fallback level chains
Returns random subset
Randomization

Fisher-Yates shuffle ensures unbiased selection.

Duplicate Removal

Ensures no repeated wordIndex in a session.

Fallback System (BaseData)

When not enough learning words exist:

Pull random words from BaseData
Exclude already used words
Convert them into session format:
{
  wordIndex,
  comprehensionLevel: -100,
  todaysDate: "00-00-0000",
  progressionDate: "00-00-0000"
}
Design Decisions
Filler Identification System
comprehensionLevel === -100 means filler word
No extra flags used
Frontend relies on this rule
_id Meaning
Exists → real learning word (from wordsLearning)
Missing → filler word (from BaseData)

This acts as an implicit type system.

Final Session Output

Each session returns:

[
  {
    wordIndex,
    comprehensionLevel,
    todaysDate,
    progressionDate,
    _id (only for real learning words)
  }
]
API Flow
1. Frontend

User answers word:

addLearningWord(index, date, result)
2. Backend updates
wordsLearning
wordsCompleted
wordsFailed
3. Session generation
learnCards(user)

Returns 5-card session.

System Capabilities
Tracks learning progress
Uses comprehension-based difficulty
Generates adaptive sessions
Uses BaseData fallback
Prevents duplicates
Ensures 5-card output
Distinguishes real vs filler via _id + -100 rule
Mental Model
BaseData = vocabulary bank
wordsLearning = user memory state
learnCards() = session generator
Summary

You have built a hybrid spaced repetition system combining:

Anki-style learning tracking
Duolingo-style session generation
MongoDB-backed vocabulary system
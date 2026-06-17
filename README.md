# LanguageVerse

A web-based, gamified vocabulary learning platform inspired by Wordle and
Spelling Bee. Users learn high-frequency vocabulary (English, Spanish, German,
Dutch) through a daily Word-of-the-Day challenge, a personalized Learn Mode
with comprehension tracking, and a Flashback mode for revisiting past days.

Built as an Honors Capstone project (HON 499WI, Central Michigan University).

## What it does

- **Word of the Day** — a daily vocabulary challenge: users see a definition
  and example sentence and pick the correct word from multiple choice options
  (one correct answer + three randomly pulled incorrect ones).
- **Learn Mode** — a personalized review session (5 words/day) for
  registered users, drawn from their in-progress vocabulary and weighted
  toward words they're still working on.
- **Flashback** — lets users replay a specific previous day's Word of the Day.
- **Accounts** — registration/login with JWT-based auth (httpOnly cookies)
  and bcrypt password hashing.
- **Multi-language word bank** — each word entry stores English, Spanish,
  German, and Dutch translations plus up to three English definitions and
  per-language example sentences.

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript (no framework)
- **Backend:** Node.js + Express
- **Database:** MongoDB (MongoDB Atlas) via Mongoose
- **Auth:** JWT + httpOnly cookies, bcrypt for password hashing
- **AI integrations:** Anthropic Claude, OpenAI, and Google Gemini SDKs are
  wired in (`server/ai-workspaces-connections/`) and used during content
  generation/data prep (definitions and example sentences)

## Project Structure

```
.
├── Documentation/              # Dev logs and architecture notes written during development
├── data_files/                 # Flat-file word/sentence data (source material for seeding MongoDB)
└── server/
    ├── index.js                # App entry point — Express setup, route mounting, DB connection
    ├── load_env.js              # Loads environment variables before other imports run
    ├── ai-workspaces-connections/  # Claude / OpenAI / Gemini API client wrappers
    ├── middleware/
    │   └── auth.js              # JWT cookie verification middleware (requireAuth)
    ├── mongodb-database/
    │   ├── model/                # Mongoose schemas: User, Word, BaseData, FlashbackData, per-language sentence models
    │   ├── mongodb_queries.js    # Word-of-the-day lookup, sentence lookup, flashback storage
    │   ├── mongodb_user_queries.js  # Comprehension tracking, Learn Mode session builder
    │   ├── seed.js / seed_files/ # Scripts to populate MongoDB from data_files/
    │   └── mongoose-connection.js
    ├── routes/
    │   ├── auth_routes.js        # Register / login / logout / learn cards / progress endpoints
    │   └── read_words_routes.js  # Word-of-the-day, random word, flashback endpoints
    ├── util_scripts/
    │   └── data_scripts.js       # Random index generation, incorrect-answer sampling
    └── public_frontend/
        ├── home.html, index.html, etc.
        ├── scripts/               # app.js, auth.js, learn.js, flashback.js, etc.
        └── styles/
```

## Requirements

- Node.js v18+
- A MongoDB instance (local or MongoDB Atlas)
- API keys for any AI providers you want active: `OPENAI_API_KEY`,
  `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` (only needed if you're regenerating
  content; not required to run the core app against already-seeded data)

## Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/AliJawed12/languageVerseProject.git
   cd languageVerseProject/server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in `server/` with at least:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000

   # Optional — only needed if using AI-assisted content generation
   OPENAI_API_KEY=...
   ANTHROPIC_API_KEY=...
   GEMINI_API_KEY=...
   ```

   Do not commit this file. It's excluded via `.gitignore`.

4. **Seed the database** (first run only)

   The `seed_files/` scripts under `mongodb-database/` populate MongoDB
   from the flat files in `data_files/`. Run the relevant seed script(s)
   referenced in `server/index.js` (`seedBaseData`, `seedEnglishData`,
   `seedSpanishData`, `seedGermanData`, `seedDutchData`, `seedFlashbackData`)
   to load word and sentence data into your MongoDB instance.

5. **Run the server**

   ```bash
   npm run dev
   ```

   The app serves on `http://localhost:3000` (or your configured `PORT`),
   with `home.html` as the default page.

## API Overview

**Word data** (`/server`)
- `GET /mongodb/read_random_word` — random word + sentences + multiple-choice options
- `POST /mongodb/get_word_of_the_day` — fetch a stored word for a given date
- `POST /mongodb/add_word_to_flashback` — store a date's word for later flashback replay
- `POST /mongodb/read_todays_word` — fetch word data by index

**Auth & progress** (`/server/auth`)
- `POST /register`, `POST /login`, `POST /logout`
- `GET /me` — current authenticated user (protected)
- `POST /add/completed_word`, `POST /add/failed_word`, `POST /add/learning_word`
- `GET /check_word_attempted` — whether the user already attempted today's word
- `GET /learn/get_cards` — generates a 5-card Learn Mode session for the user

## How Learn Mode Works (as implemented)

Each user has a `wordsLearning` list tracking, per word, a comprehension
level (0–5) and the last date it was updated. When a word is first missed or
answered, it enters this list at level 2 or 3 depending on the initial
result. A correct/incorrect answer afterward moves the level up or down by 1
(clamped to 0–5).

To build a daily 5-card session, the backend pools the user's words across
several comprehension-level priority chains, shuffles the pool (Fisher-Yates),
removes duplicates, and — if there still aren't 5 cards — fills the remainder
with random words from the global word bank (`BaseData`) so a session always
returns exactly 5 cards.

## Data Pipeline (Java / Jsoup)

The original word dataset (English definitions pulled from Merriam-Webster,
later expanded with Spanish/German/Dutch translations and example sentences)
was processed using a separate Java application built with
[Jsoup](https://jsoup.org/), a Java library for parsing and extracting data
from HTML. That pipeline lives in a separate repository/machine and is not
yet included here — **it will be added to this repo** (or linked from here)
in a future update. Once added, this section will be expanded with setup and
usage instructions for that pipeline.

In the meantime, the `data_files/` directory in this repo contains the
processed output of that pipeline (`full_data.txt`, `filtered_data.txt`,
and the per-language sentence files), which is what `seed_files/` uses to
populate MongoDB.

## Notes on Project History

This repo reflects an actively evolving capstone project, and a few design
ideas explored in the accompanying capstone report and poster are not (yet)
present in the application code itself:

- The daily Word-of-the-Day is currently selected via uniform random
  selection (`Math.random()`), not a Fisher-Yates shuffle. Fisher-Yates is
  used elsewhere, to shuffle the Learn Mode session pool.
- An Ebbinghaus-curve-based decay/"graduation" system (words reappearing on
  a schedule based on time since last review) is discussed as a design goal
  but is not yet implemented — the current comprehension system is a simple
  ±1 adjustment per answer with no time-based reappearance logic.

See `Documentation/dev_logs.md` and `Documentation/learning_mode-architecuture.md`
for the developer's own running notes on these design decisions.

## License

No license specified.

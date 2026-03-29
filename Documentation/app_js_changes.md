

## Sat March 28, 2026
1. Page loads (home.html). The HTML defines two "pages" stacked in the same <main> container — #language-select-page (visible by default) and #word-page (hidden with display: none). At the bottom, it loads data.js first, then app.js. Order matters here — app.js calls functions from data.js, so data.js must be ready first.

- So I will create word_of_day.js which will replace data.js and select a random word for the day
- instead of data.js running, index.js will since it runs all major scripts of reading data etc...

- Created queries to read a random number from the database
- Created queires to read the word in different langues 
- Moved data-script file from frontend to util_scripts folder -> general rule to follow going forward is that any code/logic that backend/server/db is dependent on to run properly should not be in public_frontend

## Sun, March 29, 2026

Modified app.js file to work with MongoDB data rather than hardcoded data

application now pulls data from MongoDB and posts on frontend

pulls data from router readWordsRouter

6 files changed, 114 insertions(+), 309 deletions(-)



data_scripts.js

added helper method: randomIncorrectAnswers, which generates 3 unique random numbers and unique to random word of the day as well. Returns array with the integers
mongodb_queries.js

created pullIncorrectAnswers function

Modified readRandomWord() query function to also generate and return three random words by calling puillIncorrectAnwers

app.js

removed hardcoded answers and replaced with incorrect_answers array

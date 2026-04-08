// app_data.js


// fetchRandomWord() route to grab the data for the random word of the dat
async function fetchRandomWord() {
  try {
    const response = await fetch('/server/mongodb/read_random_word');
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    console.log('Random word data:', data);

    // return the object
    return data;

  } catch (err) {
    console.error('Error fetching random word:', err);
  }
}


// takes in todays date and then grabs the word of the dat from the db
async function fetchWordOfTheDay(todaysDate) {
  try {
    const response = await fetch('/server/mongodb/get_word_of_the_day', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date: todaysDate })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    console.log('Word of the day data:', data);

    return data;

  } catch (err) {
    console.error('Error fetching word of the day:', err);
  }
}

// this method takes in todaysDate, wordIndex, and the word and posts it into the database
async function addWordToFlashback(todaysDate, todaysWordIndex, todaysWord) {
  try {
    const response = await fetch('/server/mongodb/add_word_to_flashback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        date: todaysDate,
        index: todaysWordIndex,
        word: todaysWord
       })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    console.log('Word of the day data:', data);

    // Since only posting data into mongoDB, don't think I need to return anything
    //return data;

  } catch (err) {
    console.error('Error fetching word of the day:', err);
  }
}

async function showcaseTodaysWord(index) {
  try {
    const response = await fetch('/server/mongodb/read_todays_word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        index: index
      })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    return await response.json();
  } catch (err) {
    console.error('Error fetching word by index:', err);
  }
}


function getLanguageSentences(data, languageCode) {
  switch (languageCode) {
    case "spanish_sentences":
      return {
        translatedWord: data.spanish_sentences.spanishWord,
        translatedSentences: [data.spanish_sentences.spaSentence1, data.spanish_sentences.spaSentence2, data.spanish_sentences.spaSentence3]
      };
    case "german_sentences":
      return {
        translatedWord: data.german_sentences.germanWord,
        translatedSentences: [data.german_sentences.gerSentence1, data.german_sentences.gerSentence2, data.german_sentences.gerSentence3]
      };
    case "dutch_sentences":
      return {
        translatedWord: data.dutch_sentences.dutchWord,
        translatedSentences: [data.dutch_sentences.dutSentence1, data.dutch_sentences.dutSentence2, data.dutch_sentences.dutSentence3]
      };
    default:
      return {
        translatedWord: data.english_sentences.englishWord,
        translatedSentences: [data.english_sentences.engSentence1, data.english_sentences.engSentence2, data.english_sentences.engSentence3]
      };
  }
}

async function addCompletedWord(index, date) {
  const res = await fetch('/server/auth/add/completed_word', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ index, todaysDate }) // send the word index
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add completed word');

  return data; // contains { message, entry }
}




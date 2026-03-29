// app_data.js

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




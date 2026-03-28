// mongodb_queires.js

import { Word } from "./model/word.js";
import { BaseData } from "./model/base_data.js";
import { EnglishSentence } from "./model/english_sentences.js";
import { SpanishSentence } from "./model/spanish_sentences.js";
import { GermanSentence } from "./model/german_sentences.js";
import { DutchSentence } from "./model/dutch_sentences.js";

// import gemini ai client to use here to send a prompt
import { ai } from '../ai-workspaces-connections/gemini-workspace.js';

import { openai } from '../ai-workspaces-connections/openai-workspace.js';

import { random_number } from "../util_scripts/data_scripts.js";


const addToWordDB = async () => {

  const addAWord = await Word.create({
    wordIndex: 1,
    word: 'abandon',
    spanishWord: 'abandonar',
    germanWord: 'aufgeben',
    dutchWord: 'verlaten',
    engDef1: 'To leave behind completely'
  });

  console.log('Created record: ', addAWord);
};

const updateAWord = async () => {


  const word = await Word.findOne({wordIndex: 1}).exec();
  console.log("Found word: ", word);

  if (word) {
    word.engDef2 = "King James";
    
    await word.save();
  }

};


const sentencesForWord = async () => {

  const word = await Word.findOne({wordIndex: 16}).exec();

  if (!word) {
    console.log("Word NOT Found!")
    return;
  }
  console.log("Word Found!");

  const eng = word.word;
  const spanish = word.spanishWord;
  const german = word.germanWord;
  const dutch = word. dutchWord;
  const def1 = word.engDef1;
  const def2 = word.engDef2;
  const def3 = word.engDef3;

  askOpenAi(eng, spanish, german, dutch, def1, def2, def3);

}

async function askGemini(eng, spanish, german, dutch, def1, def2, def3) {

  let prompt = "";

  // if def 2 and def 3 exist and not null then send this prompt
  if (def2 && def3) {
    prompt = `Please take this data. Word in English: ${eng}, the same word but in spanish ${spanish}, the same word but in german ${german}, the same word but in dutch ${dutch}, definition 1: ${def1}, definition 2: ${def2}, definition 3: ${def3}. Now I want you to please take the english word its definitions, and I want you to please return this format. 1. Word in English: then new line - def1 new line - def2 new line - def3 then i want you to construct 3 sentences using the word. -sentence1 new line sentence2 new line sentence3. Afterwards I want you to repeat this whole format but for Spanish, German, and Dutch, but for all three of these the definitions def1 def2 def3 are going to be the same as eng def but translated to that specific language. I also want you to the same with the sentences, same sentences as english but please convert to the respeciteve langueg. Please keep sentences very basic, someone who is learning the lnaguage at that level. Also, please provide consistency by neglecting gender transformations to word. Assume all verbage is referring to males. I want consistency and simplicity`;
  }
  // if def 3 doesnt exist or is empty, def 2 can still exist or be populated
  else if (def2) {
    prompt = `Please take this data. Word in English: ${eng}, the same word but in spanish ${spanish}, the same word but in german ${german}, the same word but in dutch ${dutch}, definition 1: ${def1}, definition 2: ${def2}. Now I want you to please take the english word its definitions, and I want you to please return this format. 1. Word in English: then new line - def1 new line - def2 new line then i want you to construct 3 sentences using the word. -sentence1 new line sentence2 new line sentence3. Afterwards I want you to repeat this whole format but for Spanish, German, and Dutch, but for both of these the definitions def1 def2 are going to be the same as eng def but translated to that specific language. I also want you to the same with the sentences, same sentences as english but please convert to the respeciteve langueg. Please keep sentences very basic, someone who is learning the lnaguage at that level. Also, please provide consistency by neglecting gender transformations to word. Assume all verbage is referring to males. I want consistency and simplicity`;
  }
  // if def 2 is empty, then no def 3, either so send prompt with only def 1
  else {
    prompt = `Please take this data. Word in English: ${eng}, the same word but in spanish ${spanish}, the same word but in german ${german}, the same word but in dutch ${dutch}, definition 1: ${def1}. Now I want you to please take the english word its definitions, and I want you to please return this format. 1. Word in English: then new line - def1 new line then i want you to construct 3 sentences using the word. -sentence1 new line sentence2 new line sentence3. Afterwards I want you to repeat this whole format but for Spanish, German, and Dutch, but for the definition def1 are going to be the same as eng def but translated to that specific language. I also want you to the same with the sentences, same sentences as english but please convert to the respeciteve language. Please keep sentences very basic, someone who is learning the language at that level. Also, please provide consistency by neglecting gender transformations to word. Assume all verbage is referring to males. I want consistency and simplicity`;
  }


  console.log("Sending Prompt to Gemini and Generating Response...");
  const res = ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
}


async function askOpenAi(eng, spanish, german, dutch, def1, def2, def3) {
    let prompt = "";

  // if def 2 and def 3 exist and not null then send this prompt
  if (def2 && def3) {
    prompt = `Please take this data. Word in English: ${eng}, the same word but in spanish ${spanish}, the same word but in german ${german}, the same word but in dutch ${dutch}, definition 1: ${def1}, definition 2: ${def2}, definition 3: ${def3}. Now I want you to please take the english word its definitions, and I want you to please return this format. 1. Word in English: then new line - def1 new line - def2 new line - def3 then i want you to construct 3 sentences using the word. -sentence1 new line sentence2 new line sentence3. Afterwards I want you to repeat this whole format but for Spanish, German, and Dutch, but for all three of these the definitions def1 def2 def3 are going to be the same as eng def but translated to that specific language. I also want you to the same with the sentences, same sentences as english but please convert to the respeciteve langueg. Please keep sentences very basic, someone who is learning the lnaguage at that level. Also, please provide consistency by neglecting gender transformations to word. Assume all verbage is referring to males. I want consistency and simplicity`;
  }
  // if def 3 doesnt exist or is empty, def 2 can still exist or be populated
  else if (def2) {
    prompt = `Please take this data. Word in English: ${eng}, the same word but in spanish ${spanish}, the same word but in german ${german}, the same word but in dutch ${dutch}, definition 1: ${def1}, definition 2: ${def2}. Now I want you to please take the english word its definitions, and I want you to please return this format. 1. Word in English: then new line - def1 new line - def2 new line then i want you to construct 3 sentences using the word. -sentence1 new line sentence2 new line sentence3. Afterwards I want you to repeat this whole format but for Spanish, German, and Dutch, but for both of these the definitions def1 def2 are going to be the same as eng def but translated to that specific language. I also want you to the same with the sentences, same sentences as english but please convert to the respeciteve langueg. Please keep sentences very basic, someone who is learning the lnaguage at that level. Also, please provide consistency by neglecting gender transformations to word. Assume all verbage is referring to males. I want consistency and simplicity`;
  }
  // if def 2 is empty, then no def 3, either so send prompt with only def 1
  else {
    prompt = `Please take this data. Word in English: ${eng}, the same word but in spanish ${spanish}, the same word but in german ${german}, the same word but in dutch ${dutch}, definition 1: ${def1}. Now I want you to please take the english word its definitions, and I want you to please return this format. 1. Word in English: then new line - def1 new line then i want you to construct 3 sentences using the word. -sentence1 new line sentence2 new line sentence3. Afterwards I want you to repeat this whole format but for Spanish, German, and Dutch, but for the definition def1 are going to be the same as eng def but translated to that specific language. I also want you to the same with the sentences, same sentences as english but please convert to the respeciteve language. Please keep sentences very basic, someone who is learning the language at that level. Also, please provide consistency by neglecting gender transformations to word. Assume all verbage is referring to males. I want consistency and simplicity. For definitions please use - like that for each def and for sentences instead of - please use * like that.`;
  }


  console.log("Sending Prompt and Generating Response...")
  const response = openai.responses.create({
    model: "gpt-5-nano",
    input: prompt,
    store: true,
  });

  response.then((result) => console.log(result.output_text));

  console.log(response.headers);

}


async function readRandomWord() {
  try {
    // 1. get random index
    const index = random_number();

    console.log("Random Word of Day:", index);

    // 2. query MongoDB
    const word = await BaseData.findOne({ wordIndex: index }).exec();

    // 3. check result
    if (!word) {
      console.log("Word not found for index:", index);
      return null;
    }

    console.log("Word found:", word.word);

    // 4. call the word to get its sentences in different languages
    const [
    english_sentences,
    spanish_sentences,
    german_sentences,
    dutch_sentences
    ] = await Promise.all([
      readSentences(EnglishSentence, index, "English"),
      readSentences(SpanishSentence, index, "Spanish"),
      readSentences(GermanSentence, index, "German"),
      readSentences(DutchSentence, index, "Dutch")
    ]);


    return { word, english_sentences, spanish_sentences, german_sentences, dutch_sentences};

  } catch (err) {
    console.error("Error reading random word:", err);
  }
}

async function readSentences(Model, index, language) {
  try {
    const sentences = await Model.findOne({ wordIndex: index }).exec();

    if (!sentences) {
      console.log(`${language} sentences not found for index:`, index);
      return null;
    }

    return sentences;

  } catch (err) {
    console.error(`Error reading ${language} sentences:`, err);
  }
}

export { addToWordDB, updateAWord, sentencesForWord, readRandomWord };


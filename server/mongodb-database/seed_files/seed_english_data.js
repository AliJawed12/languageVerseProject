// seed_english_data.js

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';


import { EnglishSentence } from "../model/english_sentences.js";
import { connectDB } from '../mongoose-connection.js';

// __filename & __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path to your data file
const filePath = path.join(__dirname, '../../../data_files/generated_english_sentences.txt');

// Read data from file and store in onject to later be stored to populate MongoDB Atlas
async function readFullDataFile(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const wordsArray = [];
  const errorIndexes = [];

  for await (const line of rl) {
    if (!line.trim()) continue; // skip empty lines

    try {
      const parts = line.split(',');
      if (parts.length < 4) throw new Error('Not enough fields');

      const index = parseInt(parts[0]);
      if (isNaN(index)) throw new Error('Index is not a number');

      const englishWord = parts[1].trim();
      const definitionsStr = parts.slice(2).join(',').trim();
      const definitions = definitionsStr ? definitionsStr.split(';').map(d => d.trim()) : [];
      const sentencesStr = parts.slice(3).join(',').trim();
      const sentences = sentencesStr ? sentencesStr.split(';').map(d => d.trim()) : [];

      const wordObj = { index, englishWord, definitions, sentences };
      wordsArray.push(wordObj);

      // Print each object as it's read
      console.log(wordObj);

    } catch (err) {
      const indexPart = line.split(',')[0] || 'unknown';
      errorIndexes.push(indexPart);
      console.warn(`Error parsing line ${indexPart}: ${err.message}`);
    }
  }

  console.log('Finished reading file');
  console.log('Total words read:', wordsArray.length);

  if (errorIndexes.length > 0) {
    console.log('Lines with issues (indexes):', errorIndexes.join(', '));
  } else {
    console.log('No errors while reading');
  }

  return wordsArray;
}




// Method to store the data into MongoDB

// Insert into MongoDB
async function seedEnglishData() {
  await connectDB();

  const englishData = await readFullDataFile(filePath).catch(err => {
    console.error('Error reading file:', err);
    return []; // return empty array so code continues
  });

  // Transform for MongoDB schema
  const documents = englishData.map(obj => ({
    wordIndex: obj.index,
    englishWord: obj.englishWord,
    engDef1: obj.definitions[0],
    engDef2: obj.definitions[1] || '',
    engDef3: obj.definitions[2] || '',
    engSentence1: obj.sentences[0],
    engSentence2: obj.sentences[1] || '',
    engSentence3: obj.sentences[2] || '',
    otherDefinitions: obj.definitions.slice(3)
  }));

  const result = await EnglishSentence.insertMany(documents);
  console.log(`Inserted ${result.length} documents into MongoDB`);
}

// Run the insertion
//insertDataIntoMongo().catch(err => console.error('Error inserting into MongoDB:', err));







export {filePath, readFullDataFile, seedEnglishData}

// Run the function
//readFullDataFile(filePath).catch(err => console.error('Error reading file:', err));
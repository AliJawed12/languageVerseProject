import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';


import { BaseData } from "../model/base_data.js";
import { connectDB } from '../mongoose-connection.js';

// __filename & __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path to your data file
const fullDataFilePath = path.join(__dirname, '../../../data_files/full_data.txt');

// Read data from file and store in onject to later be stored to populate MongoDB Atlas
async function readFullDataFile(fullDataFilePath) {
  const fileStream = fs.createReadStream(fullDataFilePath);

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
      if (parts.length < 6) throw new Error('Not enough fields');

      const index = parseInt(parts[0]);
      if (isNaN(index)) throw new Error('Index is not a number');

      const word = parts[1].trim();
      const spanish = parts[2].trim();
      const german = parts[3].trim();
      const dutch = parts[4].trim();
      const definitionsStr = parts.slice(5).join(',').trim();
      const definitions = definitionsStr ? definitionsStr.split(';').map(d => d.trim()) : [];

      const wordObj = { index, word, spanish, german, dutch, definitions };
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
async function seedBaseData() {
  await connectDB();

  const fullData = await readFullDataFile(fullDataFilePath).catch(err => {
    console.error('Error reading file:', err);
    return []; // return empty array so code continues
  });

  // Transform for MongoDB schema
  const documents = fullData.map(obj => ({
    wordIndex: obj.index,
    word: obj.word,
    spanishWord: obj.spanish,
    germanWord: obj.german,
    dutchWord: obj.dutch,
    engDef1: obj.definitions[0],
    engDef2: obj.definitions[1] || '',
    engDef3: obj.definitions[2] || '',
    otherDefinitions: obj.definitions.slice(3)
  }));

  const result = await BaseData.insertMany(documents);
  console.log(`Inserted ${result.length} documents into MongoDB`);
}

// Run the insertion
//insertDataIntoMongo().catch(err => console.error('Error inserting into MongoDB:', err));







export {fullDataFilePath, readFullDataFile, seedBaseData}

// Run the function
//readFullDataFile(fullDataFilePath).catch(err => console.error('Error reading file:', err));
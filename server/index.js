// index.js

// load env variables
// using import, because when index runs it triggers all 'imports' first (ESM RULE)
// Want env variables available for all files
import './load_env.js';

// Dependency Imports
import express from 'express';

// File imports
import { sendPrompt } from './ai-workspaces-connections/gemini-workspace.js';
import { sendClaudePrompt} from './ai-workspaces-connections/claude-workspace.js';
import { sendOpenAIPrompt } from './ai-workspaces-connections/openai-workspace.js';
import { connectDB } from './mongodb-database/mongoose-connection.js';
import { addToWordDB, updateAWord, sentencesForWord} from './mongodb-database/mongdo_queries.js';
import { insertManyDocuments } from './mongodb-database/seed.js'; // used only to seed initial database
import { seedBaseData } from './mongodb-database/seed_files/seed_base_data.js';
import { seedEnglishData } from './mongodb-database/seed_files/seed_english_data.js';
import { seedSpanishData } from './mongodb-database/seed_files/seed_spanish_data.js';
import { seedGermanData } from './mongodb-database/seed_files/seed_german_data.js';
import { seedDutchData } from './mongodb-database/seed_files/seed_dutch_data.js';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public_frontend'));
app.use(express.json());



app.listen(port, () => console.log(`Server is running on port: ${port}`));

connectDB();
//seedEnglishData();
//seedSpanishData();
//seedGermanData();
seedDutchData();

/* Sends a prompt to AI...
sentencesForWord();
*/


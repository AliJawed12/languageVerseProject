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


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public_frontend'));
app.use(express.json());



app.listen(port, () => console.log(`Server is running on port: ${port}`));

connectDB();

sentencesForWord();


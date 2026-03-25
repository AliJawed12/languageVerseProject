// gemini-workspace.js


// Import Gemini
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
// Automatically assums API key variable is 'GEMINI_API_KEY'
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function sendPrompt() {
  console.log("Sending prompt and generating response...")
  const res = await ai.models.generateContent({
    // Each call, sending prompt to Gemini is a new chat
    model: "gemini-2.5-flash",
    contents: "What is the date today? Also what is LeBron? Also, what is Bronny James real name? Also when you respond please give the answers in this format please. Q1. Question and then new line and the A1: Answer. Thanks",
  });
  console.log(res.text);
}

export {sendPrompt, ai};

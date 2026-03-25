// openai-workspace.js

import OpenAI from "openai";

 const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  });


async function sendOpenAIPrompt() {

 
  console.log("Sending Prompt and Generating Response...")
  const response = openai.responses.create({
    model: "gpt-5-nano",
    input: "In node.js I am sending prompt to OPEN_AI, I know headers stores info like how much more credits and stuff. Once i get resposne, do i just console log response.header?",
    store: true,
  });

  response.then((result) => console.log(result.output_text));

  console.log(response.headers);
  
}

export {sendOpenAIPrompt, openai};
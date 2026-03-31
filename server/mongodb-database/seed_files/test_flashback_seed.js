// seed_flashback_data.js

import { FlashbackData } from "../model/flashback_data.js";
import { connectDB } from '../mongoose-connection.js';

async function seedFlashbackData() {
  await connectDB();

  const result = await FlashbackData.create({
    date: "2026-03-30",
    wordIndex: 1848,
    word: "pretend",
    incorrect_answers: ["international", "climb", "hell"],
  });

  console.log("Inserted flashback document:", result);
}



export {seedFlashbackData};
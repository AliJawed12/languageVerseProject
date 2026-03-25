# index.js

## Code Documentation/Decision Making

### Enviorment Variables

Since I want better organization of code, and plan to do that by splitting parts into moduels/files and then importing them into index.js, I also have to have a seperate file ```load_env.js``` for loading enviornment variables. The reason for that is beacuse in ESM rules, when a file runs it triggers all "import" statements first, so all those imported modules will get initalized and if env variables not availble before they do, there will be errors. 

So, ```load_env.js``` improts and loads enviornemnt variables. Then index.js imports '''load_env.js``` at top of page so all variables loaded first thing.

## AI

### Gemini
Just messed with Gemini, hit 20 RPD limit quick, this free tier is definitly not viable

### Anthropic Claude
No RPD, only a 5 RPM (Rates Per Minute) which is great! But, need to buy credits to be able to use...

### OpenAI ChatGPT

-  OpenAI seems to be the best AI right now offeres free $5.00 worth of credits per month which can last a while... Can buy more later...
- I think with this in mind, I should have a daily limit for players, so that it can be cheaper to develop, less credits needed overall, and if they want to play history then store AI responses from the past days so, if they do history mode, just pull stored data rather than generate prompt. Also, can have DB, each day when someone plays, AI response stored, and when a new user plays it checks if someone has played today, if so then, pull data from DB, again preventing additional prompts and also means consistents AI resposenses and equality to all players....


I think for development purposes I will just switch between OpenAI and Gemini...

## Database
Using MongoDB Atlas. Didn't install MongoDB in project, only Mongoose which is schema based MongoDB and connects to MongoDB Atlas as well so no need to install MongoDB as well. 

Modified the connection string. Default way it would connect to LanuageVerseDB cluster which has many different collections inside it which come default with MongoDB setup (deletable). I modifed URI, so that it connects to a collection called LanguageVerseDatabase if exists and if not then create and add.

### Strict
Didn't do strict:throw in schema, so if users try to add extra field through data somehow, it won't be saved.

## AI testing with promopt and pulling data from DB
ChatGPT quickest right now with about 90 seconds to process and return prompt.
Prompts are heavy, taking around 250 tokens per prompt.

Times can vary, yesterday took 90 seconds, today took 30 seconds. I guess variation is due to also word complexity? -> For better user access, could automate this where every new day, server automatically does this in background for word of the day then stores so later users don't have to wait and are instantly given the new word.

## Meeting with Prof. Jan 8
- generate all definitiosn and sentences using ai and store in file
- have user select correct answer out of given options-> - similar to kahoot interactivity
- can integrate ai into application, to provide similar incorrect answers
- categorize words by difficualy, have ai scale on scale of 1 - 10 for a beginner. 
- we are using 10 words for day -> go research literature on how many words a user should learn in a day to learn a language within a certain period.
- format quoted into same form as unquoited. Also, go over quoted definiontions again ensuring they are good quality like I did with unquouted.
- prof available mon wed 11 - 2, tuesday thursday available after 1 pm

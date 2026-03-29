// data_scripts.js

const min = 1;
const max = 1951; // Chnage to 2739, once all data fully uploaded (max is exclusive)

// Generates a random number between min (inclusive) and max (exclusive)
const random_number = () => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Generates index's for the three incorrect answers on the frontend
// Ensures that the three genereated index's are unique and differnet from wordIndex
const randomIncorrectAnswers = (wordIndex) => {
  // initialize the set
  const randomIndexSet = new Set();

  // initialze array to return with 3 random values
  const randomIndexArray = [];

  // add the correct answer index
  randomIndexSet.add(wordIndex);
  
  // loop through genreating 3 unique random indexs, calling random_number method
  while (randomIndexArray.length !== 3) {
    let temp = random_number();

    if (!randomIndexSet.has(temp)) {
      randomIndexSet.add(temp);
      randomIndexArray.push(temp);
    }
  }

  console.log(randomIndexArray);

  return randomIndexArray;
}


export {random_number, randomIncorrectAnswers};
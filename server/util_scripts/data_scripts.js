// data_scripts.js

const min = 1;
const max = 1951; // Chnage to 2739, once all data fully uploaded (max is exclusive)

// Generates a random number between min (inclusive) and max (exclusive)
const random_number = () => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export {random_number};
async function fetchRandomWord() {
  try {
    const response = await fetch('/server/mongodb/read_random_word');
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    console.log('Random word data:', data);

    // Remove this line if you don't want to display it in the DOM
    // document.getElementById('word-display').textContent = data.word.word;

  } catch (err) {
    console.error('Error fetching random word:', err);
  }
}

fetchRandomWord();
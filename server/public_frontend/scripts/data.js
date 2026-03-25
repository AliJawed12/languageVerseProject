/**
 * Data Storage for LanguageVerse
 * Contains all word data, definitions, and translations
 */

// Word database organized by language code
const wordDatabase = {
  es: [
    {
      word: 'casa',
      definitions: [
        'A building for human habitation, especially one that consists of a ground floor and one or more upper storeys',
        'A place where something is kept or where a particular activity takes place',
      ],
      exampleSentences: {
        english: [
          'I bought a new house last year.',
          'The house on the corner has a beautiful garden.',
          'My house is painted blue.'
        ],
        translated: [
          'Compré una casa nueva el año pasado.',
          'La casa de la esquina tiene un jardín hermoso.',
          'Mi casa está pintada de azul.'
        ]
      },
      correctAnswer: 'house',
      wrongAnswers: ['car', 'tree', 'book']
    },
    {
      word: 'libro',
      definitions: [
        'A written or printed work consisting of pages glued or sewn together along one side and bound in covers',
        'A written work published in printed or electronic form',
      ],
      exampleSentences: {
        english: [
          'I am reading a fascinating book about history.',
          'She lent me her favorite book.',
          'This book was written by a famous author.'
        ],
        translated: [
          'Estoy leyendo un libro fascinante sobre historia.',
          'Ella me prestó su libro favorito.',
          'Este libro fue escrito por un autor famoso.'
        ]
      },
      correctAnswer: 'book',
      wrongAnswers: ['chair', 'window', 'door']
    }
  ],
  fr: [
    {
      word: 'chat',
      definitions: [
        'A small domesticated carnivorous mammal with soft fur, a short snout, and retractable claws',
      ],
      exampleSentences: {
        english: [
          'My cat loves to sleep in the sun.',
          'The cat climbed up the tree.',
          'I feed my cat twice a day.'
        ],
        translated: [
          'Mon chat aime dormir au soleil.',
          'Le chat est monté dans l\'arbre.',
          'Je nourris mon chat deux fois par jour.'
        ]
      },
      correctAnswer: 'cat',
      wrongAnswers: ['dog', 'bird', 'fish']
    }
  ],
  de: [
    {
      word: 'Buch',
      definitions: [
        'A written or printed work consisting of pages glued or sewn together along one side and bound in covers',
      ],
      exampleSentences: {
        english: [
          'I am reading an interesting book.',
          'This book is very old.',
          'She bought a new book yesterday.'
        ],
        translated: [
          'Ich lese ein interessantes Buch.',
          'Dieses Buch ist sehr alt.',
          'Sie hat gestern ein neues Buch gekauft.'
        ]
      },
      correctAnswer: 'book',
      wrongAnswers: ['table', 'chair', 'lamp']
    }
  ],
  it: [
    {
      word: 'acqua',
      definitions: [
        'A colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain',
        'The liquid which descends from the clouds as rain',
      ],
      exampleSentences: {
        english: [
          'I drink water every day.',
          'The water in the lake is very clear.',
          'Can I have a glass of water?'
        ],
        translated: [
          'Bevo acqua ogni giorno.',
          'L\'acqua nel lago è molto chiara.',
          'Posso avere un bicchiere d\'acqua?'
        ]
      },
      correctAnswer: 'water',
      wrongAnswers: ['juice', 'milk', 'coffee']
    }
  ],
  pt: [
    {
      word: 'sol',
      definitions: [
        'The star around which the earth orbits',
        'The light or warmth received from the earth\'s sun',
      ],
      exampleSentences: {
        english: [
          'The sun is shining brightly today.',
          'I love sitting in the sun.',
          'The sun rises in the east.'
        ],
        translated: [
          'O sol está brilhando forte hoje.',
          'Eu amo sentar no sol.',
          'O sol nasce no leste.'
        ]
      },
      correctAnswer: 'sun',
      wrongAnswers: ['moon', 'star', 'cloud']
    }
  ],
  ja: [
    {
      word: '本',
      definitions: [
        'A written or printed work consisting of pages glued or sewn together along one side and bound in covers',
      ],
      exampleSentences: {
        english: [
          'I bought a new book.',
          'This book is very interesting.',
          'She reads books every day.'
        ],
        translated: [
          '新しい本を買いました。',
          'この本はとても面白いです。',
          '彼女は毎日本を読みます。'
        ]
      },
      correctAnswer: 'book',
      wrongAnswers: ['pen', 'paper', 'desk']
    }
  ],
  ko: [
    {
      word: '물',
      definitions: [
        'A colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain',
      ],
      exampleSentences: {
        english: [
          'I need some water.',
          'The water is cold.',
          'Please bring me water.'
        ],
        translated: [
          '물이 필요해요.',
          '물이 차가워요.',
          '물을 가져다 주세요.'
        ]
      },
      correctAnswer: 'water',
      wrongAnswers: ['fire', 'air', 'earth']
    }
  ],
  zh: [
    {
      word: '家',
      definitions: [
        'A building for human habitation, especially one that consists of a ground floor and one or more upper storeys',
        'The place where one lives permanently',
      ],
      exampleSentences: {
        english: [
          'I am going home.',
          'My home is very comfortable.',
          'There is no place like home.'
        ],
        translated: [
          '我要回家了。',
          '我的家很舒适。',
          '没有地方比得上家。'
        ]
      },
      correctAnswer: 'home',
      wrongAnswers: ['office', 'school', 'store']
    }
  ]
};

/**
 * Gets the word of the day for a specific language
 * @param {string} languageCode - The language code (e.g., 'es', 'fr')
 * @returns {Object|null} Word data object or null if not found
 */
function getWordOfTheDay(languageCode) {
  const words = wordDatabase[languageCode];
  if (!words || words.length === 0) return null;
  
  // For now, just return the first word
  // In production, this could rotate based on the date
  return words[0];
}

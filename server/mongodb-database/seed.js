// seed.js

import { Word } from "./model/word.js";
import { connectDB } from './mongoose-connection.js';

const insertManyDocuments = async () => {

  await connectDB();

  const addMany = await Word.insertMany([
        {
      wordIndex: 2,
      word: "ability",
      spanishWord: "habilidad",
      germanWord: "fähigkeit",
      dutchWord: "vermogen",
      engDef1: "The quality or state of being able",
      engDef2: "power to perform, whether physical, moral, intellectual, conventional, or legal",
      engDef3: "capacity"
    },
    {
      wordIndex: 4,
      word: "abortion",
      spanishWord: "aborto",
      germanWord: "abort",
      dutchWord: "abortus",
      engDef1: "The act of giving premature birth",
      engDef2: "particularly, the expulsion of the human fetus prematurely, or before it is capable of sustaining life",
      engDef3: "miscarriage"
    },
    {
      wordIndex: 7,
      word: "abroad",
      spanishWord: "en el extranjero",
      germanWord: "im ausland",
      dutchWord: "naar het buitenland",
      engDef1: "At large",
      engDef2: "widely",
      engDef3: "broadly"
    },
    {
      wordIndex: 9,
      word: "absolute",
      spanishWord: "absoluto",
      germanWord: "absolut",
      dutchWord: "absoluut",
      engDef1: "Loosed from any limitation or condition",
      engDef2: "uncontrolled",
      engDef3: "unrestricted"
    },
    {
      wordIndex: 10,
      word: "absolutely",
      spanishWord: "absolutamente",
      germanWord: "absolut",
      dutchWord: "absoluut",
      engDef1: "In an absolute, independent, or unconditional manner",
      engDef2: "wholly",
      engDef3: "positively"
    },
    {
      wordIndex: 12,
      word: "abuse",
      spanishWord: "abuso",
      germanWord: "missbrauch",
      dutchWord: "misbruik",
      engDef1: "To put to a wrong use",
      engDef2: "to misapply",
      engDef3: "to misuse"
    },
    {
      wordIndex: 15,
      word: "acceptable",
      spanishWord: "aceptable",
      germanWord: "akzeptabel",
      dutchWord: "aanvaardbaar",
      engDef1: "Capable, worthy, or sure of being accepted or received with pleasure",
      engDef2: "pleasing to a receiver",
      engDef3: "gratifying"
    },
    {
      wordIndex: 16,
      word: "access",
      spanishWord: "acceso",
      germanWord: "zugang",
      dutchWord: "toegang",
      engDef1: "A coming to, or near approach",
      engDef2: "admittance",
      engDef3: "admission"
    },
    {
      wordIndex: 17,
      word: "accident",
      spanishWord: "accidente",
      germanWord: "unfall",
      dutchWord: "ongeluk",
      engDef1: "Literally, a befalling",
      engDef2: "an event that takes place without one's foresight or expectation",
      engDef3: "an undesigned, sudden, and unexpected event"
    },
    {
      wordIndex: 18,
      word: "accommodation",
      spanishWord: "alojamiento",
      germanWord: "unterkunft",
      dutchWord: "accommodatie",
      engDef1: "The act of fitting or adapting",
      engDef2: "the state of being fitted or adapted",
      engDef3: "adjustment"
    },
    {
      wordIndex: 19,
      word: "accompany",
      spanishWord: "acompañar",
      germanWord: "begleiten",
      dutchWord: "begeleiden",
      engDef1: "To go with or attend as a companion or associate",
      engDef2: "to keep company with",
      engDef3: "to go along with"
    },
    {
      wordIndex: 20,
      word: "accomplish",
      spanishWord: "lograr",
      germanWord: "erreichen",
      dutchWord: "volbrengen",
      engDef1: "To complete, as time or distance",
      engDef2: "to bring to an end",
      engDef3: "to achieve"
    },
    {
      wordIndex: 21,
      word: "accord",
      spanishWord: "acuerdo",
      germanWord: "übereinstimmung",
      dutchWord: "overeenstemming",
      engDef1: "Agreement or concurrence of opinion, will, or action",
      engDef2: "harmony of minds",
      engDef3: "consent or assent"
    },
    {
      wordIndex: 22,
      word: "account",
      spanishWord: "cuenta",
      germanWord: "konto",
      dutchWord: "rekening",
      engDef1: "A registry of pecuniary transactions",
      engDef2: "a written or printed statement of business dealings",
      engDef3: "a reckoning of debit and credit"
    },
    {
      wordIndex: 23,
      word: "accurate",
      spanishWord: "exacto",
      germanWord: "genau",
      dutchWord: "nauwkeurig",
      engDef1: "In exact or careful conformity to truth, or to some standard of requirement",
      engDef2: "the result of care or pains",
      engDef3: "free from failure, error, or defect"
    },
    {
      wordIndex: 26,
      word: "achievement",
      spanishWord: "logro",
      germanWord: "leistung",
      dutchWord: "prestatie",
      engDef1: "The act of achieving or performing",
      engDef2: "an obtaining by exertion",
      engDef3: "successful performance"
    },
    {
      wordIndex: 27,
      word: "acknowledge",
      spanishWord: "reconocer",
      germanWord: "anerkennen",
      dutchWord: "erkennen",
      engDef1: "To of or admit the knowledge of",
      engDef2: "to recognize as a fact or truth",
      engDef3: "to declare one's belief in"
    },
    {
      wordIndex: 28,
      word: "acquire",
      spanishWord: "adquirir",
      germanWord: "erwerben",
      dutchWord: "verwerven",
      engDef1: "To gain, usually by one's own exertions",
      engDef2: "to get as one's own",
      engDef3: "as, to acquire a title, riches, knowledge, skill, good or bad habits"
    }
  ]);
}


export { insertManyDocuments };
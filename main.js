import colors from "colors"
import scrape from "./modules/crawler.js"
import { arraySize } from "./modules/utils.js"
import process from "./modules/word_processor.js"

let uris = ['https://www.meblowapaczka.pl/pl/menu/komody-i-szafki-157.html']

scrape(uris, (keyword_candidates) => {
  console.log(keyword_candidates)
  console.log(`Received data! ${arraySize(keyword_candidates)}`.brightGreen)

})

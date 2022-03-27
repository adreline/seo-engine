import colors from "colors"
import scrape from "./modules/crawler.js"
import { arraySize as sizeof } from "./modules/utils.js"
import process from "./modules/word_processor.js"
import { write as writeMetaDesc, recap as writeMetaTitle } from './modules/ai_writer.js'

let uris = ['https://www.meblowapaczka.pl/pl/menu/komody-i-szafki-157.html']


scrape(uris, (raw_text_data) => {
  console.log(`Found ${sizeof(raw_text_data)} text nodes`.yellow)
  console.log("Starting word processor")
  process(raw_text_data, ()=>{
        console.log("Done all work, exiting".red)
  })
})

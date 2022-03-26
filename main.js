import colors from "colors"
import scrape from "./modules/crawler.js"
import { arraySize } from "./modules/utils.js"
import process from "./modules/word_processor.js"

let uris = ['https://elixirschool.com/en','https://elixirschool.com/en/lessons/ecto/associations','https://elixirschool.com/en/get_involved','https://elixirschool.com/blog']

scrape(uris, (keyword_candidates) => {
  console.log(keyword_candidates)
  console.log(`Received data! ${arraySize(keyword_candidates)}`.brightGreen)

})

const colors = require("colors")
const modules = require("./modules/modules.js")



let uris = ['https://elixirschool.com/en','https://elixirschool.com/en/lessons/ecto/associations','https://elixirschool.com/en/get_involved','https://elixirschool.com/blog']

modules.crawler.scrape(uris,(keyword_candidates) => {
  console.log(`Received data! ${modules.utils.arraySize(keyword_candidates)}`.brightGreen)
});

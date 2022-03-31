import colors from "colors"
import scrape from "./modules/crawler.js"
import async from "async"
import fs from "fs"
import child_process from "child_process"
import { arraySize as sizeof, suspended_log, save_page_to_file as export_page } from "./modules/utils.js"
import process from "./modules/word_processor.js"
import { write as writeMetaDesc, recap as writeMetaTitle } from './modules/ai_writer.js'
import http from "http"
import express from "express"
import bodyParser from "body-parser"


function main(uris, callback){
  console.log(`Targeting ${sizeof(uris)} pages`.red)
  scrape(uris, (text_data_collection) => {
    let total=0
    text_data_collection.forEach((page, i) => {
      total+=sizeof(page.dictionary)
      suspended_log(`Collected ${total} data points`.yellow)
      page.dictionary = process(page.dictionary)
    })
    console.log("\nExporting data to text files".yellow);
    text_data_collection.forEach((page, i) => {
      export_page(page,'./temp/output/')
    })
    console.log("Done".yellow)
    callback()
  })
}

//-------------SERVER SECTION------------
const app = express()
app.set('views', './html')
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }))

// Handling GET / request
app.get("/", (req, res, next) => {
    res.render('index')
})
// Handling post /scrape request
app.post("/scrape", (req, res, next) => {
    let uris = req.body.urls.split("\n")
    main(uris,()=>{
      res.render('index')
    })
})
// Server setup
app.listen(5001, () => {
    console.log("Server is Running".green)
})






/*
//make head section proposal
//first translate paragraphs into english
translateAll(index.paragraphs,languages.english,(translation_results)=>{
  //translation is done, use ai to write meta desc and meta title
  console.log("Paragraphs translated")
  let article = "" //concat all paragraphs to make title summary
  translation_results.forEach((item, i) => {
    article+=item
  });

  //call the ai
  writeMetaTitle({paragraph: article},(result)=>{
    console.log(`AI title proposal: ${result}`.yellow)
    writeMetaDesc({prompt: article}, (result)=>{
      console.log(`AI description proposal: ${result}`.yellow)
        callback()
    })
  })
  //callback()
})
*/

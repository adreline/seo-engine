import colors from "colors"
import scrape from "./modules/crawler.js"
import { arraySize as sizeof, suspended_log, save_page_to_file as export_page, isValidUrl, archiveOutputFiles } from "./modules/utils.js"
import process from "./modules/word_processor.js"
import express from "express"
import bodyParser from "body-parser"

const defaut_output_directory = './temp/output'

function main(uris, callback){
  console.log(`Targeting ${sizeof(uris)} pages`.red)
  scrape(uris, (text_data_collection) => {
    let total=0
    text_data_collection.forEach((page, i) => {
      total+=sizeof(page.dictionary)
      suspended_log(`Collected ${total} data points`.yellow)
      page.dictionary = process(page.dictionary)
    })
    console.log("\nExporting data to text files".yellow)
    text_data_collection.forEach((page, i) => {
      export_page(page, defaut_output_directory)
    })
    console.log("Done exporting".yellow)
    console.log("Compressing files".yellow)
    let archive = archiveOutputFiles()
    callback(archive)
  })
}


//-------------SERVER SECTION------------
const app = express()
app.set('views', './html')
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }))

// Handling GET / request
app.get("/", (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    res.render('index',{ url: fullUrl })
})
// Handling post /scrape request
app.post("/scrape", (req, res, next) => {
    console.log("POST Request".yellow)
    let uris = req.body.urls.split("\n")
    uris = uris.filter(isValidUrl) // filter out invalid urls

    main(uris,(archive)=>{
      res.download(`${archive}`)
    })
})
// Server setup
app.listen(5001, () => {
    console.log("Server is Running".green)
})

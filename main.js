import colors from "colors"
import scrape from "./modules/crawler.js"
import async from "async"
import fs from "fs"
import child_process from "child_process"
import { arraySize as sizeof, suspended_log, save_page_to_file as export_page } from "./modules/utils.js"
import process from "./modules/word_processor.js"
import { write as writeMetaDesc, recap as writeMetaTitle } from './modules/ai_writer.js'

let suspended_flag=false
let uris = []
console.log("Waiting for files".green)
fs.watch('./temp/tasks',(eventtype, filename)=>{
  child_process.execSync("sleep 0.5")
  if (!suspended_flag && eventtype=='change') {
    suspended_flag=true
    console.log('File "' + filename + '" detected: ' + eventtype)
    let file_contents
    try {
      file_contents=fs.readFileSync(`./temp/tasks/${filename}`, "utf8")
      fs.unlinkSync(`./temp/tasks/${filename}`)
    } catch (e) {
    console.log(e)
    return null
    }
    uris = file_contents.split("\n")
    uris.forEach((item, i) => {
      console.log(item)
    });

    /*
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
      console.log("")
      suspended_flag=false
    })
    */
    suspended_flag=false
  }

})
/*

*/

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

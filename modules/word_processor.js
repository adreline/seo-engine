import async from 'async'
import colors from 'colors'
import { arraySize as sizeof } from './utils.js'
import { write as writeMetaDesc, recap as writeMetaTitle } from './ai_writer.js'
import translateAll from './translate.js'
import { language as languages } from './translate.js'

let index = {
  paragraphs: [],
  keyphrases: [],
  keywords: []
}
let ai_proposal = {
  meta_title: "",
  meta_desc: ""
}
export default function process(keyword_candidates, callback){

  //first extract long paragraphs that can be used for meta desc
  keyword_candidates.forEach((keyword, i) => {
    let length = sizeof(keyword.split(" "))
    if ( length >= 15) {
      //good paragraph
      index.paragraphs.push(keyword)
    }
    if (length == 1) {
      //a keyword
      index.keywords.push(keyword)
    }
    if (length > 1 && length < 15) {
      //a keyphrase
      index.keyphrases.push(keyword)
    }
  })

  console.log("Data has been indexed")
  console.log(`Extracted ${sizeof(index.paragraphs)} paragraphs`.yellow)
  console.log(`Extracted ${sizeof(index.keyphrases)} keyphrases`.yellow)
  console.log(`Extracted ${sizeof(index.keywords)} keywords`.yellow)
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


}

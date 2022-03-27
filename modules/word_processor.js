import async from 'async'
import colors from 'colors'
import { arraySize as sizeof } from './utils.js'

let index = {
  paragraphs: [],
  keyphrases: [],
  keywords: []
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
  callback(index)
}

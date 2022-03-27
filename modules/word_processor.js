import async from 'async'
import colors from 'colors'
import { arraySize as sizeof } from './utils.js'

let paragraphs = []

export default function process(keyword_candidates, callback){

  //first extract long paragraphs that can be used for meta desc
  keyword_candidates.forEach((paragraph_candidate, i) => {
    if (sizeof(paragraph_candidate.split(" ")) > 15) {
      //good paragraph
      paragraphs.push(paragraph_candidate)
    }
  })
  console.log("Processed paragraphs")
  callback(paragraphs)
}

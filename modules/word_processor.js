import async from 'async'
import colors from 'colors'
import { arraySize as sizeof, suspended_log } from './utils.js'



export default function process(dictionary){
  let index = {
    paragraphs: [],
    keyphrases: [],
    keywords: []
  }
  //first extract long paragraphs that can be used for meta desc
  dictionary.forEach((keyword, i) => {
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

  return index
}

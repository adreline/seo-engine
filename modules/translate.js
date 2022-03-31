import axios from "axios"
import async from "async"

const translation_api = "https://duckduckgo.com/translation.js?vqd=3-77731457188899382984450369033913299527-338695308972019531275119613238962577063&query=translate&to="
export const language = {
  english: "en",
  polish: "pl"
}

let working_lang
let translation_results=[]
// asynchronous function that translates given text
const translate = function(paragraph, callback) {

  axios.post(translation_api+working_lang, {
    paragraph
  })
  .then(function (response) {
    try {
      translation_results.push(JSON.parse(response.data.translated).paragraph)
    } catch (e) {
      console.log("faulty json:")
      console.log(response.data)
    } finally {
      callback()
    }

    //translation_results.push(response)

  })
  .catch(function (error) {
    console.log(error)
    callback()
  })
}
//public function of this module. it translates all text in an array asynchronously
export default function translateAll(paragraphs, target_lang, callback){
  //translate all text in async mode to save time
  working_lang=target_lang //set this cus async is stupido and cant pass more then 1 arg

  async.each(paragraphs, translate)
  .then( () => {
      callback(translation_results)
  }).catch( err => {
      console.log(err)
  });

}

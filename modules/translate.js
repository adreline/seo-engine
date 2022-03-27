import axios from "axios"

const translation_api = "https://duckduckgo.com/translation.js?vqd=3-77731457188899382984450369033913299527-338695308972019531275119613238962577063&query=translate&to="
export const language = {
  english: "en",
  polish: "pl"
}

let working_lang
// asynchronous function that translates given text
function translate(paragraph, callback) {
  axios.post(translation_api+working_lang, {
    paragraph
  })
  .then(function (response) {
    callback(response.data)
  })
  .catch(function (error) {
    return callback(error)
  })
}
//public function of this module. it translates all text in an array asynchronously
export default function translateAll(paragraphs, target_lang, callback){
  //translate all text in async mode to save time
  working_lang=target_lang //set this cus async is stupido and cant pass more then 1 arg

  async.map(paragraphs, translate)
  .then( translation_results => {
      callback(translation_results)
  }).catch( err => {
      throw err
  });

}

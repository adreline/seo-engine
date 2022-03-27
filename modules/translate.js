import axios from "axios"

const translation_api = "https://duckduckgo.com/translation.js?vqd=3-77731457188899382984450369033913299527-338695308972019531275119613238962577063&query=translate&to="
export const language = {
  english: "en",
  polish: "pl"
}

export default function translate(paragraph, target_lang, callback){
  axios.post(translation_api+target_lang, {
    paragraph
  })
  .then(function (response) {
    callback(response.data)
  })
  .catch(function (error) {
    throw error
    callback()
  });

}

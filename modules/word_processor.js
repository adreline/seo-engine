import async from 'async'
import colors from 'colors'
import Markov from 'js-markov'
import { arraySize as sizeof } from './utils.js'

function createMarkovChains(raw_candidates){
  let training_data = []
  raw_candidates.forEach((raw_item, i) => {
    //extract single words and count them
    //the regexp selects everything that isn't ascii character then replace() deletes it
    let words = raw_item.replace(/[^\w\s]/gi, '').split(" ")
    if (sizeof(words)>1) {
      //we need text longer then two words for it to work
      let sentences = raw_item.split(".")
      
    }

  });
  //words processed
  var markov = new Markov()
  markov.addStates(keyword_candidates)
  markov.train()
  markov.generateRandom(30)

}

export default function process(keyword_candidates, callback){



}

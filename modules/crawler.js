import axios from "axios"
import nodehtmlparser from "node-html-parser"
import async from "async"
import colors from "colors"

import { arraySize } from "./utils.js"

let keyword_candidates=[]

function gatherTextNodes(array_of_nodes){
  //this is a recursive function which walks over html dom tree searching for _rawText.
  //test for TextNode
  if (!(typeof array_of_nodes._rawText === 'undefined')) {
    //its a text_node
    //do some formatting
    let candidate = array_of_nodes._rawText.trim()
    if (candidate.length>2) {
      keyword_candidates.push(candidate)
    }
    //text_node cant have child nodes, return
    return true;
  }
  //determine if array_of_nodes is an array or object
  if (typeof array_of_nodes.length === 'undefined') {
    //it is object, look for child nodes or text node
    //look for more nodes
    if (!(typeof array_of_nodes.childNodes === 'undefined') && array_of_nodes.childNodes.length > 0) {
      //we have some more nodes to iterate over, make a recursive call
      gatherTextNodes(array_of_nodes.childNodes)
    }
  }else {
    //it is an array
    array_of_nodes.forEach((html_object, i) => {
      //just call itself, the funct knows what to do
      gatherTextNodes(html_object)
    });

  }
}

const getCandidates = function(uri,callback){
  axios
    .get(uri)
    .then(html_response => {

      const root = nodehtmlparser.parse(html_response.data);
      /*
      Okay, i figured the data structure out. First we have Selectors array, lower is array of all objects found by querySelectorAll then
      those objects hold a childNodes array full of Objects of type TextNode.
      Selectors[
              Nodes[
                  Object{
                      childNodes[
                        TextNode{
                          _rawText
                      }
                    ]
                  }
              ]
          ]
      */
      let total_nodes = 0
      let discarded_nodes = 0
      try {
        gatherTextNodes(root)
      } catch (e) {
        console.log(e);
      } finally {
        console.log(`${uri}`.blue);
        console.log(`Analysed nodes: ${total_nodes} | Discarded: ${discarded_nodes}`)
        callback()
      }

    })
    .catch(error => {
      console.log(error)
      callback()
    })
}

export default function scrape(uris, callback){

  async.each(uris, getCandidates)
  .then( () => {
      console.log('All pages analysed'.green);
      console.log(`${arraySize(keyword_candidates)}`.grey);
      callback(keyword_candidates)
  }).catch( err => {
      console.log(err);
  });

}

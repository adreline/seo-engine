import axios from "axios"
import nodehtmlparser from "node-html-parser"
import crypto from "crypto"
import async from "async"
import colors from "colors"

import { arraySize, affirmNode, suspended_log } from "./utils.js"

let pages = new Map()

function gatherTextNodes(array_or_node,job_id){
  //this is a recursive function which walks over html dom tree searching for _rawText.
  //test for TextNode
  if (!(typeof array_or_node._rawText === 'undefined')) {
    //its a text_node
    //do some formatting
    let candidate = array_or_node._rawText.trim().replace(/[\\$'"`”„]/g, " ")
    if (candidate.length>2 && affirmNode(array_or_node)) {
      pages.get(job_id).dictionary.push(candidate)
    }
    //text_node cant have child nodes, return
    return true;
  }
  //determine if array_or_node is an array or object
  if (typeof array_or_node.length === 'undefined') {
    //it is object, look for child nodes or text node
    //look for more nodes
    if (!(typeof array_or_node.childNodes === 'undefined') && array_or_node.childNodes.length > 0) {
      //we have some more nodes to iterate over, make a recursive call
      gatherTextNodes(array_or_node.childNodes,job_id)
    }
  }else {
    //it is an array
    array_or_node.forEach((html_object, i) => {
      //just call itself, the funct knows what to do
      gatherTextNodes(html_object,job_id)
    });

  }
}

const getCandidates = function(uri,callback){
  suspended_log(`GET ${uri}`.red)
  let job_id=crypto.randomUUID()
  pages.set(job_id,{
    id: job_id,
    link: `${uri}`,
    title: '',
    desc: '',
    dictionary: []
  })
  axios
    .get(uri)
    .then(html_response => {

      const dom = nodehtmlparser.parse(html_response.data)
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
      try {
        gatherTextNodes(dom,job_id)
      } catch (e) {
        console.log(e);
      } finally {
        callback()
      }

    })
    .catch(error => {
      console.log(error)
      callback()
    })
}

export default function scrape(uris, callback){
//this is a public function that can be called from main thread
  async.each(uris, getCandidates)
  .then( () => {
      console.log('\nAll pages fetched'.green)
      callback(pages)
  }).catch( err => {
      console.log(err);
  });

}

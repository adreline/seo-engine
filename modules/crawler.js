import axios from "axios"
import nodehtmlparser from "node-html-parser"
import async from "async"
import colors from "colors"

import { arraySize } from "./utils.js"

let keyword_candidates=[]

const getCandidates = function(uri,callback){
  axios
    .get(uri)
    .then(html_response => {

      const root = nodehtmlparser.parse(html_response.data);
      const selectors = [
        root.querySelectorAll('h1'),
        root.querySelectorAll('h2'),
        root.querySelectorAll('h3'),
        root.querySelectorAll('p'),
        root.querySelectorAll('strong')
      ]
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
        selectors.forEach((html_nodes, i) => {
          html_nodes.forEach((html_node, i) => {
            html_node.childNodes.forEach((text_node, i) => {
              total_nodes++
              let candidate = text_node._rawText.trim()
              if (candidate.length>0) {
                  keyword_candidates.push(candidate)
              }else {
                discarded_nodes++
              }
            });
          });
        });

      } catch (e) {
        discarded_nodes++
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

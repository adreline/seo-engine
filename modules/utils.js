import fs from "fs"
import crypto from "crypto"
import async from "async"
import colors from "colors"

const html_tag_blacklist = [
                              "nav",
                              "script",
                              "style"
                            ]
export function affirmNode(html_node){
  //verify if a node in question should be processed
  if (!(html_node.parentNode === 'undefined') && html_node.parentNode != null) {
      if (html_tag_blacklist.includes(html_node.parentNode.rawTagName)) {
        //the tag is a backlisted one, return
        return false
      }
  }
  //tag isnt blacklisted
  return true
}

export function arraySize(ar){
  let j = 0
  try {
    ar.forEach((item, i) => {
      j++
    });

  } catch (e) {
    console.log("Size failed")
    return 0
  }
  return j
}

export function suspended_log(msg="", line=0, cur=0){
  if (typeof msg === 'string') {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(msg)
  }
}

export function save_page_to_file(page,dir="./"){

  let new_filename=`${dir}${crypto.randomUUID()}.txt`
  suspended_log(`Exporting to ${new_filename}`.red)

  let new_list=[`${page.link}`]
  new_list = new_list.concat(page.dictionary.paragraphs)
  new_list = new_list.concat(page.dictionary.keyphrases)
  new_list = new_list.concat(page.dictionary.keywords)

  new_list.forEach((str, i) => {
    try {
      fs.appendFileSync(new_filename, `${str}\n`)
    } catch (e) {
      console.log(e)
    }
  });


}

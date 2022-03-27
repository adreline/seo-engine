
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
    console.log(e);
    return null
  }
  return j
}

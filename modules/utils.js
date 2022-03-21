exports.arraySize = function (ar){
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

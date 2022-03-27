import axios from "axios"
import colors from "colors"

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'https://sassbook.com'
});
const recap_api = "/api/sum/v2"
const writer_api = "/api/gen/v2"
const token_endpoint = "https://securetoken.googleapis.com/v1/token?key=AIzaSyDxlJTZJm1bcF3SSHzZPnCUGeBQ97SDW0c"

const writer_default_options={
  kw:"", //optional keywords
  st:"", //initializing sentence
  pg:"",
  pc:"",
  ctx:"writer",
  var:"var_med", //level of variation
  alts:1, //number of paragraphs to generate
  wpg:50 //words per paragraph
}
const recap_default_options={
  sumSrc:"",
  srcHash:"",
  target:"best", //this makes no diffrence as it needs premium
  method:"abs", //method of extraction, possible are "ext" or "abs"
  targetPercent:16, //this makes no diffrence as it needs premium
  sumXAbs:true
}

//this function can retreive new access token
export function refreshToken(callback){
  axios.post(token_endpoint, {
    grant_type: "refresh_token",
    refresh_token: "AIwUaOlf0FVogf5D8xxB106kjZMWC3HGYKX1tR0C9ixD2mgxBzJzaD4PzL3W-y_Os6keOqTAy04OPkWtNbbS7TeiBNIugFLFpb1Xf0Xh91BG01bRsJ2IDURgak--b0CgBoLRWi0GWgp6eOad6cKheN7FZlVsczxNxqICq7gbztbydDwpWwXO-WE"
  })
  .then(function (response){
    if (!(response.data.access_token === 'undefined')) {
      let token = `${response.data.token_type} ${response.data.access_token}`
      instance.defaults.headers.common['Authorization'] = token
      console.log(`New token applied, type = ${response.data.token_type}`.brightGreen)
      callback(true)
    }else {
      console.log(`failed to get token`.red)
      callback(false)
    }
  })
  .catch(function (error){
    console.log(`unknown error`.red)
    callback(false)
  })
}

//this function accesses the paragraph creating ai
export function write({prompt, keywords, num},callback){
  //prepare options
  let params = writer_default_options
  params.st = prompt
  if (!(typeof keywords === 'undefined')) {
    params.kw=keywords
  }
  if (!(typeof num === 'undefined')) {
    params.alts=num
  }
  //make a request
  axios.post(writer_api, params)
  .then(function (response){
    callback({
      paragraphs: response.data.genList,
      message: response.data.genMessage
    })
  })
  .catch(function (error){
    //failed, try to refresh auth token
    console.log(`${error.response.data}`.red)
    refreshToken((res)=>{
      if (res) {
        //all good, try again
        write({prompt, keywords, num},callback)
      }else {
        //couldnt get new token
        throw "Couldn't get new auth token"
      }
    })

  })
}

//this function accesses the paragraph summarising ai
export function recap({paragraph,method},callback){
    //prepare params
    let params = recap_default_options
    params.sumSrc = paragraph
    if (!(typeof method === 'undefined')) {
      params.method = method
    }
    //make a request
      instance.post(recap_api, params)
      .then(function (response){
        //success, return data to main thread
        callback(response.data)
      })
      .catch(function (error){
        //failed, try to refresh auth token
        console.log(`${error.response.data}`.red)
        refreshToken((res)=>{
          if (res) {
            //all good, try again
            recap({paragraph,method},callback)
          }else {
            //couldnt get new token
            throw "Couldn't get new auth token"
          }
        })

      })


}

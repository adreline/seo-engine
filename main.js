import colors from "colors"
import scrape from "./modules/crawler.js"
import { arraySize } from "./modules/utils.js"
import process from "./modules/word_processor.js"
import { recap, write, refreshToken } from "./modules/ai_writer.js"

let uris = ['https://www.meblowapaczka.pl/pl/menu/komody-i-szafki-157.html']
/*
scrape(uris, (keyword_candidates) => {
  console.log(keyword_candidates)
  console.log(`Received data! ${arraySize(keyword_candidates)}`.brightGreen)

})
*/
let prompt = "Our Store (located at the address of www.meblowapaczka.pl) processes your personal data collected on the Internet, e.g. the IP address of your device and information saved using technologies used to track and store them, such as cookies, web beacons or other similar technologies."

/*
refreshToken((t)=>{
  console.log(t)
}) 
*/

recap({paragraph: prompt},(data)=>{
  console.log(data);
  console.log("finished");
})

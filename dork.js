const puppeteer = require('puppeteer');
const socket = require('socket.io-client')('http://localhost:3000');

socket.on('connect',()=>{
  console.log('Socket server connected at port 3000');
})

socket.on('tweetCount',urlTargetCount=>{
  scrape(urlTargetCount);
})



async function scrape(urlTargetCount){

  const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();

    

    
    await page.setViewport({
        width: 375,
        height: 812,
        deviceScaleFactor: 1,
      });
    await page.goto('https://twitter.com/search?q=zoom.us%2F&src=typed_query&f=live');

    //await page.goto('https://twitter.com/search?q=zoom.us%2Fj&src=recent_search_click&f=live',{waitUntil:"networkidle2"});

    
    
    await delay(5000);
    
    
    await page.screenshot({path: 'twitter.png'});
      
    const parentSelector = "#react-root > div > div > div.css-1dbjc4n.r-13qz1uu.r-417010 > main > div > div > div > div > div > div > div > div > section > div > div>div";
   
    await getUrls(page,parentSelector,urlTargetCount,socket);

    //console.log(zoomurls,zoomurls.length);
    //socket.emit('zoomUrls',zoomurls);
    
    
    
    
    await browser.close();

}
  




  function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }





async function getUrls(page,parentSelector,urlTargetCount,socket){
    let urls=[];
    let currenturls;
    let previousHeight;
   
    while(urls.length < urlTargetCount){
      
      currenturls= await page.evaluate((parentSelector)=>{
        let parentDiv = document.querySelector(parentSelector);
    
        let urlList = [];
    
        for(let i=0;i<parentDiv.childNodes.length;i++){
          let aTags=parentDiv.childNodes[i].querySelectorAll('a');
          for(let j=0;j<aTags.length;j++){
            if(aTags[j].title.includes('zoom.us/j')){
              urlList.push(aTags[j].title);
            }
          }
        }
    
        return urlList;
      },parentSelector);
      
      for(let k=0;k<currenturls.length;k++){
        if(!urls.includes(currenturls[k])){
          urls.push(currenturls[k]);
          socket.emit('zoomUrls',currenturls[k]);
          //console.log(currenturls[k])
        }
      }

      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(1000);

    }
    if(urls.length >= urlTargetCount){
      socket.emit('searchFlag',true);
    }
  

return urls;
}
const fs=require('node:fs');
let source=fs.readFileSync('.tmp/voyage-nature-review/check.cjs','utf8').replace(/\r\n/g,'\n').replace(".tmp/voyage-nature-review",".tmp/voyage-cloud-review");
fs.mkdirSync('.tmp/voyage-cloud-review',{recursive:true});
const cut=source.indexOf('  const points=');
if(cut<0)throw Error('Browser fixture not found');
source=source.slice(0,cut)+`
  await place({lat:37,lon:-13,mode:'sea'});
  await page.waitForFunction("mode==='sea' && Math.abs(mapLonAt(self.x)+13)<1");
  await page.evaluate(()=>{zoom=1.05;syncGlobeCamera();});
  await delay(1800);
  const label=process.argv[2]||'after';
  await page.screenshot({path:path.join(out,'cloud-'+label+'.jpg')});
  const atlas=await page.evaluate(()=>({width:windCloudAtlas.naturalWidth,height:windCloudAtlas.naturalHeight,src:windCloudAtlas.src,wind:CDS95Wind.windAtPixel(self.x,self.y,classGameMinutes)}));
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});await delay(500);
  await page.screenshot({path:path.join(out,'cloud-'+label+'-mobile.jpg')});
  assert(errors.length===0,JSON.stringify(errors));
  console.log(JSON.stringify({ok:true,desktop:true,mobile:true,atlas,errors}));
 }finally{child.kill();if(proxy)proxy.closeAllConnections();if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
`;
fs.writeFileSync('.tmp/voyage-cloud-review/check.cjs',source);

const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),pp=require('puppeteer-core');
const root=path.resolve(__dirname,'..'),prefix='/learning/inquiry/information-computing/computer-fundamentals/',dir=path.join(root,'docs/computer-analogies');
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream'}).end(data);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const report=[];
try{fs.mkdirSync(dir,{recursive:true});browser=await pp.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
for(const [id,type,url] of [['a01','stamp','textbook/a01.html#read'],['b01','workshop','lessons/?lesson=b01#read'],['e04','bookmark','lessons/?lesson=e04#read']]){
 await page.setViewport({width:1440,height:1050});await page.goto('http://127.0.0.1:'+server.address().port+prefix+url,{waitUntil:'networkidle0'});await page.waitForSelector('.picture-analogy svg');
 const keys=await page.$$eval('[data-analogy-part]',els=>els.map(e=>e.dataset.analogyPart));
 const rows=[];
 for(const width of [1440,768,390,320]){await page.setViewport({width,height:1000});
 for(const key of keys){await page.click('[data-analogy-part="'+key+'"]');
  assert.equal(await page.$eval('[data-analogy-part="'+key+'"]',e=>e.getAttribute('aria-pressed')),'true');
  const state=await page.$eval('.picture-analogy',e=>({part:e.dataset.part,copy:e.querySelector('.analogy-explanation p').textContent,view:e.querySelector('svg').getAttribute('viewBox'),font:getComputedStyle(e.querySelector('.analogy-explanation p')).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth+1}));
  assert.equal(state.part,key);assert.ok(state.copy.length>30);assert.equal(state.overflow,false);assert.match(state.font,/KoPub/);
  rows.push({width,key,view:state.view});
 }
 await page.click('[data-analogy-part=all]');
 if(width===1440||width===390){const box=await page.$('.picture-analogy');await box.screenshot({path:path.join(dir,type+'-'+width+'.png')});}
 }
 await page.setViewport({width:1440,height:1000});await page.click('[data-analogy-part=all]');
 const clipping=await page.$$eval('.analogy-scene text',els=>els.map(e=>{const b=e.getBBox(),v=e.ownerSVGElement.viewBox.baseVal;return{text:e.textContent,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,maxX:v.x+v.width,maxY:v.y+v.height};}).filter(e=>e.x<0||e.right>e.maxX+1||e.y<0||e.bottom>e.maxY+1));
 const cdp=await page.createCDPSession();await cdp.send('DOM.enable');await cdp.send('CSS.enable');const doc=await cdp.send('DOM.getDocument');const n=await cdp.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'.analogy-explanation p'});const fonts=await cdp.send('CSS.getPlatformFontsForNode',{nodeId:n.nodeId});assert.ok(fonts.fonts.some(f=>f.isCustomFont&&/KoPub/.test(f.familyName)));await cdp.detach();
 report.push({id,type,states:rows,clipping});console.log(id+' views '+rows.length+' clipping '+JSON.stringify(clipping));
}
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify({report,errors},null,2));assert.ok(report.every(r=>!r.clipping.length),'SVG labels must stay within the picture');
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1});

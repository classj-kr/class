const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),puppeteer=require('puppeteer-core');
const root=process.cwd(),out=path.join(root,'outputs/card-readability-browser/avalon');fs.mkdirSync(out,{recursive:true});
(async()=>{const server=http.createServer((req,res)=>{if(req.url.includes('fixture=1')){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><body></body></html>');return;}const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname)); if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;} fs.readFile(p,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.ogg':'audio/ogg'})[path.extname(p)]||'application/octet-stream');res.end(b)});}); await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const report=[];
try{browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}); const page=await browser.newPage(); await page.evaluateOnNewDocument(()=>{localStorage.setItem('classPlayerName','화면검증')});
const origin='http://127.0.0.1:'+server.address().port;

const fixtures=require(path.join(root,'scripts/lib/boardgame-fixtures.cjs'));const file=path.join(root,'learning/games/avalon/avalon.html'),original=fs.readFileSync(file,'utf8');
const html=original.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<link\b[^>]*>/gi,tag=>{const href=tag.match(/href=["']([^"']+)/)?.[1]?.split('?')[0];if(!href||!tag.includes('stylesheet'))return '';return '<style>'+fs.readFileSync(path.resolve(path.dirname(file),href),'utf8')+'</style>'});

for(const [width,height] of [[1366,768],[1280,600],[1180,820],[820,1180],[768,1024]]){
 await page.setViewport({width,height,hasTouch:true});await page.goto(origin+'/learning/games/avalon/avalon.html?fixture=1');await page.setContent(html);await fixtures.load(page,'avalon',original,file,root);
 await page.evaluate(()=>{state.phase='proposalVote';state.selectedTeam=['a','b'];lobby.sendServer=p=>{window.__sent=p;return true};render()});
 await page.waitForFunction(()=>[...document.querySelectorAll('.actionCardChoice img')].every(i=>i.complete&&i.naturalWidth));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight+1),false);
 const sizes=await page.$$eval('.actionCardChoice img',els=>els.map(i=>({ratio:i.clientWidth/i.clientHeight,natural:i.naturalWidth/i.naturalHeight})));for(const v of sizes)assert.ok(Math.abs(v.ratio-v.natural)<0.02);
 assert.ok(await page.$$eval('.actionCardCaption > span',els=>els.every(e=>parseFloat(getComputedStyle(e).fontSize)>=16)));
 assert.ok(await page.$$eval('.actionCardChoice',els=>els.every(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1&&r.left>=0&&r.right<=innerWidth+1})), 'cards and main action fit without scrolling');
 await page.screenshot({path:path.join(out,'avalon-vote-'+width+'x'+height+'.jpg'),quality:75,fullPage:true});
 await page.tap('#approve');assert.equal(await page.evaluate(()=>window.__sent.approve),true);assert.equal(await page.$('#approve'),null);
 await page.evaluate(()=>{submittedActionKey='';state.phase='questVote';roleInfo.alignment='good';render()});assert.equal(await page.$('#failure'),null);
 await page.evaluate(()=>{roleInfo.alignment='evil';render()});assert.ok(await page.$('#failure'));await page.tap('#failure');assert.equal(await page.evaluate(()=>window.__sent.success),false);
 await page.evaluate(()=>{roleInfo.role='Assassin';renderSecret()});
 const card=await page.$('#identityCard');await card.scrollIntoView();const b=await card.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();assert.equal(await page.$eval('#roleDetails',e=>e.getAttribute('aria-hidden')),'false');await new Promise(r=>setTimeout(r,400));
 await page.screenshot({path:path.join(out,'avalon-identity-'+width+'x'+height+'.jpg'),quality:75,fullPage:true});await page.mouse.up();assert.equal(await page.$eval('#roleDetails',e=>e.getAttribute('aria-hidden')),'true');
 await page.evaluate(()=>{showIdentityCard();dispatchEvent(new Event('blur'))});assert.equal(await page.$eval('#roleDetails',e=>e.getAttribute('aria-hidden')),'true');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);console.log('PASS',width,height,'image ratio, vote payload, faction options, identity hold/release/blur');
}
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});

const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),puppeteer=require('puppeteer-core');
const root=process.cwd(),out=path.join(root,'outputs/card-readability-browser/loveletter');fs.mkdirSync(out,{recursive:true});
(async()=>{const server=http.createServer((req,res)=>{if(req.url.includes('fixture=1')){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><body></body></html>');return;}const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname)); if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;} fs.readFile(p,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.ogg':'audio/ogg'})[path.extname(p)]||'application/octet-stream');res.end(b)});}); await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const report=[];
try{browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}); const page=await browser.newPage(); await page.evaluateOnNewDocument(()=>{localStorage.setItem('classPlayerName','화면검증')});
const origin='http://127.0.0.1:'+server.address().port;

const fixtures=require(path.join(root,'scripts/lib/boardgame-fixtures.cjs'));const file=path.join(root,'learning/games/loveletter/loveletter.html'),original=fs.readFileSync(file,'utf8');
const html=original.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<link\b[^>]*>/gi,tag=>{const href=tag.match(/href=["']([^"']+)/)?.[1]?.split('?')[0];if(!href||!tag.includes('stylesheet'))return '';return '<style>'+fs.readFileSync(path.resolve(path.dirname(file),href),'utf8')+'</style>'});
for(const [width,height] of [[1366,768],[1280,600],[1180,820],[820,1180],[768,1024]]){
 await page.setViewport({width,height,hasTouch:true});await page.goto(origin+'/learning/games/loveletter/loveletter.html?fixture=1');await page.setContent(html);await fixtures.load(page,'loveletter',original,file,root);
 await page.evaluate(()=>{gameState.hand=[8,1];gameState.phase='playing';gameState.turnPlayerId='a';gameState.turnDeadline=Date.now()+30000;lobby.sendServer=payload=>{window.__sent=payload;return true};resetSelection();renderGame()});
 assert.equal(await page.$$eval('.handCardEffect',els=>els.length),2);assert.ok(await page.$$eval('.handCardEffect',els=>els.every(el=>parseFloat(getComputedStyle(el).fontSize)>=16)));
 await page.tap('.handCard[aria-label^="1 "]');assert.equal(await page.$eval('#playBtn',el=>el.disabled),true);assert.ok(await page.$$eval('.guessButton',els=>els.every(el=>el.disabled)));
 await page.tap('.targetButton');assert.ok(await page.$$eval('.guessButton',els=>els.every(el=>!el.disabled)));assert.equal(await page.$eval('#playBtn',el=>el.disabled),true);
 await page.tap('.guessButton');assert.equal(await page.$eval('#playBtn',el=>el.disabled),false);
 assert.ok(await page.$$eval('.handCard,#playBtn',els=>els.every(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1&&r.left>=0&&r.right<=innerWidth+1})), 'cards and main action fit without scrolling');
 await page.screenshot({path:path.join(out,'loveletter-readability-'+width+'x'+height+'.png'),fullPage:true});
 await page.tap('#playBtn');const sent=await page.evaluate(()=>window.__sent);assert.equal(sent.card,1);assert.equal(sent.guess,2);assert.ok(sent.targetId&&sent.targetId!=='a');
 await page.evaluate(()=>{resetSelection();renderGame()});await page.tap('.handCard[aria-label^="8 "]');assert.match(await page.$eval('#playReadiness',el=>el.textContent),/내가 탈락/);
 await page.evaluate(()=>{gameState.hand=[7,5];resetSelection();renderGame()});assert.equal(await page.$eval('.handCard[aria-label^="5 "]',el=>el.disabled),true);assert.equal(await page.$eval('.handCard[aria-label^="7 "]',el=>el.disabled),false);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);console.log('PASS',width,height,'card text, guard steps, payload, princess, forced queen');report.push({width,height,passed:true});
}
fs.writeFileSync(path.join(out,'loveletter-readability-report.json'),JSON.stringify(report,null,2));
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const origin=process.env.ROOM_TEST_ORIGIN||'http://127.0.0.1:10000';
assert.ok(['localhost','127.0.0.1'].includes(new URL(origin).hostname));
const output=path.resolve('outputs/qa/game-entry-size');fs.mkdirSync(output,{recursive:true});
const sizes=[[1920,1080],[1366,768],[1180,820],[820,1180],[390,844]];
const games=fs.readdirSync('learning/games',{withFileTypes:true}).filter(e=>e.isDirectory()).flatMap(e=>{
 const file=[''+e.name+'.html','index.html'].map(f=>path.join('learning/games',e.name,f)).find(f=>fs.existsSync(f));
 if(!file)return [];const source=fs.readFileSync(file,'utf8');
 return source.includes('multiplayer-lobby.js')||source.includes('data-game-navigation="single-player"')?[{game:e.name,file,multi:source.includes('multiplayer-lobby.js')}]:[];
});
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
try{for(const {game,file,multi}of games){const page=await browser.newPage();page.setDefaultTimeout(10000);const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.context().grantPermissions(['local-network-access'],{origin});
// Supply an isolated test identity; all game scripts and socket messages are real.
await page.route('**/learning/games/**',async route=>{if(route.request().resourceType()!=='document')return route.continue();const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace(/window.CLASS_PLAYER_NAME="[^"]*"/,'window.CLASS_PLAYER_NAME="크기확인"')})});
try{
await page.goto(origin+'/'+file.replaceAll('\\','/'),{waitUntil:'domcontentloaded'});
const entry=multi?'.mp-ui-lobby':game==='sphinx'?'.game-frame':'[data-game-entry]';
await page.locator(entry).waitFor();
if(multi)await page.locator('.mp-ui-tabs button').nth(1).click();
const measure=async(phase,selector)=>{for(const [width,height]of sizes){await page.setViewportSize({width,height});
 const metric=await page.evaluate(selector=>{const el=[...document.querySelectorAll(selector)].find(e=>e.checkVisibility());if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,overflow:el.scrollWidth-el.clientWidth,title:el.querySelector('h1,.start-title,.quiz-title')?.textContent}},selector);
 const row={game,phase,viewport:[width,height],...metric};results.push(row);
 try{assert.ok(metric,'visible panel');assert.ok(metric.x>=-1&&metric.x+metric.width<=width+1,'horizontal bounds');assert.ok(Math.abs(metric.x-(width-metric.width)/2)<=2,'horizontal center');
 if(metric.height<=height-32)assert.ok(Math.abs(metric.y-(height-metric.height)/2)<=2,'vertical center');else assert.ok(metric.y>=0&&metric.y<=24,'tall panel starts in reach');assert.ok(metric.overflow<=2,'content does not overflow panel');}
 catch(e){row.failure=e.message;}
 if(game==='bomb77'&&width===1366){const png=await page.screenshot();const target=path.join(output,`bomb77-${phase}.webp`);const saved=spawnSync('python',['-c','import sys,io;from PIL import Image;Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],"WEBP",lossless=True)',target],{input:png});assert.equal(saved.status,0);}
}};
await measure('entry',entry);
if(multi){await page.locator('.mp-ui-tabs button').first().click();await page.waitForFunction(()=>!![...document.querySelectorAll('.mp-ui-connected,.mp-ui-separate-waiting:has(#lobbySetup:not(.hidden)),#game:not(.hide):has(>#lobby:not(.hide))')].find(e=>e.checkVisibility()));
await measure('waiting','.mp-ui-connected,.mp-ui-separate-waiting:has(#lobbySetup:not(.hidden)),#game:not(.hide):has(>#lobby:not(.hide))');}
if(errors.length)results.push({game,failure:errors.join('; ')});
console.log(game,results.filter(r=>r.game===game&&r.failure));
}catch(e){results.push({game,failure:e.message});console.log(game,e.message)}finally{await page.close()}}
}finally{await browser.close()}
const failures=results.filter(r=>r.failure);fs.writeFileSync(path.join(output,'verified.json'),JSON.stringify({games:games.length,cases:results.length,physicalDevices:false,identity:'local test identity',results},null,2));console.log(JSON.stringify({games:games.length,cases:results.length,failures},null,2));process.exitCode=failures.length?1:0;
})().catch(e=>{console.error(e);process.exit(1)});

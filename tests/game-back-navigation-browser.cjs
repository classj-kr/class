'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),puppeteer=require('puppeteer-core');
const origin=process.env.BACK_TEST_ORIGIN||'http://127.0.0.1:18124';
const out=path.resolve('outputs/game-back-navigation');fs.mkdirSync(out,{recursive:true});
const inventory=fs.readdirSync('learning/games',{withFileTypes:true}).filter(e=>e.isDirectory()&&!e.name.startsWith('_')).map(e=>({game:e.name,file:fs.existsSync(`learning/games/${e.name}/${e.name}.html`)?`${e.name}.html`:'index.html'})).filter(e=>fs.existsSync(`learning/games/${e.game}/${e.file}`));
async function back(page){await page.waitForFunction(()=>document.querySelector('site-back-navigation')?.shadowRoot?.querySelector('button'));await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.evaluate(()=>document.querySelector('site-back-navigation').shadowRoot.querySelector('button').click())]);}
(async()=>{const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const results=[];
try{for(const {game,file} of inventory){if(process.env.BACK_TEST_GAMES&&!process.env.BACK_TEST_GAMES.split(',').includes(game))continue;
const people=[],result={game,errors:[]};let step='entry';
async function player(name){const context=await browser.createBrowserContext(),page=await context.newPage();people.push({context,page});page.setDefaultTimeout(15000);await page.setViewport({width:1366,height:900});page.on('pageerror',e=>result.errors.push(e.message));if(process.env.BACK_TEST_COOKIE)for(const part of process.env.BACK_TEST_COOKIE.split('; ')){const i=part.indexOf('=');await page.setCookie({name:part.slice(0,i),value:part.slice(i+1),url:origin,httpOnly:true,secure:origin.startsWith('https:')});}await page.evaluateOnNewDocument(name=>{if(!location.protocol.startsWith('http'))return;localStorage.setItem('classPlayerName',name);let api;Object.defineProperty(window,'ClassroomMultiplayerLobby',{configurable:true,get:()=>api,set:value=>{api={...value,create:options=>(window.__backLobby=value.create(options))};}});},name);return page;}
const url=`${origin}/learning/games/${game}/${file}`;
async function open(page){await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__backLobby?.mounted||document.body.dataset.gameNavigation==='single-player');}
try{const host=await player('검증가람');
// The previous page is deliberately another game, not the main index.
await host.goto(`${origin}/learning/games/nonogram/index.html?back-history-test=1`,{waitUntil:'domcontentloaded'});await open(host);await back(host);assert.equal(new URL(host.url()).pathname,'/');result.entryToMain=true;
await open(host);const multi=await host.evaluate(()=>!!window.__backLobby);
if(multi){
step='waiting room to main';await host.evaluate(()=>window.__backLobby.elements.hostTab.click());await host.waitForFunction(()=>window.__backLobby.connected);await back(host);assert.equal(new URL(host.url()).pathname,'/');result.waitingToMain=true;
await open(host);await host.evaluate(()=>window.__backLobby.elements.hostTab.click());await host.waitForFunction(()=>window.__backLobby.connected);const {code,min}=await host.evaluate(()=>({code:window.__backLobby.roomCode,min:window.__backLobby.minPlayers}));step='fill players';
for(let i=1;i<min;i++){const page=await player(['검증나래','검증다람','검증라온','검증마루','검증바다','검증사랑'][i-1]);await open(page);await page.evaluate(code=>{const e=window.__backLobby.elements;e.joinTab.click();e.joinCode.value=code;e.joinButton.click();},code);await page.waitForFunction(()=>window.__backLobby.connected);}
await host.waitForFunction(min=>Object.keys(window.__backLobby.players).length>=min,{},min);
if(game==='citychase'){await host.click('.teamSeat.police.empty:not(:disabled)');await people[1].page.click('.teamSeat.thief.empty:not(:disabled)');}
if(game==='codenames')for(const [i,role] of ['red-spymaster','red-operative','blue-spymaster','blue-operative'].entries())await people[i].page.click('#pick-'+role);
step='start';const special={avalon:'#start',codenames:'#beginGameBtn',dobble:'#beginGameBtn'}[game];const selector=special||await host.evaluate(()=>'#'+window.__backLobby.ids.startButton);await host.waitForSelector(selector+':not(:disabled)',{visible:true});await host.click(selector);await host.waitForFunction(()=>(window.__backLobby.options.isGameActive?.()||window.__backLobby.started)&&!window.__backLobby.elements.lobbyScreen.checkVisibility());
}else{step='start puzzle';const selector={coinweighing:'#start-game-button',hanoitower:'#start-game-button',sphinx:'[data-difficulty-button]'}[game]||'#startButton';await host.click(selector);await host.waitForFunction(()=>![...document.querySelectorAll('[data-game-entry]')].some(e=>e.checkVisibility()));}
step='game to lobby';await back(host);assert.equal(new URL(host.url()).pathname,new URL(url).pathname.replace(/index\.html$/,'').replace(/\.html$/,''));await host.waitForFunction(()=>window.__backLobby?.mounted||[...document.querySelectorAll('[data-game-entry]')].some(e=>e.checkVisibility()));if(multi)assert.equal(await host.evaluate(()=>window.__backLobby.started||Boolean(window.__backLobby.options.isGameActive?.())),false);result.gameToLobby=true;
step='lobby to main';await back(host);assert.equal(new URL(host.url()).pathname,'/');result.lobbyToMain=true;assert.deepEqual(result.errors,[]);
}catch(e){result.failure=step+': '+e.message;await people[0]?.page.screenshot({path:path.join(out,game+'-failure.png'),fullPage:true}).catch(()=>{});}
finally{for(const {context} of people)await context.close();results.push(result);fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({origin,results},null,2));console.log(game+': '+(result.failure?'FAIL '+result.failure:'PASS'));}}
}finally{await browser.close();}console.log(results.filter(r=>!r.failure).length+'/'+results.length+' back navigation checks passed');if(results.some(r=>r.failure))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});

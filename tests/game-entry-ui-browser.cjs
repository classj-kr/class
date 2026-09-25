'use strict';
// Local by default. For an explicitly authorized live check, provide UI_TEST_ORIGIN and UI_TEST_COOKIE.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const puppeteer=require('puppeteer-core');
const origin=process.env.UI_TEST_ORIGIN||'http://127.0.0.1:18124';
const out=path.resolve('outputs',process.env.UI_TEST_OUTPUT||'game-entry-ui');fs.mkdirSync(out,{recursive:true});
const games=fs.readdirSync('learning/games',{withFileTypes:true}).filter(e=>e.isDirectory()&&!e.name.startsWith('_')).map(e=>({game:e.name,file:fs.existsSync(`learning/games/${e.name}/${e.name}.html`)?`${e.name}.html`:'index.html'})).filter(e=>fs.existsSync(`learning/games/${e.game}/${e.file}`));
(async()=>{
 const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const results=[];
 try{for(const {game,file} of games){
  if(process.env.UI_TEST_GAMES&&!process.env.UI_TEST_GAMES.split(',').includes(game))continue;
  const context=await browser.createBrowserContext(),page=await context.newPage();const result={game,checks:[],errors:[]};
  if(process.env.UI_TEST_COOKIE)for(const part of process.env.UI_TEST_COOKIE.split('; ')){const i=part.indexOf('=');await page.setCookie({name:part.slice(0,i),value:part.slice(i+1),url:origin,httpOnly:true,secure:origin.startsWith('https:')});}
  page.on('pageerror',e=>result.errors.push(e.message));
  await page.evaluateOnNewDocument(()=>{if(!location.protocol.startsWith('http'))return;localStorage.setItem('classPlayerName','화면검증');let api;Object.defineProperty(window,'ClassroomMultiplayerLobby',{configurable:true,get:()=>api,set:value=>{api={...value,create:options=>{window.__uiLobby=value.create(options);const prepare=window.__uiLobby._prepareLayout;window.__uiLobby._prepareLayout=function(){const title=this.elements.lobbyScreen.querySelector('h1, .lobby-title')||(this.gameId==='avalon'?document.querySelector('.brand b'):null);if(title)window.__authoredTitle={text:title.textContent.trim(),font:getComputedStyle(title).fontFamily};return prepare.call(this);};return window.__uiLobby;}};}});});
  try{
   await page.setViewport({width:1366,height:768});await page.goto(`${origin}/learning/games/${game}/${file}`,{waitUntil:'networkidle2',timeout:60000});
   const multiplayer=await page.evaluate(()=>!!window.__uiLobby);
   async function capture(stage){
    for(const [width,height] of [[1366,768],[768,1024],[390,844]]){
     await page.setViewport({width,height});
     const check=await page.evaluate(stage=>{
      const visible=e=>e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true});
      const result={stage,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,decorativeCopy:/CLASSROOM EDITION|방장이 선택해요|방장이 선택합니다/.test(document.body.innerText)};
      if(stage==='entry'&&window.__uiLobby){const title=document.querySelector('.mp-ui-title');result.authoredTitle=!!title&&visible(title)&&title.textContent.trim()===window.__authoredTitle?.text&&getComputedStyle(title).fontFamily===window.__authoredTitle?.font&&/[A-Z]/.test(title.textContent);const e=window.__uiLobby.elements,r=e.lobbyScreen.getBoundingClientRect(),input=e.joinCode.getBoundingClientRect(),tabs=e.hostTab.getBoundingClientRect();result.continuousCard=r.width<=642&&input.left>=r.left&&input.right<=r.right&&input.top>=tabs.bottom;result.noPrematureStart=!e.startButton||!visible(e.startButton);result.noDetachedWaiting=!['avalon','codenames','dobble'].includes(window.__uiLobby.gameId)||!visible(document.getElementById('game'));}
      if(stage==='host'&&window.__uiLobby){const e=window.__uiLobby.elements;if(e.lobbyScreen.checkVisibility()&&e.lobbyScreen.classList.contains('mp-lobby-standard')){const card=e.lobbyScreen.getBoundingClientRect(),style=getComputedStyle(e.lobbyScreen);result.fullWidthStart=e.startButton.getBoundingClientRect().width>=card.width-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-4;}}
      if(stage==='rules'&&window.__uiLobby){result.rulesVisible=[...document.querySelectorAll('.mp-ui-rules')].some(visible);result.largeHeading=[...document.querySelectorAll('.mp-ui-rules h2')].some(e=>visible(e)&&parseFloat(getComputedStyle(e).fontSize)>20);}
      return result;
     },stage);
     result.checks.push(check);
     assert.equal(check.overflow,false,`${stage} has horizontal overflow at ${width}`);
     assert.equal(check.decorativeCopy,false,'Unnecessary lobby copy is visible');
     if(check.fullWidthStart!==undefined)assert.ok(check.fullWidthStart,'Desktop start action should follow the roster at full content width');
     if(stage==='entry'&&multiplayer)assert.ok(check.authoredTitle&&check.continuousCard&&check.noPrematureStart&&check.noDetachedWaiting,JSON.stringify(check));
     if(stage==='rules'&&multiplayer)assert.ok(check.rulesVisible&&!check.largeHeading,JSON.stringify(check));
     await page.screenshot({path:path.join(out,`${game}-${stage}-${width}.png`),fullPage:true});
    }
   }
   if(multiplayer){
    await page.evaluate(()=>window.__uiLobby.elements.joinTab.click());await capture('entry');
    await page.evaluate(()=>window.__uiLobby.elements.hostTab.click());await page.waitForFunction(()=>window.__uiLobby.connected,{timeout:15000});await capture('host');
    const id=await page.evaluate(()=>window.__uiLobby.options.rulesButtonIds.find(id=>document.getElementById(id)?.checkVisibility()));assert.ok(id,'A visible rules control is required');await page.click('#'+id);
    await page.waitForFunction(()=>[...document.querySelectorAll('.mp-ui-rules')].some(e=>e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})),{timeout:5000});
    await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));
    await capture('rules');
   }else{
    await capture('entry');
    const button=await page.evaluate(()=>[...document.querySelectorAll('button')].find(e=>e.checkVisibility()&&/게임 방법/.test(e.textContent))?.getAttribute('onclick'));
    if(button){await page.evaluate(()=>[...document.querySelectorAll('button')].find(e=>e.checkVisibility()&&/게임 방법/.test(e.textContent)).click());await capture('rules');}
    else {await page.click('#startButton');await page.waitForFunction(()=>document.getElementById('gameScreen').checkVisibility());await capture('play');await page.click('#guideButton');await capture('rules');}
   }
   assert.deepEqual(result.errors,[],'Unexpected page error');
  }catch(e){result.failure=e.message;await page.screenshot({path:path.join(out,`${game}-failure.png`),fullPage:true}).catch(()=>{});}
  finally{await page.evaluate(()=>window.__uiLobby?.destroy()).catch(()=>{});await context.close();results.push(result);console.log(`${game}: ${result.failure?'FAIL '+result.failure:'PASS'}`);fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({origin,generatedAt:new Date().toISOString(),results},null,2));}
 }}finally{await browser.close();}
 console.log(`${results.filter(r=>!r.failure).length}/${results.length} UI checks passed`);if(results.some(r=>r.failure))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});

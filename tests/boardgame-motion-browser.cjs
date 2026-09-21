const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),puppeteer=require('puppeteer-core');
const fixtures=require('../scripts/lib/boardgame-fixtures.cjs');
const root=path.resolve(__dirname,'..');
(async()=>{const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
for(const game of ['lastcard','bomb77','reversi','rummikub']){
 const page=await browser.newPage();await page.setViewport({width:1024,height:768});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const file=path.join(root,'learning/games',game,game+'.html'),original=fs.readFileSync(file,'utf8');
 const html=original.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<link\b[^>]*>/gi,tag=>{const href=tag.match(/href=["']([^"']+)/)?.[1]?.split('?')[0];if(!href||!tag.includes('stylesheet')||/^https?:/.test(href))return '';const css=href.startsWith('/')?path.join(root,href):path.resolve(path.dirname(file),href);return fs.existsSync(css)?'<style>'+fs.readFileSync(css,'utf8')+'</style>':'';});
 await page.setContent(html);await page.addScriptTag({content:fs.readFileSync(path.join(root,'assets/game-motion.js'),'utf8')});await fixtures.load(page,game,original,file,root);
 await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished))});
 const result=await page.evaluate(async game=>{
  const finish=async()=>{await Promise.allSettled(document.getAnimations().filter(a=>a.effect?.target?.closest('[aria-hidden="true"]')||a.effect?.target?.classList.contains('disc')).map(a=>a.finished));await Promise.resolve()};
  const ghosts=()=>[...document.querySelectorAll('body>[data-motion-ghost]')];
  if(game==='lastcard'||game==='bomb77'){
   const field=game==='lastcard'?'topCard':'lastCard';const old=structuredClone(__fixtureState),next=structuredClone(old);next[field]=next.hand.shift();next.actionNumber++;next.turnPlayerId='b';
   __fixtureOptions.onServerMessage({type:__fixtureMessageType,state:next});
   const target=document.getElementById(field).firstElementChild;
   if(target.style.visibility!=='hidden'||!ghosts().length)throw Error('Played card did not travel');
   const moving=document.getAnimations().filter(a=>ghosts().includes(a.effect.target));
   if(!moving.some(a=>a.effect.getKeyframes()[0].transform!==a.effect.getKeyframes().at(-1).transform))throw Error('No source-to-target path');
   __fixtureOptions.onServerMessage({type:__fixtureMessageType,state:{...next,turnDeadline:Date.now()+9000}});
   if(!moving.every(a=>a.playState==='running'))throw Error('Duplicate clock snapshot interrupted motion');
   await finish();if(ghosts().length||target.style.visibility==='hidden')throw Error('Played card cleanup failed '+JSON.stringify({visibility:target.style.visibility,ghosts:ghosts().map(x=>x.outerHTML.slice(0,150)),animations:document.getAnimations().map(a=>({target:a.effect.target.className,state:a.playState}))}));
   const draw=structuredClone(next);draw.actionNumber++;draw.hand.push({...old.hand[0],id:'test-drawn-card'});
   __fixtureOptions.onServerMessage({type:__fixtureMessageType,state:draw});
   if(!ghosts().length)throw Error('Draw did not travel from deck');await finish();
   __fixtureState=draw;return game+': play, draw, duplicate update, cleanup PASS';
  }
  if(game==='reversi'){
   const cell=document.querySelector('[data-stone-value="1"]');if(!cell)throw Error('No initial stone');
   const index=boardIndex(Number(cell.dataset.row),Number(cell.dataset.col));gameState.board[index]=2;renderGame();
   if(cell.querySelectorAll('.disc').length!==2)throw Error('Old face not retained during flip');
   const animations=cell.getAnimations({subtree:true});if(animations.length!==2)throw Error('Flip animation missing');
   renderGame();if(cell.getAnimations({subtree:true})[0]!==animations[0])throw Error('Repeated render restarted flip');
   await finish();if(cell.querySelectorAll('.disc').length!==1||!cell.querySelector('.white'))throw Error('Flip cleanup failed');return 'reversi: two-sided flip, repeated render, cleanup PASS';
  }
  if(game==='rummikub'){
   const tile=document.querySelector('#rack [data-tile-id]');selectTile(tile.dataset.tileId);moveSelectedToGroup(0);
   if(!ghosts().length)throw Error('Rack-to-board travel missing');await finish();if(ghosts().length)throw Error('Tile cleanup failed');return 'rummikub: rack-to-board path and cleanup PASS';
  }
 },game);console.log(result);
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.evaluate(()=>{const el=document.createElement('div');el.style.cssText='position:fixed;left:100px;top:100px;width:50px;height:50px';document.body.append(el);ClassGameMotion.travel(el,{left:0,top:0,width:50,height:50});ClassGameMotion.appear(el);ClassGameMotion.flip(el,'old');if(el.getAnimations().length||el.style.visibility==='hidden')throw Error('Reduced motion ignored');el.remove()});
 assert.deepEqual(errors,[],game+' runtime errors');await page.close();
}
console.log('Shared reduced motion: PASS');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});

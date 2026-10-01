"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {chromium}=require("../game-hub-server/node_modules/playwright");
const base=process.env.BOARD_COACH_TEST_URL||"http://127.0.0.1:8936";
const output=path.resolve(__dirname,"../tmp/board-coach-appearance");fs.mkdirSync(output,{recursive:true});
const dimensions=[];
const artwork=(page,game)=>page.evaluate(game=>{
  const style=(selector,keys)=>{const css=getComputedStyle(document.querySelector(selector));return Object.fromEntries(keys.map(key=>[key,css[key]]));};
  const art={
    background:getComputedStyle(document.body).backgroundImage,
    board:style('#board',['backgroundColor','borderTopColor','borderTopStyle','borderTopWidth','borderRadius']),
    cell:style('#board button',['backgroundColor','borderTopStyle']),
  };
  if(game==='chess'){
    art.pieces=['white','black'].map(color=>({
      fill:style(`#board .piece-svg.${color} .piece-body`,['fill','stroke','strokeWidth']),
      detail:style(`#board .piece-svg.${color} .piece-detail`,['stroke','strokeWidth'])
    }));
    art.shapes=[...document.querySelectorAll('#board .piece-svg')].map(e=>e.innerHTML).sort();
  }else{
    art.frame=style('.boardFrame',['backgroundColor','borderTopColor','borderTopStyle','borderTopWidth','borderRadius','boxShadow']);
    art.pieces=['black','white'].map(color=>style(`#board .${game==='omok'?'stone':'disc'}.${color}`,['backgroundImage','boxShadow','borderRadius']));
  }
  return art;
},game);
async function original(page,game){
  await page.goto(`${base}/learning/games/${game}/${game}`);
  await page.evaluate(game=>{
    // Local fixture through each original renderer; no room or other players involved.
    document.querySelector('#missingScreen').classList.add('hidden');
    document.querySelector('#lobbyScreen').classList.add('hidden');
    document.querySelector('#gameScreen').classList.remove('hidden');
    if(game==='chess'){
      gameState={...ClassChessRules.createInitialState(),myColor:'w'};renderBoard();
    }else{
      lobby={snapshot:()=>({myId:'a',role:'host',players:{a:{name:'나'},b:{name:'상대'}}})};
      const board=game==='reversi'?initialBoard():Array(225).fill(0);
      if(game==='omok'){board[112]=1;board[111]=2;}
      gameState={board,playerOrder:['a','b'],turn:0,winner:0,draw:false,turnDeadline:Date.now()+60000};
      makeBoard();renderGame();
    }
  },game);
}
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});const errors=[];
  try{
    for(const game of ['chess','omok','reversi']){
      const old=await browser.newPage({viewport:{width:1366,height:668}}),coach=await browser.newPage({viewport:{width:1366,height:668}});
      for(const page of [old,coach])page.on('pageerror',e=>errors.push(e.message));
      await original(old,game);
      await coach.goto(`${base}/learning/games/board-coach/coach?game=${game}`);
      await coach.locator('#startLearning').click();
      if(game==='omok'){
        await coach.locator('[data-index="112"]').click();
        await coach.locator('#hint:not(:disabled)').waitFor();
      }
      for(const [device,viewport] of [['desktop',{width:1567,height:900}],['chromebook',{width:1366,height:668}],['ipad',{width:1024,height:768}],['ipad-large',{width:1194,height:834}],['ipad-portrait',{width:820,height:1180}],['ipad-small-portrait',{width:768,height:1024}],['phone',{width:390,height:844}]]){
        await old.setViewportSize(viewport);await coach.setViewportSize(viewport);
        await coach.evaluate(()=>window.scrollTo(0,0));
        assert.deepEqual(await artwork(coach,game),await artwork(old,game),`${game}: original artwork on ${device}`);
        const dims=await coach.evaluate(()=>{
          const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
          return {board:rect('#board'),frame:rect('.board-frame'),area:rect('#boardViewport'),cell:rect('#board button'),
            scrollWidth:document.documentElement.scrollWidth,width:innerWidth,height:innerHeight};
        });
        const context=`${game}/${device}: ${JSON.stringify(dims)}`;
        assert.ok(dims.frame.width>=Math.min(dims.area.width,dims.area.height)-2,'the board frame must fill available space: '+context);
        assert.ok(Math.abs(dims.board.width-dims.board.height)<1,'the board must stay square: '+context);
        assert.ok(Math.abs(dims.cell.width-dims.cell.height)<1,'the cells must stay square: '+context);
        assert.ok(dims.frame.y>=0&&dims.frame.bottom<=dims.height+1,'the whole board must fit on screen: '+context);
        assert.ok(dims.scrollWidth<=dims.width+1,'the page must not overflow horizontally: '+context);
        if(viewport.height>viewport.width){
          assert.ok(dims.frame.y>=50,'the fixed back control must not cover the board');
          assert.ok(dims.frame.width>=Math.min(viewport.width-40,viewport.height-80)-2,'portrait layout must use the screen width: '+context);
        }
        if(device==='ipad'&&game!=='chess')assert.ok((await coach.locator('#title').boundingBox()).x>=50,'fixed back control must not cover the heading');
        await coach.screenshot({path:path.join(output,`${game}-${device}.png`),fullPage:true});
        await coach.locator('#zoom').click();
        const zoom=await coach.locator('#board').boundingBox();
        assert.ok(zoom.width>dims.board.width+20,'zoom must enlarge even an already large board: '+context);
        assert.ok(Math.abs(zoom.width-zoom.height)<1,'zoom must preserve the square board');
        assert.ok(await coach.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'zoom stays inside the scrollable board area');
        await coach.locator('#zoom').click();
        assert.ok(Math.abs((await coach.locator('#board').boundingBox()).width-dims.board.width)<1,'whole-board view must restore the original size');
        dimensions.push({game,device,board:Math.round(dims.board.width),frame:Math.round(dims.frame.width)});
      }
      await old.close();await coach.close();
      console.log(`${game}: artwork, maximum fitted board size, square cells and zoom passed on desktop, Chromebook, iPad landscape/portrait and phone`);
    }
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(output,'dimensions.json'),JSON.stringify(dimensions,null,2));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

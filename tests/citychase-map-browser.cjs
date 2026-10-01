"use strict";
const http=require("node:http"),fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),os=require("node:os");
const {chromium,webkit}=require("../game-hub-server/node_modules/playwright");
const Game=require("../game-hub-server/citychase");
const root=path.resolve(__dirname,"..");
const output=path.join(os.tmpdir(),"citychase-map-20261001");
fs.mkdirSync(output,{recursive:true});
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(err,data)=>{
  if(err){res.writeHead(404);res.end();return;}
  res.setHeader("Content-Type",({".html":"text/html",".js":"application/javascript",".css":"text/css",".svg":"image/svg+xml",".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg"})[path.extname(file)]||"application/octet-stream");
  res.end(data);
 });
});
function fixture(){
 const g=Game.createGame("t","박하늘");
 Game.addPlayer(g,"p","김지우");Game.chooseSeat(g,"t","thief",1);Game.chooseSeat(g,"p","police",1);
 Game.startGame(g);Game.placeSecrets(g,"p",{gems:["air","cafe"],undercover:"market"});
 g.pawns[0].position="p4";g.pawns[1].position="hideout";g.pawns[2].position="p35";
 g.pawns[3].position="jail";g.pawns[4].position="pr1";g.pawns[5].position="f0";
 return g;
}
(async()=>{
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const isWebkit=process.argv.includes("--webkit");
 const browser=await (isWebkit?webkit:chromium).launch(isWebkit?{headless:true}:{channel:"msedge",headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:900},hasTouch:true,reducedMotion:"reduce"});
  await context.route("**/assets/network/game-network.js*",r=>r.fulfill({body:"window.ClassroomNetwork={};",contentType:"application/javascript"}));
  await context.route("**/assets/sound/music-control.js*",r=>r.fulfill({body:"",contentType:"application/javascript"}));
  await context.route("**/assets/network/multiplayer-lobby.js*",r=>r.fulfill({contentType:"application/javascript",body:
   fs.readFileSync(path.join(root,"assets/network/multiplayer-lobby.js"),"utf8")+
   "\nwindow.reviewMessages=[];window.reviewPlayer='t';const realLobby=window.ClassroomMultiplayerLobby;const realCreate=realLobby.create;window.ClassroomMultiplayerLobby={...realLobby,create:options=>{window.reviewOptions=options;const api=realCreate(options);api.snapshot=()=>({myId:reviewPlayer,role:'host',started:true,roomCode:'1234',players:{}});api.sendServer=m=>{reviewMessages.push(m);return true;};return api;}};"
  }));
  await context.addInitScript(()=>{localStorage.setItem("classPlayerName","박하늘");HTMLMediaElement.prototype.play=()=>Promise.resolve();HTMLMediaElement.prototype.load=()=>{};});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.goto("http://127.0.0.1:"+server.address().port+"/learning/games/citychase/citychase.html");
  async function install(state,id="t"){
   await page.evaluate(({state,id})=>{window.reviewPlayer=id;window.reviewMessages=[];reviewOptions.onServerMessage({type:"CITYCHASE_STATE",state});},{state,id});
   await page.waitForTimeout(180);
  }
  const prefix=isWebkit?"webkit-":"chromium-";
  for(const [name,width,height] of [["pc",1900,900],["chromebook",1366,650],["ipad-landscape",1024,668],["ipad-portrait",768,920]]){
   await page.setViewportSize({width,height});
   const game=fixture();await install(Game.stateFor(game,"t"));
   assert.equal(await page.locator("#nodesLayer .node").count(),127);
   assert.equal(await page.locator(".buildingPiece").count(),0);
   assert.match(await page.locator("#boardStage").evaluate(e=>getComputedStyle(e,"::before").backgroundImage),/city-board-v12\.webp/);
   const viewport=await page.locator("#boardViewport").boundingBox();
   assert(viewport.x>=0&&viewport.y>=0&&viewport.x+viewport.width<=width&&viewport.y+viewport.height<=height);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   for(const building of await page.locator("#buildingsLayer .building").all()){
    assert(await building.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
   }
   const coveredSquares=await page.evaluate(()=>{
    const buildings=[...document.querySelectorAll("#buildingsLayer .building")].map(e=>({id:e.dataset.buildingId,rect:e.getBoundingClientRect()}));
    return [...document.querySelectorAll("#nodesLayer .node")].flatMap(e=>{
     const r=e.getBoundingClientRect();
     return buildings.filter(({rect:b})=>r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top)
      .map(b=>e.dataset.nodeId+" hidden by "+b.id);
    });
   });
   assert.deepEqual(coveredSquares,[],name+": building labels must leave every square visible");
   await page.screenshot({path:path.join(output,prefix+name+".png")});
   Game.roll(game,"t",4);
   const state=Game.stateFor(game,"t");await install(state);
   const target=state.validMoves.find(id=>!Game.BOARD.NODES[id].effect&&state.moveRoutes[id].length===5&&Game.BOARD.NODES[id].kind!=="building");
   assert(target);
   await page.locator('#nodesLayer [data-node-id="'+target+'"]').tap();
   assert.equal(await page.locator("#routePreview circle").count(),4);
   assert.equal(await page.locator("#routePreview text").allTextContents().then(x=>x.join(",")),"1,2,3,4");
   assert.match(await page.locator("#boardInspectorText").innerText(),/4칸 이동/);
   assert.deepEqual(await page.evaluate(()=>reviewMessages),[],"preview must not commit a move");
   await page.screenshot({path:path.join(output,prefix+name+"-route.png")});
   await page.locator("#boardInspectorActions button").tap();
   const action=await page.evaluate(()=>reviewMessages[0]);
   assert.equal(action.action,"MOVE");assert.equal(action.nodeId,target);
   assert.equal(await page.locator("#routePreview circle").count(),0);
   assert(Game.moveToDestination(game,"t",target).ok);
   await install(Game.stateFor(game,"t"));
   console.log("PASS",prefix+name,"fit, readable labels, four-step preview and touch confirmation");
  }
  // Information opens opposite the selected square, keeping the destination visible.
  await page.locator('#nodesLayer [data-node-id="p18"]').tap();
  assert.equal(await page.locator("#boardInspector").getAttribute("data-position"),"top");
  const selected=await page.locator('#nodesLayer [data-node-id="p18"]').boundingBox();
  const inspector=await page.locator("#boardInspector").boundingBox();
  assert(inspector.y+inspector.height<selected.y);
  // The long cross-town connection still costs one step and its pawn follows the displayed bridge.
  const bridgeGame=fixture();bridgeGame.pawns[0].position="c6";
  assert(Game.roll(bridgeGame,"t",1).ok);
  await install(Game.stateFor(bridgeGame,"t"));
  await page.locator('#nodesLayer [data-node-id="d4"]').tap();
  assert.equal(await page.locator("#routePreview circle").count(),1);
  assert.equal(await page.locator("#routePreview polyline").first().evaluate(e=>e.points.numberOfItems),4);
  await page.screenshot({path:path.join(output,prefix+"bridge-preview.png")});
  await page.locator("#boardInspectorActions button").tap();
  assert(Game.moveToDestination(bridgeGame,"t","d4").ok);
  await page.emulateMedia({reducedMotion:"no-preference"});
  const samples=await page.evaluate(state=>new Promise((resolve,reject)=>{
   const samples=[],started=performance.now();let seen=false;
   reviewOptions.onServerMessage({type:"CITYCHASE_STATE",state});
   function sample(){
    const pawn=document.querySelector(".pawn.moving");
    if(pawn){seen=true;samples.push({x:parseFloat(pawn.style.left)*10,y:parseFloat(pawn.style.top)*10});}
    else if(seen){resolve(samples);return;}
    if(performance.now()-started>2000){reject(new Error("bridge animation did not finish"));return;}
    requestAnimationFrame(sample);
   }
   requestAnimationFrame(sample);
  }),Game.stateFor(bridgeGame,"t"));
  assert(samples.some(point=>point.x>580&&point.x<870&&Math.abs(point.y-440)<.1),"pawn must travel along the separated lower corridor");
  console.log("PASS",prefix+"one-step bridge preview and animation");
  assert.deepEqual(errors,[]);
  console.log("Screenshots:",output);
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});

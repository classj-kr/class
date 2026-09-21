"use strict";

// Rendered local fixtures. This does not certify real devices or live multiplayer.
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");
const http = require("node:http");
const root = path.resolve(__dirname, "..");
const sizes = [[1366,768],[1280,600],[1024,768],[768,1024],[1180,820],[820,1180]];
const seeded = new Set(["baduk", "omok", "connect6", "chess", "traverse", "diamondgame", "honeycomb"]);
const output = path.resolve(process.argv[2] || path.join(root, "docs/qa/boardgame-layout-20260921/boardgame-layout-audit.json"));
const fixtures = require("./lib/boardgame-fixtures.cjs");
const read = file => fs.readFileSync(file, "utf8");

async function main() {
  const server=http.createServer((req,res)=>{
    const url=new URL(req.url,"http://localhost");
    if(url.searchParams.has("fixture")){res.setHeader("Content-Type","text/html");res.end("<!doctype html><html><head></head><body></body></html>");return;}
    const assetPath=url.pathname.startsWith("/assets/avatars/")?"/classtools"+url.pathname:url.pathname;
    const file=path.resolve(root,"."+decodeURIComponent(assetPath));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
    const mime={'.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.css':'text/css','.js':'text/javascript'};
    res.setHeader("Content-Type",mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const origin="http://127.0.0.1:"+server.address().port;

  const browser = await puppeteer.launch({executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true});
  const results = [];
  let randomSeed=7199;const random=Math.random;Math.random=()=>((randomSeed=(randomSeed*1664525+1013904223)>>>0)/4294967296);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  try {
    for (const dir of fs.readdirSync(path.join(root,"learning/games"), {withFileTypes:true})) {
      if (!dir.isDirectory() || dir.name.startsWith("_")) continue;
      const game = dir.name;
      if(process.env.AUDIT_GAMES && !process.env.AUDIT_GAMES.split(",").includes(game)) continue;
      let file = path.join(root,"learning/games",game,game+".html");
      if (!fs.existsSync(file)) file = path.join(path.dirname(file),"index.html");
      if (!fs.existsSync(file)) continue;
      const page = await browser.newPage();
      await page.setViewport({width:1366,height:768,hasTouch:true});
      await page.goto(origin+"/"+path.relative(root,file).replaceAll(path.sep,"/")+"?fixture=1");
      await page.evaluate(()=>{let seed=7199;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296)});
      const original = read(file);
      const errors=[];page.on("pageerror",error=>errors.push(error.message));
      let fixtureError=null,rendered=seeded.has(game);
      // Inline local CSS in its original cascade order. No network/game initialization.
      const html = original.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<link\b[^>]*>/gi, tag => {
        if (!/stylesheet/i.test(tag)) return "";
        const href = tag.match(/href=["']([^"']+)/i)?.[1]?.split("?")[0];
        if (!href || /^https?:/.test(href)) return "";
        const css = href.startsWith("/") ? path.join(root,href) : path.resolve(path.dirname(file),href);
        return fs.existsSync(css) ? `<style>${read(css)}</style>` : "";
      });
      await page.setContent(html);
      await page.addScriptTag({content:read(path.join(root,"assets/game-motion.js"))});
      await page.evaluate(()=>Object.defineProperty(window,"localStorage",{configurable:true,value:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}}}));
      if (seeded.has(game)) {
        if (game === "chess") await page.addScriptTag({content:read(path.join(path.dirname(file),"chess-rules.js"))});
        const source = game === "baduk" ? read(path.join(path.dirname(file),"baduk.js")) : game === "chess" ? read(path.join(path.dirname(file),"chess-ui.js")) : [...original.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
        await page.addScriptTag({content:source.replace(/const savedName\s*=.*?;/, 'const savedName="박화승";')});
        let serverState=null;
        if(game==="honeycomb") {const engine=require(path.join(root,"game-hub-server/honeycomb.js"));const match=engine.createGame("a","박화승");engine.addPlayer(match,"b","김테스트");if(process.env.AUDIT_MAX_PLAYERS==="1")for(const id of ["c","d","e","f"])engine.addPlayer(match,id,"참가자"+id);engine.startGame(match);serverState=engine.stateFor(match,"a");}
        await page.evaluate(({game,serverState,maxPlayers}) => {
          lobby = {snapshot:()=>({players:{a:{name:"박화승"},b:{name:"김테스트"}},myId:"a",role:"host",roomCode:"7199"}),broadcast:()=>{},sendServer:()=>true};
          if(maxPlayers && (game==="traverse"||game==="diamondgame")){const snapshot=lobby.snapshot();snapshot.players.c={name:"이하늘"};if(game==="traverse")snapshot.players.d={name:"최바다"};lobby.snapshot=()=>snapshot;}
          if (game === "honeycomb") {createBoard();installState(serverState);return;}
          if (game === "traverse" || game === "diamondgame") {
            players=lobby.snapshot().players;myId="a";myRole="guest";
            if(game==="traverse") {started=true;state=makeInitialState();} else state=createInitialState(lobby.snapshot());
            showGame();renderAll();return;
          }
          if (game === "chess") {
            gameState = {...ClassChessRules.createInitialState(),myColor:"w",phase:"playing",clocks:{w:180000,b:180000},moves:[],captures:[],players:[{color:"w",name:"박화승"},{color:"b",name:"김테스트"}]};
          } else {
            if(game === "baduk") selectedMode = "standard";
            gameState = createInitialState(lobby.snapshot());
            if(game !== "baduk") makeBoard();
          }
          showGame();renderGame();
        },{game,serverState,maxPlayers:process.env.AUDIT_MAX_PLAYERS==="1"});
      }
      if(fixtures.supports(game)) {
        try {await fixtures.load(page,game,original,file,root);rendered=true;} catch(error) {fixtureError=error.message;}
      }
      const screen = await page.evaluate(() => {
        const game = document.querySelector('#gameScreen,#game-screen,#game,#game-container,#game-board,#display-area');
        if (!game) return null;
        for(const el of document.querySelectorAll('#lobbyScreen,#lobby-screen,#missingScreen,#startScreen,#start-screen')) el.style.display="none";
        for(let el=game;el&&el!==document.body;el=el.parentElement){el.classList.remove("hidden");if(getComputedStyle(el).display==="none")el.style.display="block";}
        return game.id;
      });
      const playerCount=await page.evaluate(()=>window.__fixtureState?.players?.length||Object.keys(window.__fixtureSnapshot?.players||{}).length||(typeof gameState!=="undefined"&&Array.isArray(gameState?.players)?gameState.players.length:0)||(typeof lobby!=="undefined"?Object.keys(lobby?.snapshot?.().players||{}).length:0));
      const result = {game,playerCount,coverage:rendered?"rendered match fixture":"static shell only",fixtureError,errors,screen,checks:[]};
      if(screen) for(const [width,height] of sizes) {
        await page.setViewport({width,height,hasTouch:true});
        const states = seeded.has(game) ? ["playing","ended"] : [rendered?"playing":"shell"];
        for(const state of states) {
          if(seeded.has(game)) await page.evaluate(({game,phase})=>{
            if(game==="traverse"||game==="diamondgame"){state.winner=phase==="ended"?state.order[0]:null;renderAll();return;}
            if(game==="honeycomb"){gameState.phase=phase;gameState.winnerIds=phase==="ended"?["a"]:[];renderGame();return;}
            if(game==="chess"){gameState.phase=phase;gameState.result=phase==="ended"?{reason:"checkmate",winner:"w"}:null;}
            else {gameState.winner=phase==="ended"?1:0;gameState.timeoutNotice=phase==="playing"?"김테스트 시간 초과 · 차례를 넘겼습니다.":"";}
            renderGame();
          },{game,phase:state});
          const metrics = await page.evaluate(screen=>{
            const area=document.getElementById(screen);
            const visible=el=>el.checkVisibility() && !el.closest('details:not([open]) .chat-row') && el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;
            const clipped=el=>{const r=el.getBoundingClientRect();for(let parent=el.parentElement;parent&&parent!==document.body;parent=parent.parentElement){const c=getComputedStyle(parent),p=parent.getBoundingClientRect();if((/(hidden|clip|auto|scroll)/.test(c.overflowX)&&(r.left<p.left-2||r.right>p.right+2))||(/(hidden|clip|auto|scroll)/.test(c.overflowY)&&(r.top<p.top-2||r.bottom>p.bottom+2)))return true;}return false;};
            const scrollContainer=el=>{for(let parent=el.parentElement;parent&&parent!==document.body;parent=parent.parentElement){const c=getComputedStyle(parent),r=parent.getBoundingClientRect();if((/(auto|scroll)/.test(c.overflowY)&&parent.scrollHeight>parent.clientHeight+2||/(auto|scroll)/.test(c.overflowX)&&parent.scrollWidth>parent.clientWidth+2)&&r.top>=0&&r.bottom<=innerHeight+1&&r.left>=0&&r.right<=innerWidth+1)return parent;}return null;};
            const boards=[...area.querySelectorAll('#board,.board-frame,.boardFrame,.chessboard,#boardViewport,.board-wrapper,#card-grid,#drawingCanvas')].filter(visible).map(el=>{
              const r=el.getBoundingClientRect();return {selector:el.id||el.className,width:Math.round(r.width),height:Math.round(r.height),collapsed:r.width<100||r.height<100,clipped:clipped(el),outside:r.left<0||r.top<0||r.right>innerWidth+1||r.bottom>innerHeight+1};
            });
            const candidates=[...area.querySelectorAll('button')].filter(el=>visible(el)&&!el.closest('#board,.piece-list-wrap'));
            const out=el=>{const r=el.getBoundingClientRect();return r.bottom>innerHeight+1||r.right>innerWidth+1||r.left<0||r.top<0||clipped(el);};
            const name=el=>el.id||el.textContent.trim().slice(0,25);
            const buttonsOutside=candidates.filter(el=>out(el)&&!scrollContainer(el)).map(name);
            const scrollableButtons=candidates.filter(el=>out(el)&&scrollContainer(el)).map(name);
            const visibleRoomCodes=[...area.querySelectorAll('[id*="roomCode" i],[id*="room-code" i]')].filter(visible).map(el=>el.id);
            return {visibleRoomCodes,pageOverflow:document.documentElement.scrollHeight>innerHeight+1||document.documentElement.scrollWidth>innerWidth+1,boards,buttonsOutside,scrollableButtons};
          },screen);
          result.checks.push({width,height,state,...metrics});
        }
      }
      results.push(result);
      if(rendered) {
        if(seeded.has(game)) await page.evaluate(game=>{if(game==="traverse"||game==="diamondgame"){state.winner=null;renderAll();}else{gameState.winner=0;gameState.phase="playing";renderGame();}},game);
        await page.screenshot({path:path.join(path.dirname(output),game+"-portrait-check.png")});
        await page.setViewport({width:1024,height:768,hasTouch:true});
        await page.screenshot({path:path.join(path.dirname(output),game+"-layout-check.png")});
      }
      console.log(game+": "+result.coverage+"; "+result.checks.filter(c=>c.pageOverflow||c.boards.some(b=>b.outside||b.collapsed||b.clipped)||c.buttonsOutside.length).length+" flagged checks");
      await page.close();
    }
  } finally {Math.random=random;await browser.close();server.close();}
  fs.writeFileSync(output,JSON.stringify({generatedAt:new Date().toISOString(),playerMode:process.env.AUDIT_MAX_PLAYERS==="1"?"maximum configured":"minimum configured",note:"Static shells are triage, not gameplay certification. Match fixtures use local render functions with mocked network state. No real iPad/Safari or multiplayer session was tested.",results},null,2));
  if(results.some(r=>r.fixtureError||r.errors.length||r.checks.some(c=>c.pageOverflow||c.boards.some(b=>b.outside||b.collapsed||b.clipped)||c.buttonsOutside.length))) process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;});

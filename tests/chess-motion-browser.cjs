const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),puppeteer=require('puppeteer-core');
(async()=>{const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{const p=await b.newPage();await p.setViewport({width:1024,height:768});const dir=path.resolve(__dirname,'../learning/games/chess');let html=fs.readFileSync(path.join(dir,'chess.html'),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*>/g,'');await p.setContent(html);await p.addStyleTag({content:fs.readFileSync(path.join(dir,'styles.css'),'utf8')});await p.addScriptTag({content:fs.readFileSync(path.join(dir,'chess-rules.js'),'utf8')});await p.addScriptTag({content:fs.readFileSync(path.join(dir,'chess-ui.js'),'utf8').replace(/const savedName\s*=.*?;/,'const savedName="Test";')});const failures=[];p.on('pageerror',e=>failures.push(e.message));
const results=await p.evaluate(async()=>{
 lobby={snapshot:()=>({myId:'a'}),sendServer:()=>true};
 let match=0,revision=0;
 const snapshot=(pos,side='w')=>({...pos,moves:pos.san,myColor:side,matchNumber:match,phase:'playing',revision:++revision,clocks:{w:180000,b:180000}});
 const cases=[
 ['pawn',null,'e2','e4','',1,'w'],
 ['opponent','rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1','e7','e5','',1,'w'],
 ['knight',null,'g1','f3','',1,'w'],
 ['capture','4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1','e4','d5','',2,'w'],
 ['castle king','4k3/8/8/8/8/8/8/4K2R w K - 0 1','e1','g1','',2,'w'],
 ['castle queen black','r3k3/8/8/8/8/8/8/4K3 b q - 0 1','e8','c8','',2,'b'],
 ['en passant','4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1','e5','d6','',2,'w'],
 ['promotion','4k3/P7/8/8/8/8/8/4K3 w - - 0 1','a7','a8','Q',1,'w']];
 const out=[];
 for(const [name,fen,from,to,promotion,count,side] of cases){
  match++;const pos=fen?ClassChessRules.boardFromFen(fen):ClassChessRules.createInitialState();applyServerMessage({type:'CHESS_STATE',state:snapshot(pos,side)});
  if(pieceMotions.size)throw Error('Initial snapshot animated');
  const next=ClassChessRules.applyMove(pos,from,to,promotion);if(!next.ok)throw Error(name+': illegal fixture');
  const state=snapshot(next.state,side);applyServerMessage({type:'CHESS_STATE',state});
  if(pieceMotions.size!==count)throw Error(name+': motion count '+pieceMotions.size);
  const animations=[...pieceMotions].map(m=>m.animation);
  const path=animations[0].effect.getKeyframes();if(path[0].transform==='translate(0px, 0px)')throw Error('No travel');
  if(name==='knight'&&path.length!==3)throw Error('No knight jump');
  selectSquare(0);if(selected!==null)throw Error('Input accepted while moving');
  applyServerMessage({type:'CHESS_STATE',state:{...state,revision:++revision}});
  if([...pieceMotions][0].animation!==animations[0])throw Error('Duplicate snapshot restarted motion');
  await Promise.all(animations.map(a=>a.finished));await Promise.resolve();
  if(pieceMotions.size||document.querySelector('.moving-ghost,.capture-ghost,.piece-moving'))throw Error('Motion cleanup failed');
  if(document.querySelector('#board [style*="visibility: hidden"]'))throw Error('Promotion still hidden');
  applyServerMessage({type:'CHESS_STATE',state});if(pieceMotions.size)throw Error('Move replayed');
  out.push(name+': PASS');
 }
 return out;
});
assert.equal(failures.length,0,failures.join('\n'));console.log(results.join('\n'));
await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.evaluate(()=>{const pos=ClassChessRules.createInitialState();gameState=null;const snap=p=>({...p,moves:p.san,myColor:'w',matchNumber:100,phase:'playing'});applyServerMessage({type:'CHESS_STATE',state:snap(pos)});const next=ClassChessRules.applyMove(pos,'e2','e4');applyServerMessage({type:'CHESS_STATE',state:snap(next.state)});if(pieceMotions.size)throw Error('Reduced motion ignored')});console.log('Reduced motion: PASS');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});

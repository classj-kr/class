// Local-only fixture: real museum HTML/scripts/models + production presence handler.
// Synthetic identities never touch the account database or production service.
const path = require('node:path'), fs = require('node:fs'), http = require('node:http');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname,'../..'), req = createRequire(path.join(root,'game-hub-server/package.json'));
const express=req('express'), {WebSocketServer}=req('ws');
const {createMuseumPresence}=require('../../game-hub-server/museum-presence');
const identities={
  cat:{userId:'test-cat',name:'시험고양이',schoolKey:'test-school',classKey:'test-school|1',avatarKey:'animal-cat.webp'},
  ramen:{userId:'test-ramen',name:'시험라멘',schoolKey:'test-school',classKey:'test-school|2',avatarKey:'food-ramen.webp'},
  other:{userId:'test-other',name:'다른학교',schoolKey:'other-school',classKey:'other-school|1',avatarKey:'animal-bee.webp'}
};
const app=express(),server=http.createServer(app),wss=new WebSocketServer({server});
const presence=createMuseumPresence({verifyTicket:t=>identities[t],normalizeAvatarKey:k=>k,send:(s,m)=>s.send(JSON.stringify(m))});
wss.on('connection',s=>{s.meta={};s.on('message',raw=>presence.handle(s,JSON.parse(raw)));s.on('close',()=>presence.leave(s));});
app.get('/api/museum/presence-ticket',(request,response)=>{
 const key=new URL(request.headers.referer||'http://local').searchParams.get('testVisitor')||'cat';
 if(!identities[key])return response.sendStatus(403);response.json({ticket:key,scope:'school'});
});
app.get('/api/me/storage/museum',(q,r)=>r.json({items:{}}));
app.get('/api/museum/completions',(q,r)=>r.json({records:[]}));
const museum='/learning/arts/art-appreciation/museum/';
app.get('/performance/:version',(q,r)=>{
 const version=q.params.version==='before'?'before':'after';
 let html=fs.readFileSync(path.join(root,version==='before'?'outputs/qa/museum-overhaul/before/index.html':museum+'index.html'),'utf8');
 html=html.replace('<head>','<head><base href="'+museum+'">');
 if(version==='before')html=html.replace(/src="museum.js[^\"]*"/,'src="/outputs/qa/museum-overhaul/before/museum.js"').replace(/href="styles.css[^\"]*"/,'href="/outputs/qa/museum-overhaul/before/styles.css"');
 html=html.replace(/(<script src="(?:museum.js|\/outputs\/qa\/museum-overhaul\/before\/museum.js)[^\"]*"><\/script>)/,'<script src="/tools/avatar-optimizer/museum-performance-review.js"></script>$1');
 r.type('html').send(html);
});
app.post('/performance-capture/:name',express.raw({type:'image/png',limit:'10mb'}),async(q,r)=>{
 try{if(!/^(before|after)-(entrance|resumed)$/.test(q.params.name))return r.sendStatus(400);const sharp=require('sharp'),bytes=await sharp(q.body).webp({lossless:true}).toBuffer();const out=path.join(root,'outputs/qa/museum-overhaul',q.params.name+'.webp');fs.writeFileSync(out,bytes);r.sendStatus(200);}catch(e){r.status(500).send(e.message);}
});
app.post('/performance-report/:version',express.json({limit:'2mb'}),(q,r)=>{
 if(!['before','after'].includes(q.params.version))return r.sendStatus(400);
 fs.writeFileSync(path.join(root,'outputs/qa/museum-overhaul',q.params.version+'.json'),JSON.stringify(q.body,null,2));r.sendStatus(200);
});
app.get([museum,museum+'index.html'],(q,r)=>{
 let html=fs.readFileSync(path.join(root,museum,'index.html'),'utf8');
 const controls=`<aside style="position:fixed;bottom:8px;left:12px;z-index:1000;background:#fff;padding:8px;color:#222" id="qa-controls">
 <b>로컬 가상 접속 시험 · ${q.query.testVisitor||'cat'}</b>
 <button data-qa-key="KeyW">앞으로 걷기</button><button data-qa-key="KeyS">입구로 걷기</button><button data-qa-key="KeyA">왼쪽 걷기</button><button id="qa-loop">왕복 걷기</button><button id="qa-stop">멈추기</button>
 </aside><script>
 let qaKey,qaLoop;function qaStop(){clearInterval(qaLoop);if(qaKey)window.dispatchEvent(new KeyboardEvent('keyup',{code:qaKey}));qaKey=null;}
 document.querySelectorAll('[data-qa-key]').forEach(b=>b.onclick=()=>{qaStop();qaKey=b.dataset.qaKey;window.dispatchEvent(new KeyboardEvent('keydown',{code:qaKey}));});
 document.querySelector('#qa-stop').onclick=qaStop;
 document.querySelector('#qa-loop').onclick=()=>{qaStop();let side=false;const step=()=>{if(qaKey)window.dispatchEvent(new KeyboardEvent('keyup',{code:qaKey}));qaKey=side?'KeyD':'KeyA';side=!side;window.dispatchEvent(new KeyboardEvent('keydown',{code:qaKey}));};step();qaLoop=setInterval(step,650);};
 </script>`;
 r.type('html').send(html.replace('</body>',controls+'</body>'));
});
app.use('/assets/avatars',express.static(path.join(root,'apps/classtools/assets/avatars')));
app.use(express.static(root));
server.listen(8771,'127.0.0.1',()=>console.log('Local museum fixture: http://127.0.0.1:8771'+museum+'?testVisitor=cat'));

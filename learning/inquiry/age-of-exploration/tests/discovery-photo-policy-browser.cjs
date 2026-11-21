'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {fork,execFileSync}=require('node:child_process');
const {chromium}=require('../../../../game-hub-server/node_modules/playwright');
const {io}=require('socket.io-client');
const root=path.resolve(__dirname,'..'),runtime=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'voyage-photo-'));
const server=fork(path.join(__dirname,'voyage-classroom-browser.cjs'),['--fixture'],{env:{...process.env,PORT:'0',DATA_DIR:runtime},silent:true,windowsHide:true});
let logs='',browser,host,seq=0;
server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
const place=payload=>new Promise((resolve,reject)=>{
  const request=++seq,timer=setTimeout(()=>reject(Error('fixture timeout')),8000);
  const listener=m=>{if(m.request!==request)return;clearTimeout(timer);server.off('message',listener);m.error?reject(Error(m.error)):resolve(m)};
  server.on('message',listener);server.send({request,name:'검증학생',...payload});
});
(async()=>{try{
  const port=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error(logs)),15000);server.on('message',m=>{if(m.port){clearTimeout(timer);resolve(m.port)}})});
  const base='http://127.0.0.1:'+port;
  host=io(base,{path:'/learn/world-voyage/socket.io',transports:['websocket'],reconnection:false});
  await new Promise((resolve,reject)=>{host.once('connect',resolve);host.once('connect_error',reject)});
  const ack=(event,payload={})=>new Promise((resolve,reject)=>host.timeout(8000).emit(event,payload,(error,data)=>error?reject(error):resolve(data)));
  const room=await ack('createRoom',{roomType:'free'});assert.equal(room.ok,true);assert.equal((await ack('hostStartFree')).ok,true);
  browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1180,height:820}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/?room='+room.roomCode+'&name='+encodeURIComponent('검증학생'));
  await page.waitForFunction(()=>typeof joined!=='undefined'&&joined&&assetsReady,null,{timeout:60000});
  const points=require('../data/catalog/discoveries.json');
  const inspect=async id=>{
    const item=points.find(item=>item.id===id);assert.ok(item);
    await place({lat:item.lat,lon:item.lon,mode:'land'});
    await page.waitForFunction(id=>discoveryInteraction?.id===id&&discoveryInteraction.canUse,id,{timeout:5000});
    await page.locator('#discoveryActionBtn').click();
    await page.waitForFunction(()=>document.querySelector('#discoveryView').classList.contains('show'));
  };
  const capture=async name=>{
    if(!process.env.VOYAGE_PHOTO_CAPTURE)return;
    fs.mkdirSync(process.env.VOYAGE_PHOTO_CAPTURE,{recursive:true});
    execFileSync('python',['-c','import sys,io;from PIL import Image;Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],"WEBP",lossless=True)',path.resolve(process.env.VOYAGE_PHOTO_CAPTURE,name+'.webp')],{input:await page.screenshot(),windowsHide:true});
  };
  await inspect('amazon_mouth');
  assert.equal(await page.locator('#discoveryPhoto').isVisible(),true,'Amazon must show the new landscape photo');
  await page.waitForFunction(()=>document.querySelector('#discoveryImage').complete&&document.querySelector('#discoveryImage').naturalWidth>0);
  assert.equal(await page.locator('#discoveryPhoto .photoCredit').count(),1,'replacement keeps source and license information');
  assert.ok((await page.locator('#discoveryPhoto .photoCaption').innerText()).includes('바이리키'));
  assert.ok((await page.locator('#discoveryText').innerText()).includes('대서양'));
  await capture('amazon-landscape-desktop');
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.locator('#discoveryImage').evaluate(image=>{const r=image.getBoundingClientRect();return{left:r.left,right:r.right,width:r.width,viewport:innerWidth}});
  assert.ok(mobile.width>0&&mobile.left>=0&&mobile.right<=mobile.viewport,'photo fits the mobile popup');
  await capture('amazon-landscape-mobile');
  await page.setViewportSize({width:1180,height:820});
  const ids=require('../docs/discovery-photo-replacements.json').photos.map(row=>row.id);
  const decoded=await page.evaluate(async ids=>Promise.all(ids.map(id=>new Promise((resolve,reject)=>{
    const image=new Image();image.onload=()=>resolve({id,width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(Error(id+' failed to load'));
    image.src='/learn/world-voyage/assets/landmarks/'+id+'.webp';
  }))),ids);
  assert.equal(decoded.length,40);assert.ok(decoded.every(image=>image.width>=600&&image.height>=300),'all replacement images decode at usable dimensions');
  await page.locator('#discoveryClose').click();
  await inspect('meteora');
  assert.equal(await page.locator('#discoveryPhoto').isVisible(),true,'suitable landscape photo remains visible');
  await page.waitForFunction(()=>document.querySelector('#discoveryImage').complete&&document.querySelector('#discoveryImage').naturalWidth>0);
  await capture('meteora-landscape');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({ok:true,replacementImagesDecoded:decoded.length,amazonLandscapeVisible:true,mobileFits:true,groundPhotoRetained:true,browserErrors:0}));
}finally{
  if(browser)await browser.close();if(host)host.disconnect();server.kill();
  await new Promise(resolve=>server.exitCode!==null?resolve():server.once('exit',resolve));
  fs.rmSync(runtime,{recursive:true,force:true});
}})().catch(error=>{console.error(error);process.exitCode=1});

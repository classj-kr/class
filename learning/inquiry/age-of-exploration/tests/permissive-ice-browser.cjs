'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fork, execFileSync } = require('node:child_process');
const project = path.resolve(__dirname, '..');

// 별도 서버와 임시 저장소에서만 날짜·위치를 제어한다. 운영 서버에는 시험용 API를 추가하지 않는다.
if (process.argv.includes('--fixture')) {
  const Module = require('node:module'), file = path.join(project, 'server.js');
  const mod = new Module(file, module); mod.filename = file; mod.paths = Module._nodeModulePaths(project);
  let source = fs.readFileSync(file, 'utf8');
  source = source.replace('const app = express();', `const app = express();
    app.use('/learning',express.static(${JSON.stringify(path.resolve(project, '../..'))}));
    app.use('/assets',express.static(${JSON.stringify(path.resolve(project, '../../../assets'))}));
    app.use((req,res,next)=>{req.url=req.url.replace(/^\\/learn\\/world-voyage/,'')||'/';next()});`);
  source = source.replace('serveClient: true,', "serveClient: true, path:'/learn/world-voyage/socket.io',");
  mod._compile(source + `
    server.on('listening',()=>process.send({port:server.address().port}));
    process.on('message',m=>{try{
      const p=[...rooms.values()].flatMap(r=>[...r.values()]).find(p=>p.name==='빙하탐험');
      if(!p)throw Error('missing player');
      const clock=clockForRoom(p.roomCode);clock.baseGameMinutes=(m.day-1)*1440;clock.baseServerMs=Date.now();
      const lon=m.lon??0,lat=m.core?Terrain.iceLimitNorthAt(lon,m.day)+m.core:m.lat;
      setModeAt(p,'sea',{x:(lon+180)/360*WORLD_PIXEL_W,y:(90-lat)/180*WORLD_PIXEL_H});
      p.fatigue=0;p.noticeText='';p.noticeAt=0;
      const slowdown=iceSlowdownFor(p),before={x:p.x,y:p.y};
      const collision=m.deltaLat?moveWithTerrainCollision(p,0,-m.deltaLat/180*WORLD_PIXEL_H):null;
      process.send({request:m.request,before,collision,slowdown,player:publicPlayer(p)});
    }catch(e){process.send({request:m.request,error:e.message})}});
  `, file);
} else {
  const { chromium } = require('../../../../game-hub-server/node_modules/playwright');
  const { io } = require('socket.io-client');
  const runtime = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'voyage-ice-'));
  const server = fork(__filename, ['--fixture'], {env:{...process.env,PORT:'0',DATA_DIR:runtime},silent:true,windowsHide:true});
  let logs='', browser, host, seq=0;
  server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
  const place = payload => new Promise((resolve,reject)=>{
    const request=++seq,timer=setTimeout(()=>reject(Error('fixture timeout: '+logs)),8000);
    const listener=m=>{if(m.request!==request)return;clearTimeout(timer);server.off('message',listener);m.error?reject(Error(m.error)):resolve(m)};
    server.on('message',listener);server.send({request,...payload});
  });
  (async()=>{
    try {
      const port=await new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(Error(logs||'server timeout')),15000);
        server.on('message',m=>{if(m.port){clearTimeout(timer);resolve(m.port)}});
      });
      const base='http://127.0.0.1:'+port;
      host=io(base,{path:'/learn/world-voyage/socket.io',transports:['websocket'],reconnection:false});
      await new Promise((resolve,reject)=>{host.once('connect',resolve);host.once('connect_error',reject)});
      const ack=(event,payload={})=>new Promise((resolve,reject)=>host.timeout(8000).emit(event,payload,(err,data)=>err?reject(err):resolve(data)));
      const room=await ack('createRoom',{roomType:'free'});assert.equal(room.ok,true);
      assert.equal((await ack('hostStartFree')).ok,true);
      browser=await chromium.launch({channel:'msedge',headless:true});
      const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+'/?room='+room.roomCode+'&name='+encodeURIComponent('빙하탐험'));
      await page.waitForFunction(()=>typeof joined!=='undefined'&&joined&&assetsReady&&globeReady,null,{timeout:60000});
      const at=async payload=>{
        const result=await place(payload);
        await page.waitForFunction(pos=>serverSelf&&Math.hypot(serverSelf.x-pos.x,serverSelf.y-pos.y)<2,result.player,{timeout:5000});
        await page.evaluate(()=>{zoom=.75;zoomManuallyAdjusted=true;viewMotion.update(self,1,mode);globeLastCenter=null;syncGlobeCamera()});
        return result;
      };
      const capture=async name=>{
        if(!process.env.VOYAGE_ICE_CAPTURE)return;
        fs.mkdirSync(process.env.VOYAGE_ICE_CAPTURE,{recursive:true});
        await page.waitForTimeout(700);
        execFileSync('python',['-c','import sys,io;from PIL import Image;Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],"WEBP",lossless=True)',path.resolve(process.env.VOYAGE_ICE_CAPTURE,name+'.webp')],{input:await page.screenshot(),windowsHide:true});
      };
      const iceLabels=()=>page.evaluate(()=>{
        const labels=[],fill=ctx.fillText,view=viewPosition();
        ctx.fillText=function(text,...args){labels.push(text);return fill.call(this,text,...args)};
        try{drawIceLayer(innerWidth,innerHeight,view.x-innerWidth/zoom/2,view.y-innerHeight/zoom/2)}
        finally{ctx.fillText=fill}
        return labels;
      });
      await at({lat:66.04,lon:-29.41,day:105});
      assert.deepEqual(await iceLabels(),[],'open water must not show an ice warning because of distant floes');
      await capture('greenland-april');
      const start=await page.evaluate(()=>({...serverSelf}));
      await page.keyboard.down('ArrowUp');await page.waitForTimeout(2000);await page.keyboard.up('ArrowUp');
      const end=await page.evaluate(()=>({...serverSelf}));
      assert.ok(end.y<start.y-2,'the ship can sail north at the previously blocked screenshot location');
      assert.ok(!end.noticeText?.includes('항해가 어려움'),'open water must not report a blocking ice wall');
      const drift=await at({lat:66,lon:-33,day:105,deltaLat:.2});
      assert.equal(drift.collision.moved,true,'April coastal drift ice is passable');
      assert.ok(drift.slowdown>=.72&&drift.slowdown<1,'coastal drift ice causes only mild slowdown');
      assert.ok((await iceLabels()).includes('유빙 구역 - 천천히 항해하세요'),'visible drift ice has a passable-area label');
      await at({lat:66.04,lon:-29.41,day:256});
      assert.deepEqual(await iceLabels(),[],'September offshore is clear');await capture('greenland-september');
      const southwest=await at({lat:64,lon:-53,day:74,deltaLat:.2});
      assert.equal(southwest.collision.moved,true,'southwest Greenland remains navigable in March');
      assert.equal(southwest.slowdown,1);assert.deepEqual(await iceLabels(),[]);await capture('greenland-southwest-march');
      const core=await place({lon:0,day:74,core:-.05,deltaLat:.2});
      assert.ok(core.collision.blockedTerrain,'dense polar core still blocks entry');
      const escape=await place({lon:0,day:74,core:.2,deltaLat:-.3});
      assert.equal(escape.collision.moved,true,'a ship inside the polar core can escape south');
      assert.deepEqual(errors,[]);
      console.log(JSON.stringify({ok:true,screenshotLocationSailed:true,driftSlowdown:drift.slowdown,southwestOpen:true,polarCoreBlocks:true,escape:true,browserErrors:errors.length,captures:process.env.VOYAGE_ICE_CAPTURE||null}));
    } finally {
      if(browser)await browser.close();if(host)host.disconnect();server.kill();
      await new Promise(resolve=>server.exitCode!==null?resolve():server.once('exit',resolve));
      fs.rmSync(runtime,{recursive:true,force:true});
    }
  })().catch(error=>{console.error(error);process.exitCode=1});
}

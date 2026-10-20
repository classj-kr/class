'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {fork,execFileSync}=require('node:child_process');
const {chromium}=require('../../../../game-hub-server/node_modules/playwright');
const runtime=fs.mkdtempSync(path.join(os.tmpdir(),'voyage-flow-'));
const fixture=fork(path.join(__dirname,'voyage-classroom-browser.cjs'),['--fixture'],{env:{...process.env,PORT:'0',DATA_DIR:runtime},silent:true,windowsHide:true});
let browser,logs='';fixture.stdout.on('data',d=>logs+=d);fixture.stderr.on('data',d=>logs+=d);
(async()=>{
  try{
    const port=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error(logs||'server timeout')),15000);fixture.on('message',m=>{if(m.port){clearTimeout(timer);resolve(m.port)}})});
    browser=await chromium.launch({channel:'msedge',headless:true});
    const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:'+port+'/?name='+encodeURIComponent('검증학생'));
    await page.waitForFunction(()=>typeof assetsReady!=='undefined'&&assetsReady&&socket.connected,null,{timeout:60000});
    await page.locator('[data-room-type="free"]').click();await page.locator('#joinStartBtn').click();
    await page.waitForFunction(()=>joined);await page.locator('#hostStartBtn').click();
    await page.waitForFunction(()=>classSettings.started===true&&globeReady);
    // Freeze authoritative updates while inspecting the same real map at several ocean locations.
    await page.evaluate(()=>{socket.disconnect();backgroundMusic.setMuted?.(true)});
    const cases=[];
    for(const [label,lon,lat,width,height,mapZoom]of[
      ['atlantic-desktop',-48,46,1366,768,1],
      ['atlantic-phone',-48,46,390,844,.68],
      ['kuroshio-phone',136,33,390,844,1],
      ['peru-desktop',-77,-24,1366,768,1],
      ['atlantic-close',-48,46,1366,768,3.6],
      ['quiet-ocean',-140,0,1366,768,1],
      ['dateline',179,43,1366,768,.55],
      ['high-latitude',-58,64,1366,768,.55]
    ]){
      await page.setViewportSize({width,height});
      await page.evaluate(({lon,lat,mapZoom})=>{
        const p=CDS95Current.pixelFromLonLat(lon,lat);self.x=p.x;self.y=p.y;mode='sea';zoom=mapZoom;zoomManuallyAdjusted=true;
        viewMotion.update(self,1,mode);globeLastCenter=null;syncGlobeCamera();
      },{lon,lat,mapZoom});
      await page.waitForTimeout(450);
      const result=await page.evaluate(()=>{
        const width=innerWidth,height=innerHeight,view=viewPosition(),left=view.x-viewSpanX/2,top=view.y-viewSpanY/2;
        let marks=0,pixels=0,clouds=0;const draw=ctx.drawImage;
        ctx.clearRect(0,0,width,height);
        ctx.drawImage=function(img,...args){if(img===currentFlowSprite)marks++;return draw.call(this,img,...args)};
        const start=performance.now();
        try{drawOceanCurrents(width,height,left,top,1000)}finally{ctx.drawImage=draw}
        const elapsed=performance.now()-start;
        const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
        for(let i=3;i<data.length;i+=4)if(data[i]>80)pixels++;
        ctx.drawImage=function(img,...args){if(img===windCloudAtlas)clouds++;return draw.call(this,img,...args)};
        try{drawWindClouds(width,height,left,top,1000)}finally{ctx.drawImage=draw;paintScene()}
        return{marks,pixels,clouds,elapsed,globe:globeReady,lat:90-view.y/MAP_H*180};
      });
      if(label==='quiet-ocean')assert.equal(result.marks,0,'quiet ocean has no current overlay');
      else{assert.ok(result.marks>=2,label+': multiple current marks must be drawn');assert.ok(result.pixels>120,label+': water marks must have visible pixels')}
      cases.push({label,...result});
      if(process.env.VOYAGE_FLOW_CAPTURE&&['atlantic-desktop','atlantic-phone','kuroshio-phone'].includes(label)){
        fs.mkdirSync(process.env.VOYAGE_FLOW_CAPTURE,{recursive:true});
        execFileSync('python',['-c','import sys,io; from PIL import Image; im=Image.open(io.BytesIO(sys.stdin.buffer.read())); im.save(sys.argv[1],"WEBP",lossless=True); out=Image.open(sys.argv[1]); out.load(); assert out.size==im.size and out.convert("RGBA").tobytes()==im.convert("RGBA").tobytes()',path.resolve(process.env.VOYAGE_FLOW_CAPTURE,label+'.webp')],{input:await page.screenshot(),windowsHide:true});
      }
    }
    // The flat fallback must keep the same current coverage if WebGL is unavailable.
    const fallback=await page.evaluate(()=>{globeReady=false;const p=CDS95Current.pixelFromLonLat(-48,46);self.x=p.x;self.y=p.y;viewMotion.update(self,1,mode);drawMap(innerWidth,innerHeight);return currentTracers.length});
    assert.ok(fallback>0);assert.deepEqual(errors,[]);
    console.log(JSON.stringify({ok:true,cases,fallbackTracers:fallback},null,2));
  }finally{await browser?.close();fixture.kill()}
})().catch(e=>{console.error(e);console.error(logs);process.exitCode=1});

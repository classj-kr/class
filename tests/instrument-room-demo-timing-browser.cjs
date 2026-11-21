// Check score rhythm and audio-clock scheduling independently of UI callbacks.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'..'),room='/learning/arts/instrument-room/';
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 fs.readFile(file,(err,data)=>{
  if(err)return res.writeHead(404).end();
  if(file.endsWith('instrument-room'+path.sep+'app.js')){
   data=data.toString().replace('document.addEventListener("DOMContentLoaded", init);','window.timingTest={state,selectModel,stopKeyboardDemo,playKeyboardDemo,GUITAR_DEMOS,ensureAudio,getRun:()=>keyboardDemoRun};window.demoStarts=[];document.addEventListener("DOMContentLoaded", init);');
   data=data.replace('function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) {','function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) { demoStarts.push({midi,anchor,when,calledAt:state.audioContext?.currentTime});');
  }
  res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ogg':'audio/ogg','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream'}).end(data);
 });
});
const beats=[0,.5,.75,1.25,1.75,2,2.5,2.75,3.25,4,4.5,4.75,5.25,5.75,6,6,6.5,6.75,7,7.5];
const pitches=[69,54,61,69,52,68,52,61,68,66,50,59,66,50,66,49,59,49,65,49];
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  for(const width of [1366,390]){
   const page=await browser.newPage();await page.setViewport({width,height:900,isMobile:width<500,hasTouch:width<500});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+room,{waitUntil:'networkidle0'});
   await page.click('[data-family="guitar"]');await page.evaluate(()=>timingTest.selectModel('classical-guitar'));
   await page.$eval('#guitarDemoButton',b=>b.scrollIntoView());
   if(width<500)await page.tap('#guitarDemoButton');else await page.click('#guitarDemoButton');
   await page.waitForFunction(()=>demoStarts.length===40);
   const starts=await page.evaluate(()=>demoStarts);
   const expectedBeats=[...beats,...beats.map(b=>b+8)];
   const expectedPitches=[...pitches,...pitches.map((p,i)=>i===2?62:p)];
   assert.deepEqual(starts.map(n=>n.midi),expectedPitches);
   starts.forEach((note,i)=>{
    assert.equal(note.midi,note.anchor,'native recorded pitch');
    assert.ok(note.when>note.calledAt,'schedule ahead of the audio clock');
    assert.ok(Math.abs(note.when-starts[0].when-expectedBeats[i]*60/84)<1/48000,'score attack '+i);
   });
   // Stall the UI over more than two sixteenth-note slots. Audio was already
   // submitted at exact times, so this cannot stretch or bunch up its attacks.
   await page.evaluate(()=>{const until=performance.now()+550;while(performance.now()<until){};});
   assert.deepEqual(await page.evaluate(()=>demoStarts),starts);
   await page.evaluate(()=>{
    const voices=[...timingTest.getRun().voices];timingTest.stopKeyboardDemo();
    window.cancelledFuture=voices.filter(v=>v.startedAt>timingTest.state.audioContext.currentTime+.25).every(v=>v.stopAt<v.startedAt);
   });
   assert.equal(await page.evaluate(()=>cancelledFuture),true,'stop cancels queued future notes');
   assert.equal(await page.$$('.key.demo-hit').then(x=>x.length),0);
   await new Promise(r=>setTimeout(r,300));
   assert.equal(await page.evaluate(()=>timingTest.state.pianoVoices.size),0);
   assert.deepEqual(errors,[]);
   if(width===1366){
    const encoded=await page.evaluate(async()=>{
     const a=timingTest,Native=window.AudioContext;
     const context=new OfflineAudioContext(2,13*48000,48000);context.resume=()=>Promise.resolve();
     window.AudioContext=function(){return context;};a.state.audioContext=null;
     a.state.pianoVoices.clear();a.state.pianoReleaseVoices.clear();a.ensureAudio();window.AudioContext=Native;
     const demo=a.GUITAR_DEMOS['classical-guitar'];
     await a.playKeyboardDemo(document.querySelector('#guitarDemoButton'),demo.bpm,demo.notes,demo.endBeat);
     const output=await context.startRendering();a.stopKeyboardDemo();
     const pcm=new Float32Array(output.length*2);
     for(let i=0;i<output.length;i++){pcm[2*i]=output.getChannelData(0)[i];pcm[2*i+1]=output.getChannelData(1)[i];}
     const bytes=new Uint8Array(pcm.buffer);let result='';
     for(let i=0;i<bytes.length;i+=32768)result+=String.fromCharCode(...bytes.subarray(i,i+32768));
     return btoa(result);
    });
    const pcm=Buffer.from(encoded,'base64'),head=Buffer.alloc(44);
    head.write('RIFF');head.writeUInt32LE(pcm.length+36,4);head.write('WAVEfmt ',8);head.writeUInt32LE(16,16);
    head.writeUInt16LE(3,20);head.writeUInt16LE(2,22);head.writeUInt32LE(48000,24);head.writeUInt32LE(384000,28);
    head.writeUInt16LE(8,32);head.writeUInt16LE(32,34);head.write('data',36);head.writeUInt32LE(pcm.length,40);
    fs.mkdirSync(path.join(root,'outputs/instrument-demo-review'),{recursive:true});
    fs.writeFileSync(path.join(root,'outputs/instrument-demo-review/shape-fixed-demo.wav'),Buffer.concat([head,pcm]));
   }
   console.log(JSON.stringify({width,notes:40,bpm:84,sixteenthSeconds:60/84/4,uiStallMs:550,cancelledFuture:true,passed:true}));
   await page.close();
  }
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});

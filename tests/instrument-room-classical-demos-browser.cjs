const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'..'),room='/learning/arts/instrument-room/';
const fixtures=require('./fixtures/instrument-classical-excerpts.json');
const plans={
 'french-horn':{family:'brass',source:'horn',bpm:171,end:24.5,first:[58,63,63]},
 clarinet:{family:'woodwind',source:'clarinet',bpm:57,end:24,first:[69,74,78]},
 trumpet:{family:'brass',source:'trumpet',bpm:130,end:24,first:[70,75,72]},
 flute:{family:'woodwind',source:'flute',bpm:120,end:17,first:[83,86,83]},
 'pipe-organ':{family:'keyboard',bpm:60,end:25.5,first:[69,81,67,79,69,81]},
 clavinet:{family:'keyboard',bpm:100,end:17,first:[39,51,49]}
};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 fs.readFile(file,(err,data)=>{
  if(err)return res.writeHead(404).end();
  if(file.endsWith('instrument-room'+path.sep+'app.js')){
   data=data.toString().replace('document.addEventListener("DOMContentLoaded", init);','window.classicalTest={state,selectModel,MELODY_DEMOS,ensureAudio,playKeyboardDemo,stopKeyboardDemo};window.classicalHits=[];document.addEventListener("DOMContentLoaded", init);');
   data=data.replace('function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) {','function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) { classicalHits.push({midi,anchor,sampleSet,when});');
  }
  res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ogg':'audio/ogg','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream'}).end(data);
 });
});
function wave(pcm){const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(pcm.length+36,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(3,20);h.writeUInt16LE(2,22);h.writeUInt32LE(48000,24);h.writeUInt32LE(384000,28);h.writeUInt16LE(8,32);h.writeUInt16LE(32,34);h.write('data',36);h.writeUInt32LE(pcm.length,40);return Buffer.concat([h,pcm]);}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  for(const width of [1366,390])await Promise.all(Object.entries(plans).map(async([id,plan])=>{
   const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.setViewport({width,height:900,isMobile:width<500,hasTouch:width<500});
   await page.goto('http://127.0.0.1:'+server.address().port+room,{waitUntil:'networkidle0'});
   await page.click('[data-family="'+plan.family+'"]');await page.evaluate(id=>classicalTest.selectModel(id),id);
   const selector='#melodyDemoButtons button';await page.waitForSelector(selector,{visible:true});
   await page.$eval(selector,e=>e.scrollIntoView({block:'center',inline:'center'}));
   await page.evaluate(()=>window.classicalHits=[]);
   if(width<500)await page.tap(selector);else await page.click(selector);
   await page.waitForFunction(()=>classicalHits.length>0&&document.querySelector('.key.demo-hit'));
   const hits=await page.evaluate(()=>classicalHits);
   assert.deepEqual(hits.slice(0,plan.first.length).map(n=>n.midi),plan.first,id);
   assert.ok(hits.every(n=>n.midi===n.anchor&&n.sampleSet===id),id+': exact recorded pitches');
   if(plan.source){
    const expected=fixtures[plan.source];assert.equal(hits.length,expected.length,id);
    hits.forEach((n,i)=>{assert.equal(n.midi,expected[i][1],id+'/'+i);assert.ok(Math.abs(n.when-hits[0].when-expected[i][0]*60/plan.bpm)<1/48000,id+' score timing '+i);});
   }
   if(id==='pipe-organ'){
    assert.equal(hits.length,61);for(const time of [0,4.5,9,13.5])assert.ok(hits.some(n=>Math.abs(n.when-hits[0].when-time)<1e-8));
    assert.ok(Math.abs(hits.at(-1).when-hits[0].when-22)<1e-8);
   }
   await page.waitForFunction(()=>document.querySelector('#melodyDemoButtons button').getAttribute('aria-pressed')==='false',{timeout:35000});
   assert.equal(await page.$$('.key.demo-hit').then(e=>e.length),0);assert.deepEqual(errors,[]);
   if(width===1366){
    const encoded=await page.evaluate(async id=>{
     const a=classicalTest,Native=window.AudioContext,demo=a.MELODY_DEMOS[id][0],context=new OfflineAudioContext(2,Math.ceil((demo.endBeat*60/demo.bpm+.7)*48000),48000);context.resume=()=>Promise.resolve();
     window.AudioContext=function(){return context;};a.state.audioContext=null;a.state.pianoVoices.clear();a.state.pianoReleaseVoices.clear();a.ensureAudio();window.AudioContext=Native;
     await a.playKeyboardDemo(document.querySelector('#melodyDemoButtons button'),demo.bpm,demo.notes,demo.endBeat);
     const rendered=await context.startRendering();a.stopKeyboardDemo();const pcm=new Float32Array(rendered.length*2);
     for(let i=0;i<rendered.length;i++){pcm[i*2]=rendered.getChannelData(0)[i];pcm[i*2+1]=rendered.getChannelData(1)[i];}
     const bytes=new Uint8Array(pcm.buffer);let s='';for(let i=0;i<bytes.length;i+=32768)s+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(s);
    },id);
    fs.mkdirSync(path.join(root,'outputs/instrument-demo-review'),{recursive:true});fs.writeFileSync(path.join(root,'outputs/instrument-demo-review/'+id+'-demo.wav'),wave(Buffer.from(encoded,'base64')));
   }
   console.log(JSON.stringify({id,width,notes:hits.length,seconds:plan.end*60/plan.bpm,passed:true}));await page.close();
  }));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});

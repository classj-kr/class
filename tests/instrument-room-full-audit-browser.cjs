// Real app sample routing and sustain-loop validation across every held sample.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer-core');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'learning/arts/instrument-room/app.js'), 'utf8');
const held = [...source.match(/const heldTone = ([^;]+);/)[1].matchAll(/"([^"]+)"/g)].map(match => match[1]);
const sourceFiles = {};
const server = http.createServer((request, response) => {
  let file = path.resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return response.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) return response.writeHead(404).end();
    if(file.endsWith('.ogg')) {
      const stat=fs.statSync(file);
      sourceFiles[path.relative(root,file).split(path.sep).join('/')]={size:stat.size,mtimeMs:stat.mtimeMs};
    }
    if (file.endsWith('instrument-room' + path.sep + 'app.js')) data = data.toString().replace('document.addEventListener("DOMContentLoaded", init);',
      'window.audit={state,KEYBOARD_SAMPLE_SETS,concertGrandSampleFile,loadConcertGrandSample,decodedBufferSustainLoop,startConcertGrandSample,preloadRemainingRange,modelById,allNotesOff};cacheElements();');
    response.writeHead(200, {'Content-Type': ({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ogg':'audio/ogg'})[path.extname(file)] || 'application/octet-stream'}).end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:' + server.address().port + '/learning/arts/instrument-room/');
    const result = await page.evaluate(async held => {
      const a = audit, decoder = new OfflineAudioContext(2,48000,48000), routes = [], loops = [], overlaps = [];
      const Native = window.AudioContext;
      for (const id of ['baritone-sax','bass-clarinet','bass-trombone','contrabassoon','euphonium','french-horn','tenor-sax','trombone','tuba','upright-bass','upright-bass-pizz','xylophone','cello']) {
        const context = new OfflineAudioContext(2,48000*7,48000);
        context.resume = () => Promise.resolve();
        window.AudioContext = function () { return context; };
        a.state.audioContext = null;
        a.state.currentModel = {id:id === 'upright-bass-pizz' ? 'upright-bass' : id};
        a.state.articulation = id.endsWith('-pizz') ? 'pizzicato' : 'sustain';
        const sample = await a.loadConcertGrandSample(60);
        window.AudioContext = Native;
        const voice = a.startConcertGrandSample(60,.8,sample.anchor,sample.buffer,sample.sampleSet);
        const rendered = await context.startRendering();
        const data = sample.buffer.getChannelData(0), rate = sample.buffer.sampleRate;
        const period = rate / (440*2**((60-69)/12));
        function correlation(lag) {
          let cross=0,left=0,right=0;
          for (let i=Math.round(rate*.3);i<Math.round(rate*.6);i++) {
            const offset=i+lag,low=Math.floor(offset),fraction=offset-low;
            const x=data[i],y=data[low]*(1-fraction)+data[low+1]*fraction;
            cross+=x*y;left+=x*x;right+=y*y;
          }
          return cross/Math.sqrt(left*right);
        }
        let body=0,late=0;
        const output=rendered.getChannelData(0);
        for(let i=48000;i<96000;i++)body+=output[i]*output[i];
        for(let i=48000*6;i<48000*7;i++)late+=output[i]*output[i];
        const config=a.KEYBOARD_SAMPLE_SETS[id],model=a.modelById(id==='upright-bass-pizz'?'upright-bass':id);
        if(model.range[0]!==Math.max(21,config.min)||model.range[1]!==config.max)throw new Error(id+': displayed range must match sounding range');
        routes.push({id,range:model.range,correlation:correlation(period),halfPeriod:correlation(period/2),rate:voice.source.playbackRate.value,held:voice.source.loop,lateRatio:Math.sqrt(late/Math.max(body,1e-20))});
        a.state.pianoVoices.clear();
      }
      // An older instrument finishing preload must not cancel the new range.
      a.state.currentModel={id:'flute'};
      const token=a.state.rangePreloadToken;
      a.preloadRemainingRange(a.KEYBOARD_SAMPLE_SETS.oboe,60);
      if(a.state.rangePreloadToken!==token)throw new Error('Stale preload canceled the selected instrument');
      for(const id of ['cello','flute']) {
        const context=new OfflineAudioContext(2,48000*2,48000);
        context.resume=()=>Promise.resolve();window.AudioContext=function(){return context;};
        a.state.audioContext=null;a.state.currentModel={id};a.state.articulation='sustain';
        const sample=await a.loadConcertGrandSample(60);window.AudioContext=Native;
        const merger=context.createChannelMerger(2);merger.connect(context.destination);
        const previous=a.startConcertGrandSample(60,.8,sample.anchor,sample.buffer,sample.sampleSet);
        previous.gain.disconnect();previous.gain.connect(merger,0,0);
        const retrigger=context.suspend(.9),stop=context.suspend(1.05),rendering=context.startRendering();
        await retrigger;
        const current=a.startConcertGrandSample(60,.8,sample.anchor,sample.buffer,sample.sampleSet);
        current.gain.disconnect();current.gain.connect(merger,0,1);
        await OfflineAudioContext.prototype.resume.call(context);
        await stop;a.allNotesOff();await OfflineAudioContext.prototype.resume.call(context);
        const rendered=await rendering;
        function rms(channel,start,end) {const data=rendered.getChannelData(channel);let e=0;for(let i=Math.round(start*48000);i<Math.round(end*48000);i++)e+=data[i]*data[i];return Math.sqrt(e/((end-start)*48000));}
        overlaps.push({id,tailRatio:rms(0,.95,.99)/rms(0,.7,.85),newAttack:rms(1,.95,.99),afterStop:rms(0,1.3,1.5)+rms(1,1.3,1.5)});
      }
      const jobs=[];
      for(const config of Object.values(a.KEYBOARD_SAMPLE_SETS).filter(config=>held.includes(config.id))) {
        const anchors=config.anchors || Array.from({length:(config.max-config.min)/config.step+1},(_,i)=>config.min+i*config.step);
        for(const midi of anchors)jobs.push({config,midi});
      }
      async function next() {
        while(jobs.length) {
          const {config,midi}=jobs.shift();
          const response=await fetch(config.root+a.concertGrandSampleFile(midi,config));
          if(!response.ok)throw new Error(config.id+'/'+midi+': missing sample');
          const buffer=await decoder.decodeAudioData(await response.arrayBuffer());
          const region=a.decodedBufferSustainLoop(buffer,config);
          let data=buffer.getChannelData(0);const rate=buffer.sampleRate;
          function rms(start,end) {let e=0;for(let i=start;i<end;i++)e+=data[i]*data[i];return Math.sqrt(e/(end-start));}
          const start=Math.max(0,Math.floor((region.start+.004)*rate));
          const end=Math.max(0,Math.floor((region.end-.054)*rate));
          let startLevel=Infinity,endLevel=Infinity;
          for(let channel=0;channel<buffer.numberOfChannels;channel++) {
            data=buffer.getChannelData(channel);let body=0;
            for(let i=0;i+2400<data.length;i+=2400)body=Math.max(body,rms(i,i+2400));
            if(body<.00001)continue;
            startLevel=Math.min(startLevel,rms(start,start+2400)/body);
            endLevel=Math.min(endLevel,rms(end,end+2400)/body);
          }
          loops.push({id:config.id,midi,start:region.start,end:region.end,startLevel,endLevel});
        }
      }
      await Promise.all(Array.from({length:4},next));
      return {routes,loops,overlaps};
    }, held);
    const output=path.join(root,'outputs/qa/instrument-full-audit');
    fs.mkdirSync(output,{recursive:true});
    result.sourceSha256=crypto.createHash('sha256').update(source).digest('hex');
    result.sourceFiles=sourceFiles;
    fs.writeFileSync(path.join(output,'browser.json'),JSON.stringify(result,null,2));
    for(const route of result.routes) {
      console.log('C4 route',JSON.stringify(route));
      assert.equal(route.rate,1,route.id+': use the correctly recorded note without octave-speed changes');
      assert.ok(route.correlation>.65 && route.correlation>route.halfPeriod+.03,route.id+': decoded concert C4, not an octave alias');
      if(route.held)assert.ok(route.lateRatio>.15,route.id+': held note remains audible after six seconds');
    }
    const failures=result.loops.filter(loop=>!(loop.end>loop.start+.25&&loop.startLevel>.05&&loop.endLevel>.1));
    assert.deepEqual(failures,[],'loops must stay inside the recorded sounding body');
    for(const overlap of result.overlaps) {
      assert.ok(overlap.tailRatio>.1&&overlap.newAttack>.0001,overlap.id+': old resonance overlaps the new attack');
      assert.ok(overlap.afterStop<.00001,overlap.id+': explicit stop also clears fading voices');
      console.log('Repeated note resonance',JSON.stringify(overlap));
    }
    console.log(result.loops.length+' real sustained samples: sounding loop boundaries passed');
  } finally {
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});

// Decode all seven kits and render the production pad -> limiter -> output path.
// The 250 Hz / 6 kHz filter is a bandwidth stress test, not a physical-device test.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const root=path.resolve(__dirname,'..'), room='/learning/arts/instrument-room/';
const output=path.join(root,"outputs/qa/drum-balance");
fs.mkdirSync(output,{recursive:true});
const server=http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)) return res.writeHead(403).end();
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  fs.readFile(file,(error,data)=>{
    if(error)return res.writeHead(404).end();
    if(file.endsWith('instrument-room'+path.sep+'app.js')) {
      if(process.env.DRUM_SOURCE) data=fs.readFileSync(process.env.DRUM_SOURCE);
      data=data.toString().replace('document.addEventListener("DOMContentLoaded", init);',
        'window.drumAudit={state,DRUM_SAMPLE_SETS,AD2_DRUM_ARTICULATIONS,balancedDrumGain,decodedBufferPeak,decodedBufferBodyRms,playSampledDrum,ensureAudio};cacheElements();');
    }
    res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ogg':'audio/ogg'})[path.extname(file)]||'application/octet-stream'}).end(data);
  });
});
function wav(samples,file) {
  const buffer=Buffer.alloc(44+samples.length*2);
  buffer.write('RIFF');buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);
  buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);
  buffer.writeUInt32LE(48000,24);buffer.writeUInt32LE(96000,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);
  buffer.write('data',36);buffer.writeUInt32LE(samples.length*2,40);
  samples.forEach((value,index)=>buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),44+index*2));
  fs.writeFileSync(file,buffer);
}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
    const page=await browser.newPage();
    await page.goto('http://127.0.0.1:'+server.address().port+room);
    const result=await page.evaluate(async()=>{
      const a=drumAudit, Native=AudioContext, decoder=new OfflineAudioContext(2,48000,48000), rows=[], mixes=[];
      const measure=buffer=>({body:a.decodedBufferBodyRms(buffer),peak:a.decodedBufferPeak(buffer)});
      for(const [kit,config] of Object.entries(a.DRUM_SAMPLE_SETS).filter(([,config])=>config.id.startsWith('drums-'))) {
        const buffers=new Map();
        for(const piece of a.AD2_DRUM_ARTICULATIONS) {
          const response=await fetch(config.root+piece+'.ogg');
          if(!response.ok)throw new Error(kit+'/'+piece+': '+response.status);
          const buffer=await decoder.decodeAudioData(await response.arrayBuffer());
          buffers.set(piece,buffer);a.state.drumSamples.set(config.id+':'+piece,buffer);
        }
        async function render(events,limited,duration=2) {
          const context=new OfflineAudioContext(2,Math.ceil(duration*48000),48000);
          context.resume=()=>Promise.resolve();
          if(limited) {
            const destination=context.destination,hp=context.createBiquadFilter(),lp=context.createBiquadFilter();
            hp.type='highpass';hp.frequency.value=250;lp.type='lowpass';lp.frequency.value=6000;
            hp.connect(lp).connect(destination);Object.defineProperty(context,'destination',{value:hp});
          }
          let at=0;
          const create=context.createBufferSource.bind(context);
          context.createBufferSource=()=>{const node=create(),start=node.start.bind(node);node.start=(when,...rest)=>start(when+at,...rest);return node;};
          window.AudioContext=function(){return context;};
          a.state.audioContext=null;a.state.openHatVoices.clear();a.state.currentModel={id:kit};
          a.ensureAudio();window.AudioContext=Native;
          for(const event of events) {at=event.at||0;a.playSampledDrum(event.piece,event.velocity??.8);await Promise.resolve();}
          return context.startRendering();
        }
        for(const [piece,buffer] of buffers) {
          const requested=.8*Math.pow(10,(config.gainDb+(config.pieceBoostDb?.[piece]||0))/20);
          const gain=a.balancedDrumGain(buffer,requested,.8,piece,config.id);
          const softGain=a.balancedDrumGain(buffer,requested*.5,.4,piece,config.id);
          if(!(softGain<gain))throw new Error(kit+'/'+piece+': velocity dynamics lost');
          const full=measure(await render([{piece}],false));
          const limited=measure(await render([{piece}],true));
          rows.push({kit,piece,gain,source:measure(buffer),full,limited});
        }
        const groove=[];
        for(let beat=0;beat<8;beat++) {
          groove.push({piece:beat%2?'snare':'kick',at:beat*.5},{piece:'ride',at:beat*.5},{piece:'ride',at:beat*.5+.25});
          if(beat%4===0)groove.push({piece:'crash',at:beat*.5});
        }
        const mix=await render(groove,false,5);
        const loud=measure(await render(groove.map(hit=>({...hit,velocity:1.2})),false,5));
        const data=Array.from(mix.getChannelData(0),(value,i)=>(value+mix.getChannelData(1)[i])/2);
        mixes.push({kit,...measure(mix),loud,samples:data});
      }
      return {rows,mixes};
    });
    const prefix=process.env.DRUM_REPORT_PREFIX||(process.env.DRUM_AUDIT_ONLY?'audit':'after');
    for(const mix of result.mixes) {wav(mix.samples,path.join(output,prefix+'-'+mix.kit+'.wav'));delete mix.samples;}
    fs.writeFileSync(path.join(output,prefix+'.json'),JSON.stringify(result,null,2));
    for(const kit of result.mixes.map(mix=>mix.kit)) {
      const parts=Object.fromEntries(result.rows.filter(row=>row.kit===kit).map(row=>[row.piece,row]));
      console.log(kit,JSON.stringify(Object.fromEntries(['kick','snare','hat','crash','ride','ridebell'].map(piece=>[piece,{bodyDb:+(20*Math.log10(parts[piece].full.body)).toFixed(1),limitedDb:+(20*Math.log10(parts[piece].limited.body)).toFixed(1),peak:+parts[piece].full.peak.toFixed(3)}]))));
      if(!process.env.DRUM_AUDIT_ONLY) {
        for(const key of ['full','limited']) {
          assert.ok(parts.snare[key].body>parts.ride[key].body*1.5,kit+': snare must lead the ride in '+key+' output');
          assert.ok(parts.crash[key].body>parts.ride[key].body*1.3,kit+': ride must not overpower crash');
          assert.ok(parts.ghost[key].body<parts.snare[key].body*.6,kit+': ghost notes retain their soft articulation');
        }
        assert.ok(parts.kick.full.body>parts.ride.full.body*2,kit+': kick must lead the ride');
        // A bass drum naturally loses its fundamental in this bandwidth test;
        // require an audible attack, not a high-frequency spectrum like a cymbal.
        assert.ok(parts.kick.limited.body>.014,kit+': kick attack survives reduced bass response');
        assert.ok(parts.kick.full.body>.08 && parts.snare.full.body>.085,kit+': core drums cannot be faint');
        for(const row of Object.values(parts)) assert.ok(row.full.peak<.93&&row.full.body>.012,kit+'/'+row.piece+': audible with headroom');
      }
    }
    if(!process.env.DRUM_AUDIT_ONLY)for(const mix of result.mixes)assert.ok(mix.peak<1&&mix.loud.peak<1,mix.kit+': groove must not clip at normal or maximum velocity');
    console.log(result.rows.length+' real pad samples; '+result.mixes.length+' combined grooves rendered');
  }finally{if(browser)await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

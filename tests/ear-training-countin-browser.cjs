// Render the real mixer, not gain constants. Band-limiting checks midrange
// audibility; it does not certify a particular physical speaker or device.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(process.env.COUNTIN_SOURCE || path.join(root,'learning/arts/music-theory/ear-training/piano-engine.js'),'utf8');
const output = path.join(root,"outputs/qa/ear-training-countin");
fs.mkdirSync(output,{recursive:true});

function saveWav(samples, sampleRate, file) {
  const wav = Buffer.alloc(44 + samples.length * 2);
  wav.write('RIFF'); wav.writeUInt32LE(wav.length-8,4); wav.write('WAVEfmt ',8);
  wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20); wav.writeUInt16LE(1,22);
  wav.writeUInt32LE(sampleRate,24); wav.writeUInt32LE(sampleRate*2,28);
  wav.writeUInt16LE(2,32); wav.writeUInt16LE(16,34); wav.write('data',36);
  wav.writeUInt32LE(samples.length*2,40);
  samples.forEach((sample,index)=>wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,sample))*32767),44+index*2));
  fs.writeFileSync(file,wav);
}

(async () => {
  const browser = await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try {
    const page = await browser.newPage();
    const results = await page.evaluate(async source => {
      const results = [], NativeContext = window.AudioContext;
      for (const sampleRate of [44100,48000]) for (const bpm of [60,100,180]) for (const limited of [false,true]) for (const api of ['metronome','rhythm']) {
        const gap=60/bpm, context=new OfflineAudioContext(1,Math.ceil((.5+gap*4)*sampleRate),sampleRate);
        context.resume=()=>Promise.resolve();
        if (limited) {
          const destination=context.destination, highpass=context.createBiquadFilter(), lowpass=context.createBiquadFilter();
          highpass.type='highpass'; highpass.frequency.value=500;
          lowpass.type='lowpass'; lowpass.frequency.value=4000;
          highpass.connect(lowpass).connect(destination);
          Object.defineProperty(context,'destination',{value:highpass});
        }
        window.AudioContext=function(){return context;};
        (0,eval)(source);
        const zero=api==='rhythm' ? PianoEngine.playRhythm([],gap,{countIn:4}) : PianoEngine.metronome(4,gap)+4*gap;
        const rendered=await context.startRendering(), data=rendered.getChannelData(0);
        const beats=[];
        for(let beat=0;beat<4;beat++) {
          const start=.18+beat*gap, from=Math.floor(start*sampleRate), to=Math.floor((start+.2)*sampleRate);
          let energy=0,peak=0,onset=null;
          for(let i=from;i<to;i++) {
            energy+=data[i]*data[i]; peak=Math.max(peak,Math.abs(data[i]));
            if(onset===null && Math.abs(data[i])>.002) onset=i/sampleRate-start;
          }
          beats.push({rms:Math.sqrt(energy/(to-from)),peak,onset});
        }
        const row={sampleRate,bpm,limited,api,zero,beats};
        if(sampleRate===48000 && bpm===100 && !limited && api==='rhythm') row.samples=Array.from(data);
        results.push(row);
      }
      window.AudioContext=NativeContext;
      return results;
    },source);
    for(const row of results) {
      const reference=row.beats[0].rms;
      row.weakestRelativeDb=Math.min(...row.beats.slice(1).map(beat=>20*Math.log10(beat.rms/reference)));
      if(!process.env.COUNTIN_AUDIT_ONLY) {
        assert.ok(row.beats.every(beat=>beat.rms>.018),'Each beat needs an audible signal: '+JSON.stringify({...row,samples:undefined}));
        assert.ok(row.weakestRelativeDb>-6,'Unaccented beats must not disappear behind the bell');
        assert.ok(row.beats.every(beat=>beat.peak<.9 && beat.onset!==null && beat.onset<.025),'Clean headroom and prompt onset');
        assert.ok(Math.abs(row.zero-(.18+4*60/row.bpm))<.0001,'Four count-in beats before the exercise');
        const plain=row.beats.slice(1).map(beat=>beat.rms);
        assert.ok(20*Math.log10(Math.max(...plain)/Math.min(...plain))<1,'Three ordinary beats should have consistent level');
      }
      if(row.samples) {
        saveWav(row.samples,row.sampleRate,path.join(output,process.env.COUNTIN_AUDIT_ONLY?'before.wav':'countin.wav'));
        delete row.samples;
      }
    }
    fs.writeFileSync(path.join(output,process.env.COUNTIN_AUDIT_ONLY?'before.json':'report.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify({cases:results.length,minBeatRms:Math.min(...results.flatMap(row=>row.beats.map(beat=>beat.rms))),weakestRelativeDb:Math.min(...results.map(row=>row.weakestRelativeDb)),peak:Math.max(...results.flatMap(row=>row.beats.map(beat=>beat.peak)))}));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});

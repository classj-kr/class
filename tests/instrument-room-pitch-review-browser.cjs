// Render the actual application routing for every previously uncertain note.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const crypto=require('node:crypto');
const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'..');
const fixture=require('./fixtures/instrument-room-pitch-review.json');
const cases=[...fixture.originalCandidates,...fixture.additionalRelatedCases];
const source=fs.readFileSync(path.join(root,'learning/arts/instrument-room/app.js'),'utf8');
const sourceFiles={};
const server=http.createServer((request,response)=>{
  let file=path.resolve(root,'.'+new URL(request.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep))return response.writeHead(403).end();
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  fs.readFile(file,(error,data)=>{
    if(error)return response.writeHead(404).end();
    if(file.endsWith('.ogg'))sourceFiles[path.relative(root,file).split(path.sep).join('/')]=crypto.createHash('sha256').update(data).digest('hex');
    if(file.endsWith('instrument-room'+path.sep+'app.js'))data=data.toString().replace('document.addEventListener("DOMContentLoaded", init);','window.pitchReview={state,KEYBOARD_SAMPLE_SETS,loadConcertGrandSample,startConcertGrandSample,concertGrandSampleFile};cacheElements();');
    response.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ogg':'audio/ogg'})[path.extname(file)]||'application/octet-stream'}).end(data);
  });
});
function wav(channels,rate,file){
  const length=channels[0].length,buffer=Buffer.alloc(44+length*channels.length*4);
  buffer.write('RIFF');buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);
  buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(3,20);buffer.writeUInt16LE(channels.length,22);
  buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*channels.length*4,28);buffer.writeUInt16LE(channels.length*4,32);buffer.writeUInt16LE(32,34);
  buffer.write('data',36);buffer.writeUInt32LE(buffer.length-44,40);
  for(let i=0;i<length;i++)for(let c=0;c<channels.length;c++)buffer.writeFloatLE(channels[c][i],44+(i*channels.length+c)*4);
  fs.writeFileSync(file,buffer);
}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
  try{
    browser=await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
    const page=await browser.newPage();
    await page.goto('http://127.0.0.1:'+server.address().port+'/learning/arts/instrument-room/');
    const rows=await page.evaluate(async cases=>{
      const a=pitchReview,Native=AudioContext,rows=[];
      for(const item of cases){
        const context=new OfflineAudioContext(2,24000,24000);context.resume=()=>Promise.resolve();
        window.AudioContext=function(){return context;};
        a.state.audioContext=null;a.state.pianoVoices.clear();
        a.state.currentModel={id:item.group==='guitar-cubase-t'?'dreadnought':item.group==='upright-bass-pizz'?'upright-bass':item.group};
        a.state.articulation=item.group==='upright-bass-pizz'?'pizzicato':'pluck';
        const sample=await a.loadConcertGrandSample(item.midi);window.AudioContext=Native;
        const voice=a.startConcertGrandSample(item.midi,.8,sample.anchor,sample.buffer,sample.sampleSet);
        const output=await context.startRendering();
        const config=a.KEYBOARD_SAMPLE_SETS[item.group];
        rows.push({...item,anchor:sample.anchor,playbackRate:voice.source.playbackRate.value,sampleFile:config.root+a.concertGrandSampleFile(sample.anchor,config),sampleRate:output.sampleRate,channels:[Array.from(output.getChannelData(0)),Array.from(output.getChannelData(1))]});
      }
      return rows;
    },cases);
    const output=path.join(root,'outputs/qa/instrument-pitch-review');fs.mkdirSync(output,{recursive:true});
    for(const row of rows){
      assert.ok(row.channels.some(channel=>channel.some(value=>Math.abs(value)>.005)),row.group+'/'+row.midi+': rendered audio is audible');
      if(row.resolution==='use-stable-anchor')assert.notEqual(row.anchor,row.midi,row.group+'/'+row.midi+': avoids unreliable source');
      else assert.equal(row.anchor,row.midi,row.group+'/'+row.midi+': retains verified source');
      row.renderFile=path.relative(root,path.join(output,row.group+'-'+row.midi+'.wav')).split(path.sep).join('/');
      wav(row.channels,row.sampleRate,path.join(root,row.renderFile));delete row.channels;
    }
    fs.writeFileSync(path.join(output,'rendered.json'),JSON.stringify({sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),sourceFiles,rows},null,2));
    console.log(rows.length+' notes rendered through production sample loading, pitch shifts and output mixing');
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});

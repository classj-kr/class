const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium,webkit} = require('playwright');
const root=path.resolve(__dirname,'..'), output=path.join(root,'tmp','ear-training-rhythm');
fs.mkdirSync(output,{recursive:true});
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)) return res.writeHead(403).end();
  fs.readFile(file,(error,data)=>{
    if(error) return res.writeHead(404).end();
    res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript':'text/css'}).end(data);
  });
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browsers=[];
  try {
    for(const engine of ['chromium','webkit']) {
      const browser=await(engine==='chromium'?chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}):webkit.launch({headless:true}));
      browsers.push(browser);
      for(const width of [1024,390]) {
        const page=await browser.newPage({viewport:{width,height:900}}), errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        const base='http://127.0.0.1:'+server.address().port+'/learning/arts/music-theory/ear-training/';
        await page.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="'+base+'styles.css"><main id="gallery" style="padding:16px;display:grid;gap:16px;max-width:940px;margin:auto"></main>');
        await page.addScriptTag({url:base+'notation.js'});
        await page.addScriptTag({url:base+'rhythm.js'});
        const shapes=await page.evaluate(()=>{
          const R=RhythmNotation;
          const cases=[
            ['사진의 리듬 · 박 경계에서 붙임줄로 연결','s s s s s s s e e s s s e'.split(' ').map(v=>({v}))],
            ['16분음표 · 네 개씩 한 박',Array.from({length:16},()=>({v:'s'}))],
            ['여러 박에 걸쳐 이어지는 음',R.fromOnsets([0,9,30,42],48)],
            ['점8분음표와 16분음표',Array.from({length:4},()=>[{v:'ed'},{v:'s'}]).flat()],
            ['쉼표와 붙임줄',R.fromOnsets([3,21,33],48)],
            ['셋잇단음표',Array.from({length:12},()=>({v:'te'}))]
          ];
          return cases.map(([title,bar],index)=>{
            const section=document.createElement('section');
            section.style.cssText='background:#f8f6ef;color:#1e293b;border-radius:10px;padding:14px;min-width:0';
            const heading=document.createElement('p');heading.textContent=title;heading.style.cssText='margin:0 0 12px;font-size:14px;font-weight:700';
            const svg=R.render(bar,{meter:'4/4'});svg.id='example-'+index;
            section.append(heading,svg);document.querySelector('#gallery').append(section);
            const box=svg.viewBox.baseVal;
            return {
              heads:svg.querySelectorAll('.rhythm-head').length,
              ties:[...svg.querySelectorAll('.rhythm-tie')].map(tie=>{const r=tie.getBBox();return {width:r.width,height:r.height,inside:r.x>=0&&r.x+r.width<=box.width&&r.y>=box.y&&r.y+r.height<=box.y+box.height};}),
              beats:[...new Set([...svg.querySelectorAll('.rhythm-beam')].map(beam=>beam.dataset.beat))],
              triplets:svg.querySelectorAll('.rhythm-triplet').length,
              onsets:R.onsets(bar)
            };
          });
        });
        assert.equal(shapes[0].heads,14,'Cross-beat eighth becomes two tied sixteenths');
        assert.equal(shapes[0].ties.length,1);
        assert.equal(shapes[0].onsets.length,13,'Extra written head is not an extra attack');
        assert.deepEqual(shapes[0].beats,['0','1','2','3']);
        assert.equal(shapes[1].heads,16);
        assert.equal(shapes[1].ties.length,0);
        assert.deepEqual(shapes[1].beats,['0','1','2','3']);
        assert.equal(shapes[5].triplets,4);
        for(const row of shapes) for(const tie of row.ties) assert.ok(tie.width>10&&tie.height>4&&tie.inside,'Tie must be visible and unclipped');
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal page overflow');
        await page.screenshot({path:path.join(output,engine+'-'+width+'.png'),fullPage:true});
        assert.deepEqual(errors,[]);
        console.log(engine+' '+width+': ties, beat groups, tuplets and bounds passed');
        await page.close();
      }
    }
  } finally {for(const browser of browsers)await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

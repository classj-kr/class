const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const puppeteer = require('puppeteer-core');
const app = path.resolve(__dirname, '../learning/inquiry/korea-map');
const output = path.resolve(__dirname, '../outputs/korea-map-history');
const ctx = {window:{}};
for (const file of ['history-data.js','history-territories.js','history-war.js']) vm.runInNewContext(fs.readFileSync(path.join(app,'data',file),'utf8'),ctx);
const data = ctx.window.KOREA_HISTORY_WAR;
assert.equal(data.stages.length,6);
assert.equal(data.quizStages.length,4);
assert.equal(new Set(data.stages.map(s=>s.id)).size,6);
assert.equal(data.defaultStage,'nakdong');
const extents = [];
for (const stage of data.stages) {
  assert.ok(stage.lesson.marks.length && stage.lesson.cues.length && stage.lesson.trap);
  assert.ok(stage.lines.every(line=>line.coords.length>=2));
  assert.ok(stage.sources.some(source=>source[1].includes('archives.go.kr')));
  if (stage.card) {
    const svg = fs.readFileSync(path.join(app,stage.card.split('?')[0]),'utf8');
    assert.ok(svg.includes('data-control="north"') && svg.includes('data-control="south"'));
    assert.ok(!/1950|1951|1953|낙동강|정전|후퇴|북진/.test(svg.replace(/d="[^"]*"/g,'')),'Do not disclose stage dates in SVG labels');
    extents.push(svg.match(/viewBox="([^"]+)"/)[1]);
  }
}
assert.equal(new Set(extents).size,1,'Quiz cards must share a view');
const audit = JSON.parse(fs.readFileSync(path.join(app,'history/territories/war-geometry-audit.json'),'utf8'));
const area = id=>audit.stages.find(s=>s.id===id).southArea;
assert.ok(area('nakdong')<area('retreat') && area('retreat')<area('1953') && area('1953')<area('north'));

(async()=>{
  const browser = await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
  try {
    const page = await browser.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',res=>{if(res.status()>=400 && /history|war-/.test(res.url())) errors.push(res.url());});
    const base = process.env.MAP_TEST_URL || 'http://127.0.0.1:64604/learning/inquiry/korea-map/';
    fs.mkdirSync(output,{recursive:true});
    await page.setViewport({width:1440,height:1000});
    await page.goto(`${base}?historyScene=korean-war#history`,{waitUntil:'networkidle0'});
    assert.equal(await page.$eval('[data-territory][aria-pressed="true"]',n=>n.dataset.territory),'nakdong');
    assert.equal(await page.$$eval('[data-territory]',ns=>ns.length),6);
    assert.equal(await page.$eval('#historyContent',n=>n.innerText.includes('판문점')),false);
    for (const width of [1440,390]) {
      await page.setViewport({width,height:1000});
      for (const stage of data.stages) {
        await page.click(`[data-territory="${stage.id}"]`);
        await page.waitForFunction(()=>[...document.querySelectorAll('.leaflet-image-layer')].filter(n=>/war-/.test(n.src)).every(n=>n.complete&&n.naturalWidth>0));
        assert.equal(await page.$eval('#historyMapCaption strong',n=>n.textContent),stage.date);
        assert.equal(await page.$eval('#historyMapCaption span',n=>n.textContent),stage.stageTitle);
        assert.equal(await page.$eval('[data-territory][aria-pressed="true"]',n=>n===document.activeElement),true);
        assert.equal(await page.$$eval('.history-point',ns=>ns.length),stage.lesson.marks.length);
        const text = await page.$eval('#historyContent',n=>n.innerText);
        assert.ok(text.includes(stage.lesson.trap));
        const labels = await page.$$eval('.history-map-label',ns=>ns.map(n=>n.textContent));
        stage.lesson.marks.forEach(mark=>assert.ok(labels.some(label=>label.includes(mark.label)),`${width} ${stage.id}: missing ${mark.label} in ${labels.join(' / ')}`));
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
        if (width===1440) {
          await page.evaluate(()=>scrollTo(0,0));
          await page.screenshot({path:path.join(output,`war-${stage.id}.jpg`),type:'jpeg',quality:75});
        }
      }
    }
    for (const width of [1440,768,390]) {
      await page.setViewport({width,height:1000});
      await page.click('.history-order-launch');
      await page.waitForFunction(()=>[...document.querySelectorAll('.history-order-card img')].every(n=>n.complete&&n.naturalWidth>0));
      assert.equal(await page.$eval('.history-order-dialog',n=>n.open),true);
      for (let attempt=0;attempt<2;attempt++) {
        const before = await page.$eval('.history-order-dialog',n=>({
          text:n.innerText,
          captions:[...n.querySelectorAll('figcaption')].map(n=>n.textContent),
          alt:[...n.querySelectorAll('img')].map(n=>n.alt),
          choices:[...n.querySelectorAll('.history-order-choice')].map(n=>n.textContent),
          overflow:n.scrollWidth>n.clientWidth
        }));
        assert.deepEqual(before.captions,['(가)','(나)','(다)','(라)']);
        assert.equal(/1950|1951|1953|낙동강|1·4/.test(before.text+before.alt.join()),false);
        assert.equal(new Set(before.choices).size,5);
        assert.equal(before.overflow,false,`${width}: quiz overflow`);
        const correct = await page.evaluate(()=>{
          const cards=[...document.querySelectorAll('.history-order-card img')].map(n=>KOREA_HISTORY_WAR.stages.find(s=>s.card && n.src.endsWith(s.card)));
          const order=cards.map((_,i)=>i).sort((a,b)=>cards[a].order-cards[b].order).map(i=>`(${'가나다라'[i]})`).join(' → ');
          return [...document.querySelectorAll('.history-order-choice')].findIndex(n=>n.textContent.endsWith(order));
        });
        assert.ok(correct>=0);
        if (attempt===0) {
          await page.$eval('.history-order-dialog',n=>n.scrollTop=0);
          await page.screenshot({path:path.join(output,`war-quiz-${width}.jpg`),type:'jpeg',quality:80});
        }
        const chosen=attempt===0?correct:(correct+1)%5;
        const options=await page.$$('.history-order-choice');
        await options[chosen].click();
        assert.equal(await page.$$eval('.history-order-choice:disabled',ns=>ns.length),5);
        assert.equal(await page.$$eval('.history-order-choice.is-correct',ns=>ns.length),1);
        assert.equal(await page.$$eval('.history-order-choice.is-wrong',ns=>ns.length),attempt);
        assert.equal(await page.$$eval('.history-order-date',ns=>ns.length),4);
        assert.equal(await page.$$eval('.history-order-explanation li',ns=>ns.length),4);
        assert.ok((await page.$eval('.history-order-result',n=>n.textContent)).startsWith(attempt===0?'정답입니다.':'오답입니다.'));
        assert.equal(await page.$eval('.history-order-footer button',n=>n===document.activeElement),true);
        if(attempt===0) {
          await page.screenshot({path:path.join(output,`war-answer-${width}.jpg`),type:'jpeg',quality:80});
          const old=await page.$$eval('.history-order-card img',ns=>ns.map(n=>n.src).join());
          await page.click('.history-order-footer button');
          assert.equal(await page.$eval('.history-order-feedback',n=>n.hidden),true);
          assert.equal(await page.$$eval('.history-order-choice:disabled',ns=>ns.length),0);
          assert.notEqual(await page.$$eval('.history-order-card img',ns=>ns.map(n=>n.src).join()),old);
        }
      }
      await page.keyboard.press('Escape');
      assert.equal(await page.$eval('.history-order-dialog',n=>n.open),false);
      assert.equal(await page.$eval('.history-order-launch',n=>n===document.activeElement),true);
    }
    await page.select('#historyScene','balhae');
    assert.equal(await page.$('.history-order-launch'),null);
    assert.equal(await page.$$eval('.leaflet-image-layer',ns=>ns.filter(n=>/war-/.test(n.src)).length),0);
    await page.select('#historyScene','korean-war');
    await page.click('.history-order-launch');
    await page.click('.history-order-header button');
    assert.equal(await page.$eval('.history-order-dialog',n=>n.open),false);
    assert.equal(await page.$$eval('.history-order-dialog',ns=>ns.length),1);
    assert.deepEqual(errors,[]);
    console.log('Korean War passed: six distinct stages; four undated map cards; five unique choices; correct/wrong feedback; reset, keyboard, focus, desktop/tablet/mobile, no overflow or asset errors.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

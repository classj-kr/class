const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '../learning/inquiry/korea-map');
const out = path.resolve(__dirname, '../outputs/korea-map-history-cleanup');
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (file !== root && !file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (file === root) file = path.join(root, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    res.setHeader('Content-Type', {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2'}[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  fs.mkdirSync(out, {recursive:true});
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({headless:true, executablePath:process.env.MAP_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args:['--no-first-run','--disable-background-networking']});
    const page = await browser.newPage(), errors = [], report = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [1440,820,390]) {
      await page.setViewport({width, height:900, isMobile:width===390, hasTouch:width===390});
      await page.goto(`http://127.0.0.1:${server.address().port}/?historyScene=foreign-incursions#history`, {waitUntil:'networkidle0'});
      const ids = await page.$$eval('#historyScene option', options => options.map(o => o.value));
      let states = 0;
      for (const id of ids) {
        await page.select('#historyScene', id);
        const variants = await page.$$eval('[data-territory]', buttons => buttons.map(b => b.dataset.territory));
        for (const variant of variants.length ? variants : [null]) {
          if (variant) await page.click(`[data-territory="${variant}"]`);
          const result = await page.evaluate(() => {
            const content = document.querySelector('#historyContent');
            const dialog = content.querySelector('.history-resource-dialog');
            return {
              visible:content.innerText,
              dialogOpen:dialog.open,
              sources:[...dialog.querySelectorAll('a')].map(a => ({href:a.href, target:a.target, rel:a.rel})),
              notes:dialog.querySelectorAll('.history-sources p').length,
              cues:content.querySelectorAll('.history-cues dd').length,
              distributionQuiz:content.querySelectorAll('.bronze-choice').length,
              accordions:content.querySelectorAll('details, summary').length,
              places:[...content.querySelectorAll('.history-places li button')].map(b=>b.getBoundingClientRect().height>0),
              mapPoints:document.querySelectorAll('.history-point').length,
              titleSize:getComputedStyle(content.querySelector('.history-scene-heading h3')).fontSize,
              reading:[...content.querySelectorAll('.history-cues dt,.history-cues dd,.history-trap,.bronze-prompt,.bronze-artifacts p,.bronze-choice')].map(n=>{const s=getComputedStyle(n);return {size:s.fontSize,weight:s.fontWeight};}),
              obsolete:content.textContent.includes(KOREA_HISTORY.scope) || content.textContent.includes(KOREA_HISTORY.chronology),
              overflow:document.documentElement.scrollWidth-innerWidth
            };
          });
          assert.equal(result.dialogOpen,false,id);
          assert.equal(result.obsolete,false,id);
          assert.equal(result.accordions,0,id);
          assert.equal(result.titleSize,'16px',id);
          assert.ok(result.reading.length>0&&result.reading.every(s=>s.size==='15px'&&s.weight==='400'),id+': consistent reading typography');
          assert.equal(result.places.length,result.mapPoints,id);
          assert.ok(result.places.length>0 && result.places.every(Boolean),id+': places must be visible without expanding');
          assert.doesNotMatch(result.visible,/출처 · 지도 안내|역사 내용 근거|정밀 복원도|공식 출제 범위|자료 정보 닫기|객관식 판별 단서|선지 구별/);
          assert.ok((result.cues>0 || result.distributionQuiz===5) && result.notes>0 && result.sources.length>0,id);
          assert.ok(result.sources.every(s=>s.href.startsWith('https://') && s.target==='_blank' && s.rel.includes('noopener')),id);
          assert.ok(result.overflow<=1,id);
          states++;
        }
      }
      await page.select('#historyScene','four-six');
      const placeButtons = await page.$$('.history-places li button');
      for (const place of placeButtons) {
        const label = await place.evaluate(b=>b.textContent.replace(/^\d+\. /,''));
        await place.scrollIntoView();
        if (width===390) await place.tap(); else await place.click();
        await page.waitForFunction(label=>document.querySelector('.leaflet-popup-content')?.textContent===label,{},label);
      }
      await page.click('.history-places > button');
      const trigger = await page.$('.history-resource-trigger');
      await trigger.scrollIntoView();
      await page.screenshot({path:path.join(out,`lesson-${width}.png`)});
      if (width===390) await trigger.tap(); else await trigger.click();
      await page.waitForSelector('.history-resource-dialog[open]');
      assert.equal(await page.$eval('.history-resource-dialog', d=>d.contains(document.activeElement)),true);
      const bounds = await page.$eval('.history-resource-dialog', d=>{const b=d.getBoundingClientRect();return {inside:b.left>=0&&b.right<=innerWidth&&b.top>=0&&b.bottom<=innerHeight,overflow:d.scrollWidth-d.clientWidth};});
      assert.ok(bounds.inside && bounds.overflow<=1);
      await page.screenshot({path:path.join(out,`resources-${width}.png`)});
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>!document.querySelector('.history-resource-dialog').open);
      assert.equal(await page.$eval('.history-resource-trigger', b=>b===document.activeElement),true);
      await trigger.click();
      await page.click('[aria-label="자료 정보 닫기"]');
      await page.waitForFunction(()=>!document.querySelector('.history-resource-dialog').open);
      await page.click('[data-theme="terrain"]');
      assert.equal(await page.$('.history-resource-dialog'),null);
      await page.click('[data-theme="history"]');
      assert.equal(await page.$eval('.history-resource-dialog', d=>d.open),false);
      report.push({width,scenes:ids.length,states,placesAlwaysVisible:true,placeClicks:placeButtons.length,dialogKeyboardAndClose:true});
    }
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({report,errors},null,2));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});

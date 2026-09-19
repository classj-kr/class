const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { test } = require('node:test');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../learning/inquiry/science-lab');
const catalog = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const slugs = [...catalog.matchAll(/href="([^"/]+)\/"/g)].map(m => m[1]);

test('every catalog app loads, every question has a working correct answer, mobile layout', { timeout: 900000 }, async () => {
  assert.equal(new Set(slugs).size, 102);
  const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }
      res.setHeader('Content-Type', { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' }[path.extname(file)] || 'application/octet-stream');
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  const failures = []; let questions = 0;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.SCIENCE_BROWSER || chromium.executablePath() });
    const catalogPage=await browser.newPage({viewport:{width:390,height:844}});
    await catalogPage.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
    await catalogPage.goto(`http://127.0.0.1:${server.address().port}/`);
    for(const grade of ['전체','초3','초4','초5','초6','중1','중2','중3','고1','고2','고3']){
      await catalogPage.locator(`[data-grade="${grade}"]`).click();
      const state=await catalogPage.evaluate(grade=>{
        const visible=[...document.querySelectorAll('.level-entry')].filter(e=>!e.hidden);
        const expected=Object.values(window.scienceCurriculum).filter(m=>grade==='전체'||m.grades.includes(grade)).length;
        return {count:visible.length,expected,wrong:visible.filter(e=>grade!=='전체'&&!e.dataset.grades.split(' ').includes(grade)).length,overflow:document.documentElement.scrollWidth>innerWidth+1};
      },grade);
      assert.equal(state.count,state.expected,grade);assert.equal(state.wrong,0,grade);assert.equal(state.overflow,false,grade);
    }
    await catalogPage.locator('#courseSelect').selectOption('화학반응의 세계');
    assert.equal(await catalogPage.locator('.level-entry:not([hidden])').count(),2);
    if(process.env.SCIENCE_CAPTURE){await catalogPage.locator('[data-grade="초6"]').click();fs.mkdirSync(path.resolve(root,'../../../docs/science-lab-audit-2026-09-20/current-screenshots'),{recursive:true});await catalogPage.screenshot({path:path.resolve(root,'../../../docs/science-lab-audit-2026-09-20/current-screenshots/catalog-mobile.png'),fullPage:true});}
    await catalogPage.close();
    for (const slug of slugs) {
      const page = await browser.newPage({ viewport: { width: 1365, height: 980 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`, { waitUntil: 'load', timeout: 20000 });
        const integration=await page.evaluate(()=>{
          const visible=e=>e.getClientRects().length&&!e.closest('[hidden]');
          const modes=[...document.querySelectorAll('button[data-mode]')].filter(visible);
          const list=modes.length?modes:[null];
          let interactions=0;
          for(const mode of list){
            mode?.click();interactions++;
            for(const input of [...document.querySelectorAll('input[type="range"]')].filter(visible)){
              const old=input.value;for(const v of [input.min,input.max,old]){input.value=v;input.dispatchEvent(new Event('input',{bubbles:true}));interactions++;}
            }
            const options=[...document.querySelectorAll('.control-panel button[data-value],.control-panel button[data-direction],.control-panel button[data-wiring],.control-panel button[data-circuit]')].filter(visible).map(b=>({value:b.dataset.value,direction:b.dataset.direction,wiring:b.dataset.wiring,circuit:b.dataset.circuit,pick:b.closest('[data-pick]')?.dataset.pick}));
            for(const option of options){
              const candidate=[...document.querySelectorAll('.control-panel button')].find(b=>visible(b)&&b.dataset.value===option.value&&b.dataset.direction===option.direction&&b.dataset.wiring===option.wiring&&b.dataset.circuit===option.circuit&&b.closest('[data-pick]')?.dataset.pick===option.pick);
              candidate?.click();interactions++;
              for(const name of Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model'))){if(typeof window[name]?.runToEnd==='function')window[name].runToEnd();}
            }
            for(const key of Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model'))){const model=window[key];if(typeof model?.runToEnd==='function'){model.runToEnd();interactions++;}}
          }
          modes[0]?.click();
          const choices=()=>[...document.querySelectorAll('[data-supplement-choice]')].map(b=>[b.dataset.supplementChoice,b.dataset.value]);
          const pick=([key,value])=>document.querySelector(`[data-supplement-choice="${key}"][data-value="${value}"]`)?.click();
          for(const choice of choices()){
            pick(choice);interactions++;
            for(const nested of choices()){pick(nested);interactions++;}
          }
          document.querySelector('.supplement-reset')?.click();
          if(document.getElementById('bendArm')){document.getElementById('bendArm').click();document.getElementById('straightArm').click();interactions+=2;}
          return {interactions,scope:document.querySelector('.exam-scope')?.textContent||'',invalid:/\bNaN\b|\bundefined\b/.test(document.body.innerText)};
        });
        if(!integration.scope.includes('성취기준'))errors.push('missing grade exam scope');
        if(integration.invalid)errors.push('NaN/undefined visible after boundary controls');
        const result = await page.evaluate(() => {
          const cards = [...document.querySelectorAll('.quiz-card')];
          const errors = [];
          for (const [index, card] of cards.entries()) {
            const answer = card.dataset.answer;
            const option = card.querySelector(`input[value="${answer}"]`);
            const button = card.querySelector('.answer-button');
            if (!option || !button) { errors.push(`q${index + 1}: missing keyed answer/button`); continue; }
            const wrong = card.querySelector(`input:not([value="${answer}"])`);
            if (wrong) { wrong.click(); button.click(); }
            option.click(); button.click();
            const feedback = card.querySelector('.answer-result')?.textContent || '';
            if (!/맞|정답/.test(feedback)) errors.push(`q${index + 1}: correct answer feedback ${feedback}`);
            const explanation = card.querySelector('.answer-explanation');
            if (explanation?.hidden) errors.push(`q${index + 1}: correct explanation hidden`);
          }
          const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
          const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
          return { count: cards.length, errors, duplicateIds, heading: document.querySelector('h1')?.textContent };
        });
        if(process.env.SCIENCE_CAPTURE&&await page.locator('.curriculum-supplement').count())await page.locator('.curriculum-supplement').screenshot({path:path.resolve(root,'../../../docs/science-lab-audit-2026-09-20/current-screenshots/'+slug+'-desktop.png')});
        if (result.count !== 4) errors.push(`expected 4 questions, got ${result.count}`);
        errors.push(...result.errors);
        if (!result.heading) errors.push('missing heading');
        await page.setViewportSize({ width: 390, height: 844 });
        const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
        if (dimensions.scroll > dimensions.width + 1) errors.push(`mobile overflow ${dimensions.scroll}/${dimensions.width}`);
        if(process.env.SCIENCE_CAPTURE&&await page.locator('.curriculum-supplement').count())await page.locator('.curriculum-supplement').screenshot({path:path.resolve(root,'../../../docs/science-lab-audit-2026-09-20/current-screenshots/'+slug+'-mobile.png')});
        questions += result.count;
        if (errors.length) failures.push({ slug, errors: [...new Set(errors)] });
        console.log(`${slug}: ${errors.length ? 'FAIL ' + [...new Set(errors)].join('; ') : 'OK'} (${result.count} questions)`);
      } catch (error) { failures.push({ slug, errors: [String(error)] }); console.log(`${slug}: FAIL ${error.message}`); }
      finally { await page.close(); }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(`Inspected ${slugs.length} apps / ${questions} questions`);
  assert.deepEqual(failures, []);
});

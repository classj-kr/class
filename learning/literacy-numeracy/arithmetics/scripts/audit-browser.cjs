const { chromium } = require('../../../../game-hub-server/node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const output = path.resolve('tmp/browser-audit');
const baseUrl = process.env.ARITHMETIC_AUDIT_URL || 'http://localhost:6180';
(async () => {
  const { learningWorksheetCatalog: catalog } = await import('../lib/arithmetic-worksheets.ts');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({headless:true, channel:'msedge'});
  const gradePanel = async page => {
    const button = page.locator('button.trig-derivative-panel-grade');
    if (await button.count()) await button.click();
    else {
      await page.getByRole('button', { name: /닫기$/ }).click();
      await page.getByRole('button', { name: '전체 채점', exact: true }).click();
      await page.getByRole('button', { name: '답안 입력', exact: true }).click();
    }
  };
  const results = []; let cursor = 0;
  const getState = page => page.evaluate(() => {
    const stages = [...document.querySelectorAll('.worksheet-stage')];
    const elements = stages.flatMap(s => [...s.querySelectorAll('article, [data-testid$="-question"], [data-testid="question-card"], .counting-question, .multiplication-question, .complement-row')]);
    const rows = [...new Set(elements)].filter(el => !elements.some(other => other !== el && other.contains(el)));
    const invalid = [...document.querySelectorAll('.worksheet-stage .katex-error')].map(el => el.textContent);
    const clipped = rows.filter(el => { const a=el.getBoundingClientRect(), b=el.closest('.a4-sheet')?.getBoundingClientRect(); return b && (a.bottom>b.bottom+3 || a.right>b.right+3 || a.left<b.left-3); }).map(el => el.textContent.slice(0,100));
    const tokens = stages.map(s => [...s.querySelectorAll('.a4-sheet')].map(sheet => [...sheet.children].filter(el => el.tagName !== 'HEADER').map(el => el.textContent + [...el.querySelectorAll('svg')].map(svg => svg.innerHTML).join('') + [...el.querySelectorAll('[style]')].map(e=>e.getAttribute('style')).join('')).join('')).join('')).join('');
    return {counter:document.querySelector('.counting-progress')?.textContent, rows:rows.length, inputs:stages.reduce((n,s)=>n+s.querySelectorAll('input').length,0), pages:stages.length, invalid, clipped, tokens, sheetTitles:stages.map(s=>s.querySelector('.counting-sheet-title')?.textContent)};
  });
  async function worker() {
    while (cursor < catalog.length) {
      const index = cursor++, worksheet = catalog[index];
      const page = await browser.newPage({viewport:{width:1280,height:1250}});
      page.setDefaultTimeout(6000);
      const record = {index, ...worksheet, issues:[], browserErrors:[]};
      page.on('pageerror',error=>record.browserErrors.push(error.message));
      page.on('dialog',dialog=>dialog.accept());
      try {
        const response = await page.goto(baseUrl + worksheet.route, {waitUntil:'networkidle', timeout:40000});
        record.status = response.status();
        await page.locator('.worksheet-stage').first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(100);
        const initial = await getState(page);
        record.initial = {...initial, tokens:undefined};
        if (initial.invalid.length) record.issues.push('invalid math');
        if (initial.clipped.length) record.issues.push('rows outside sheet');
        const count = initial.counter?.match(/(\d+)\s*\/\s*(\d+)/);
        record.total = count ? Number(count[2]) : null;
        if (count && initial.rows && record.total !== initial.rows && record.total !== initial.inputs && !worksheet.route.endsWith('prime-numbers')) record.issues.push('counter/row count differs');
        await page.screenshot({path:path.join(output, `${String(index).padStart(3,'0')}-desktop.png`), fullPage:true});
        const grade = page.getByRole('button',{name:'전체 채점',exact:true});
        if (await grade.count()) {
          await grade.first().click();
          record.blankCounter = await page.locator('.counting-progress').textContent();
          if (!/^0\s*\//.test(record.blankCounter)) record.issues.push('empty answers graded correct');
        }
        const panelButton = page.getByRole('button',{name:'답안 입력',exact:true});
        if (await panelButton.count()) {
          await panelButton.click();
          const items = page.locator('.trig-derivative-answer-panel .trig-derivative-answer-item');
          if (await items.count()) {
            if (!(await items.first().locator('.is-correct-answer').count())) {
              for (let i=0;i<await items.count();i++) await items.nth(i).locator('.trig-derivative-choices button').first().click();
              await gradePanel(page);
            }
            const answers = await items.evaluateAll(items=>items.map(item=>{
              const buttons=[...item.querySelectorAll('.trig-derivative-choices button')];
              return {correct:buttons.findIndex(button=>button.classList.contains('is-correct-answer')), correctCount:buttons.filter(button=>button.classList.contains('is-correct-answer')).length, choices:buttons.map(button=>button.querySelector('annotation')?.textContent ?? button.textContent), prompt:item.querySelector('.trig-derivative-answer-item-heading span')?.textContent};
            }));
            record.choiceQuestions = answers;
            if (answers.some(a=>a.correctCount!==1 || a.correct<0)) record.issues.push('choice lacks unique correct answer');
            if (answers.some(a=>new Set(a.choices).size!==a.choices.length)) record.issues.push('duplicate choices');
            if (answers.every(a=>a.correct>=0)) {
              for(let i=0;i<answers.length;i++) await items.nth(i).locator('.trig-derivative-choices button').nth(answers[i].correct).click();
              await gradePanel(page);
              record.correctCounter=await page.locator('.counting-progress').textContent();
              if (!record.correctCounter.startsWith(`${record.total}/`)) record.issues.push('correct choices grading mismatch');
            }
          }
          await page.getByRole('button',{name:/닫기$/}).click();
        }
        const reset = page.getByRole('button',{name:/^다시 (풀기|쓰기|하기)$/});
        if (await reset.count()) await reset.first().click();
        const fresh = page.getByRole('button',{name:'새 문제',exact:true});
        record.hasNewProblems = (await fresh.count()) > 0;
        if(record.hasNewProblems) {
          await fresh.first().click();
          const changed = await getState(page);
          record.freshCounter=changed.counter;
          record.changed = initial.tokens !== changed.tokens;
          if(!record.changed) record.issues.push('new problems unchanged');
          if(changed.invalid.length) record.issues.push('new problems invalid math');
          if(changed.clipped.length) record.issues.push('new rows outside sheet');
        }
        await page.emulateMedia({media:'print'});
        await page.evaluate(()=>document.documentElement.dataset.printMode='both');
        record.print={worksheet:await page.locator('.worksheet-stage:visible').count(),answers:await page.locator('.answer-stage:visible').count()};
        if(!record.print.worksheet || !record.print.answers) record.issues.push('missing printed worksheet/answers');
        record.printClipped = await page.evaluate(() => [...document.querySelectorAll('.a4-sheet')].flatMap(sheet => {
          if (!sheet.getBoundingClientRect().height) return [];
          const box = sheet.getBoundingClientRect();
          const rows = [...sheet.querySelectorAll('article')].filter(el => !el.parentElement.closest('article'));
          return rows.filter(el => {const r=el.getBoundingClientRect();return r.bottom>box.bottom+3 || r.right>box.right+3 || r.left<box.left-3;}).map(el=>el.textContent.slice(0,70));
        }));
        if(record.printClipped.length) record.issues.push('printed rows outside sheet');
        await page.evaluate(()=>delete document.documentElement.dataset.printMode);
        await page.emulateMedia({media:'screen'});
        await page.setViewportSize({width:390,height:844});
        await page.waitForTimeout(50);
        record.mobileOverflow = await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
        if(record.mobileOverflow>2) record.issues.push('mobile horizontal overflow');
        if(record.issues.length || index%12===0) await page.screenshot({path:path.join(output,`${String(index).padStart(3,'0')}-mobile.png`),fullPage:true});
      } catch(error) {record.issues.push('audit error');record.error=error.message;}
      finally {await page.close();}
      if(record.browserErrors.length) record.issues.push('browser error');
      results.push(record);
      await fs.writeFile(path.join(output, 'results.json'),JSON.stringify(results.sort((a,b)=>a.index-b.index),null,2));
      console.log(`${results.length}/${catalog.length} ${worksheet.title}: ${record.issues.join('; ') || 'PASS'}`);
    }
  }
  try {await Promise.all([worker(),worker(),worker()]);} finally {await browser.close();}
  const flagged=results.filter(r=>r.issues.length).length;
  console.log(JSON.stringify({total:results.length,flagged}));
  if(flagged) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
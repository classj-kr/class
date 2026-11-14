'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');
const screenshotWebp = require('./screenshot-webp.cjs');
const path = require('node:path');
const fs = require('node:fs');

async function main() {
  const h = await harness({withStorage:true});
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const errors=[];
  try {
    const student=await browser.newContext({extraHTTPHeaders:{'x-test-user':'1'}});
    await student.route('https://**',route=>route.abort());
    const page=await student.newPage();page.on('pageerror',e=>errors.push(e.message));
    const words=['사과','바나나','포도','딸기'].map((w,i)=>({w,mean:`검증용 뜻 ${i}`,use:`오늘 ${w}를 보았다.`,blanks:[`오늘 {}를 보았다 ${i}.`,`내일 {}를 먹는다 ${i}.`]}));
    const unit={id:'test',title:'과일',words};
    await page.route('**/words-3-1.js?*',route=>route.fulfill({contentType:'text/javascript',body:`window.CurriculumWords['3-1']=${JSON.stringify({국어:{units:[unit]}})};`}));
    await page.route('**/figures/**',route=>route.fulfill({contentType:'text/javascript',body:''}));
    const controls=await student.newPage();
    await controls.goto(h.base+'/learning/literacy-numeracy/proverbs/');
    const dock=controls.locator('learning-records .strip');
    await dock.getByRole('link',{name:'🏁 순위전',exact:true}).waitFor();
    await dock.getByRole('button',{name:'내 기록',exact:true}).click();
    await controls.locator('learning-records dialog[open]').waitFor();
    await controls.close();
    const actions=[];
    page.on('request',r=>{if(r.url().endsWith('/actions')) actions.push(r.postDataJSON());});
    await page.goto(h.base+'/learning/literacy-numeracy/curriculum-vocabulary/?term=3-1&unit=test');
    await page.locator('.chips button:not(.practice-chip)').last().waitFor();
    assert.equal(actions.length,0,'opening words and automatic scenes do not become activity');
    const savedRead=page.waitForResponse(r=>r.url().endsWith('/actions')&&r.status()===200);
    await page.locator('.chips button:not(.practice-chip)').last().click();await savedRead;
    await page.locator('.words-view .start').click();
    const savedComplete=page.waitForResponse(r=>r.url().endsWith('/actions')&&r.request().postDataJSON()?.complete&&r.status()===200);
    savedComplete.catch(()=>{});
    let first=true;
    while(await page.locator('.question').count()) {
      const text=(await page.locator('.prompt').textContent()).trim();
      const word=words.find(w=>text==='뜻'+w.mean||w.blanks.some(b=>b.replace('{}','').trim()===text));
      assert.ok(word,text);
      if(first){await page.locator('.choices button').filter({hasNotText:word.w}).first().click();first=false;}
      await page.locator('.choices').getByRole('button',{name:word.w,exact:true}).click();
      await page.locator('.next').click();
    }
    await savedComplete;
    const report=async()=>{
      const r=await fetch(h.base+'/api/learning-records/teacher/report?classId=10:2026:4:1',{headers:{'x-test-user':'3'}});
      assert.equal(r.status,200);return r.json();
    };
    const lesson=(await report()).sessions.find(s=>s.activity==='curriculum-vocabulary'&&s.status==='completed');
    assert.ok(lesson);assert.equal(lesson.summary.firstScored,4);assert.equal(lesson.summary.firstCorrect,3);assert.equal(lesson.summary.retryCount,2);

    // Use real game controls. An open board produces nothing; a legal tile move does.
    const puzzle=await student.newPage();puzzle.on('pageerror',e=>errors.push(e.message));
    await puzzle.route('**/assets/network/game-network.js?*',route=>route.fulfill({contentType:'text/javascript',body:'window.ClassroomNetwork={HTTP_URL:location.origin};window.CLASS_PLAYER_NAME="검증가람";'}));
    await puzzle.route('**/api/finishers?*',route=>route.fulfill({contentType:'application/json',body:'{"records":[]}'}));
    await puzzle.goto(h.base+'/learning/games/sliding-puzzle/');
    await puzzle.locator('#startButton').click();
    assert.equal((await report()).sessions.some(s=>s.activity==='sliding-puzzle'),false);
    const savedMove=puzzle.waitForResponse(r=>r.url().endsWith('/actions')&&r.status()===200);
    await puzzle.evaluate(()=>{
      const nodes=[...document.querySelector('#board').children],empty=nodes.findIndex(n=>n.classList.contains('empty'));
      const next=empty%3 ? empty-1 : empty+1;nodes[next].click();
    });await savedMove;
    assert.equal((await report()).sessions.filter(s=>s.activity==='sliding-puzzle').length,1);
    // Completion must be recorded on every round, even with no new best score.
    await puzzle.evaluate(async()=>{const r=LearningActivity.round('sliding-puzzle',()=> '반복 퍼즐');await r.start();await r.finish('퍼즐 완료');r.reset();await r.start();await r.finish('퍼즐 완료');});
    assert.equal((await report()).sessions.filter(s=>s.activity==='sliding-puzzle'&&s.status==='completed').length,2);
    // A separate browser context represents another device, using only the account.
    const teacher=await browser.newContext({extraHTTPHeaders:{'x-test-user':'3'},viewport:{width:1440,height:900}});
    const view=await teacher.newPage();await view.goto(h.base+'/classtools/learning-reports.html');
    await view.locator('.record-card').first().waitFor();
    assert.match(await view.locator('#records').innerText(),/단원 연습 4문항 완료/);
    await view.locator('#areaTab').click();await view.locator('#activitySelect').selectOption('sliding-puzzle');
    assert.equal(await view.locator('.record-card').count(),3);
    const output=path.resolve(__dirname,'../outputs/learning-records-review');fs.mkdirSync(output,{recursive:true});
    await screenshotWebp(view,{path:path.join(output,'activity-sources.webp'),fullPage:true});
    assert.deepEqual(errors,[]);
    console.log('PASS browser activity reports: open exclusion, real vocabulary read/answer/retry/completion, ordered requests, real puzzle move, repeated rounds, teacher view on another device.');
  } finally {await browser.close();await h.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});

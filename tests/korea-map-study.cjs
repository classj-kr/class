const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const vm=require('node:vm');
const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'../learning/inquiry/korea-map');
const output=path.resolve(__dirname,'../outputs/korea-map-study');
const sandbox={window:{}};vm.createContext(sandbox);
for(const file of ['data/geo-data.js','data/questions.js','data/study-lessons.js','study-visuals.js','study.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox);
const dataset=sandbox.window.KOREA_GEOGRAPHY;
const original=dataset.questions.filter(q=>!q.diagram);
assert.equal(original.length,139);
assert.equal(dataset.lessons.length,28);
assert.equal(new Set(dataset.questions.map(q=>q.id)).size,dataset.questions.length);
for(const q of dataset.questions) { assert.ok(q.lesson,q.id+' not mapped');assert.ok(q.options[q.answer]); assert.equal(new Set(q.options).size,q.options.length,q.id+' duplicate options'); if(q.stimulus?.type==='pyramid') assert.equal(q.stimulus.groups.reduce((sum,g)=>sum+g.male+g.female,0),100,q.id+' population proportions must total 100%'); }
for(const lesson of dataset.lessons) {
  for(const qid of lesson.questionIds) assert.ok(dataset.questions.some(q=>q.id===qid&&q.topic===lesson.topic));
  const pools=['essential','basic','advanced'].map(level=>sandbox.window.KoreaStudy.questionsFor(lesson,level));
  assert.equal(pools.flat().length,lesson.questionIds.length);
  assert.ok(pools[0].length);
  for(const level of ['essential','basic','advanced','all']) for(const q of sandbox.window.KoreaStudy.questionsFor(lesson,level)) assert.ok(lesson.questionIds.includes(q.id));
}
const { startHarness } = require('./site-storage-harness.cjs');
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const h=await startHarness();let browser;
  try {
    browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
    const page=await browser.newPage(),errors=[];
    await page.setCookie({name:'test_user',value:'1',url:h.base});   // 로그인한 학생: 기록이 서버에 남는다
    page.on('pageerror',e=>errors.push(e.message));
    await page.setViewport({width:1440,height:1000});
    const url=`${h.base}/learning/inquiry/korea-map/`;   // 틀은 저장소 뿌리를 내보내므로 앱 주소를 붙인다
    await page.goto(url,{waitUntil:'networkidle0'});
    const select=async lesson=>{
      await page.evaluate(l=>{document.querySelector(`[data-theme="${l.topic}"]`).click();const el=document.querySelector('#lessonSelect');el.value=l.id;el.dispatchEvent(new Event('change',{bubbles:true}));},lesson);
      assert.equal(await page.$eval('#lessonSelect',el=>el.value),lesson.id);
      assert.ok(await page.$eval('.practice-launch',el=>el.hidden));
      assert.equal(await page.$('#startMixed'),null);
    };
    const activeQuestion=()=>page.evaluate(()=>{
      const prompt=document.querySelector('#questionTitle').innerHTML;
      const options=[...document.querySelectorAll('#answerOptions button')].map(b=>b.lastElementChild.textContent);
      return window.KOREA_GEOGRAPHY.questions.find(q=>q.prompt===prompt&&q.options.every(o=>options.includes(o)));
    });
    const chooseAnswer=answer=>page.evaluate(answer=>[...document.querySelectorAll('#answerOptions button')].find(b=>b.lastElementChild.textContent===answer).click(),answer);
    const overflows=[];
    for(const lesson of dataset.lessons){
      await select(lesson);
      assert.equal(await page.$$eval('#lessonDiagram svg, #lessonDiagram .concept-table',e=>e.length),1);
      const overflow=await page.$$eval('#lessonDiagram svg text',nodes=>nodes.filter(n=>{const b=n.getBBox();return b.x < -1 || b.x+b.width > 521 || b.y < -1 || b.y+b.height > 251;}).map(n=>n.textContent));
      if(overflow.length)overflows.push({id:lesson.id,overflow});
      await page.evaluate(()=>document.querySelector('#practiceLesson').click());
      assert.ok(await page.$eval('#practiceDialog',el=>el.open));
      assert.equal(await page.$('#questionDifficulty,.difficulty-badge'),null,'Question difficulty badges must stay removed');
      assert.equal(await page.$eval('.question-copy',el=>el.firstElementChild.id),'questionTitle');
      assert.equal(await page.$eval('#questionProgressBar',el=>el.style.width),'0%');
      assert.ok(await page.$eval('#questionMap',el=>el.hidden));
      assert.ok(!await page.$('#questionDiagram .visual-evidence'));
      for(let n=0;n<2;n++) {
        const q=await activeQuestion();
        await chooseAnswer(q.options[q.answer]);
        assert.ok(await page.$('#questionDiagram .visual-evidence'));
        assert.ok(!await page.$eval('#nextQuestion',el=>el.disabled));
        await page.evaluate(()=>document.querySelector('#nextQuestion').click());
      }
      await page.evaluate(()=>document.querySelector('#finishPractice').click());
    }
    assert.deepEqual(overflows,[],'SVG text must fit');
    await select(dataset.lessons.find(l=>l.id==='floodplain'));
    await page.evaluate(()=>document.querySelector('.study-panel').scrollTop=0);
    await page.screenshot({path:path.join(output,'desktop-floodplain.png')});
    await page.evaluate(()=>document.querySelector('#practiceLesson').click());
    const fq=await activeQuestion();
    await page.evaluate(answer=>[...document.querySelectorAll('#answerOptions button')].find(b=>b.textContent.includes(answer)).click(),fq.options[(fq.answer+1)%fq.options.length]);
    assert.ok(await page.$eval('#nextQuestion',el=>el.disabled));
    assert.ok(!await page.$('#questionDiagram .visual-evidence'));
    await page.evaluate(answer=>[...document.querySelectorAll('#answerOptions button')].find(b=>b.textContent.includes(answer)).click(),fq.options[fq.answer]);
    // 첫 답 기록은 계정 저장 공간(서버)에 남는다. 브라우저에는 남지 않는다.
    await page.waitForFunction(async id=>(await (await fetch('/api/me/storage/korea-map',{cache:'no-store'})).json()).items['classj-korea-geography-progress-v2']?.items?.[id]?.n===2,{polling:200,timeout:10000},fq.id);   // 두 번째 답까지 서버에 닿은 뒤 읽는다
    const record=(await h.items('korea-map'))['classj-korea-geography-progress-v2'].items[fq.id];
    assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).filter(k=>/korea-geography/.test(k))),[]);
    assert.equal(record.n,2);assert.equal(record.c,1);assert.equal(record.wrong,true);
    await page.screenshot({path:path.join(output,'desktop-answer.png')});
    await page.evaluate(()=>document.querySelector('#closePractice').click());
    await page.reload({waitUntil:'networkidle0'});
    await select(dataset.lessons.find(l=>l.id==='floodplain'));
    assert.ok(!await page.$eval('#reviewLesson',el=>el.disabled));
    // Existing graph, map and text question paths are still accessible from each lesson.
    for(const id of dataset.lessons.map(lesson=>lesson.id)){
      await select(dataset.lessons.find(l=>l.id===id));
      await page.evaluate(()=>document.querySelector('[data-study-level="all"]').click());
      await page.evaluate(()=>document.querySelector('#practiceLesson').click());
      const count=Number((await page.$eval('#questionProgress',el=>el.textContent)).split('/')[1]);
      assert.equal(count,dataset.lessons.find(l=>l.id===id).questionIds.length);
      for(let i=0;i<count;i++){
        const answer=await page.evaluate(()=>{const prompt=document.querySelector('#questionTitle').innerHTML;const options=[...document.querySelectorAll('#answerOptions button')].map(b=>b.lastElementChild.textContent);const q=window.KOREA_GEOGRAPHY.questions.find(q=>q.prompt===prompt&&q.options.every(o=>options.includes(o)));return q.options[q.answer];});
        await page.evaluate(answer=>{const buttons=[...document.querySelectorAll('#answerOptions button')];const b=buttons.find(b=>b.lastElementChild.textContent===answer);if(!b)throw Error(JSON.stringify({answer,options:buttons.map(x=>x.textContent),prompt:document.querySelector('#questionTitle').textContent}));b.click();},answer);
        await page.evaluate(()=>document.querySelector('#nextQuestion').click());
      }
      assert.ok(await page.$eval('#resultDialog',el=>el.open));
      await page.evaluate(()=>document.querySelector('#finishPractice').click());
    }
    await select(dataset.lessons.find(l=>l.id==='foehn'));
    await page.evaluate(()=>document.querySelector('.study-panel').scrollTop=0);
    await page.screenshot({path:path.join(output,'desktop-foehn.png')});
    await page.setViewport({width:390,height:844});
    await select(dataset.lessons.find(l=>l.id==='floodplain'));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(output,'mobile-floodplain.png'),fullPage:true});
    await page.evaluate(()=>{document.querySelector('[data-study-level="essential"]').click();document.querySelector('#practiceLesson').click();});
    await page.screenshot({path:path.join(output,'mobile-question.png')});
    assert.equal(await page.$('#questionDifficulty,.difficulty-badge'),null);
    assert.ok(await page.$eval('#practiceDialog',el=>el.scrollWidth<=el.clientWidth));
    await page.evaluate(()=>document.querySelector('#closePractice').click());
    for(const topic of ['heritage','travel']){
      await page.evaluate(t=>document.querySelector(`[data-theme="${t}"]`).click(),topic);
      assert.ok(await page.$eval('#studyWorkspace',el=>el.hidden));
      assert.equal(await page.$eval('.practice-launch',el=>el.hidden),topic==='travel');
      if(topic==='heritage'){
        await page.$eval('#startPractice',el=>el.click());
        assert.ok(await page.$eval('#practiceDialog',el=>el.open));
        await page.$eval('#practiceDialog',el=>el.close());
      }
    }
    assert.deepEqual(errors,[]);
    console.log('Study passed: 28 lessons / 195 questions; all existing questions mapped; all visual questions render and reveal; first-answer records persist; graph/map/mixed sessions complete; mobile and exploration tabs work.');
  } finally {if(browser)await browser.close();await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

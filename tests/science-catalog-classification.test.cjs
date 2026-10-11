const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const screenshotWebp=require('./science-screenshot.cjs');
const map=require('../learning/inquiry/science-lab/curriculum-map.js');
const {foundation,courses,standards,source,classify}=require('../scripts/science-catalog-classification.cjs');
const {build}=require('../scripts/build-science-catalog.cjs');
const placements=classify(map);
const root=path.resolve(__dirname,'../learning/inquiry/science-lab');

test('official 2022 areas and courses, and one auditable primary placement per app',()=>{
 assert.deepEqual(foundation.map(a=>a.title),['운동과 에너지','물질','생명','지구와 우주','과학과 사회']);
 assert.equal(foundation.reduce((n,a)=>n+a.categories.length,0),18);
 assert.deepEqual(Object.keys(placements).sort(),Object.keys(map).sort());
 const toc=source.slice(0,source.indexOf('교육과정 설계의 개요'));
 for(const course of courses) {
  const label=course.kind==='공통'?'공통 과목':course.kind+' 과목';
  const block=toc.split(`[${label}]`)[1]?.split(/\[[^\]]+\]/)[0];
  assert(block?.includes(course.title),`${course.title} must be in the official ${label} table`);
 }
 assert.deepEqual(courses.filter(c=>c.kind==='공통').map(c=>c.title),['통합과학1','통합과학2','과학탐구실험1','과학탐구실험2']);
 assert.equal(courses.filter(c=>c.kind==='일반 선택').length,4);
 assert.equal(courses.filter(c=>c.kind==='진로 선택').length,8);
 assert.equal(courses.filter(c=>c.kind==='융합 선택').length,3);
 for(const [slug,p]of Object.entries(placements)) {
  assert(map[slug].codes.every(code=>standards[code]),slug);
  if(map[slug].level==='high') {
   assert(map[slug].codes.every(code=>code.startsWith(p.school==='high-common'?'10':'12')),slug);
   assert.equal(p.category,standards[p.code].domain,slug);
  }
 }
 assert.equal(placements['infection-prevention'].area,'과학과 사회');
 assert.equal(placements['infection-prevention'].category,'과학과 안전');
 assert.equal(placements['water-cycle'].category,'물질의 성질');
 assert.equal(placements['land-sea'].category,'유체 지구');
 assert.equal(placements['speaker-lab'].category,'전기와 자기');
 assert.equal(placements['newton-prism'].area,'과학탐구실험1');
 assert.equal(placements['newton-prism'].category,'과학 탐구의 과정과 절차');
 assert.equal(placements['cell-division'].category,'생명의 연속성과 다양성');
 assert.equal(placements['semiconductor-relativity'].category,'빛과 물질');
 const changed=structuredClone(map);
 changed.measurement.grade='고3';changed.measurement.grades=['고3'];
 changed['lens-image'].grade='고1';changed['lens-image'].grades=['고1'];
 assert.equal(classify(changed).measurement.school,'high-common','Scheduling a subject in a different year cannot change its course type');
 assert.equal(classify(changed)['lens-image'].school,'high-elective');
 const invalid=structuredClone(map); invalid.measurement.codes.push('12물리01-01');
 assert.throws(()=>classify(invalid),/Common\/elective mixed/);
 const newApp={...map,'unclassified-app':{...map['refraction']}};
 assert.throws(()=>classify(newApp),/no curriculum placement/,'New apps cannot silently disappear from the catalog');
 build({check:true});
});

test('school/course filtering, old links, exact high-school domains and responsive catalog', {timeout:120000},async()=>{
 const server=http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  fs.readFile(file,(err,data)=>{
   if(err){res.writeHead(404);res.end();return;}
   res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(file)]||'application/octet-stream');res.end(data);
  });
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.SCIENCE_BROWSER||chromium.executablePath()});
  const page=await browser.newPage(), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const base=`http://127.0.0.1:${server.address().port}`;
  const shotDir=process.env.SCIENCE_SCREENSHOT_DIR;
  if(shotDir)fs.mkdirSync(shotDir,{recursive:true});
  for(const width of [1440,1024,768,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base);
   for(const school of ['all','elementary','middle','high-common','high-elective']){
    await page.locator(`[data-school-filter="${school}"]`).click();
    const expected=Object.entries(placements).filter(([,p])=>school==='all'||p.school===school).map(([slug])=>slug).sort();
    const actual=await page.locator('.level-entry:visible').evaluateAll(es=>es.map(e=>e.getAttribute('href').slice(0,-1)).sort());
    assert.deepEqual(actual,expected,`${width} ${school}: visible routes`);
    assert.equal(await page.locator('[data-school-filter][aria-pressed="true"]').count(),1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${width} ${school}: no horizontal overflow`);
    assert.equal(await page.locator('.level-entry:visible > span').evaluateAll(es=>es.some(e=>e.scrollWidth>e.clientWidth+1)),false,'Full experiment names must be readable');
    if(['all','elementary','middle'].includes(school)){
     assert.deepEqual(await page.locator('.foundation-section .subject-heading h3:visible').allTextContents(),foundation.map(a=>a.title),'All five official areas remain visible');
     assert.deepEqual(await page.locator('.foundation-section .topic-row h4:visible').allTextContents(),foundation.flatMap(a=>a.categories),'All 18 categories remain visible, including empty categories');
     for(const category of ['생명과학과 인간의 생활','과학과 지속가능한 사회','과학과 진로']){
      const row=page.locator(`.foundation-section [data-category="${category}"]`);
      assert(await row.isVisible());assert((await row.locator('.catalog-empty:visible').count())>0);
     }
    }else assert.equal(await page.locator('.foundation-section').isVisible(),false);
    for(const section of ['high-common','high-elective']){
     const visible=school==='all'||school===section;
     const scope=page.locator(`.school-section[data-school="${section}"]`);
     assert.equal(await scope.isVisible(),visible);
     if(visible){
      assert.deepEqual(await scope.locator('.subject-heading h3:visible').allTextContents(),courses.filter(c=>c.school===section).map(c=>c.title),'Include every official course, even without registered apps');
      for(const course of courses.filter(c=>c.school===section)){
       const domains=[...new Set(Object.values(standards).filter(s=>s.code.startsWith(course.prefix)).map(s=>s.domain))];
       assert.deepEqual(await scope.locator(`[data-area="${course.title}"] .topic-row h4:visible`).allTextContents(),domains);
      }
     }
    }
    assert.equal(await page.locator('.catalog-empty:visible').evaluateAll(es=>es.some(e=>e.parentElement.querySelector('.level-entry:not([hidden])'))),false,'Empty labels must never accompany visible experiments');
    if(['elementary','middle'].includes(school)){
     for(const grade of school==='elementary'?['초3','초4','초5','초6']:['중1','중2','중3']){
      await page.locator(`[data-grade="${grade}"]`).click();
      const count=Object.values(map).filter(a=>a.grades.includes(grade)).length;
      assert.equal(await page.locator('.level-entry:visible').count(),count);
      assert.equal(await page.locator('.foundation-section .topic-row:visible').count(),18,'Grade changes must not erase the official classification');
      assert.equal(await page.locator('.catalog-empty:visible').evaluateAll(es=>es.every(e=>e.textContent==='선택한 학년에 등록된 실험 없음')),true);
     }
     await page.locator('[data-grade="전체"]').click();
    }
    if(shotDir&&[1440,390].includes(width)&&['all','high-common','high-elective'].includes(school))
     await screenshotWebp(page,path.join(shotDir,`${school}-${width}.webp`));
    if(shotDir&&[1440,390].includes(width)&&school==='all'){
     await screenshotWebp(page.locator('#society'),path.join(shotDir,`society-${width}.webp`));
     await screenshotWebp(page.locator('#biology'),path.join(shotDir,`life-${width}.webp`));
     await screenshotWebp(page.locator('[data-area="과학탐구실험2"]'),path.join(shotDir,`inquiry2-${width}.webp`));
    }
   }
  }
  for(const [query,school,grade]of [
   ['?grade=고1&course=세포와%20물질대사','high-common',null],['?grade=고2','high-elective',null],['?grade=고3','high-elective',null],
   ['?grade=초6','elementary','초6'],['?grade=중2','middle','중2'],['?school=high-elective&grade=초3','high-elective',null],['?school=invalid&grade=invalid','all',null]
  ]){
   await page.goto(base+query);
   assert.equal(await page.locator(`[data-school-filter="${school}"]`).getAttribute('aria-pressed'),'true');
   const url=new URL(page.url());assert.equal(url.searchParams.has('course'),false);assert.equal(url.searchParams.get('grade'),grade);
   await page.reload();assert.equal(await page.locator(`[data-school-filter="${school}"]`).getAttribute('aria-pressed'),'true');
  }
  await page.goto(base);
  const actual=await page.locator('.level-entry').evaluateAll(es=>es.map(e=>({slug:e.getAttribute('href').slice(0,-1),area:e.closest('.subject-section').dataset.area,category:e.closest('.topic-row').dataset.category,school:e.dataset.school})));
  for(const e of actual){const p=placements[e.slug];assert.deepEqual({area:e.area,category:e.category,school:e.school},{area:p.area,category:p.category,school:p.school});}
  assert.deepEqual(errors,[]);
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
});

const assert=require('node:assert/strict');
const express=require('../game-hub-server/node_modules/express');
const {PGlite}=require('../game-hub-server/node_modules/@electric-sql/pglite');
const {createSchoolTextbooks}=require('../game-hub-server/school-textbooks');
const catalog=require('../game-hub-server/data/textbooks/catalog-2022.json');
const path=require('node:path');
class HttpError extends Error { constructor(status,code,message){super(message);this.status=status;this.code=code;} }
async function harness(){
 const db=new PGlite();
 await db.exec('CREATE TABLE classroom_schools(id BIGINT PRIMARY KEY); INSERT INTO classroom_schools VALUES(1),(2);');
 const pool={query:async(sql,args)=>!args&&sql.includes('CREATE TABLE')?(await db.exec(sql)).at(-1):db.query(sql,args)};
 const access=async req=>{
  const school=Number(req.headers['x-test-school']||1);
  if(req.headers['x-test-role']==='anonymous') throw new HttpError(401,'AUTH','Login required');
  return {profile:{school_id:school},canEdit:req.headers['x-test-role']!=='reader'};
 };
 const feature=createSchoolTextbooks({pool,HttpError,requireSchoolCurriculum:access,requireSchoolAdmin:async req=>{const a=await access(req);if(!a.canEdit)throw new HttpError(403,'DENIED','Read only');return a;},asyncRoute:fn=>(req,res,next)=>Promise.resolve(fn(req,res)).catch(next)});
 await feature.initialize(); await feature.initialize();
 const app=express();app.use(express.json());app.use('/api/school-admin/textbooks',feature.router);
 app.get('/preview',(_req,res)=>res.type('html').send(`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/schooladmin/style.css"><title>교과서 선택 검증</title><body data-curriculum-access="edit"><main class="tab-content"><h1>학교 교육과정 · 교과서</h1><label>학년 <select id="grade"><option>3</option><option>4</option><option selected>5</option><option>6</option></select></label><div id="textbookPanel" class="textbook-panel margin-top"></div></main><script src="/schooladmin/textbooks.js"></script><script>const panel=createTextbookPanel({canEdit:()=>true,api:async(p,o={})=>{const r=await fetch(p,{...o,headers:{'Content-Type':'application/json'}});const d=await r.json();if(!r.ok)throw Object.assign(new Error(d.message),{status:r.status});return d;}});panel.load(2026,5);document.getElementById('grade').onchange=e=>panel.load(2026,Number(e.target.value));</script></body></html>`));
 app.use('/schooladmin',express.static(path.resolve(__dirname,'../schooladmin')));
 app.use((error,_req,res,_next)=>res.status(error.status||500).json({message:error.message,code:error.code}));
 const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 return {base:`http://127.0.0.1:${server.address().port}`,async close(){await new Promise(r=>server.close(r));await db.close();}};
}
async function run(){
 const h=await harness();
 if(process.argv.includes('--preview')){console.log(h.base+'/preview');return;}
 const call=async(route='',body,headers={})=>{const r=await fetch(h.base+'/api/school-admin/textbooks'+route,{method:body?'PUT':'GET',headers:{'Content-Type':'application/json',...headers},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};};
 try{
  const pick=(grade,publisher,subject='과학')=>catalog.editions.find(e=>e.grades.includes(grade)&&e.publisher===publisher&&e.subject===subject);
  const save=(grade,publisher,revision=0)=>({academicYear:2026,grade,subject:'과학',editionId:pick(grade,publisher).id,revision});
  assert.equal((await call('?academicYear=2026&grade=3',null,{'x-test-role':'anonymous'})).status,401);
  assert.equal((await call('',save(3,'비상교육'),{'x-test-role':'reader'})).status,403);
  assert.equal((await call('',save(3,'비상교육'))).status,200);
  assert.equal((await call('',save(5,'아이스크림미디어'))).status,200);
  assert.equal((await call('?academicYear=2026&grade=3')).data.selections[0].editionId,pick(3,'비상교육').id);
  assert.equal((await call('?academicYear=2026&grade=5')).data.selections[0].editionId,pick(5,'아이스크림미디어').id);
  for(const query of ['?academicYear=2027&grade=3','?academicYear=2026&grade=4']) assert.equal((await call(query)).data.selections.length,0);
  assert.equal((await call('?academicYear=2026&grade=3',null,{'x-test-school':'2'})).data.selections.length,0);
  assert.equal((await call('',{...save(3,'동아출판'),grade:5})).status,400);
  assert.equal((await call('',{...save(3,'비상교육'),subject:'수학'})).status,400);
  assert.equal((await call('',{...save(3,'비상교육'),grade:7})).status,400);
  assert.equal((await call('',save(3,'아이스크림미디어'))).status,409);
  assert.equal((await call('',save(3,'아이스크림미디어',1))).data.selection.revision,2);
  assert.equal((await call('',save(3,'비상교육',1))).status,409);
  const data=(await call('?academicYear=2026&grade=5')).data;
  assert.ok(data.editions.every(e=>e.grades.includes(5)&&e.volumes.every(v=>v.grade===5)));
  const ice=data.editions.find(e=>e.id===pick(5,'아이스크림미디어').id);
  assert.equal(ice.plans.length,2);
  const plan=(await call('/plans/'+ice.plans[0].id)).data.plan;
  assert.ok(plan.lessons.length>30);assert.equal(plan.grade,5);assert.equal(plan.subject,'과학');
  assert.equal((await call('/plans/missing')).status,404);
  const multi=catalog.editions.filter(e=>e.publisher==='천재교과서'&&e.subject==='수학'&&e.grades.includes(3));
  assert.equal(multi.length,2);assert.equal(new Set(multi.map(e=>e.id)).size,2);
  const nat=catalog.editions.filter(e=>e.subject==='수학'&&e.grades.includes(1));assert.equal(nat.length,1);
  for(const grade of [5,6]) for(const subject of ['국어','도덕']) assert.equal(catalog.editions.filter(e=>e.subject===subject&&e.grades.includes(grade)&&e.approvalType==='국정').length,1);
  const sources=require('../references/textbooks/acquired-sources.json');
  assert.equal(sources.issues.length,0);assert.ok(sources.sources.every(s=>s.plans.length>0&&s.sha256.length===64));
  const allPlans=require('node:fs').readdirSync(path.resolve(__dirname,'../game-hub-server/data/textbooks'))
    .filter(name=>/^pacing-.+-2022\.json$/.test(name)).flatMap(name=>require(`../game-hub-server/data/textbooks/${name}`).plans);
  assert.equal(new Set(allPlans.flatMap(p=>p.lessons.map(l=>l.id))).size,allPlans.reduce((n,p)=>n+p.lessons.length,0));
  for(const p of allPlans){assert.ok(catalog.editions.some(e=>e.id===p.editionId&&e.grades.includes(p.grade)&&e.subject===p.subject));assert.ok(p.lessons.every(l=>l.topic&&Number.isInteger(l.sourceRow)&&l.sourceRow>=1));}
  const donga=allPlans.filter(p=>p.publisher==='동아출판');
  const achimContent=require('../references/textbooks/assessment-content-achim-2022.json').assessments;
  const visangContent=require('../references/textbooks/assessment-content-visang-2022.json').assessments;
  assert.equal(visangContent.length,81);
  assert.equal(visangContent.reduce((n,a)=>n+a.stages.length,0),108);
  for(const a of visangContent){
    assert.ok(a.documentStandardCodes.length>0&&a.lessonIds.length>0);
    const cache=require(path.resolve(__dirname,'../references/textbooks/수집작업/visang-assessments',a.id+'.json'));
    for(const stage of a.stages){
      assert.equal(stage.rubric.length,3);
      for(const field of [stage.objective,...stage.rubric,...stage.rubric.map(r=>r.feedback)])assert.equal(field.sourceParagraphs.map(n=>cache[n-1]).join(' '),field.text);
    }
    assert.equal(require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(path.resolve(__dirname,'../references/textbooks/raw',a.sourceFile))).digest('hex'),a.sha256);
    const matched=allPlans.filter(p=>p.grade===a.grade&&p.editionId===a.editionId).flatMap(p=>p.lessons).filter(l=>l.semester===a.semester);
    assert.ok(a.lessonIds.every(id=>matched.some(l=>l.id===id)));
  }
  assert.equal(achimContent.length,66);
  for(const a of achimContent){
    assert.equal(a.rubric.length,3);assert.ok(a.standardCodes.length>0);
    assert.ok(a.rubric.every(r=>r.text&&r.sourceParagraphs.length));
    const cache=require(path.resolve(__dirname,'../references/textbooks/수집작업/achim-assessments',a.id+'.json'));
    for(const field of [a.standards,a.objective,a.method,...a.rubric])assert.equal(field.sourceParagraphs.map(n=>cache[n-1]).join(' '),field.text);
    assert.equal(require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(path.resolve(__dirname,'../references/textbooks/raw',a.sourceFile))).digest('hex'),a.sha256);
    const matched=allPlans.filter(p=>p.grade===a.grade&&p.editionId===a.editionId).flatMap(p=>p.lessons);
    assert.ok(a.lessonIds.every(id=>matched.some(l=>l.id===id)));
    if(a.subject==='미술')assert.equal(a.linkedWorksheetIds.length,1);
  }
  const visangOnline=allPlans.filter(p=>p.id.startsWith('visang-online-'));
  assert.equal(visangOnline.length,4);
  for(const p of visangOnline){
    const bytes=require('node:fs').readFileSync(path.resolve(__dirname,'../references/textbooks',p.sourceFile));
    assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'),p.sha256);
    const source=JSON.parse(bytes);
    assert.equal(p.lessons.reduce((n,l)=>n+l.suggestedPeriods,0),p.subject==='과학'?48:45);
    assert.equal(p.additionalResources.length,p.subject==='과학'?4:0);
    for(const l of p.lessons){
      assert.deepEqual(l.sourcePointer.split('/').slice(1).reduce((v,k)=>v[k],source),l.sourceCells);
      assert.equal(String(new URL(l.sourceCells.bookUrl).searchParams.get('page')),l.pages);
      assert.equal(l.pageMapping,'ebook-start-page-only');
    }
  }
  for(const p of allPlans.filter(p=>p.format==='official-guide-semester-table')){
    const source=require(path.resolve(__dirname,'../references/textbooks',p.sourceFile));
    assert.equal(p.lessons.reduce((n,l)=>n+l.suggestedPeriods,0),source.expectedPeriods);
    for(const l of p.lessons){
      assert.deepEqual(l.sourcePointer.split('/').slice(1).reduce((v,k)=>v[k],source),l.sourceCells);
      assert.equal(require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(path.resolve(__dirname,'../references/textbooks/raw',l.originalSourceFile))).digest('hex'),l.originalSha256);
      assert.deepEqual(l.standardCodes,[]); // Guide gives unit standards, not a lesson-specific mapping.
    }
  }
  const miraen=allPlans.filter(p=>p.publisher==='미래엔');
  assert.equal(miraen.length,42);
  assert.equal(new Set(miraen.map(p=>`${p.editionId}:${p.grade}`)).size,30);
  for(const p of miraen){
    const sourcePath=path.resolve(__dirname,'../references/textbooks',p.sourceFile);
    const bytes=require('node:fs').readFileSync(sourcePath);
    assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'),p.sha256);
    const source=JSON.parse(bytes);
    for(const l of p.lessons){
      const raw=l.sourcePointer.split('/').slice(1).reduce((v,k)=>v[k],source);
      assert.deepEqual(l.sourceCells.slice(2),raw.split('|'));
      assert.ok(!l.unit.includes('[보완]')&&l.unit!=='부록');
    }
    const hours=p.lessons.reduce((n,l)=>n+(l.suggestedPeriods||0),0);
    if(p.subject==='수학')assert.equal(hours,64);
    if(p.subject==='과학')assert.equal(hours,48);
    if(p.subject==='체육')assert.equal(hours,102);
    if(p.subject==='음악')assert.equal(hours,68);
  }
  assert.equal(miraen.flatMap(p=>p.lessons).filter(l=>l.periodNumbers===null).length,12);
  assert.ok(miraen.filter(p=>p.subject==='미술').flatMap(p=>p.lessons).every(l=>l.periodBasis==='subunit'));
  const miraenApi=(await call('/plans/miraen-1613')).data.plan;
  assert.equal(miraenApi.grade,6);assert.equal(miraenApi.lessons.length,37);
  const tselpa=allPlans.filter(p=>p.id.startsWith('tselpa-'));
  assert.equal(tselpa.length,122);
  assert.equal(tselpa.filter(p=>p.semester===null).length,26);
  const tselpaSource=require('../references/textbooks/tselpa-outline-extracted.json');
  const verifiedHashes=new Map();
  for(const p of tselpa)for(const l of p.lessons){
    assert.equal(l.sourcePointer.split('/').slice(1).reduce((v,k)=>v[k],tselpaSource),l.sourceCells[1]);
    assert.ok(!l.unit.includes('[보완]')&&!l.unit.includes('학습 보완'));
    if(!verifiedHashes.has(l.originalSourceFile))verifiedHashes.set(l.originalSourceFile,require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(path.resolve(__dirname,'../references/textbooks/raw',l.originalSourceFile))).digest('hex'));
    assert.equal(l.originalSha256,verifiedHashes.get(l.originalSourceFile));
  }
  const tselpaOverlap=tselpa.flatMap(p=>p.lessons).filter(l=>l.reviewStatus==='source-period-overlap');
  assert.equal(tselpaOverlap.length,2);assert.ok(tselpaOverlap.every(l=>l.suggestedPeriods===null&&l.periodNumbers[0]===3));
  const integrated=tselpa.filter(p=>p.subject==='통합교과');
  assert.equal(integrated.length,16);assert.ok(integrated.flatMap(p=>p.lessons).every(l=>l.suggestedPeriods===null));
  assert.equal((await call('/plans/tselpa-E-curri03-math-H_2025-s2')).data.plan.grade,3);
  const kumsung=allPlans.filter(p=>p.publisher==='금성출판사');
  for(const p of kumsung) assert.equal(p.lessons.reduce((n,l)=>n+(l.suggestedPeriods||0),0),p.subject==='체육'?102:68);
  const kumsungLower=kumsung.filter(p=>p.subject==='체육'&&p.grade<5);
  assert.equal(kumsungLower.length,2);
  const kumsungTranscription=require('../references/textbooks/kumsung-pe34-reviewed-transcription.json');
  for(const p of kumsungLower)for(const l of p.lessons){
    assert.equal(l.sourcePointer.split('/').slice(1).reduce((v,k)=>v[k],kumsungTranscription),l.sourceCells[0]);
    assert.equal(require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(path.resolve(__dirname,'../references/textbooks/raw',l.originalSourceFile))).digest('hex'),l.originalSha256);
    assert.equal(l.semester,null);assert.equal(l.periodBasis,'subunit');
  }
  assert.equal(kumsungLower.find(p=>p.grade===3).lessons[0].subunit,'1. 체력 운동 움직임');
  assert.equal(kumsungLower.find(p=>p.grade===4).lessons[0].subunit,'1. 운동 생활 습관');
  const jihak=allPlans.filter(p=>p.publisher==='지학사');
  const korean32=jihak.find(p=>p.subject==='국어'&&p.grade===3&&p.semester===2);
  assert.equal(korean32.sheet,'3-1 국어'); // Misnamed source tab; row semester is authoritative.
  assert.ok(korean32.lessons.every(l=>l.semester===2));
  assert.equal(jihak.filter(p=>p.subject==='통합교과').length,4);
  assert.ok(jihak.every(p=>p.lessons.every(l=>l.semester!==0)));
  assert.equal(donga.filter(p=>p.subject==='미술').length,8); // Two files contain four grades, both semesters.
  assert.equal(donga.find(p=>p.subject==='미술'&&p.grade===4&&p.semester===1).lessons[0].unit,'01. 알록달록 색이 가득');
  for(const grade of [3,4,5,6]) {
    const music=donga.filter(p=>p.subject==='음악'&&p.grade===grade);
    assert.equal(music.reduce((sum,p)=>sum+p.lessons.reduce((n,l)=>n+l.suggestedPeriods,0),0),68);
    if(grade>=5) assert.ok(music.every(p=>p.lessons.every(l=>l.periodNumbers===null)));
  }
  for(const practical of donga.filter(p=>p.subject==='실과')) {
    assert.equal(practical.lessons.reduce((n,l)=>n+(l.suggestedPeriods||0),0),64);
    assert.ok(practical.lessons.every(l=>l.semester===null));
    assert.ok(practical.lessons.filter(l=>l.sharedPeriodWith).every(l=>l.suggestedPeriods===null&&practical.lessons.some(prior=>prior.id===l.sharedPeriodWith)));
  }
  const art4=(await call('?academicYear=2026&grade=4')).data.editions.find(e=>e.publisher==='동아출판'&&e.subject==='미술');
  assert.equal(art4.plans.length,2);
  assert.equal((await call('/plans/'+art4.plans[0].id)).data.plan.grade,4);
  const ybm=allPlans.filter(p=>p.publisher==='와이비엠');
  const music4=ybm.find(p=>p.subject==='음악'&&p.grade===4);
  assert.ok(music4.lessons.find(l=>l.topic==='고기잡이').unit.startsWith('2.'));
  assert.ok(music4.lessons.find(l=>l.topic==='꿈의 나침반').unit.startsWith('4.'));
  for(const p of ybm.filter(p=>p.subject==='음악')) {
    assert.equal(p.lessons.reduce((n,l)=>n+l.suggestedPeriods,0),68);
    assert.ok(p.lessons.every(l=>l.periodNumbers===null&&l.semester===null));
  }
  for(const p of ybm.filter(p=>p.subject==='수학')) assert.equal(p.lessons.reduce((n,l)=>n+(l.suggestedPeriods||0),0),64);
  const ybmMath=ybm.filter(p=>p.subject==='수학');
  assert.equal(ybmMath.length,8);
  const math52=ybmMath.find(p=>p.grade===5&&p.semester===2);
  assert.equal(math52.lessons[32].sourcePage,5);
  assert.equal(math52.lessons[33].sourcePage,6);
  assert.deepEqual(math52.lessons.map(l=>l.periodNumbers[0]),Array.from({length:64},(_,i)=>i+1));
  assert.equal(math52.lessons[33].topic,'3. (자연수)×(소수)를 계산해요(1)');
  assert.equal(math52.lessons[63].pages,'160~161');
  const math61=ybmMath.find(p=>p.grade===6&&p.semester===1);
  assert.equal(math61.lessons.find(l=>l.periodNumbers.includes(55)).topic,'3. 부피의 단위 1m³를 알아봐요');
  const klassmon=allPlans.filter(p=>p.id.startsWith('klassmon-'));
  const artculture=allPlans.filter(p=>p.publisher==='아트앤컬처');
  const didim=allPlans.filter(p=>p.publisher==='디딤돌교육');
  assert.equal(didim.length,8);
  for(const p of didim) {
    assert.equal(p.lessons.reduce((n,l)=>n+l.suggestedPeriods,0)+p.withheldUnits.reduce((n,u)=>n+u.periods,0),64);
    assert.ok(p.lessons.every(l=>l.pages===null&&l.standardCodes.length===0&&l.standardMappingScope==='unit'&&l.originalSha256.length===64));
  }
  const didim51=didim.find(p=>p.grade===5&&p.semester===1);
  assert.equal(didim51.withheldUnits.length,0);
  const didim51Fixed=didim51.lessons.filter(l=>l.unit.startsWith('5.')&&l.sourceCorrections.length);
  assert.equal(didim51Fixed.length,6);
  assert.ok(didim51Fixed.every(l=>l.sourceCorrections[0].sourcePage===290&&l.topic.startsWith('분수의')));
  const didim31Fixed=didim.find(p=>p.grade===3&&p.semester===1).lessons.filter(l=>l.sourceCorrections.length);
  assert.equal(didim31Fixed.length,3);
  assert.ok(didim31Fixed.every(l=>l.sourceCorrections[0].sourcePage===133&&l.topic.includes('−')&&l.sourceCells[2].includes('+')));
  assert.equal(didim51.lessons.find(l=>l.topic==='마름모의 넓이를 구해 볼까요').sourcePage,147);
  assert.equal(artculture.length,4);
  for(const p of artculture) {
    assert.equal(p.lessons.reduce((n,l)=>n+l.suggestedPeriods,0),68);
    assert.ok(p.lessons.every(l=>l.periodNumbers===null&&l.semester===null&&l.periodBasis==='allocation'));
    assert.equal(p.lessons.filter(l=>l.unitKind==='project').reduce((n,l)=>n+l.suggestedPeriods,0),4);
  }
  const art6Building=artculture.find(p=>p.grade===6).lessons.filter(l=>l.unitNumber===11);
  assert.equal(art6Building.length,1);
  assert.equal(art6Building[0].suggestedPeriods,6);
  for(const a of require('../references/textbooks/assessment-index-artculture-2022.json').assessments) {
    assert.ok(a.lessonIds.length>0);
    assert.ok(a.lessonIds.every(id=>artculture.some(p=>p.grade===a.grade&&p.editionId===a.editionId&&p.lessons.some(l=>l.id===id&&l.unitNumber===a.unitNumber))));
  }
  const artRubrics=require('../references/textbooks/assessment-content-artculture-2022.json').assessments;
  assert.equal(artRubrics.length,48);
  assert.equal(artRubrics.reduce((n,a)=>n+a.stages.length,0),120);
  for(const a of artRubrics){
    assert.equal(require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(path.resolve(__dirname,'../references/textbooks/raw',a.sourceFile))).digest('hex'),a.sha256);
    assert.ok(a.standardCodes.length>0);
    for(const stage of a.stages){
      assert.deepEqual(stage.rubric.map(r=>r.level),['상','중','하']);
      for(const field of [stage.objective,stage.elements,stage.method,...stage.rubric]){
        assert.ok(field.text&&field.sourceRect.length===4&&field.sourceRect[0]>=0&&field.sourceRect[1]>=0);
        assert.equal(field.sourcePage,1);
      }
    }
  }
  assert.equal(klassmon.length,10);
  assert.ok(klassmon.every(p=>p.semester===null&&p.originalSha256.length===64&&p.scheduleCompleteness==='annual-file-comparison-pending'));
  for(const p of klassmon.filter(p=>p.subject==='체육')) assert.equal(p.lessons.reduce((n,l)=>n+l.suggestedPeriods,0),102);
  const practical5=klassmon.find(p=>p.grade===5&&p.subject==='실과');
  assert.equal(practical5.lessons[0].sourceCells[2],'차시');
  assert.deepEqual(practical5.lessons[0].periodNumbers,[1,2,3]);
  assert.equal(practical5.lessons.reduce((n,l)=>n+l.suggestedPeriods,0),66);
  for(const p of ybm.filter(p=>p.subject==='사회'&&p.format!=='official-ebook-outline')) assert.ok(p.lessons.every(l=>l.sourcePage<=8));
  const ybmOnline=ybm.filter(p=>p.format==='official-ebook-outline');
  assert.equal(ybmOnline.length,3);
  for(const p of ybmOnline){
    const bytes=require('node:fs').readFileSync(path.resolve(__dirname,'../references/textbooks',p.sourceFile));
    assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'),p.sha256);
    const original=JSON.parse(bytes);
    assert.equal(p.lessons.reduce((n,l)=>n+l.suggestedPeriods,0),48);
    for(const l of p.lessons){
      assert.deepEqual(l.sourcePointer.split('/').slice(1).reduce((v,k)=>v[k],original),l.sourceCells.slice(2));
      assert.equal(l.pages,null);
    }
  }
  for(const grade of [3,4])assert.deepEqual(ybm.filter(p=>p.subject==='사회'&&p.grade===grade).map(p=>p.semester).sort(),[1,2]);
  const ybmPe=ybm.filter(p=>p.subject==='체육');
  assert.equal(ybmPe.length,8);
  for(const grade of [3,4,5,6]) {
    assert.equal(ybmPe.filter(p=>p.grade===grade).flatMap(p=>p.lessons).reduce((n,l)=>n+l.suggestedPeriods,0),102);
  }
  const pe3first=ybmPe.find(p=>p.grade===3&&p.semester===1);
  const recovered=pe3first.lessons.find(l=>l.topic.startsWith('체력을 기르는 운동 시도하기'));
  assert.equal(recovered.suggestedPeriods,3);
  assert.equal(recovered.pages,'18~19');
  assert.equal(recovered.relatedSourceRows[0].sourceRow,5);
  assert.equal(pe3first.lessons.find(l=>l.topic.includes('이동 움직임 알아보기')).unit,'01. 이동하며 움직여요');
  assert.equal(ybmPe.find(p=>p.grade===4&&p.semester===2).lessons[0].unit,'02. 운동을 규칙적으로 실천해요');
  const ybmPractical=ybm.filter(p=>p.subject==='실과');
  assert.equal(ybmPractical.length,2);
  for(const p of ybmPractical) {
    assert.equal(p.semester,null);
    assert.equal(p.lessons.reduce((n,l)=>n+(l.suggestedPeriods||0),0),64);
    assert.ok(p.lessons.filter(l=>l.sharedPeriodWith).every(l=>l.suggestedPeriods===null&&p.lessons.some(prior=>prior.id===l.sharedPeriodWith&&prior.unit===l.unit)));
  }
  const ybmMusic=data.editions.find(e=>e.publisher==='와이비엠'&&e.subject==='음악');
  const english=ybm.filter(p=>p.subject==='영어');
  assert.equal(english.length,8);
  for(const p of english) {
    const author=catalog.editions.find(e=>e.id===p.editionId).leadAuthor;
    const hours=p.lessons.reduce((n,l)=>n+l.suggestedPeriods,0);
    assert.equal(hours,p.grade>=5?84:(author==='최희경'&&p.grade===4?60:58));
    assert.ok(p.lessons.every(l=>l.granularity==='unit'&&l.periodNumbers===null));
  }
  const sports=allPlans.filter(p=>p.publisher==='체육과건강');
  const musiclife=allPlans.filter(p=>p.publisher==='음악과생활');
  assert.equal(musiclife.length,4);
  for(const grade of [5,6]) {
    const lessons=musiclife.filter(p=>p.grade===grade).flatMap(p=>p.lessons);
    assert.equal(lessons.reduce((n,l)=>n+l.suggestedPeriods,0),68);
    assert.ok(lessons.every(l=>l.periodBasis==='topic'));
  }
  const corrected=musiclife.filter(p=>p.grade===6).flatMap(p=>p.lessons).find(l=>l.topic==='다 함께 연주해요 ②');
  assert.equal(corrected.suggestedPeriods,2);
  assert.equal(corrected.sourceCorrections[0].original,'1~3');
  assert.equal(corrected.sourceCorrections[0].sourcePage,6);
  const musicAssessments=require('../references/textbooks/assessment-content-musiclife-2022.json').assessments;
  assert.equal(musicAssessments.length,56);
  for(const a of musicAssessments) {
    assert.ok(a.standardCodes.length>0);
    assert.deepEqual(a.rubric.map(r=>r.level),['매우 잘함','잘함','보통']);
    assert.ok(a.rubric.every(r=>r.text&&r.sourceParagraphs.length>0));
    for(const id of a.lessonIds) assert.ok(musiclife.some(p=>p.grade===a.grade&&p.editionId===a.editionId&&p.lessons.some(l=>l.id===id&&l.topic===a.title)));
  }
  const achim=allPlans.filter(p=>p.publisher==='아침나라');
  assert.equal(achim.length,12);
  for(const subject of ['음악','미술']) for(const grade of (subject==='음악'?[3,4,5,6]:[5,6])) {
    const matched=achim.filter(p=>p.subject===subject&&p.grade===grade);
    assert.equal(matched.length,2);
    assert.equal(matched.flatMap(p=>p.lessons).reduce((n,l)=>n+l.suggestedPeriods,0),68);
    if(subject==='음악') assert.ok(matched.every(p=>p.lessons.every(l=>l.periodNumbers===null&&l.periodBasis==='allocation')));
    else assert.ok(matched.every(p=>p.alternateSourceIds.length===1&&p.lessons.every(l=>l.periodBasis==='unit')));
  }
  assert.equal(achim.find(p=>p.subject==='음악'&&p.grade===3&&p.semester===1).lessons.find(l=>l.topic==='구슬비').suggestedPeriods,2);
  const achimEdition=data.editions.find(e=>e.publisher==='아침나라'&&e.subject==='미술');
  assert.equal(achimEdition.plans.length,2);
  assert.equal((await call('/plans/'+achimEdition.plans[0].id)).data.plan.grade,5);
  assert.equal(sports.length,8);
  for(const grade of [3,4,5,6]) {
    const lessons=sports.filter(p=>p.grade===grade).flatMap(p=>p.lessons);
    assert.equal(lessons.reduce((n,l)=>n+(l.suggestedPeriods||0),0),grade===4?101:102);
    assert.ok(lessons.every(l=>l.periodBasis==='domain'));
  }
  const missing=sports.flatMap(p=>p.lessons).filter(l=>l.reviewStatus==='source-period-missing');
  assert.equal(missing.length,1);assert.equal(missing[0].sourceRow,39);assert.equal(missing[0].suggestedPeriods,null);
  const assessments=require('../references/textbooks/assessment-index-sports-2022.json').assessments;
  assert.equal(assessments.length,122);
  assert.equal(assessments.filter(a=>a.matchStatus==='needs-content-review').length,1);
  assert.equal(assessments.filter(a=>a.matchStatus.startsWith('body-reviewed-')).length,3);
  for(const a of assessments) for(const id of a.lessonIds) {
    const p=sports.find(p=>p.lessons.some(l=>l.id===id));
    const l=p.lessons.find(l=>l.id===id);
    assert.equal(p.grade,a.grade);assert.equal(p.editionId,a.editionId);
    assert.equal(l.domain,a.domain);
    if(a.matchStatus.startsWith('body-reviewed-')){
      const review=require('../references/textbooks/sports-assessment-match-review.json').reviews.find(r=>r.id===a.id);
      assert.ok(review.lessonIds.includes(id));assert.equal(review.evidence,a.matchEvidence);
    }else assert.equal(l.topic,a.title);
    assert.ok(l.periodNumbers.some(n=>a.periodNumbers.includes(n)));
  }
  const sportsContent=require('../references/textbooks/assessment-content-sports-2022.json').assessments;
  assert.equal(sportsContent.length,122);
  for(const a of sportsContent){
    assert.deepEqual(a.rubric.map(r=>r.level),['잘함','보통','노력 요함']);
    assert.ok(a.standardCodes.length&&a.objective.text&&a.method.text&&a.elements.text);
    assert.ok(a.rubric.every(r=>r.text&&r.sourceParagraphs.length));
    assert.equal(require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(path.resolve(__dirname,'../references/textbooks/raw',a.sourceFile))).digest('hex'),a.sha256);
  }
  const sportsEdition=data.editions.find(e=>e.publisher==='체육과건강');
  assert.equal(sportsEdition.plans.length,2);
  assert.equal((await call('/plans/'+sportsEdition.plans[0].id)).data.plan.grade,5);
  assert.equal(ybmMusic.plans.length,1);
  assert.equal((await call('/plans/'+ybmMusic.plans[0].id)).data.plan.grade,5);
  assert.equal(data.editions.find(e=>e.publisher==='와이비엠'&&e.subject==='수학').plans.length,2);
  console.log('PASS: school/year/grade isolation, author editions, national deduplication, authorization, invalid selection, stale writes, pacing provenance');
 } finally{await h.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});

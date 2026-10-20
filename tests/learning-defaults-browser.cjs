const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const express=require('../game-hub-server/node_modules/express');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const {schoolDefaults}=require('../game-hub-server/school-affiliation');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'game-hub-server/server.js'),'utf8');
const inject=new Function(source.slice(source.indexOf('function siteIdentityTag('),source.indexOf('\nfunction sendSiteHtml'))+';return withSiteIdentity;')();
let identity={},scope={homeroomGrade:null,pairs:[{grade:3,subject:'국어'},{grade:6,subject:'국어'}]};
const app=express(),requests=[];
app.use('/api',(req,res)=>{
  requests.push(req.originalUrl);
  const url=req.path;
  if(url==='/auth/me')return res.json({signedIn:true,isTeacher:true,user:{id:1,role:'teacher'}});
  if(url==='/learning-records/context')return res.json({mode:'preview'});
  if(url==='/teacher/assessment-plans/scope')return res.json(scope);
  if(url==='/teacher/assessment-plans')return res.json({items:[],canEdit:true});
  if(url==='/teacher/available-classes')return res.json({classes:[
    {id:1,grade:3,classNumber:1,isMyTeaching:true,myTeachingSubjects:['국어']},
    {id:2,grade:6,classNumber:1,isMyTeaching:true,myTeachingSubjects:['국어']}]});
  if(url.startsWith('/me/storage/'))return res.json({items:{},persistent:false});
  if(url==='/teacher/class')return res.json({classroom:{students:[]}});
  return res.json({sessions:[],groups:[],plans:[],topics:[],items:[]});
});
app.use((req,res,next)=>{
  const requested=req.path.startsWith('/classtools/')?'/apps'+req.path:req.path;
  let file=path.resolve(root,'.'+decodeURIComponent(requested));
  if(!file.startsWith(root+path.sep))return next();
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(fs.existsSync(file)&&file.endsWith('.html'))return res.type('html').send(inject(fs.readFileSync(file,'utf8'),identity));
  next();
});
app.use('/classtools',express.static(path.join(root,'apps/classtools')));
app.use(express.static(root));
(async()=>{
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const results=[],errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1366,height:768},timezoneId:'America/Los_Angeles'});
  page.on('pageerror',error=>errors.push(error.message));
  const base=`http://127.0.0.1:${server.address().port}`;
  await page.clock.setFixedTime(new Date('2026-10-20T12:00:00+09:00'));
  for(const [school,grade,expected] of [['초등학교',6,'6-2'],['중학교',2,'8-2'],['고등학교',1,'10-2'],['고등학교',3,'10-2']]){
   identity={kind:'student',...schoolDefaults({schoolName:'검증'+school,grade})};
   await page.goto(base+'/learning/literacy-numeracy/math-bank/');
   await page.waitForFunction(()=>document.querySelector('#termSelect').options.length>0);
   assert.equal(await page.locator('#termSelect').inputValue(),expected);results.push({area:'math',school,grade,expected});
  }
  identity={kind:'teacher',...schoolDefaults({school_name:'가초등학교',teaching_scope:scope.pairs})};
  await page.goto(base+'/learning/literacy-numeracy/math-bank/?term=3-1');
  await page.waitForFunction(()=>document.querySelector('#termSelect').options.length>0);
  assert.equal(await page.locator('#termSelect').inputValue(),'3-1');
  await page.locator('#termSelect').selectOption('4-2');
  await page.waitForFunction(()=>location.search.includes('unit=4-2-'));
  assert.equal(await page.locator('#termSelect').inputValue(),'4-2');results.push({area:'math',case:'explicit-and-manual'});
  for(const [query,expected] of [['','초6'],['?grade=초3','초3'],['?school=middle','전체']]){
   await page.goto(base+'/learning/inquiry/science-lab/'+query);
   assert.equal(await page.locator('[data-grade][aria-pressed="true"]').getAttribute('data-grade'),expected);
   results.push({area:'science',query,expected});
  }
  await page.goto(base+'/learning/inquiry/science-lab/');
  await page.locator('[data-grade="전체"]').click();
  assert.equal(await page.locator('[data-grade="전체"]').getAttribute('aria-pressed'),'true');
  results.push({area:'science',case:'manual-all'});
  for(const [date,year,semester] of [
   ['2026-02-14T23:59:59+09:00','2025','2'],['2026-02-15T00:00:00+09:00','2026','1'],
   ['2026-08-14T23:59:59+09:00','2026','1'],['2026-08-15T00:00:00+09:00','2026','2']]){
   await page.clock.setFixedTime(new Date(date));
   await page.goto(base+'/classtools/assessment-plan/plan.html');
   await page.waitForFunction(()=>document.querySelector('#subject-select').options.length>0);
   assert.equal(await page.locator('#grade-select').inputValue(),'6');
   assert.equal(await page.locator('#year-select').inputValue(),year);
   assert.equal(await page.locator('#semester-select').inputValue(),semester);
   results.push({area:'assessment',date,year,semester});
  }
  await page.locator('#grade-select').selectOption('3');
  await page.locator('#semester-select').selectOption('1');
  assert.equal(await page.locator('#grade-select').inputValue(),'3');
  assert.equal(await page.locator('#semester-select').inputValue(),'1');
  results.push({area:'assessment',case:'manual'});
  await page.clock.setFixedTime(new Date('2026-02-14T23:59:59+09:00'));
  await page.goto(base+'/classtools/record-ai.html');
  await page.waitForFunction(()=>document.querySelector('#scope-select')?.options.length>1);
  assert.equal(await page.locator('#scope-select').inputValue(),'1');
  assert.equal(await page.locator('#semester-select').inputValue(),'2학기');
  results.push({area:'record-ai',case:'highest-teaching-grade-and-semester'});
  await page.goto(base+'/apps/schooladmin/index.html');
  await page.waitForFunction(()=>document.querySelector('#curriculumGradeSelect').value==='6');
  for(const id of ['curriculumGradeSelect','timetableGradeSelect','annualTimetableGradeSelect']){
   assert.equal(await page.locator('#'+id).inputValue(),'6');
  }
  results.push({area:'schooladmin',case:'highest-grade-in-three-filters'});
  assert.deepEqual(errors,[]);
  const out=path.join(root,'outputs/qa/learning-defaults');fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({results,errors},null,2));
  console.log(JSON.stringify({checks:results.length,errors}));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

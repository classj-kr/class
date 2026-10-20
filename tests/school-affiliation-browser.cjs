const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const express=require('../game-hub-server/node_modules/express');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const {schoolDefaults}=require('../game-hub-server/school-affiliation');
const root=path.resolve(__dirname,'..'),out=path.join(root,'outputs/qa/school-affiliation');fs.mkdirSync(out,{recursive:true});
const serverSource=fs.readFileSync(path.join(root,'game-hub-server/server.js'),'utf8');
const start=serverSource.indexOf('function siteIdentityTag('),end=serverSource.indexOf('\nfunction sendSiteHtml',start);
const inject=new Function(`${serverSource.slice(start,end)};return withSiteIdentity;`)();
let identity={};
const app=express();app.use((req,res,next)=>{
 let file=path.resolve(root,'.'+decodeURIComponent(req.path));if(!file.startsWith(root+path.sep))return next();
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(file.endsWith('.html')&&fs.existsSync(file))return res.type('html').send(inject(fs.readFileSync(file,'utf8'),identity));next();
});app.use(express.static(root));
(async()=>{
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
 const base=`http://127.0.0.1:${server.address().port}/learning/inquiry/`,results=[];
 try{
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const scenarios=[['초등학교','student','elementary',6],['중학교','teacher','middle',1],['고등학교','teacher','high',2]];
 for(const [school,kind,expected,grade] of scenarios){
  identity={name:'검증',kind,...schoolDefaults({schoolName:'검증'+school,grade})};
  for(const area of ['globe','korea-map','human-body','space','periodic-table','science-lab']){
   await page.goto(base+area+'/');
   const selector=area==='science-lab'?'[data-school-filter][aria-pressed="true"]':'.school-level [data-school][aria-pressed="true"]';
   await page.locator(selector).waitFor();
   const actual=await page.locator(selector).getAttribute(area==='science-lab'?'data-school-filter':'data-school');
   assert.equal(actual,area==='science-lab'&&expected==='high'?'high-elective':expected,area+' '+school);results.push({area,kind,expected,actual});
   if(area==='globe')cp.execFileSync('python',['-c','import sys,io;from PIL import Image;Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],"WEBP",lossless=True)',path.join(out,expected+'.webp')],{input:await page.screenshot(),windowsHide:true});
  }
 }
 // A request for another school level is deliberate and survives navigation.
 identity={name:'초등교사',kind:'teacher',...schoolDefaults({schoolName:'검증초등학교',grade:3})};
 await page.goto(base+'human-body/?school=high');assert.equal(await page.locator('[data-school="high"][aria-pressed="true"]').count(),1);
 await page.locator('.hub-card[href*="immune"]').click();await page.locator('.school-level [data-school="high"][aria-pressed="true"]').waitFor();results.push({case:'explicit-level-and-child-link',actual:'high'});
 await page.goto(base+'space/');await page.locator('.school-level [data-school="high"]').click();assert.equal(new URL(page.url()).searchParams.get('school'),'high');results.push({case:'manual-override',actual:'high'});
 // The first availability guard must use the same default as the later picker.
 identity={name:'고등학생',kind:'student',...schoolDefaults({schoolName:'검증고등학교',grade:1})};
 await page.goto(base+'human-body/immune/');await page.locator('.school-level [data-school="high"][aria-pressed="true"]').waitFor();assert.ok(new URL(page.url()).pathname.endsWith('/immune/'));results.push({case:'direct-high-only-topic',actual:'high'});
 await page.goto(base+'science-lab/');assert.equal(await page.locator('[data-school-filter="high-common"]').getAttribute('aria-pressed'),'true');results.push({case:'high-grade-1',actual:'high-common'});
 identity={name:'초등학생',kind:'student',...schoolDefaults({schoolName:'검증초등학교',grade:2})};
 await page.goto(base+'human-body/skeleton/');await page.locator('.school-level [data-school="elementary"][aria-pressed="true"]').waitFor();assert.ok(new URL(page.url()).pathname.endsWith('/skeleton/'));results.push({case:'direct-primary-only-topic',actual:'elementary'});
 // Same browser, next account: there must be no persisted previous selection.
 await page.setViewportSize({width:768,height:1024});await page.goto(base+'globe/');await page.locator('.school-level [data-school="elementary"][aria-pressed="true"]').waitFor();results.push({case:'account-switch-tablet',actual:'elementary'});
 await page.goto(base+'science-lab/?school=middle');assert.equal(await page.locator('[data-school-filter="middle"]').getAttribute('aria-pressed'),'true');results.push({case:'science-explicit-link',actual:'middle'});
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({checks:results.length,errors}));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

// Actual responsive pages, including all source-specific restored experiments.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),slugs=Object.keys(require(path.join(root,'curriculum-map.js')));
const out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'tmp/science-presentation'),engine=process.argv.includes('--webkit')?'webkit':'chromium';
const selected=process.argv.find(x=>x.startsWith('--slugs='))?.slice(8).split(',')||slugs;
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(file!==root&&!file.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',{'.js':'text/javascript','.css':'text/css','.html':'text/html; charset=utf-8','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser,cursor=0;const reports=[];
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  await Promise.all(Array.from({length:3},async()=>{
   const page=await browser.newPage({viewport:{width:1024,height:900},hasTouch:true});let report;
   page.on('pageerror',e=>report?.errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
   while(cursor<selected.length){const slug=selected[cursor++];report={slug,errors:[],layouts:[],shots:[]};reports.push(report);
    try{
     await page.goto('http://127.0.0.1:'+server.address().port+'/'+slug+'/');await page.waitForLoadState('networkidle');
     for(const width of [1024,390,320]){
      await page.setViewportSize({width,height:900});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      const layout=await page.evaluate(()=>{
       const visible=e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height&&!e.closest('[hidden]');
       return{overflow:document.documentElement.scrollWidth>innerWidth+1,sharedStyle:!!document.querySelector('link[href*="lab-ui.css"]'),sharedScript:!!document.querySelector('script[src*="lab-ui.js"]'),resultInControls:!!document.querySelector('.control-panel .result-box'),smallControls:[...document.querySelectorAll('.control-panel button,.toolbar button,.quiz-heading')].filter(visible).filter(e=>e.getBoundingClientRect().height<43).map(e=>e.textContent.trim()),invalid:/\bNaN\b|\bundefined\b/.test(document.body.innerText)};
      });report.layouts.push({width,...layout});
      if(engine==='chromium'&&width===390){
       const stage=page.locator('.stage-views,.inquiry-scene,.scene,.comparison,.element-board,.structure-scene,.evidence-scene,.sensor-scene').first();
       const target=await stage.count()?stage:page.locator('.experiment-layout,.desktop-layout,.curriculum-supplement').first();
       const file=slug+'-mobile.webp';await require('../tests/science-screenshot.cjs')(target,path.join(out,file));report.shots.push(file);
      }
     }
    }catch(e){report.errors.push(e.message);}
    console.log(engine+' '+slug+': '+report.errors.length+' errors');
   }
   await page.close();
  }));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
 const reportFile=path.join(out,'presentation-'+engine+'.json');
 if(selected.length!==slugs.length&&fs.existsSync(reportFile))reports.push(...JSON.parse(fs.readFileSync(reportFile)).reports.filter(r=>!selected.includes(r.slug)));
 reports.sort((a,b)=>slugs.indexOf(a.slug)-slugs.indexOf(b.slug));
 const failures=reports.filter(r=>r.errors.length||r.layouts.some(l=>l.overflow||!l.sharedStyle||!l.sharedScript||l.resultInControls||l.smallControls.length||l.invalid));
 const summary={engine,apps:reports.length,layouts:reports.reduce((n,r)=>n+r.layouts.length,0),failures,reports};
 fs.writeFileSync(reportFile,JSON.stringify(summary,null,2));
 console.log(JSON.stringify({engine,apps:summary.apps,layouts:summary.layouts,failures}));if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});

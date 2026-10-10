// Audit visible supplementary panels across the entire science catalog.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const screenshotWebp=require('../tests/science-screenshot.cjs');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
const map=require(path.join(root,'curriculum-map.js'));
const output=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'tmp/science-panel-visuals');
const engine=process.argv.includes('--webkit')?'webkit':'chromium';
const requiredOnly=process.argv.includes('--required-only');
const selected=process.argv.find(a=>a.startsWith('--slugs='))?.slice(8).split(',')||Object.keys(map);
const required=require(path.join(root,'required-experiments.js')).requiredExperimentModels();
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(error,bytes)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream');res.end(bytes);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser,cursor=0;const apps=[],shots=[];
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  await Promise.all(Array.from({length:2},async()=>{
   const page=await browser.newPage({viewport:{width:1024,height:900},hasTouch:true});let report;
   page.on('pageerror',e=>report?.errors.push(e.message));
   await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
   const capture=async(slug,id,variant,selector)=>{
    const panel=page.locator(selector);await panel.scrollIntoViewIfNeeded();
    await page.evaluate(()=>document.fonts.ready);
    const info=await panel.evaluate(element=>{
     const visible=e=>!!e&&getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0&&!e.closest('[hidden]');
     const text=element.querySelector('.supplement-observation,.required-observation');
     const drawings=[...element.querySelectorAll('svg path,svg rect,svg circle,svg ellipse,svg polygon,svg polyline,svg line,svg image')].filter(e=>!e.closest('defs')&&visible(e));
     const clipped=[];for(const svg of element.querySelectorAll('svg')){const b=svg.getBoundingClientRect();for(const t of svg.querySelectorAll('text')){if(!visible(t))continue;const a=t.getBoundingClientRect();if(a.left<b.left-2||a.right>b.right+2||a.top<b.top-2||a.bottom>b.bottom+2)clipped.push(t.textContent);}}
     return{title:element.querySelector('h2')?.textContent,text:text?.textContent||'',observationVisible:visible(text),drawings:drawings.length,photos:[...element.querySelectorAll('img')].map(e=>({src:e.getAttribute('src'),loaded:e.complete&&e.naturalWidth>0})),clippedLabels:clipped,overflow:element.scrollWidth>element.clientWidth+2,state:window.__scienceSupplement?.getState(),controlLabels:[...element.querySelectorAll('button[aria-pressed=true],select')].map(e=>e.tagName==='SELECT'?e.selectedOptions[0]?.textContent:e.textContent)};
    });
    const file=`${slug}-${id}-${variant}-${engine}.webp`;await screenshotWebp(panel,path.join(output,file));
    const shot={slug,id,variant,file,...info};shots.push(shot);if(!info.observationVisible||!info.text||info.overflow||info.clippedLabels.length||info.photos.some(p=>!p.loaded))report.findings.push(shot);
   };
   while(cursor<selected.length){const slug=selected[cursor++];report={slug,errors:[],findings:[],supplement:false,experiments:0};apps.push(report);
    try{
     await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`);await page.waitForLoadState('networkidle');
     if(!requiredOnly&&await page.locator('.curriculum-supplement').count()){
      report.supplement=true;const selector='.curriculum-supplement';
      const paths=await page.locator('[data-supplement-choice="pathway"]').evaluateAll(es=>es.map(e=>e.dataset.value));
      for(const pathway of paths.length?paths:['only']){
       await page.locator('.supplement-reset').click();if(pathway!=='only')await page.locator(`[data-supplement-choice="pathway"][data-value="${pathway}"]`).click();
       await capture(slug,'supplement',pathway+'-initial',selector);
       const controls=await page.locator('[data-supplement-choice]:not([data-supplement-choice="pathway"])').evaluateAll(es=>es.map(e=>({key:e.dataset.supplementChoice,value:e.dataset.value})));
       // Compare every category option while retaining a known baseline for other fields.
       for(const choice of controls){
        await page.locator('.supplement-reset').click();if(pathway!=='only')await page.locator(`[data-supplement-choice="pathway"][data-value="${pathway}"]`).click();
        const button=page.locator(`[data-supplement-choice="${choice.key}"][data-value="${choice.value}"]`);if(!await button.count())continue;await button.click();
        await capture(slug,'supplement',pathway+'-'+choice.key+'-'+choice.value,selector);
       }
       await page.evaluate(()=>{const keys=[...new Set([...document.querySelectorAll('[data-supplement-choice]')].map(e=>e.dataset.supplementChoice))].filter(k=>k!=='pathway');for(const key of keys)[...document.querySelectorAll(`[data-supplement-choice="${key}"]`)].at(-1)?.click();});
       await capture(slug,'supplement',pathway+'-combined-last',selector);
      }
     }
     for(const spec of required[slug]||[]){report.experiments++;await page.locator(`[data-experiment="${spec.id}"]`).click();await page.locator('.required-experiments [data-reset]').click();await capture(slug,spec.id,'initial','.required-experiments');
      await page.evaluate(()=>{const keys=[...document.querySelectorAll('[data-required-field]')].map(e=>e.dataset.requiredField);for(const key of keys){const field=document.querySelector(`[data-required-field="${key}"]`);field.value=field.options[field.options.length-1].value;field.dispatchEvent(new Event('change',{bubbles:true}));}});
      await capture(slug,spec.id,'changed','.required-experiments');
     }
    }catch(error){report.errors.push(error.message);}
    console.log(`${engine} ${slug}: ${report.supplement?'supplement, ':''}${report.experiments} experiments, ${report.findings.length} visual flags, ${report.errors.length} errors`);
   }
   await page.close();
  }));
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
 if(requiredOnly){const previous=JSON.parse(fs.readFileSync(path.join(output,'inventory-'+engine+'.json'),'utf8'));shots.push(...previous.shots.filter(s=>s.id==='supplement'));for(const app of apps){const old=previous.reports.find(r=>r.slug===app.slug);app.supplement=old?.supplement||false;app.findings.push(...(old?.findings||[]).filter(s=>s.id==='supplement'));}}
 const summary={engine,apps:apps.length,supplements:apps.filter(a=>a.supplement).length,experiments:apps.reduce((s,a)=>s+a.experiments,0),screenshots:shots.length,errors:apps.flatMap(a=>a.errors.map(error=>({slug:a.slug,error}))),findings:apps.flatMap(a=>a.findings),reports:apps,shots:shots.sort((a,b)=>a.slug.localeCompare(b.slug)||a.id.localeCompare(b.id)||a.variant.localeCompare(b.variant))};
 fs.writeFileSync(path.join(output,'inventory-'+engine+'.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({apps:summary.apps,supplements:summary.supplements,experiments:summary.experiments,screenshots:shots.length,errors:summary.errors.length,flags:summary.findings.length}));
 if(summary.errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});

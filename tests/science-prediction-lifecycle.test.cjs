const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),map=require(path.join(root,'curriculum-map.js'));
// Deliberately seeds an old result: this is a lifecycle regression, not a scientific-accuracy audit.
for(const engine of ['chromium','webkit'])test(`${engine}: every app clears obsolete predictions and quiz verdicts`,{timeout:240000},async()=>{
 let browser;const failures=[],errors=[];let predictions=0,quizzes=0,rebuilt=0;
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(file)]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{})});
 const slugs=process.env.SCIENCE_SLUGS?.split(',')||Object.keys(map);let cursor=0;
 await Promise.all(Array.from({length:3},async()=>{const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());page.on('pageerror',e=>errors.push(e.message));
 while(cursor<slugs.length){const slug=slugs[cursor++];await page.goto('http://127.0.0.1:'+server.address().port+'/'+slug+'/');const result=await page.evaluate(async(probeLift)=>{
  const issues=[],visible=e=>!!e&&!!e.getClientRects().length&&!e.closest('[hidden]');let p=0,q=0,r=0;
  const models=Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model')).map(k=>window[k]);
  const btn=[...document.querySelectorAll('[data-prediction]')].find(visible),feedback=document.getElementById('predictionResult'),content=document.getElementById('resultContent');
  if(btn&&feedback&&content){p++;content.hidden=false;feedback.textContent='예전 예상은 맞았습니다.';feedback.dataset.correct='true';for(const m of models)if(m.state&&typeof m.state==='object'&&'checked'in m.state)m.state.checked=true;btn.click();if(!content.hidden||feedback.textContent||feedback.dataset.correct)issues.push('obsolete prediction verdict remains');for(const m of models)if(m.state?.checked)issues.push('continuous rendering can restore obsolete verdict');
   const setting=document.querySelector('#controlArea [data-pick] button:not(.selected)');if(setting){setting.click();if(!document.querySelector('[data-prediction].selected'))for(const m of models){if(m.state&&typeof m.state==='object'&&'prediction'in m.state){r++;if(m.state.prediction!==null)issues.push('invisible prediction retained after question rebuilt');}}}
  }
  for(const card of document.querySelectorAll('.quiz-card')){const choices=[...card.querySelectorAll('input[type=radio]')];if(choices.length<2)continue;const right=choices.find(i=>i.value===card.dataset.answer)||choices[0];right.click();card.querySelector('.answer-button')?.click();const result=card.querySelector('.answer-result');if(!result?.textContent.trim())continue;q++;const other=choices.find(i=>i!==right&&!i.disabled);if(!other)continue;other.click();if(result.textContent.trim()||card.dataset.state||card.querySelector('.answer-explanation')?.hidden===false)issues.push('quiz '+q+' retains old grade after answer change');}
  if(probeLift){
   const readout=document.getElementById('stageReadout'),note=document.getElementById('stageNote'),verdict=document.getElementById('stageVerdict');
   for(const e of [readout,note,verdict])if(e)e.textContent='obsolete-condition-sentinel';
   for(const id of ['mainGroup','graphGroup'])document.getElementById(id)?.replaceChildren(document.createElementNS('http://www.w3.org/2000/svg','g'));
   await Promise.resolve();await Promise.resolve();
   for(const e of [readout,note,verdict])if(e?.textContent.includes('obsolete-condition-sentinel'))issues.push('lifted SVG prose survives a new empty drawing');
  }
  return{issues,p,q,r};
 },fs.existsSync(path.join(root,slug,'app.js'))&&fs.readFileSync(path.join(root,slug,'app.js'),'utf8').includes('new MutationObserver(run)'));predictions+=result.p;quizzes+=result.q;rebuilt+=result.r;if(result.issues.length)failures.push({slug,issues:result.issues});if(cursor%20===0)console.log(engine,cursor+'/'+slugs.length);}
 await page.close();}));
 console.log(JSON.stringify({engine,apps:slugs.length,predictions,quizzes,rebuilt,failures}));assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});

const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {test}=require('node:test');
const base=path.resolve(__dirname,'../learning/inquiry/science-lab');
const factory=require(path.join(base,'supplement-core.js'));
const helpers={line:(a,b,c,d,color='gray',width=4)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${color}" stroke-width="${width}"/>`,label:(text,x,y,color='black',size=16)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}">${text}</text>`,rect:(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`,jar:(x,h,c)=>`<rect x="${x}" y="${230-h}" width="110" height="${h}" fill="${c}"/>`,field:(key,title,items)=>({key,title,items:items.map(([value,text])=>({value,text}))})};
const specs=factory(helpers),map=require(path.join(base,'curriculum-map.js'));
function states(spec){const seen=new Set(),pending=[{...spec.initial}],result=[];while(pending.length){const s=pending.pop(),fields=typeof spec.fields==='function'?spec.fields(s):spec.fields;for(const f of fields)if(!f.items.some(x=>x.value===s[f.key]))s[f.key]=f.items[0].value;const key=JSON.stringify(s);if(seen.has(key))continue;seen.add(key);result.push({state:s,fields});for(const f of fields)for(const o of f.items)pending.push({...s,[f.key]:o.value});}return result;}
test('23 repaired common-curriculum paths have source evidence and observation checks in every state',()=>{
 const reviews=require('../docs/science-lab-audit-2026-09-20/required-core-review.cjs');
 assert.equal(Object.keys(specs).length,23);assert.deepEqual(reviews.map(r=>r.slug).sort(),Object.keys(specs).sort());
 const source=fs.readFileSync(path.resolve(base,'../../../references/moe/2022-revised-curriculum/extracted/09-science.txt'),'utf8');let count=0;
 for(const[slug,spec]of Object.entries(specs)){
  assert(!map[slug].grade.startsWith('고2')&&!map[slug].grade.startsWith('고3'));
  for(const c of spec.codes){assert(source.includes('['+c+']'),c);assert(map[slug].codes.includes(c),slug+': missing map code '+c);assert(!c.startsWith('12'));}
  for(const{state:s}of states(spec)){const r=spec.view(s);assert(r.svg&&r.text&&r.note&&r.check,slug);assert(!/NaN|undefined/.test(JSON.stringify(r)),slug);assert.equal(r.check.choices.length,3);assert(['0','1','2'].includes(r.check.answer));assert(r.check.why.length>10);count++;}
 }
 console.log(count+' core state/observation/check combinations verified');
});
test('independent science invariants: controls, conservation, optics, division and neutralization',()=>{
 const view=(slug,s)=>specs[slug].view({...specs[slug].initial,...s});
 assert.match(view('solubility',{kind:'solute',dose:'small'}).text,/판단할 수 없습니다/);
 assert.match(view('solubility',{kind:'float',amount:'same',water:'more'}).text,/묽어집니다/);
 assert.match(view('solubility',{kind:'float',amount:'more',water:'more'}).text,/진하기가 같습니다/);
 assert.match(view('acid-base',{material:'shell',stage:'after'}).text,/기포/);
 assert.doesNotMatch(view('acid-base',{material:'protein',stage:'after'}).text,/기포가 생/);
 assert.match(view('state-change',{kind:'condensation',stage:'after'}).text,/공기 중의 수증기/);
 for(const optic of ['plane','convexMirror','concaveMirror','convexLens','concaveLens'])for(const distance of ['near','far']){
  const r=view('refraction',{optic,distance});const expected=['concaveMirror','convexLens'].includes(optic)&&distance==='far';assert.equal(r.text.includes('거꾸로'),expected,optic+distance);
 }
 for(const kind of ['melt','boil'])for(const sample of ['A','B']){const a=view('density-buoyancy',{kind,sample,amount:'one',step:'during'}),b=view('density-buoyancy',{kind,sample,amount:'two',step:'during'});assert.equal(a.text,b.text);assert.match(a.text,/온도가 .*일정한 구간/);}
 const numberOfParticles=r=>(r.svg.match(/<circle /g)||[]).length;
 for(const phase of ['solid','liquid','gas'])assert.equal(numberOfParticles(view('diffusion',{kind:'phase',phase})),20);
 for(const gas of ['pressure','temperature'])for(const setting of ['low','normal','high'])assert.equal(numberOfParticles(view('diffusion',{kind:'gas',gas,setting})),15);
 const fall=(mass,time)=>view('motion-energy',{mass:String(mass),time:String(time)}).text;
 for(let t=0;t<=3;t++){assert.match(fall(1,t),new RegExp((t*9.8).toFixed(1)+' m/s'));assert.match(fall(2,t),new RegExp((t*9.8).toFixed(1)+' m/s'));assert.match(fall(1,t),/합 490.0 J/);assert.match(fall(2,t),/합 980.0 J/);}
 assert.match(view('weather-front',{moisture:'dry',stage:'after'}).text,/구름이 생기지/);
 assert.match(view('weather-front',{moisture:'moist',stage:'after'}).text,/이슬점/);
 for(const pole of ['N','S'])assert.match(view('energy-conversion',{moving:'none',pole}).text,/흐르지 않습니다/);
 for(const current of ['forward','reverse'])for(const pole of ['N','S']){const r=view('ohms-law',{kind:'coil',current,pole});assert.equal(r.text.includes('밀어냅니다'),(current==='forward'?'N':'S')===pole);}
 const chromosomes=(kind,step)=>(view('pea-genetics',{kind,step}).svg.match(/<line /g)||[]).length;
 assert.equal(chromosomes('mitosis','start'),8);assert.equal(chromosomes('mitosis','middle'),8);assert.equal(chromosomes('mitosis','end'),8);
 assert.equal(chromosomes('meiosis','start'),8);assert.equal(chromosomes('meiosis','middle'),8);assert.equal(chromosomes('meiosis','end'),8);
 assert.match(view('pea-genetics',{kind:'meiosis',step:'end'}).text,/염색체 수가 절반/);
 const temp=a=>Number(view('neutralization-common',{acid:String(a),stage:'after'}).text.match(/결과는 ([\d.]+) ℃/)[1]);
 assert.equal(temp(20),temp(80));assert.equal(temp(40),temp(60));assert(temp(50)>temp(40));assert(temp(40)>temp(20));
 assert.match(view('cell-membrane',{sample:'heated',stage:'after'}).text,/구조가 변/);
 assert.match(view('mass-ratio',{trial:'excess',stage:'after'}).text,/수소 1이 남습니다/);
});
test('all required observation controls, wrong/correct answers and resets work in the browser', {timeout:240000},async()=>{
 const {chromium}=require('playwright');
 const server=http.createServer((req,res)=>{let file=path.resolve(base,'.'+new URL(req.url,'http://localhost').pathname);if(file!==base&&!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css'}[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser,total=0;
 try{browser=await chromium.launch({headless:true,executablePath:process.env.SCIENCE_BROWSER||chromium.executablePath()});
  for(const[slug,spec]of Object.entries(specs)){
   const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
   try{await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`,{waitUntil:'load'});await page.locator('.curriculum-supplement').waitFor();
    const cases=states(spec).map(({state,fields})=>({state,fields:fields.map(f=>f.key),expected:spec.view(state)}));
    const checks=await page.evaluate(cases=>{const errors=[];let n=0;const section=document.querySelector('.curriculum-supplement');for(const c of cases){for(const key of c.fields){const b=section.querySelector(`[data-supplement-choice="${key}"][data-value="${c.state[key]}"]`);if(!b){errors.push('Missing '+key+':'+c.state[key]);continue;}b.click();}
      if(section.querySelector('.supplement-observation').textContent!==c.expected.text)errors.push('Observation mismatch '+JSON.stringify(c.state));
      for(const i of ['0','1','2']){section.querySelector(`[data-check-answer="${i}"]`).click();const feedback=section.querySelector('.supplement-check-feedback');if(feedback.dataset.correct!==String(i===c.expected.check.answer))errors.push('Wrong grading '+i);if(!feedback.textContent.includes(c.expected.check.why))errors.push('Missing explanation');}
      if(/NaN|undefined/.test(section.textContent))errors.push('Invalid number');n++;
     }section.querySelector('.supplement-reset').click();return{errors,n,state:window.__scienceSupplement.getState(),overflow:document.documentElement.scrollWidth>innerWidth+1};},cases);
    assert.deepEqual(checks.errors,[],slug);assert.equal(checks.overflow,false,slug);for(const[key,value]of Object.entries(spec.initial))assert.equal(checks.state[key],value,slug+' reset '+key);assert.deepEqual(errors,[],slug);total+=checks.n;
    if(process.env.SCIENCE_CAPTURE){const dir=path.resolve(base,'../../../docs/science-lab-audit-2026-09-20/required-core-screenshots');fs.mkdirSync(dir,{recursive:true});await page.locator('.curriculum-supplement').screenshot({path:path.join(dir,slug+'-mobile.png')});}
    console.log(slug+': '+checks.n+' browser states, all 3 answers + reset verified');
   }finally{await page.close();}
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
 console.log(total+' browser state cases, '+total*3+' answer checks');
});

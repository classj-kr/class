const {test}=require('node:test'),assert=require('node:assert/strict'),pw=require('playwright');
const base=process.env.SCIENCE_BASE_URL||'http://127.0.0.1:18765/learning/inquiry/science-lab/';
for(const engine of ['chromium','webkit'])test(engine+': stable choices and exact angle-dependent mineral colours',{timeout:90000},async()=>{
 const browser=await pw[engine].launch({headless:true,...engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{}}),errors=[];
 try{const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto(base+'coastal-inundation/');await page.waitForSelector('.lab-choice-group');await page.bringToFront();
  const stable=await page.evaluate(async()=>{const s=document.querySelector('#cohome'),group=document.querySelector('[data-for="cohome"]');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));let writes=0;const watch=new MutationObserver(ms=>writes+=ms.length);watch.observe(group,{subtree:true,attributes:true,childList:true});for(let i=0;i<100;i++){s.value=s.value;s.disabled=s.disabled;}await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));watch.disconnect();return{writes,buttons:group.children.length};});
  assert(stable.buttons>1);assert.equal(stable.writes,0,'Unchanged choices must not invalidate layout every frame');
  const changed=await page.evaluate(async()=>{const s=document.querySelector('#cohome');s.options[1].text='조건 이름 변경';s.value=s.options[1].value;s.disabled=true;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const bs=[...document.querySelectorAll('[data-for="cohome"] button')];return{selected:bs.find(b=>b.getAttribute('aria-checked')==='true').textContent,disabled:bs.every(b=>b.disabled)};});
  assert.deepEqual(changed,{selected:'조건 이름 변경',disabled:true},'The cache must invalidate when options, selection or availability changes');
  await page.goto(base+'polarized-thin-sections/');await page.waitForFunction(()=>!!window.__thinSections);await page.bringToFront();
  const pixels=await page.evaluate(()=>{
   __thinSections.sample('granite');document.querySelector('#tsMount').click();const focus=document.querySelector('#tsFocus');focus.value=50;focus.dispatchEvent(new Event('input'));
   const c=document.querySelector('#tsCanvas'),ctx=c.getContext('2d'),M=scienceThinSections,one=document.createElement('canvas');one.width=one.height=1;const ink=one.getContext('2d'),rows=[];
   for(const crossed of [false,true])for(const angle of [0,45,90])for(const light of [70,90]){
    if(__thinSections.getState().crossed!==crossed)document.querySelector('#tsAnalyzer').click();
    for(const [id,value]of [['tsAngle',angle],['tsLight',light]]){const input=document.getElementById(id);input.value=value;input.dispatchEvent(new Event('input'));}
    const kind=crossed?'quartz':'mica',g=M.grains('granite').find(g=>g.kind===kind&&Math.hypot(g.x-300,g.y-300)<230),rad=angle*Math.PI/180;
    const x=Math.round((300+(g.x-300)*Math.cos(rad)-(g.y-300)*Math.sin(rad))*c.width/600),y=Math.round((300+(g.x-300)*Math.sin(rad)+(g.y-300)*Math.cos(rad))*c.height/600);
    ink.fillStyle=M.color(g,angle,crossed,light);ink.fillRect(0,0,1,1);const expected=[...ink.getImageData(0,0,1,1).data].slice(0,3),actual=ctx.getImageData(x-1,y-1,3,3).data;let error=Infinity;
    for(let i=0;i<actual.length;i+=4)error=Math.min(error,Math.max(...expected.map((v,j)=>Math.abs(v-actual[i+j]))));rows.push({kind,crossed,angle,light,expected,error,scaleError:Math.abs(parseFloat(document.querySelector('.ts-scale i').style.width)-c.clientWidth/6)});
   }return rows;
  });
  for(const row of pixels){assert(row.error<=4,'Rendered optical colour differs from the model at its rotated position: '+JSON.stringify(row));assert(row.scaleError<.1,'The scale bar must retain its size while the specimen rotates');}
  assert.notDeepEqual(pixels[0].expected,pixels[2].expected,'Mica pleochroism must change with rotation');assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

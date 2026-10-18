const {test}=require('node:test'),assert=require('node:assert/strict');
const base=process.env.SCIENCE_BASE_URL||'http://127.0.0.1:18765/learning/inquiry/science-lab/';
for(const engine of ['chromium','webkit'])test(engine+': continuous drawing preserves energy, orbit geometry and sampled observations',{timeout:90000},async()=>{
 const pw=require('playwright'),browser=await pw[engine].launch({headless:true,...engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{}}),errors=[];
 try{const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const open=async(slug,model)=>{await page.goto(base+slug+'/');await page.waitForFunction(name=>!!window[name],model);};
  await open('motion-energy','__motionModel');
  const energy=await page.evaluate(()=>{const m=__motionModel,rows=[];for(const height of [1,2,3]){const a=m.analyseEnergy({...m.state,height});const i=Math.min(12,a.path.length-2),left=a.path[i],right=a.path[i+1],t1=left.t+(right.t-left.t)*.25,t2=left.t+(right.t-left.t)*.75,q1=m.sampleEnergy(a,t1/a.duration),q2=m.sampleEnergy(a,t2/a.duration);rows.push({height,different:q1.x!==q2.x,timeError:Math.abs(q1.t-t1),trackError:Math.abs(q1.y-m.trackY(q1.x)),energyError:Math.abs(q1.pe+q1.ke-a.eTotal),speedError:Math.abs(q1.v*q1.v/2+ m.G*q1.y-m.G*height),first:m.sampleEnergy(a,0).x===a.path[0].x,last:m.sampleEnergy(a,1).x===a.path.at(-1).x});}return rows;});
  for(const r of energy){assert(r.different,'Car must move between recorded points');assert(r.first&&r.last,'Endpoints changed');for(const key of ['timeError','trackError','energyError','speedError'])assert(r[key]<1e-8,JSON.stringify(r));}
  await open('torque','__torqueModel');
  const seesaw=await page.evaluate(()=>{const m=__torqueModel;m.setMode('seesaw');const read=p=>{m.setProgress(p);return document.querySelector('#mainGroup g[transform^="rotate"]')?.getAttribute('transform');};const before=read(.051),after=read(.052);m.set('mass','m20');return{before,after,balanced:read(.5)};});
  assert.notEqual(seesaw.before,seesaw.after,'Seesaw must interpolate within its integration interval');assert.match(seesaw.balanced,/rotate\(0\.00 /,'A balanced seesaw must remain level');
  await open('planet-motion','__planetModel');
  const orbit=await page.evaluate(()=>{const m=__planetModel;m.setMode('retro');return Object.keys(m.PLANETS).map(key=>{m.set('planet',key);const a=m.analyse(),q=a.at(.125),r=a.at(.126),sample=a.rows[a.W+1],same=a.at(1);return {key,earthRadius:Math.hypot(q.ex,q.ey),planetError:Math.abs(Math.hypot(q.px,q.py)-a.pl.a),moved:q.px!==r.px||q.py!==r.py,sampleError:Math.abs(sample.lon-same.lon),deltaError:Math.abs(q.delta-Math.hypot(q.px-q.ex,q.py-q.ey)),rows:a.rows.length,expected:2*a.W+1};});});
  for(const r of orbit){assert(Math.abs(r.earthRadius-1)<1e-12);assert(r.planetError<1e-12&&r.deltaError<1e-12&&r.sampleError<1e-10);assert(r.moved);assert.equal(r.rows,r.expected,'Do not invent extra observed dates');}
  await open('neuron','__neuronModel');
  const nerve=await page.evaluate(()=>{const m=__neuronModel;m.setMode('conduct');m.set('axon','myelin');const get=p=>{m.setProgress(p);const e=document.querySelector('.impulse-glow');return {x:e.getAttribute('cx'),r:e.getAttribute('r'),opacity:e.getAttribute('opacity')};};return [get(.02),get(.03),get(.1)];});
  assert.equal(nerve[0].x,nerve[1].x,'Activity must remain at a node of Ranvier');assert.notDeepEqual(nerve[0],nerve[1],'A node pulse must develop continuously');assert.notEqual(nerve[0].x,nerve[2].x,'Activity must reach the next node');
  await open('air-stability','__airModel');await page.locator('#runBtn').click();await page.waitForTimeout(350);assert.deepEqual(errors,[]);
  // A looping dash must advance by complete periods; otherwise it jumps back
  // at each iteration even when the frame rate is high.
  for(const [slug,selector]of [['ohms-law','.current-pulse'],['refraction','.ray'],['circuit-bulbs','.current'],['light-shadow','.ray']]){
   await page.goto(base+slug+'/');await page.waitForSelector('[data-assessment-ready]',{state:'attached'});await page.bringToFront();
   const loops=await page.locator(selector).evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).flatMap(e=>e.getAnimations().filter(a=>a.effect.getTiming().iterations===Infinity).map(a=>{const frames=a.effect.getKeyframes(),first=frames[0],last=frames.at(-1),dash=getComputedStyle(e).strokeDasharray.split(/[ ,]+/).map(parseFloat);return{period:dash.reduce((n,v)=>n+v,0)*(dash.length%2?2:1),distance:parseFloat(last.strokeDashoffset)-parseFloat(first.strokeDashoffset||'0')};})));
   assert(loops.length,slug+' must display its flow');for(const loop of loops)assert(Math.abs(loop.distance/loop.period-Math.round(loop.distance/loop.period))<1e-8,slug+' jumps at the loop boundary');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
